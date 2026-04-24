import { SectionList, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
type TransactionItem = {
  id: string;
  name: string;
  amount: string;
};
function TransactionCard({ item }: { item: TransactionItem }) {
  return (
    <View className="mb-3 rounded-2xl bg-zinc-800 px-4 py-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-medium text-white">{item.name}</Text>
        <Text className="text-base font-bold text-rose-400">{item.amount}</Text>
      </View>
    </View>
  );
}
function TransactionPage() {
  const groupedTransactions = [
    {
      title: 'Hôm nay',
      data: [
        { id: '1', name: 'Cafe', amount: '-25k' },
        { id: '2', name: 'Grab', amount: '-50k' },
      ],
    },
    {
      title: 'Hôm qua',
      data: [{ id: '3', name: 'Ăn trưa', amount: '-40k' }],
    },
  ];
  return (
    <ScrollView className="flex-1 items-center justify-center bg-black">
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="mb-3 mt-4 text-lg font-bold text-white">{title}</Text>
        )}
        renderItem={({ item }) => <TransactionCard item={item} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
}

export default TransactionPage;
