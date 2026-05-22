import { JarRepository } from '../Jar/jarRepository';
import { CategoryRuleRepository } from '../categoryRule/categoryRuleRepository';
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
      const ruleRelate = await this.ruleRepo.findByJarId(jar.id);
      for (const rule of ruleRelate) {
        await this.ruleRepo.delete(rule.id);
      }
      await this.jarRepo.delete(jar.id);
    }
  }
}
