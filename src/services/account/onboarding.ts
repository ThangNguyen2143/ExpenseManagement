import { StorageKeys } from '@/src/constants/ModelName';
import { JsonStorage } from '../db/JsonStore';
import { AccountRepository } from './accountRepository';

export class OnboardingService {
  constructor(
    private storage: JsonStorage,
    private account: AccountRepository
  ) {}
  async isFirstLaunch(): Promise<boolean> {
    const value = await this.account.getAll();
    return value.length === 0;
  }

  async markOnboardingCompleted(): Promise<void> {
    await this.storage.set(StorageKeys.ONBOARDING_KEY, 'true');
  }

  async resetOnboarding(): Promise<void> {
    await this.storage.remove(StorageKeys.ONBOARDING_KEY);
  }
}
