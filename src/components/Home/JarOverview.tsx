import { JarDashboardItem } from '@/src/services/Jar/types';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
type JarOverviewHomeScreenProps = {
  jars: JarDashboardItem[];
  onAddJar?: () => void;
};
function JarOverviewHomeScreen({ jars, onAddJar }: JarOverviewHomeScreenProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text className="text-2xl font-bold dark:text-zinc-100">Hũ chi tiêu</Text>
      <View className="flex-row flex-wrap justify-between p-5">
        {jars.map((jar, i) => (
          <View
            className="mb-4 w-[48%] rounded-2xl border border-zinc-200 bg-white p-4"
            key={jar.name + i}>
            <Text className="mb-2 text-base font-semibold text-zinc-800">{jar.name}</Text>
            <Text className="text-lg font-bold text-blue-600">
              {jar.spent.toLocaleString()}đ
              <Text className="text-sm font-medium text-zinc-500">
                {' '}
                / {jar.limit.toLocaleString()}đ
              </Text>
            </Text>
          </View>
        ))}
        <View className="mb-4 w-[48%] items-center justify-center rounded-2xl border border-zinc-200 bg-white p-4">
          <Pressable className="flex-row" onPress={onAddJar}>
            <Ionicons name="add" size={24} color="black" />
            <Text className="text-base font-semibold text-zinc-800">Thêm hũ</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default JarOverviewHomeScreen;
