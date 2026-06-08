import { TransactionModel } from '@/src/types/Models/Transaction';
import { Ionicons } from '@expo/vector-icons';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
type TransactionCardProps = {
  item: TransactionModel & { jarName: string | null };
  onLongPress: (event: GestureResponderEvent) => void;
  onDelete: (item: TransactionModel & { jarName: string | null }) => void;
};
function TransactionCards({ item, onLongPress, onDelete }: TransactionCardProps) {
  const renderRightActions = () => {
    return (
      <Pressable
        onPress={() => onDelete(item)}
        className="mb-3 ml-2 items-center justify-center rounded-2xl bg-rose-500 px-6">
        <Ionicons name="trash-bin" size={24} color={'black'} />
      </Pressable>
    );
  };
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable
        className="mb-3 rounded-2xl border border-zinc-200  p-4"
        key={item.id}
        onLongPress={onLongPress}
        delayLongPress={1000}>
        <View className="mb-2 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {item.title}
            </Text>
            <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.jarName}</Text>
          </View>

          <Text className="text-base font-bold text-rose-500 dark:text-rose-400">
            {item.amount.toLocaleString()}đ
          </Text>
        </View>

        <Text className="text-sm text-zinc-600 dark:text-zinc-400">{item.type}</Text>
      </Pressable>
    </Swipeable>
  );
}

export default TransactionCards;
