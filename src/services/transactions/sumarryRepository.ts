import { StorageKeys } from '@/src/constants/ModelName';
import {
  DailyJarSummary,
  DailySummary,
  MonthlyJarSummary,
  MonthlySummary,
} from '@/src/types/Models/Summary';
import { TransactionModel } from '@/src/types/Models/Transaction';
import { JsonStorage } from '../db/JsonStore';
import { SummaryBase, SummaryDirection, SummaryState } from './types';

export interface ISummaryRepository {
  getDailySummaries(): Promise<DailySummary[]>; // Get all daily summaries for all accounts
  getMonthlySummaries(): Promise<MonthlySummary[]>; // Get all monthly summaries for all accounts
  getDailyJarSummaries(): Promise<DailyJarSummary[]>; // Get all daily jar summaries for all accounts
  getMonthlyJarSummaries(): Promise<MonthlyJarSummary[]>; // Get all monthly jar summaries for all accounts
  findDailySummary(accountId: string, dayKey: number): Promise<DailySummary | undefined>;
  findMonthlySummary(accountId: string, monthKey: number): Promise<MonthlySummary | undefined>;
  findDailySummariesByMonth(accountId: string, monthKey: number): Promise<DailySummary[]>;
  findMonthlyJarSummaries(accountId: string, monthKey: number): Promise<MonthlyJarSummary[]>;
  findMonthlyJarSummary(
    accountId: string,
    jarId: string,
    monthKey: number
  ): Promise<MonthlyJarSummary | undefined>;
  findDailyJarSummariesByMonth(
    accountId: string,
    jarId: string,
    monthKey: number
  ): Promise<DailyJarSummary[]>;
  findDailyJarSummariesInRange(
    accountId: string,
    fromDayKey: number,
    toDayKey: number
  ): Promise<DailyJarSummary[]>;
  addTransaction(transaction: TransactionModel): Promise<void>;
  rollbackTransaction(transaction: TransactionModel): Promise<void>;
  replaceTransaction(
    oldTransaction: TransactionModel,
    newTransaction: TransactionModel
  ): Promise<void>;
  clearByAccount(accountId: string): Promise<void>;
}

export class SummaryRepository implements ISummaryRepository {
  constructor(private db: JsonStorage) {}

  async getDailySummaries(): Promise<DailySummary[]> {
    return this.db.get<DailySummary[]>(StorageKeys.dailySummaries, []);
  }

  async getMonthlySummaries(): Promise<MonthlySummary[]> {
    return this.db.get<MonthlySummary[]>(StorageKeys.monthlySummaries, []);
  }

  async getDailyJarSummaries(): Promise<DailyJarSummary[]> {
    return this.db.get<DailyJarSummary[]>(StorageKeys.dailyJarSummaries, []);
  }

  async getMonthlyJarSummaries(): Promise<MonthlyJarSummary[]> {
    return this.db.get<MonthlyJarSummary[]>(StorageKeys.monthlyJarSummaries, []);
  }

  async findDailySummary(accountId: string, dayKey: number): Promise<DailySummary | undefined> {
    const all = await this.getDailySummaries();

    return all.find((item) => item.accountId === accountId && item.dayKey === dayKey);
  }

  async findMonthlySummary(
    accountId: string,
    monthKey: number
  ): Promise<MonthlySummary | undefined> {
    const all = await this.getMonthlySummaries();

    return all.find((item) => item.accountId === accountId && item.monthKey === monthKey);
  }

  async findDailySummariesByMonth(accountId: string, monthKey: number): Promise<DailySummary[]> {
    const all = await this.getDailySummaries();

    return all
      .filter((item) => item.accountId === accountId && this.isDayKeyInMonth(item.dayKey, monthKey))
      .sort((a, b) => a.dayKey - b.dayKey);
  }

  async findMonthlyJarSummaries(accountId: string, monthKey: number): Promise<MonthlyJarSummary[]> {
    const all = await this.getMonthlyJarSummaries();

    return all.filter((item) => item.accountId === accountId && item.monthKey === monthKey);
  }

  async findMonthlyJarSummary(
    accountId: string,
    jarId: string,
    monthKey: number
  ): Promise<MonthlyJarSummary | undefined> {
    const all = await this.getMonthlyJarSummaries();

    return all.find(
      (item) => item.accountId === accountId && item.jarId === jarId && item.monthKey === monthKey
    );
  }

  async findDailyJarSummariesByMonth(
    accountId: string,
    jarId: string,
    monthKey: number
  ): Promise<DailyJarSummary[]> {
    const all = await this.getDailyJarSummaries();

    return all
      .filter(
        (item) =>
          item.accountId === accountId &&
          item.jarId === jarId &&
          this.isDayKeyInMonth(item.dayKey, monthKey)
      )
      .sort((a, b) => a.dayKey - b.dayKey);
  }
  async findDailyJarSummariesInRange(
    accountId: string,
    fromDayKey: number,
    toDayKey: number
  ): Promise<DailyJarSummary[]> {
    const all = await this.getDailyJarSummaries();

    return all.filter(
      (item) => item.accountId === accountId && item.dayKey >= fromDayKey && item.dayKey <= toDayKey
    );
  }
  async addTransaction(transaction: TransactionModel): Promise<void> {
    await this.applyTransactionChange(transaction, 1);
  }

  async rollbackTransaction(transaction: TransactionModel): Promise<void> {
    await this.applyTransactionChange(transaction, -1);
  }

  async replaceTransaction(
    oldTransaction: TransactionModel,
    newTransaction: TransactionModel
  ): Promise<void> {
    const state = await this.getState();

    this.applyToState(state, oldTransaction, -1);
    this.applyToState(state, newTransaction, 1);

    await this.saveState(state);
  }

  async clearByAccount(accountId: string): Promise<void> {
    const state = await this.getState();

    await this.saveState({
      dailySummaries: state.dailySummaries.filter((item) => item.accountId !== accountId),
      monthlySummaries: state.monthlySummaries.filter((item) => item.accountId !== accountId),
      dailyJarSummaries: state.dailyJarSummaries.filter((item) => item.accountId !== accountId),
      monthlyJarSummaries: state.monthlyJarSummaries.filter((item) => item.accountId !== accountId),
    });
  }

  private async applyTransactionChange(
    transaction: TransactionModel,
    direction: SummaryDirection
  ): Promise<void> {
    const state = await this.getState();

    this.applyToState(state, transaction, direction);

    await this.saveState(state);
  }

  private async getState(): Promise<SummaryState> {
    const [dailySummaries, monthlySummaries, dailyJarSummaries, monthlyJarSummaries] =
      await Promise.all([
        this.getDailySummaries(),
        this.getMonthlySummaries(),
        this.getDailyJarSummaries(),
        this.getMonthlyJarSummaries(),
      ]);

    return {
      dailySummaries,
      monthlySummaries,
      dailyJarSummaries,
      monthlyJarSummaries,
    };
  }

  private async saveState(state: SummaryState): Promise<void> {
    await this.db.setMulti({
      [StorageKeys.dailySummaries]: state.dailySummaries,
      [StorageKeys.monthlySummaries]: state.monthlySummaries,
      [StorageKeys.dailyJarSummaries]: state.dailyJarSummaries,
      [StorageKeys.monthlyJarSummaries]: state.monthlyJarSummaries,
    });
  }

  private applyToState(
    state: SummaryState,
    transaction: TransactionModel,
    direction: SummaryDirection
  ): void {
    if (!transaction.accountId) {
      throw new Error('INVALID_ACCOUNT');
    }

    if (!transaction.amount || transaction.amount <= 0) {
      throw new Error('INVALID_AMOUNT');
    }

    if (!transaction.dayKey || !transaction.monthKey) {
      throw new Error('INVALID_DATE_KEY');
    }

    const now = new Date().toISOString();

    const dailySummary = this.getOrCreateDailySummary(state.dailySummaries, transaction, now);

    const monthlySummary = this.getOrCreateMonthlySummary(state.monthlySummaries, transaction, now);

    this.applyAmount(dailySummary, transaction, direction, now);
    this.applyAmount(monthlySummary, transaction, direction, now);

    if (!transaction.jarId) {
      return;
    }

    const dailyJarSummary = this.getOrCreateDailyJarSummary(
      state.dailyJarSummaries,
      transaction,
      now
    );

    const monthlyJarSummary = this.getOrCreateMonthlyJarSummary(
      state.monthlyJarSummaries,
      transaction,
      now
    );

    this.applyAmount(dailyJarSummary, transaction, direction, now);
    this.applyAmount(monthlyJarSummary, transaction, direction, now);
  }

  private applyAmount<T extends SummaryBase>(
    summary: T,
    transaction: TransactionModel,
    direction: SummaryDirection,
    updatedAt: string
  ): void {
    const amount = transaction.amount * direction;

    if (transaction.type === 'expense') {
      summary.totalExpense = Math.max(0, summary.totalExpense + amount);
    }

    if (transaction.type === 'income') {
      summary.totalIncome = Math.max(0, summary.totalIncome + amount);
    }

    summary.transactionCount = Math.max(0, summary.transactionCount + direction);

    summary.updatedAt = updatedAt;
  }

  private getOrCreateDailySummary(
    summaries: DailySummary[],
    transaction: TransactionModel,
    now: string
  ): DailySummary {
    const found = summaries.find(
      (item) => item.accountId === transaction.accountId && item.dayKey === transaction.dayKey
    );

    if (found) {
      return found;
    }

    const created: DailySummary = {
      id: this.createDailySummaryId(transaction.accountId, transaction.dayKey),
      accountId: transaction.accountId,
      dayKey: transaction.dayKey,
      totalExpense: 0,
      totalIncome: 0,
      transactionCount: 0,
      updatedAt: now,
    };

    summaries.unshift(created);

    return created;
  }

  private getOrCreateMonthlySummary(
    summaries: MonthlySummary[],
    transaction: TransactionModel,
    now: string
  ): MonthlySummary {
    const found = summaries.find(
      (item) => item.accountId === transaction.accountId && item.monthKey === transaction.monthKey
    );

    if (found) {
      return found;
    }

    const created: MonthlySummary = {
      id: this.createMonthlySummaryId(transaction.accountId, transaction.monthKey),
      accountId: transaction.accountId,
      monthKey: transaction.monthKey,
      totalExpense: 0,
      totalIncome: 0,
      transactionCount: 0,
      updatedAt: now,
    };

    summaries.unshift(created);

    return created;
  }

  private getOrCreateDailyJarSummary(
    summaries: DailyJarSummary[],
    transaction: TransactionModel,
    now: string
  ): DailyJarSummary {
    if (!transaction.jarId) {
      throw new Error('INVALID_JAR');
    }

    const found = summaries.find(
      (item) =>
        item.accountId === transaction.accountId &&
        item.jarId === transaction.jarId &&
        item.dayKey === transaction.dayKey
    );

    if (found) {
      return found;
    }

    const created: DailyJarSummary = {
      id: this.createDailyJarSummaryId(
        transaction.accountId,
        transaction.jarId,
        transaction.dayKey
      ),
      accountId: transaction.accountId,
      jarId: transaction.jarId,
      dayKey: transaction.dayKey,
      totalExpense: 0,
      totalIncome: 0,
      transactionCount: 0,
      updatedAt: now,
    };

    summaries.unshift(created);

    return created;
  }

  private getOrCreateMonthlyJarSummary(
    summaries: MonthlyJarSummary[],
    transaction: TransactionModel,
    now: string
  ): MonthlyJarSummary {
    if (!transaction.jarId) {
      throw new Error('INVALID_JAR');
    }

    const found = summaries.find(
      (item) =>
        item.accountId === transaction.accountId &&
        item.jarId === transaction.jarId &&
        item.monthKey === transaction.monthKey
    );

    if (found) {
      return found;
    }

    const created: MonthlyJarSummary = {
      id: this.createMonthlyJarSummaryId(
        transaction.accountId,
        transaction.jarId,
        transaction.monthKey
      ),
      accountId: transaction.accountId,
      jarId: transaction.jarId,
      monthKey: transaction.monthKey,
      totalExpense: 0,
      totalIncome: 0,
      transactionCount: 0,
      updatedAt: now,
    };

    summaries.unshift(created);

    return created;
  }

  private isDayKeyInMonth(dayKey: number, monthKey: number): boolean {
    return Math.floor(dayKey / 100) === monthKey;
  }

  private createDailySummaryId(accountId: string, dayKey: number): string {
    return `daily_summary:${accountId}:${dayKey}`;
  }

  private createMonthlySummaryId(accountId: string, monthKey: number): string {
    return `monthly_summary:${accountId}:${monthKey}`;
  }

  private createDailyJarSummaryId(accountId: string, jarId: string, dayKey: number): string {
    return `daily_jar_summary:${accountId}:${jarId}:${dayKey}`;
  }

  private createMonthlyJarSummaryId(accountId: string, jarId: string, monthKey: number): string {
    return `monthly_jar_summary:${accountId}:${jarId}:${monthKey}`;
  }
}
