import { MonthlyJarSummary } from '@/src/types/Models/Summary';
import { TransactionModel, TypeTransactionModel } from '@/src/types/Models/Transaction';
import { normalizeText } from '@/src/utils/normalizeText';
import { parseQuickInput } from '@/src/utils/parseText';
import * as Crypto from 'expo-crypto';
import { JarRepository } from '../Jar/jarRepository';
import { AccountRepository } from '../account/accountRepository';
import { CategoryRuleRepository } from '../categoryRule/categoryRuleRepository';
import { SummaryRepository } from './sumarryRepository';
import { TransactionRepository } from './transactionRepository';
export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository,
    private accountRepo: AccountRepository,
    private jarRepo: JarRepository,
    private ruleRepo: CategoryRuleRepository,
    private summaryRepo: SummaryRepository
  ) {}

  async createQuickTransaction(
    text: string,
    accountId: string,
    type?: TypeTransactionModel,
    jarId?: string
  ) {
    const parsed = parseQuickInput(text);

    if (!parsed.amount || parsed.amount <= 0) {
      throw new Error('INVALID_AMOUNT');
    }

    const jarSaveId =
      jarId ??
      (await this.detectJar(parsed.title, accountId)) ??
      (await this.jarRepo.findDefaultJar(accountId))?.id;
    const dateKeys = this.createDateKeys();
    let transaction: TransactionModel = {
      id: Crypto.randomUUID(),
      title: parsed.title || 'Chưa có tiêu đề',
      amount: parsed.amount,
      type: 'expense',
      jarId: jarSaveId,
      accountId,
      transactionAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dayKey: dateKeys.dayKey,
      monthKey: dateKeys.monthKey,
      yearKey: new Date().getFullYear(),
      isDraft: jarId ? false : true, // If we can't detect a jar, mark this transaction as draft for later review
    };
    if (type === 'income') {
      transaction.type = 'income';
      transaction.jarId = undefined; // Income transactions don't need jar, we will just put them in a virtual jar in summary
      transaction.isDraft = false; // Income transactions are not draft, we can save them directly
      await this.accountRepo.updateBalance(accountId, transaction.amount, 'increase');
    } else {
      await this.accountRepo.updateBalance(accountId, transaction.amount, 'decrease');
    }
    await this.transactionRepo.create(transaction);
    await this.summaryRepo.addTransaction(transaction);
    if (jarId && parsed.title) {
      await this.learnKeyword(parsed.title, jarId);
    }
    return transaction;
  }

  async sumExpenseByJarForMonth(
    accountId: string,
    monthKey: number
  ): Promise<{ jarId: string; total: number }[]> {
    const jars = await this.jarRepo.findByAccount(accountId);
    //Get summary data from summary repo
    let summaries: MonthlyJarSummary[] = [];
    jars.forEach(async (jar) => {
      if (!jar.isArchived) {
        const summary = await this.summaryRepo.findMonthlyJarSummary(accountId, jar.id, monthKey);
        if (summary) summaries.push(summary); // We only care about jars that have transactions in this month, so if summary is null, we can ignore it
      }
    });
    //Map summaries to result
    const result = summaries.map((s) => ({
      jarId: s.jarId,
      total: s.totalExpense,
    }));
    return result;
  }

  sumExpenseByJarInRange(
    accountId: string,
    from: string,
    to: string
  ): Promise<{ jarId: string; total: number }[]> {
    // This function can be implemented similarly to sumExpenseByJarForMonth, but we need to get daily summaries and filter them by date range
    throw new Error('Not implemented yet');
  }
  async changeJar(transactionId: string, newJarId: string): Promise<void> {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    const newJar = await this.jarRepo.findById(newJarId);
    if (!newJar) {
      throw new Error('New jar not found');
    }
    await this.transactionRepo.update(transactionId, { jarId: newJarId, isDraft: false });
    const newTransaction = { ...transaction, jarId: newJarId, isDraft: false };
    await this.summaryRepo.replaceTransaction(transaction, newTransaction);
  }
  async getRecentTransactions(accountId: string, limit = 10): Promise<TransactionModel[]> {
    const transactions = await this.transactionRepo.findByAccount(accountId);
    // Sort transactions by transactionAt in descending order
    transactions.sort(
      (a, b) => new Date(b.transactionAt).getTime() - new Date(a.transactionAt).getTime()
    );
    return transactions.slice(0, limit);
  }
  async getAllTransactionsByAccountId(accountId: string): Promise<TransactionModel[]> {
    return (await this.transactionRepo.findByAccount(accountId)).sort(
      (a, b) => new Date(b.transactionAt).getTime() - new Date(a.transactionAt).getTime()
    );
  }
  async deleteTransaction(transactionId: string): Promise<void> {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.dayKey === this.createDateKeys().dayKey) {
      if (transaction.type === 'expense') {
        await this.accountRepo.updateBalance(transaction.accountId, transaction.amount, 'increase');
      } else if (transaction.type === 'income') {
        await this.accountRepo.updateBalance(transaction.accountId, transaction.amount, 'decrease');
      }
      await this.transactionRepo.delete(transactionId);
      await this.summaryRepo.rollbackTransaction(transaction);
    } else {
      throw new Error(
        'Only transactions created today can be deleted to prevent data inconsistency in summary. Please contact support if you want to delete this transaction.'
      );
    }
  }
  private createDateKeys(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const monthText = String(month).padStart(2, '0');
    const dayText = String(day).padStart(2, '0');

    return {
      dayKey: Number(`${year}${monthText}${dayText}`),
      monthKey: Number(`${year}${monthText}`),
    };
  }
  private async learnKeyword(title: string, jarId: string) {
    const normalized = normalizeText(title);

    if (!normalized) return;

    const existing = await this.ruleRepo.findByKeyWord(normalized);

    if (existing) return;

    await this.ruleRepo.create({
      keywords: [title, normalized, title.toUpperCase()],
      hitCount: 1,
      normalizedKeyword: normalized,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: Crypto.randomUUID(),
      jarId,
    });
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
