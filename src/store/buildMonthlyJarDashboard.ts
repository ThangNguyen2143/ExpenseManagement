import { JarModel } from '../types/Models/Jar';
import { MonthlyJarSummary } from '../types/Models/Summary';
import { JarDashboardItem } from '../types/Views/JarViewModel';

type BuildMonthlyJarDashboardParams = {
  jars: JarModel[];
  summaries: MonthlyJarSummary[];
  accountId: string;
  monthKey: number;
};

export function buildMonthlyJarDashboard({
  jars,
  summaries,
  accountId,
  monthKey,
}: BuildMonthlyJarDashboardParams): JarDashboardItem[] {
  return jars
    .filter((jar) => jar.accountId === accountId && !jar.isArchived)
    .map((jar) => {
      const summary = summaries.find(
        (item) =>
          item.accountId === accountId && item.jarId === jar.id && item.monthKey === monthKey
      );

      const totalExpense = summary?.totalExpense ?? 0;
      const totalIncome = summary?.totalIncome ?? 0;
      const transactionCount = summary?.transactionCount ?? 0;

      const remainingAmount = jar.limit - totalExpense;
      const usedPercent = jar.limit > 0 ? Math.min((totalExpense / jar.limit) * 100, 999) : 0;

      return {
        id: `${jar.id}-${monthKey}`,
        accountId,
        jarId: jar.id,

        name: jar.name,
        limit: jar.limit,

        totalExpense,
        totalIncome,
        transactionCount,

        remainingAmount,
        usedPercent,
        isOverLimit: totalExpense > jar.limit,

        isDefault: jar.isDefault,
        isArchived: jar.isArchived,
      };
    });
}
