export type JarDashboardItem = {
  id: string;
  accountId: string;
  jarId: string;

  name: string;
  limit: number;

  totalExpense: number;
  totalIncome: number;
  transactionCount: number;

  remainingAmount: number;
  usedPercent: number;
  isOverLimit: boolean;

  isDefault: boolean;
  isArchived: boolean;
};
