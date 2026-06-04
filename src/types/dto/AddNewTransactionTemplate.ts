import { TypeTransactionModel } from '../Models/Transaction';

export type CreateNewTransactionTemplateDto = {
  accountId: string;
  type: TypeTransactionModel;
  title: string;
  defaultJarId?: string;
  lastAmount?: number;
};
