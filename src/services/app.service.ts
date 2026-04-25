import { AccountService } from './account/account.service';
import { AccountRepository } from './account/accountRepository';
import { OnboardingService } from './account/onboarding';
import { asyncStorageAdapter } from './db/adapter';
import { JsonStorage } from './db/JsonStore';
import { JarRepository } from './Jar/jarRepository';
import { CategoryRuleRepository } from './repo/categoryRuleRepository';
import { TransactionService } from './transactions/transaction.service';
import { TransactionRepository } from './transactions/transactionRepository';
const jsonStorage = new JsonStorage(asyncStorageAdapter, {
  removeCorruptedData: true,
});

const accountRepository = new AccountRepository(jsonStorage);
const jarRepository = new JarRepository(jsonStorage);
const transactionRepository = new TransactionRepository(jsonStorage);
const categoryRuleRepository = new CategoryRuleRepository(jsonStorage);

const transactionService = new TransactionService(
  transactionRepository,
  jarRepository,
  categoryRuleRepository
);

const onboardingService = new OnboardingService(jsonStorage, accountRepository);
const accountService = new AccountService(accountRepository, jarRepository, categoryRuleRepository);
export const appServices = {
  storage: jsonStorage,

  repositories: {
    accountRepository,
    jarRepository,
    transactionRepository,
    categoryRuleRepository,
  },

  services: {
    transactionService,
    onboardingService,
    accountService,
  },
};
