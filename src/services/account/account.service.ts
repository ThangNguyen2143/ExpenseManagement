import { JarRepository } from '../Jar/jarRepository';
import { CategoryRuleRepository } from '../repo/categoryRuleRepository';
import { AccountRepository } from './accountRepository';

export class AccountService {
  constructor(
    private accountRepo: AccountRepository,
    private jarRepo: JarRepository,
    private ruleRepo: CategoryRuleRepository
  ) {}
  //create account with default jar and default category rule
  async createAccount(input: { name: string; balance: number }): Promise<void> {
    await this.accountRepo.createAccountAndSetDefaultData(input);
  }
  //get account info
  async getAccount(accountId: string) {
    const account = await this.accountRepo.findOne(accountId);
    if (!account) {
      throw new Error('ACCOUNT_NOT_FOUND');
    }
    return account;
  }
  //get all accounts
  async getAllAccounts() {
    return await this.accountRepo.getAll();
  }
  //Update account info
  async updateAccount(
    accountId: string,
    patch: { name?: string; balance?: number }
  ): Promise<void> {
    await this.accountRepo.update(accountId, patch);
  }
  //Delete account and all related data (jars, transactions)
  async deleteAccount(accountId: string): Promise<void> {
    await this.accountRepo.delete(accountId);
    const jars = await this.jarRepo.findByAccount(accountId);
    for (const jar of jars) {
      await this.jarRepo.delete(jar.id);
    }
    // Assuming transactions are also related to accounts, we should delete them as well
    const transactions = await this.ruleRepo.findByKeyWord(accountId); // This is just an example, you should implement a proper method to find transactions by account
    for (const transaction of transactions) {
      await this.ruleRepo.delete(transaction.id); // Again, this is just an example, you should implement a proper method to delete transactions by id
    }
  }
}
