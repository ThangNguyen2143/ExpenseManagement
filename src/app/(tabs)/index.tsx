import AccountBalance from '@/src/components/Home/AccountBalance';
import JarOverviewHomeScreen from '@/src/components/Home/JarOverview';
import CreateAccountModal from '@/src/components/Home/Modals/CreateAccountModal';
import CreateJarModal from '@/src/components/Home/Modals/CreateJarModal';
import RecentTransaction from '@/src/components/Home/RecentTransaction';
import AccountSelect from '@/src/components/Home/SelectAccountComp';
import { useAccountContext } from '@/src/Context/AccountContext';
import { useTransactionEvent } from '@/src/Context/TransactionEventContext';
import { appServices } from '@/src/services/app.service';
import { JarDashboardItem } from '@/src/services/Jar/types';
import { TransactionModel } from '@/src/types/Models/Transaction';
import { mapJarIdToNameJar } from '@/src/utils/mapJarIdToNameJar';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  const { colorScheme } = useColorScheme();
  const bg = colorScheme === 'dark' ? '#09090b' : '#ffffff';
  const {
    accounts: accountList,
    selectedAccountId: accountSelected,
    selectAccount: setAccountSelected,
    refreshAccounts,
    isLoading,
  } = useAccountContext();
  const { transactionChange } = useTransactionEvent();

  const [showFirstAccountModal, setShowFirstAccountModal] = useState(false);
  const [showAddJarModal, setShowAddJarModal] = useState(false);
  const [jarsDashboard, setJarsDashboard] = useState<JarDashboardItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionModel[]>([]);
  const fetchDataDashboard = useCallback(async (accountId: string) => {
    await appServices.services.jarService.getDashboardJars(accountId ?? '').then(setJarsDashboard);
    await appServices.services.transactionService
      .getRecentTransactions(accountId)
      .then(setRecentTransactions);
  }, []);
  useEffect(() => {
    appServices.services.onboardingService
      .isFirstLaunch()
      .then((isFirst) => {
        if (isFirst) {
          setShowFirstAccountModal(true);
        }
      })
      .catch((error) => {
        console.error('Failed to check onboarding state', error);
      });
  }, []);
  useEffect(() => {
    if (!accountSelected) return;
    fetchDataDashboard(accountSelected);
  }, [accountSelected, fetchDataDashboard]);
  useEffect(() => {
    if (!transactionChange?.version || !transactionChange?.accountId) return;
    if (!accountSelected) return;

    const isSameAccount = transactionChange.accountId === accountSelected;

    if (!isSameAccount) return;

    fetchDataDashboard(accountSelected);
  }, [
    transactionChange?.version,
    transactionChange?.accountId,
    accountSelected,
    fetchDataDashboard,
  ]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['left', 'right']}>
      <View className="flex-1 bg-white dark:bg-zinc-950">
        <ScrollView>
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-500">Loading accounts...</Text>
            </View>
          ) : accountList.length === 0 ? (
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-500">No accounts found. Please create an account.</Text>
            </View>
          ) : null}
          <AccountSelect
            data={accountList.map((a) => ({ id: a.id, label: a.name }))}
            id_select={accountSelected}
            onChange={setAccountSelected}
          />
          {accountList.length > 0 && (
            <AccountBalance
              balance={accountList.find((a) => a.id === accountSelected)?.balance ?? null}
            />
          )}
          <JarOverviewHomeScreen jars={jarsDashboard} onAddJar={() => setShowAddJarModal(true)} />
          {accountSelected && (
            <RecentTransaction
              transactions={recentTransactions.map((tx) => ({
                ...tx,
                jarName: mapJarIdToNameJar({ jarId: tx.jarId, jars: jarsDashboard }),
              }))}
              JarList={jarsDashboard}
              onRefresh={() => fetchDataDashboard(accountSelected)}
            />
          )}
        </ScrollView>
      </View>
      <CreateAccountModal
        isVisible={showFirstAccountModal}
        onClose={() => {
          setShowFirstAccountModal(false);
          refreshAccounts();
        }}
      />
      {accountSelected && (
        <CreateJarModal
          isVisible={showAddJarModal}
          onClose={() => {
            setShowAddJarModal(false);
            fetchDataDashboard(accountSelected);
          }}
          accountId={accountSelected}
        />
      )}
    </SafeAreaView>
  );
}
