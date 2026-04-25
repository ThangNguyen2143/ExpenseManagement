const APP_PREFIX = '@money_app';

export const StorageKeys = {
  meta: `${APP_PREFIX}:meta`,
  accounts: `${APP_PREFIX}:accounts`,
  jars: `${APP_PREFIX}:jars`,
  transactions: `${APP_PREFIX}:transactions`,
  categoryRules: `${APP_PREFIX}:category_rules`,
  settings: `${APP_PREFIX}:settings`,
  ONBOARDING_KEY: `${APP_PREFIX}:hasCompletedOnboarding`,
} as const;
export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
