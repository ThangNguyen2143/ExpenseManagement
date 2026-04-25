import { appServices } from '@/src/services/app.service';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { toast } from 'sonner-native';

function AccountBalance({ accountId }: { accountId: string }) {
  const [balance, setBalance] = useState(5200000);
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const account = await appServices.services.accountService.getAccount(accountId);
        setBalance(account.balance);
      } catch (error) {
        console.error('Error fetching account:', error);
        setBalance(0);
        toast.error('Không thể tải thông tin tài khoản');
      }
    };
    fetchAccount();
  }, [accountId]);
  return (
    <View className="mb-6 rounded-3xl bg-emerald-500 px-5 py-6">
      <Text className="mb-2 text-sm font-medium text-emerald-50">💰 Tổng tiền</Text>
      <Text className="text-3xl font-extrabold text-white">{balance.toLocaleString()}đ</Text>
    </View>
  );
}

export default AccountBalance;
