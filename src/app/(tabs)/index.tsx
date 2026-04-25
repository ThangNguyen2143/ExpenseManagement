import AccountBalance from '@/src/components/Home/AccountBalance';
import CreateAccountModal from '@/src/components/Home/CreateAccountModal';
import { appServices } from '@/src/services/app.service';
import { AccountModel } from '@/src/types/Models/Account';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  const [accountList, setAccountList] = useState<AccountModel[]>([]);
  const [showFirstAccountModal, setShowFirstAccountModal] = useState(false);
  //Fetch data
  useEffect(() => {
    appServices.services.onboardingService.isFirstLaunch().then((isFirst) => {
      if (isFirst) {
        setShowFirstAccountModal(true);
      }
    });
  }, []);
  useEffect(() => {
    appServices.services.accountService
      .getAllAccounts()
      .then(setAccountList)
      .catch((reason) => {
        console.error('Failed to fetch accounts', reason);
      });
  }, []);
  //---------

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View className="flex-1">
        <ScrollView>
          {accountList.length > 0 && <AccountBalance accountId={accountList[0]?.id ?? ''} />}
        </ScrollView>
      </View>
      <CreateAccountModal
        isVisible={showFirstAccountModal}
        onClose={() => setShowFirstAccountModal(false)}
      />
    </SafeAreaView>
  );
}
