import { StorageKeys } from '@/src/constants/ModelName';
import { TransactionModel } from '@/src/types/Models/Transaction';
import { JsonStorage } from '../db/JsonStore';
export class TransactionRepository {
  constructor(private db: JsonStorage) {}

  async getAll(): Promise<TransactionModel[]> {
    return this.db.get<TransactionModel[]>(StorageKeys.transactions, []);
  }

  async findByAccount(accountId: string): Promise<TransactionModel[]> {
    const all = await this.getAll();
    return all.filter((t) => t.accountId === accountId);
  }

  async create(input: TransactionModel): Promise<void> {
    const all = await this.getAll();
    await this.db.set(StorageKeys.transactions, [input, ...all]);
  }

  async update(id: string, patch: Partial<TransactionModel>): Promise<void> {
    const all = await this.getAll();
    const next = all.map((t) => (t.id === id ? { ...t, ...patch } : t));
    await this.db.set(StorageKeys.transactions, next);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    await this.db.set(
      StorageKeys.transactions,
      all.filter((t) => t.id !== id)
    );
  }
}
