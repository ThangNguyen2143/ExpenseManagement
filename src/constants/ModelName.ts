const APP_PREFIX = '@money_app';

export const StorageKeys = {
  meta: `${APP_PREFIX}:meta`,
  accounts: `${APP_PREFIX}:accounts`,
  jars: `${APP_PREFIX}:jars`,
  transactions: `${APP_PREFIX}:transactions`,
  categoryRules: `${APP_PREFIX}:category_rules`,
  settings: `${APP_PREFIX}:settings`,
  ONBOARDING_KEY: `${APP_PREFIX}:hasCompletedOnboarding`,
  dailySummaries: `${APP_PREFIX}:dailySummaries`,
  monthlySummaries: `${APP_PREFIX}:monthlySummaries`,
  dailyJarSummaries: `${APP_PREFIX}:dailyJarSummaries`,
  monthlyJarSummaries: `${APP_PREFIX}:monthlyJarSummaries`,
  SELECTED_ACCOUNT_ID: `${APP_PREFIX}:selected_account_id`,
  templateTransactions: `${APP_PREFIX}:template_transactions`,
} as const;
export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
