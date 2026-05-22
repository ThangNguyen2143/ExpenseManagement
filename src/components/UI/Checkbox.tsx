import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
type CheckboxVariant = 'primary' | 'secondary' | 'default' | 'neutral';
const variantClass: Record<CheckboxVariant, string> = {
  primary: 'border-blue-500 bg-blue-500',
  secondary: 'border-emerald-500 bg-emerald-500',
  default: 'border-amber-400 bg-amber-400',
  neutral: 'border-zinc-500 bg-zinc-500',
};

const uncheckedClass: Record<CheckboxVariant, string> = {
  primary: 'border-blue-500',
  secondary: 'border-emerald-500',
  default: 'border-amber-400',
  neutral: 'border-zinc-500',
};
type CheckboxProps = {
  checked: boolean;
  label?: string;
  variant?: CheckboxVariant;
  onChange: (checked: boolean) => void;
};

export default function Checkbox({ checked, label, variant = 'default', onChange }: CheckboxProps) {
  return (
    <Pressable onPress={() => onChange(!checked)} className="flex-row items-center gap-3">
      <View
        className={`h-6 w-6 items-center justify-center rounded-md border ${
          checked ? variantClass[variant] : `${uncheckedClass[variant]} bg-transparent`
        }`}>
        {checked && <Ionicons name="checkmark" size={18} color="#111827" />}
      </View>

      {!!label && <Text className="text-base text-zinc-900 dark:text-white">{label}</Text>}
    </Pressable>
  );
}
