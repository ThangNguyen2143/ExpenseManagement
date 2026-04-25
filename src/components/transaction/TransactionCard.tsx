import { Text, View } from 'react-native';

type TransactionItem = {
  id: string;
  name: string;
  amount: string;
};
export default function TransactionCard({ item }: { item: TransactionItem }) {
  return (
    <View className="mb-3 rounded-2xl bg-zinc-800 px-4 py-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-medium text-white">{item.name}</Text>
        <Text className="text-base font-bold text-rose-400">{item.amount}</Text>
      </View>
    </View>
  );
}
