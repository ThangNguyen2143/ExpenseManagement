export type AddTransactionDTO = {
  title: string;
  amount: number;
  type: 'expense' | 'income';
  jarId?: string;
  accountId?: string;
};
