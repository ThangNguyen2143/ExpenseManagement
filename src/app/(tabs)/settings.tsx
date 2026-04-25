import InputModal from '@/src/components/InputModal';
import { appServices } from '@/src/services/app.service';
import { AddNewAccountDTO } from '@/src/types/dto/AddNewAccount';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function SettingsScreen() {
  const [isDark, setIsDark] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [accountInput, setAccountInput] = useState<AddNewAccountDTO | undefined>(undefined);
  useEffect(() => {
    const fetchAccount = async () => {
      const accounts = await appServices.services.accountService.getAllAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        setAccountInput({ name: account.name, balance: account.balance });
      }
    };
    if (showModalUpdate) {
      fetchAccount();
    }
  }, [showModalUpdate]);
  const onSubmit = async () => {
    if (!accountInput) return;
    try {
      const accounts = await appServices.services.accountService.getAllAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        await appServices.services.accountService.updateAccount(account.id, accountInput);
        setShowModalUpdate(false);
        toast.success('Cập nhật tài khoản thành công');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật tài khoản');
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{ padding: 16 }}>
          <Text className="mb-4 text-2xl font-bold text-zinc-900">⚙️ Cài đặt</Text>
          <View className="flex-1 gap-4">
            <View className="flex-row items-center justify-between rounded-2xl border border-zinc-200 bg-white px-2 py-4">
              <Text className="text-base font-medium text-zinc-900">Chủ đề</Text>
              <Pressable
                className="mt-2 rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-2"
                onPress={() => setIsDark(!isDark)}>
                {isDark ? (
                  <Ionicons name="moon" size={20} color="#000" />
                ) : (
                  <Ionicons name="sunny" size={20} color="#000" />
                )}
              </Pressable>
            </View>
            <View className="flex-row items-center justify-between rounded-2xl border border-zinc-200 bg-white px-2 py-4">
              <Text className="text-base font-medium text-zinc-900">Xóa dữ liệu</Text>
              <Pressable className="mt-2 rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-2">
                <Text className="text-sm text-zinc-700">Xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View>
          <Pressable
            className="mx-4 my-8 items-center rounded-md bg-white px-4 py-2"
            onPress={() => setShowModalUpdate(true)}>
            <Text className="text-center font-bold"> Cài đặt tài khoản </Text>
          </Pressable>
        </View>
        <View className="mx-4 my-8 h-[1px] bg-zinc-300" />
        <View>
          <Text className="mt-8 text-center text-sm text-zinc-500">
            © 2026 Expense Management App. All rights reserved.
          </Text>
        </View>
      </ScrollView>
      <InputModal
        isVisible={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        title="Cập nhật tài khoản">
        <TextInput
          placeholder="Tên tài khoản"
          className="m-4 rounded-md border border-zinc-600 bg-zinc-700 p-2 text-white"
          value={accountInput?.name}
          onChangeText={(e) => {
            setAccountInput((pre) => ({ name: e, balance: pre?.balance || 0 }));
          }}
        />
        <TextInput
          placeholder="Số dư ban đầu"
          keyboardType="numeric"
          className="mx-4 mb-4 rounded-md border border-zinc-600 bg-zinc-700 p-2 text-white"
          value={accountInput?.balance.toString()}
          onChangeText={(e) => {
            setAccountInput((pre) => ({ name: pre?.name || '', balance: parseFloat(e) || 0 }));
          }}
        />
        <Pressable className="mx-4 items-center rounded-md bg-white p-2" onPress={onSubmit}>
          <Text>Cập nhật</Text>
        </Pressable>
      </InputModal>
    </SafeAreaView>
  );
}
