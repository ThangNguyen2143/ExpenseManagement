export type CategoryRuleModel = {
  id: string;
  keywords: string[];
  normalizedKeyword: string;
  jarId: string;

  hitCount: number; // số lần rule này được áp dụng
  createdAt: string;
  updatedAt: string;
};
