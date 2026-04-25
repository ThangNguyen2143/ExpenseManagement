import TransactionCard from '@/src/components/transaction/TransactionCard';
import { SectionList, Text, View } from 'react-native';

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
    <View style={{ flex: 1, backgroundColor: '#1E293B' }}>
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-gray-400">Danh sách chi tiêu gần đây</Text>
          </View>
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text className="mb-3 mt-4 text-lg font-bold text-white">{title}</Text>
        )}
        renderItem={({ item }) => <TransactionCard item={item} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default TransactionPage;
