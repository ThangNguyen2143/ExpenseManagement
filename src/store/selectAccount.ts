// src/store/selectedAccount.store.ts

import { StorageKeys } from '@/src/constants/ModelName';
import { appServices } from '@/src/services/app.service';
export const selectedAccountStore = {
  async getSelectedAccountId(): Promise<string | null> {
    try {
      const value = await appServices.storage.get<string | null>(
        StorageKeys.SELECTED_ACCOUNT_ID,
        null
      );

      if (!value || typeof value !== 'string') {
        return null;
      }

      return value;
    } catch (error) {
      console.warn('[selectedAccountStore] Failed to get selected account id', error);

      return null;
    }
  },

  async setSelectedAccountId(accountId: string): Promise<void> {
    try {
      await appServices.storage.set(StorageKeys.SELECTED_ACCOUNT_ID, accountId);
    } catch (error) {
      console.warn('[selectedAccountStore] Failed to set selected account id', error);
    }
  },

  async removeSelectedAccountId(): Promise<void> {
    try {
      await appServices.storage.remove(StorageKeys.SELECTED_ACCOUNT_ID);
    } catch (error) {
      console.warn('[selectedAccountStore] Failed to remove selected account id', error);
    }
  },
};
