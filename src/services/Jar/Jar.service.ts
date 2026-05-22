import { AddNewJarDTO } from '@/src/types/dto/AddNewJar';
import { JarModel } from '@/src/types/Models/Jar';
import { ISummaryRepository } from '../transactions/sumarryRepository';
import { JarRepository } from './jarRepository';
import { CreateJarInput, JarAnalysisItem, JarAnalysisParams, JarDashboardItem } from './types';
export class JarService {
  constructor(
    private jarRepo: JarRepository,
    private summaryRepo: ISummaryRepository
  ) {}

  async createJar(input: CreateJarInput) {
    const name = this.normalizeName(input.name);

    if (!name) {
      throw new Error('INVALID_JAR_NAME');
    }

    if (!input.accountId) {
      throw new Error('INVALID_ACCOUNT');
    }

    if (input.limit < 0) {
      throw new Error('INVALID_JAR_LIMIT');
    }

    const jar: AddNewJarDTO = {
      name,
      limit: input.limit,
      accountId: input.accountId,
      isDefault: input.isDefault ?? false,
      isArchived: false,
    };

    await this.jarRepo.create(jar);

    return jar;
  }

  async updateJarName(jarId: string, accountId: string, name: string) {
    const jar = await this.getActiveJarOrThrow(jarId, accountId);
    const normalizedName = this.normalizeName(name);

    if (!normalizedName) {
      throw new Error('INVALID_JAR_NAME');
    }

    const updatedJar: JarModel = {
      ...jar,
      name: normalizedName,
    };

    await this.jarRepo.update(jar.id, {
      name: updatedJar.name,
    });

    return updatedJar;
  }

  async updateJarLimit(jarId: string, accountId: string, limit: number) {
    const jar = await this.getActiveJarOrThrow(jarId, accountId);

    if (limit < 0) {
      throw new Error('INVALID_JAR_LIMIT');
    }

    const updatedJar: JarModel = {
      ...jar,
      limit,
    };

    await this.jarRepo.update(jar.id, {
      limit: updatedJar.limit,
    });

    return updatedJar;
  }

  /**
   * Không reset bằng cách sửa JarModel.
   * Vì JarModel không có spent/currentAmount.
   * Sang tháng mới, dashboard tự tính theo monthKey/yearKey mới => spent tự về 0.
   */
  async resetJarsForNewMonth(accountId: string, date = new Date()) {
    if (!accountId) {
      throw new Error('INVALID_ACCOUNT');
    }

    return this.getDashboardJars(accountId, date);
  }
  async getAllJars(accountId: string): Promise<JarModel[]> {
    if (!accountId) {
      throw new Error('INVALID_ACCOUNT');
    }
    return this.jarRepo.findByAccount(accountId);
  }
  async getDashboardJars(accountId: string, date = new Date()): Promise<JarDashboardItem[]> {
    if (!accountId) {
      throw new Error('INVALID_ACCOUNT');
    }

    const monthKey = this.createMonthKey(date);

    const jars = await this.jarRepo.findByAccount(accountId);

    const summaries = await this.summaryRepo.findMonthlyJarSummaries(accountId, monthKey);

    const spentMap = new Map<string, number>();

    for (const summary of summaries) {
      spentMap.set(summary.jarId, summary.totalExpense);
    }

    return jars.map((jar) => {
      const spent = spentMap.get(jar.id) ?? 0;
      const remaining = Math.max(jar.limit - spent, 0);

      const percentUsed = jar.limit > 0 ? Math.round((spent / jar.limit) * 100) : 0;

      return {
        ...jar,
        spent,
        remaining,
        percentUsed,
        isOverLimit: jar.limit > 0 && spent > jar.limit,
      };
    });
  }
  async getAnalysisJars(params: JarAnalysisParams): Promise<{
    from: string;
    to: string;
    totalSpent: number;
    jars: JarAnalysisItem[];
  }> {
    if (!params.accountId) {
      throw new Error('INVALID_ACCOUNT');
    }

    if (!params.from || !params.to) {
      throw new Error('INVALID_DATE_RANGE');
    }

    const fromDate = new Date(params.from);
    const toDate = new Date(params.to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      throw new Error('INVALID_DATE_RANGE');
    }

    const fromDayKey = this.createDayKey(fromDate);
    const toDayKey = this.createDayKey(toDate);

    if (fromDayKey > toDayKey) {
      throw new Error('INVALID_DATE_RANGE');
    }

    const jars = await this.jarRepo.findByAccount(params.accountId);

    const summaries = await this.summaryRepo.findDailyJarSummariesInRange(
      params.accountId,
      fromDayKey,
      toDayKey
    );

    const spentMap = new Map<string, number>();

    for (const summary of summaries) {
      const currentSpent = spentMap.get(summary.jarId) ?? 0;
      spentMap.set(summary.jarId, currentSpent + summary.totalExpense);
    }

    const totalSpent = Array.from(spentMap.values()).reduce((sum, spent) => sum + spent, 0);

    const analysisItems: JarAnalysisItem[] = jars
      .map((jar) => {
        const spent = spentMap.get(jar.id) ?? 0;

        return {
          ...jar,
          spent,
          percentOfTotal: totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0,
        };
      })
      .filter((jar) => jar.spent > 0)
      .sort((a, b) => b.spent - a.spent);

    return {
      from: params.from,
      to: params.to,
      totalSpent,
      jars: analysisItems,
    };
  }

  /**
   * Nếu sau này cần xóa hũ thật:
   * - Không xóa nếu còn transaction.
   * - Hoặc phải reassign transaction sang hũ khác.
   *
   * Với model hiện tại có isArchived, nên ưu tiên archive.
   */
  async archiveJar(jarId: string, accountId: string) {
    const jar = await this.getActiveJarOrThrow(jarId, accountId);

    if (jar.isDefault) {
      throw new Error('CANNOT_ARCHIVE_DEFAULT_JAR');
    }

    const updatedJar: JarModel = {
      ...jar,
      isArchived: true,
    };

    await this.jarRepo.update(jar.id, {
      isArchived: true,
    });

    return updatedJar;
  }

  private async getActiveJarOrThrow(jarId: string, accountId: string) {
    if (!jarId) {
      throw new Error('INVALID_JAR');
    }

    if (!accountId) {
      throw new Error('INVALID_ACCOUNT');
    }

    const jar = await this.jarRepo.findById(jarId);

    if (!jar || jar.accountId !== accountId) {
      throw new Error('JAR_NOT_FOUND');
    }

    if (jar.isArchived) {
      throw new Error('JAR_ARCHIVED');
    }

    return jar;
  }

  private normalizeName(name: string) {
    return name.trim().replace(/\s+/g, ' ');
  }
  private createDayKey(date: Date): number {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return Number(`${year}${month}${day}`);
  }

  private createMonthKey(date: Date): number {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return Number(`${year}${month}`);
  }
}
