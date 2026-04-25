import { JarDashboardItem } from '@/src/types/Views/JarViewModel';
import { Text, View } from 'react-native';

function JarOverviewHomeScreen({ jars }: { jars: JarDashboardItem[] }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text className="text-2xl font-bold">Hũ chi tiêu</Text>
      <View className="flex-row flex-wrap justify-between p-5">
        {jars.map((jar, i) => (
          <View
            className="mb-4 w-[48%] rounded-2xl border border-zinc-200 bg-white p-4"
            key={jar.name + i}>
            <Text className="mb-2 text-base font-semibold text-zinc-800">{jar.name}</Text>
            <Text className="text-lg font-bold text-blue-600">
              {jar.remainingAmount.toFixed(2)}đ
              <Text className="text-sm font-medium text-zinc-500"> / {jar.limit}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default JarOverviewHomeScreen;
