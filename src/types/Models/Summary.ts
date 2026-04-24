type Summary = {
  totalExpense: number;
  totalIncome: number;
  transactionCount: number;
};
export type DailySummary = Summary & {
  id: string;
  accountId: string;
  dayKey: number;

  updatedAt: string;
};
export type MonthlySummary = Summary & {
  id: string;
  accountId: string;
  monthKey: number;

  updatedAt: string;
};
export type DailyJarSummary = Summary & {
  id: string;
  accountId: string;
  jarId: string;
  dayKey: number;

  updatedAt: string;
};
export type MonthlyJarSummary = Summary & {
  id: string;
  accountId: string;
  jarId: string;
  monthKey: number;

  updatedAt: string;
};
