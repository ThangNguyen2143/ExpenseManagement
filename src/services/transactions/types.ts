import {
  DailyJarSummary,
  DailySummary,
  MonthlyJarSummary,
  MonthlySummary,
} from '@/src/types/Models/Summary';

export type SummaryDirection = 1 | -1;

export type SummaryBase = {
  totalExpense: number;
  totalIncome: number;
  transactionCount: number;
  updatedAt: string;
};

export type SummaryState = {
  dailySummaries: DailySummary[];
  monthlySummaries: MonthlySummary[];
  dailyJarSummaries: DailyJarSummary[];
  monthlyJarSummaries: MonthlyJarSummary[];
};
