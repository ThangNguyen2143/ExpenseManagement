import { TypeTransactionModel } from './Transaction';

export type TransactionTemplate = {
  id: string;

  accountId: string;
  type: TypeTransactionModel;

  title: string;
  normalizedTitle: string;

  defaultJarId?: string;
  lastAmount?: number;

  usageCount: number;
  lastUsedAt: string;

  createdAt: string;
  updatedAt: string;

  isArchived: boolean;
};
