import InputModal from '@/src/components/UI/InputModal';
import { appServices } from '@/src/services/app.service';
import { AddNewAccountDTO } from '@/src/types/dto/AddNewAccount';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-white p-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <View className="flex-1 ">
          <Text className="mb-4 text-2xl font-bold dark:text-zinc-100">⚙️ Cài đặt</Text>
          <View className="flex-1 gap-4">
            <View className="flex-row items-center justify-between rounded-2xl border px-2 py-4 dark:border-zinc-700">
              <Text className="text-base font-medium dark:text-zinc-100">Chủ đề</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={20}
                  color={isDark ? '#fff' : '#000'}
                />

                <Switch
                  onValueChange={(value) => setColorScheme(value ? 'dark' : 'light')}
                  value={isDark}
                />
              </View>
            </View>
            <View className="flex-row items-center justify-between rounded-2xl border  px-2 py-4 dark:border-zinc-700">
              <Text className="text-base font-medium dark:text-zinc-100">Xóa dữ liệu</Text>
              <Pressable className="mt-2 rounded-lg border px-4 py-2">
                <Text className="text-sm dark:text-zinc-100">Xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View className="mx-4 my-8 ">
          <Pressable
            className="items-center rounded-md border px-4 py-2"
            onPress={() => setShowModalUpdate(true)}>
            <Text className="text-center font-bold dark:text-zinc-100"> Cài đặt tài khoản </Text>
          </Pressable>
        </View>
        <View className="mx-4 my-8 h-[1px] " />
        <View className="">
          <Text className="mt-8 text-center text-sm dark:text-zinc-100">
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
        <Pressable className="mx-4 items-center rounded-md border px-4 py-2" onPress={onSubmit}>
          <Text className="dark:text-zinc-100">Cập nhật</Text>
        </Pressable>
      </InputModal>
    </SafeAreaView>
  );
}
