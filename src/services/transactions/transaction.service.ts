import { TransactionModel } from '@/src/types/Models/Transaction';
import { parseQuickInput } from '@/src/utils/parseText';
import { JarRepository } from '../Jar/jarRepository';
import { CategoryRuleRepository } from '../repo/categoryRuleRepository';
import { TransactionRepository } from './transactionRepository';

export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository,
    private jarRepo: JarRepository,
    private ruleRepo: CategoryRuleRepository
  ) {}

  async createQuickTransaction(text: string, accountId: string) {
    const parsed = parseQuickInput(text);

    if (!parsed.amount || parsed.amount <= 0) {
      throw new Error('INVALID_AMOUNT');
    }

    const jarId =
      (await this.detectJar(parsed.title, accountId)) ??
      (await this.jarRepo.findDefaultJar(accountId))?.id;

    const transaction: TransactionModel = {
      id: crypto.randomUUID(),
      title: parsed.title || 'Chưa có tiêu đề',
      amount: parsed.amount,
      type: 'expense',
      jarId,
      accountId,
      transactionAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dayKey: new Date().getDate(),
      monthKey: new Date().getMonth() + 1,
      yearKey: new Date().getFullYear(),
      isDraft: jarId ? false : true, // If we can't detect a jar, mark this transaction as draft for later review
    };

    await this.transactionRepo.create(transaction);

    return transaction;
  }

  private async detectJar(title: string, accountId: string) {
    const rules = await this.ruleRepo.findByKeyWord(title);
    // Find the rule with the highest hit count
    let matched: { jarId: string; hitCount: number } | null = null;
    for (const rule of rules) {
      if (rule.hitCount > (matched?.hitCount ?? 0)) {
        matched = { jarId: rule.jarId, hitCount: rule.hitCount };
      }
    }

    return matched?.jarId ?? null;
  }
}
