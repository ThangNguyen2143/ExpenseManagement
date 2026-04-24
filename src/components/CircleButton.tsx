import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, View } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  return (
    <View className="mx-16 h-20 w-20 rounded-full border-4 border-yellow-400 p-1">
      <Pressable
        className="flex-1 items-center justify-center rounded-full bg-white"
        onPress={onPress}>
        <MaterialIcons name="add" size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}
