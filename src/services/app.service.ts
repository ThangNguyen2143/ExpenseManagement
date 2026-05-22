import { AccountService } from './account/account.service';
import { AccountRepository } from './account/accountRepository';
import { OnboardingService } from './account/onboarding';
import { CategoryRuleRepository } from './categoryRule/categoryRuleRepository';
import { asyncStorageAdapter } from './db/adapter';
import { JsonStorage } from './db/JsonStore';
import { JarService } from './Jar/Jar.service';
import { JarRepository } from './Jar/jarRepository';
import { SummaryRepository } from './transactions/sumarryRepository';
import { TransactionService } from './transactions/transaction.service';
import { TransactionRepository } from './transactions/transactionRepository';
const jsonStorage = new JsonStorage(asyncStorageAdapter, {
  removeCorruptedData: true,
});

const accountRepository = new AccountRepository(jsonStorage);
const jarRepository = new JarRepository(jsonStorage);
const transactionRepository = new TransactionRepository(jsonStorage);
const categoryRuleRepository = new CategoryRuleRepository(jsonStorage);
const summaryRepository = new SummaryRepository(jsonStorage);
const transactionService = new TransactionService(
  transactionRepository,
  accountRepository,
  jarRepository,
  categoryRuleRepository,
  summaryRepository
);

const onboardingService = new OnboardingService(jsonStorage, accountRepository);
const accountService = new AccountService(accountRepository, jarRepository, categoryRuleRepository);
const jarService = new JarService(jarRepository, summaryRepository);
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
    jarService,
  },
};
