import { selectedAccountStore } from '@/src/store/selectAccount';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { appServices } from '../services/app.service';
import { AccountModel } from '../types/Models/Account';
type AccountContextValue = {
  accounts: AccountModel[];
  selectedAccountId: string | null;
  selectedAccount: AccountModel | null;

  isLoading: boolean;
  isReady: boolean;

  refreshAccounts: () => Promise<void>;
  selectAccount: (accountId: string) => Promise<void>;
  setDefaultAccount: (accountId: string) => Promise<void>;
  clearSelectedAccount: () => Promise<void>;
};
const AccountContext = createContext<AccountContextValue | null>(null);
export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AccountModel[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    try {
      const [storedAccountId, dbAccounts] = await Promise.all([
        selectedAccountStore.getSelectedAccountId(),
        appServices.services.accountService.getAllAccounts(),
      ]);

      setAccounts(dbAccounts);

      const storedAccountExists =
        storedAccountId &&
        dbAccounts.some((account: AccountModel) => account.id === storedAccountId);

      if (storedAccountExists) {
        setSelectedAccountId(storedAccountId);
        return;
      }

      const fallbackAccount = dbAccounts[0];

      if (fallbackAccount) {
        setSelectedAccountId(fallbackAccount.id);
        await selectedAccountStore.setSelectedAccountId(fallbackAccount.id);
        return;
      }

      setSelectedAccountId(null);
      await selectedAccountStore.removeSelectedAccountId();
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, []);
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);
  const refreshAccounts = useCallback(async () => {
    const dbAccounts = await appServices.services.accountService.getAllAccounts();

    setAccounts(dbAccounts);

    setSelectedAccountId((currentSelectedId) => {
      if (!currentSelectedId) return dbAccounts[0]?.id ?? null;

      const stillExists = dbAccounts.some(
        (account: AccountModel) => account.id === currentSelectedId
      );

      return stillExists ? currentSelectedId : (dbAccounts[0]?.id ?? null);
    });
  }, []);

  const selectAccount = useCallback(async (accountId: string) => {
    const account = await appServices.services.accountService.getAccount(accountId);

    setSelectedAccountId(account.id);
    await selectedAccountStore.setSelectedAccountId(account.id);
  }, []);

  const setDefaultAccount = useCallback(
    async (accountId: string) => {
      await selectAccount(accountId);
    },
    [selectAccount]
  );

  const clearSelectedAccount = useCallback(async () => {
    setSelectedAccountId(null);
    await selectedAccountStore.removeSelectedAccountId();
  }, []);

  const selectedAccount = useMemo(() => {
    if (!selectedAccountId) return null;

    return accounts.find((account) => account.id === selectedAccountId) ?? null;
  }, [accounts, selectedAccountId]);

  const value = useMemo<AccountContextValue>(
    () => ({
      accounts,
      selectedAccountId,
      selectedAccount,
      isLoading,
      isReady,
      refreshAccounts,
      selectAccount,
      setDefaultAccount,
      clearSelectedAccount,
    }),
    [
      accounts,
      selectedAccountId,
      selectedAccount,
      isLoading,
      isReady,
      refreshAccounts,
      selectAccount,
      setDefaultAccount,
      clearSelectedAccount,
    ]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
export function useAccountContext() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error('useAccountContext must be used inside AccountProvider');
  }

  return context;
}

export function useSelectedAccount() {
  const { selectedAccount, selectedAccountId, isLoading, isReady, selectAccount } =
    useAccountContext();

  return {
    selectedAccount,
    selectedAccountId,
    isLoading,
    isReady,
    selectAccount,
  };
}
