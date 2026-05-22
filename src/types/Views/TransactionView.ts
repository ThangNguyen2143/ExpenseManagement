import { TransactionModel } from '../Models/Transaction';

export type TransactionView = TransactionModel & { jarName: string | null };
