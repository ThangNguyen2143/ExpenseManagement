import { TransactionModel } from '@/src/types/Models/Transaction';
import { Text, View } from 'react-native';

function RecentTransaction({ transactions }: { transactions: TransactionModel[] }) {
  return (
    <View className="mb-6 p-4">
      <Text className="mb-4 text-lg font-bold text-zinc-900">📜 Giao dịch gần đây</Text>

      {transactions.map((item) => (
        <View className="mb-3 rounded-2xl border border-zinc-200 bg-white p-4" key={item.id}>
          <View className="mb-2 flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold text-zinc-900">{item.title}</Text>
              <Text className="mt-1 text-sm text-zinc-500">{item.jarId}</Text>
            </View>

            <Text className="text-base font-bold text-rose-500">{item.amount}</Text>
          </View>

          <Text className="text-sm text-zinc-600">{item.type}</Text>
        </View>
      ))}
    </View>
  );
}

export default RecentTransaction;
