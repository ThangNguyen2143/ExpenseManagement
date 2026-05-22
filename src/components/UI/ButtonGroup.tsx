import React from 'react';
import { Pressable, Text, View } from 'react-native';

type ButtonGroupVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'neutral';

type ButtonGroupOrientation = 'horizontal' | 'vertical' | 'responsive';

type ButtonGroupOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type ButtonGroupProps = {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;

  variant?: ButtonGroupVariant;
  orientation?: ButtonGroupOrientation;

  radius?: number;
  fullWidth?: boolean;

  containerClassName?: string;
  itemClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  activeTextClassName?: string;
  inactiveTextClassName?: string;
};

const variantClass: Record<ButtonGroupVariant, string> = {
  default: 'border-zinc-300 dark:border-zinc-700',
  primary: 'border-blue-400',
  secondary: 'border-emerald-400',
  danger: 'border-rose-400',
  neutral: 'border-zinc-500',
};

const activeVariantClass: Record<ButtonGroupVariant, string> = {
  default: 'bg-zinc-200 dark:bg-zinc-700',
  primary: 'bg-blue-600',
  secondary: 'bg-emerald-600',
  danger: 'bg-rose-600',
  neutral: 'bg-zinc-700',
};

const inactiveVariantClass: Record<ButtonGroupVariant, string> = {
  default: 'bg-white dark:bg-zinc-900',
  primary: 'bg-blue-50 dark:bg-blue-950/30',
  secondary: 'bg-emerald-50 dark:bg-emerald-950/30',
  danger: 'bg-rose-50 dark:bg-rose-950/30',
  neutral: 'bg-zinc-50 dark:bg-zinc-900',
};

const activeTextVariantClass: Record<ButtonGroupVariant, string> = {
  default: 'text-zinc-950 dark:text-white font-semibold',
  primary: 'text-white font-semibold',
  secondary: 'text-white font-semibold',
  danger: 'text-white font-semibold',
  neutral: 'text-white font-semibold',
};

const inactiveTextVariantClass: Record<ButtonGroupVariant, string> = {
  default: 'text-zinc-700 dark:text-zinc-300',
  primary: 'text-blue-700 dark:text-blue-300',
  secondary: 'text-emerald-700 dark:text-emerald-300',
  danger: 'text-rose-700 dark:text-rose-300',
  neutral: 'text-zinc-700 dark:text-zinc-300',
};

const orientationClass: Record<ButtonGroupOrientation, string> = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
  responsive: 'flex-col lg:flex-row',
};

const separatorClass: Record<ButtonGroupOrientation, string> = {
  horizontal: 'border-l',
  vertical: 'border-t',
  responsive: 'border-t lg:border-t-0 lg:border-l',
};

export function ButtonGroup({
  options,
  value,
  onChange,

  variant = 'default',
  orientation = 'horizontal',

  radius = 10,
  fullWidth = false,

  containerClassName = '',
  itemClassName = '',
  activeClassName,
  inactiveClassName,
  activeTextClassName,
  inactiveTextClassName,
}: ButtonGroupProps) {
  return (
    <View
      className={`
        overflow-hidden border
        ${orientationClass[orientation]}
        ${variantClass[variant]}
        ${fullWidth ? 'w-full' : 'self-start'}
        ${containerClassName}
      `}
      style={{ borderRadius: radius }}
      accessibilityRole="radiogroup">
      {options.map((option, index) => {
        const isActive = option.value === value;
        const isFirst = index === 0;

        return (
          <Pressable
            key={option.value}
            disabled={option.disabled}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{
              selected: isActive,
              disabled: option.disabled,
            }}
            className={`
              items-center justify-center px-5 py-3
              ${fullWidth ? 'flex-1' : ''}
              ${!isFirst ? separatorClass[orientation] : ''}
              ${variantClass[variant]}
              ${
                isActive
                  ? (activeClassName ?? activeVariantClass[variant])
                  : (inactiveClassName ?? inactiveVariantClass[variant])
              }
              ${option.disabled ? 'opacity-40' : 'opacity-100'}
              ${itemClassName}
            `}>
            <Text
              className={`
                text-sm
                ${
                  isActive
                    ? (activeTextClassName ?? activeTextVariantClass[variant])
                    : (inactiveTextClassName ?? inactiveTextVariantClass[variant])
                }
              `}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
