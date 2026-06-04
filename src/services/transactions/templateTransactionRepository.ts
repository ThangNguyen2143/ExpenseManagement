import { StorageKeys } from '@/src/constants/ModelName';
import { TransactionTemplate } from '@/src/types/Models/TransactionTemplate';
import { JsonStorage } from '../db/JsonStore';
export class TemplateTransactionRepository {
  constructor(private db: JsonStorage) {}

  async getAll(): Promise<TransactionTemplate[]> {
    return this.db.get<TransactionTemplate[]>(StorageKeys.templateTransactions, []);
  }

  async findByAccount(accountId: string): Promise<TransactionTemplate[]> {
    const all = await this.getAll();
    return all.filter((t) => t.accountId === accountId);
  }
  async findById(id: string): Promise<TransactionTemplate | null> {
    const all = await this.getAll();
    return all.find((t) => t.id === id) ?? null;
  }
  async create(input: TransactionTemplate): Promise<void> {
    const all = await this.getAll();
    await this.db.set(StorageKeys.templateTransactions, [input, ...all]);
  }

  async update(id: string, patch: Partial<TransactionTemplate>): Promise<void> {
    const all = await this.getAll();
    const next = all.map((t) => (t.id === id ? { ...t, ...patch } : t));
    await this.db.set(StorageKeys.templateTransactions, next);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    await this.db.set(
      StorageKeys.templateTransactions,
      all.filter((t) => t.id !== id)
    );
  }
}
