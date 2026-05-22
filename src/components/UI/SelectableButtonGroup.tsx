import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Option = {
  id: string;
  label: string;
};

type SelectableButtonGroupProps = {
  options: Option[];
  value: string | null;
  onChange: (id: string) => void;
  direction?: 'row' | 'column';
};

export function SelectableButtonGroup({
  options,
  value,
  onChange,
  direction = 'row',
}: SelectableButtonGroupProps) {
  return (
    <View className={`flex-${direction} flex-wrap gap-3`}>
      {options.map((option) => {
        const isActive = value === option.id;

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            className={`
              rounded-full border px-4 py-2
              ${
                isActive
                  ? 'border-blue-600 bg-blue-600 opacity-100'
                  : 'border-gray-300 bg-gray-100 opacity-60'
              }
            `}>
            <Text
              className={`
                text-sm font-semibold
                ${isActive ? 'text-white' : 'text-gray-600'}
              `}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
