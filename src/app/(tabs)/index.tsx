import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  // Layout Home screen
  /**
   * ---------------------------------
      💰 Tổng tiền: 5,200,000đ

      Hũ chi tiêu  -> style center
      - Ăn uống: 1tr / 2tr
      - Di chuyển: 500k / 1tr
      - Cá nhân: 300k / 800k
      - Giải trí: 200k / 500k
      -> style grid with 2 columns
      -------------------------------
      📜 Giao dịch gần đây
      - Cafe -25k
      - Grab -50k
      - Ăn trưa -40k
      ---------------------------------

           (+)
   */
  //Fetch data
  const jars = [
    { name: 'Ăn uống', spent: 1000000, total: 2000000 },
    { name: 'Di chuyển', spent: 500000, total: 1000000 },
    { name: 'Cá nhân', spent: 300000, total: 800000 },
    { name: 'Giải trí', spent: 200000, total: 500000 },
  ];
  const recentTransactions = [
    {
      id: 1,
      title: 'Cafe',
      amount: '-25k',
      category: 'Ăn uống',
      note: 'Cafe sáng',
    },
    {
      id: 2,
      title: 'Grab',
      amount: '-50k',
      category: 'Di chuyển',
      note: 'Đi làm',
    },
    {
      id: 3,
      title: 'Ăn trưa',
      amount: '-40k',
      category: 'Ăn uống',
      note: 'Cơm văn phòng',
    },
  ];
  //---------

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View className="flex-1">
        <ScrollView>
          <View className="mb-6 rounded-3xl bg-emerald-500 px-5 py-6">
            <Text className="mb-2 text-sm font-medium text-emerald-50">💰 Tổng tiền</Text>
            <Text className="text-3xl font-extrabold text-white">5,200,000đ</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text className="text-2xl font-bold">Hũ chi tiêu</Text>
            <View className="flex-row flex-wrap justify-between p-5">
              {jars.map((jar, i) => (
                <View
                  className="mb-4 w-[48%] rounded-2xl border border-zinc-200 bg-white p-4"
                  key={jar.name + i}>
                  <Text className="mb-2 text-base font-semibold text-zinc-800">{jar.name}</Text>
                  <Text className="text-lg font-bold text-blue-600">
                    {jar.spent}
                    <Text className="text-sm font-medium text-zinc-500"> / {jar.total}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View className="mb-6 p-4">
            <Text className="mb-4 text-lg font-bold text-zinc-900">📜 Giao dịch gần đây</Text>

            {recentTransactions.map((item) => (
              <View className="mb-3 rounded-2xl border border-zinc-200 bg-white p-4" key={item.id}>
                <View className="mb-2 flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold text-zinc-900">{item.title}</Text>
                    <Text className="mt-1 text-sm text-zinc-500">{item.category}</Text>
                  </View>

                  <Text className="text-base font-bold text-rose-500">{item.amount}</Text>
                </View>

                <Text className="text-sm text-zinc-600">{item.note}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
