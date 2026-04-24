import { FontAwesome } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View className="mx-7 h-16 w-80 items-center justify-center rounded-xl border-4 border-yellow-400 p-0.5">
        <Pressable
          className="h-full w-full flex-row items-center justify-center rounded-xl bg-white"
          onPress={onPress}>
          <FontAwesome name="picture-o" size={18} color="#25292e" className="pr-2" />
          <Text className="text-base text-blue-950 ">{label}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View className="mx-7 h-16 w-80 items-center justify-center p-0.5">
      <Pressable
        className="h-full w-full flex-row items-center justify-center rounded-xl"
        onPress={onPress}>
        <Text className="text-base text-white">{label}</Text>
      </Pressable>
    </View>
  );
}
