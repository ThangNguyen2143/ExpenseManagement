import { StorageKeys } from '@/src/constants/ModelName';
import { AddNewAccountDTO } from '@/src/types/dto/AddNewAccount';
import { AccountModel } from '@/src/types/Models/Account';
import { JarModel } from '@/src/types/Models/Jar';
import * as Crypto from 'expo-crypto';
import { JsonStorage } from '../db/JsonStore';
export class AccountRepository {
  constructor(private db: JsonStorage) {}

  async getAll(): Promise<AccountModel[]> {
    return this.db.get<AccountModel[]>(StorageKeys.accounts, []);
  }

  async findOne(accountId: string): Promise<AccountModel | undefined> {
    const all = await this.getAll();
    return all.find((t) => t.id === accountId);
  }

  async createAccountAndSetDefaultData(input: AddNewAccountDTO): Promise<void> {
    const newAccount: AccountModel = {
      id: Crypto.randomUUID(),
      name: input.name,
      balance: input.balance,
      createdAt: new Date().toISOString(),
    };
    const defaultJar: JarModel = {
      id: Crypto.randomUUID(),
      name: 'Khác',
      limit: input.balance,
      accountId: newAccount.id,
      isDefault: true,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    const all = await this.getAll();
    await this.db.setMulti({
      [StorageKeys.accounts]: [newAccount, ...all],
      [StorageKeys.jars]: [defaultJar],
      [StorageKeys.transactions]: [],
    });
  }

  async update(id: string, patch: Partial<AddNewAccountDTO>): Promise<void> {
    const all = await this.getAll();
    const next = all.map((t) => (t.id === id ? { ...t, ...patch } : t));
    await this.db.set(StorageKeys.accounts, next);
  }
  async updateBalance(
    accountId: string,
    amountChange: number,
    type: 'increase' | 'decrease'
  ): Promise<void> {
    const account = await this.findOne(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    const newBalance =
      type === 'increase' ? account.balance + amountChange : account.balance - amountChange;
    await this.update(accountId, { balance: newBalance });
  }
  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    await this.db.set(
      StorageKeys.accounts,
      all.filter((t) => t.id !== id)
    );
  }
}
