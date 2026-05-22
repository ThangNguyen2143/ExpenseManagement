import { Text, View } from 'react-native';

function AccountBalance({ balance }: { balance: number | null }) {
  return (
    <View className="mb-6 rounded-3xl bg-emerald-500 px-5 py-6">
      <Text className="mb-2 text-sm font-medium text-emerald-50">💰 Tổng tiền</Text>
      <Text className="text-3xl font-extrabold text-white">
        {balance !== null ? balance.toLocaleString() + 'đ' : '0đ'}
      </Text>
    </View>
  );
}

export default AccountBalance;
