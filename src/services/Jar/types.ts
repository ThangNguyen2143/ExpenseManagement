import { JarModel } from '@/src/types/Models/Jar';

export type CreateJarInput = {
  name: string;
  limit: number;
  accountId: string;
  isDefault?: boolean;
};

export type JarDashboardItem = JarModel & {
  spent: number;
  remaining: number;
  percentUsed: number;
  isOverLimit: boolean;
};

export type JarAnalysisItem = JarModel & {
  spent: number;
  percentOfTotal: number;
};

export type JarAnalysisParams = {
  accountId: string;
  from: string; // ISO string
  to: string; // ISO string
};
