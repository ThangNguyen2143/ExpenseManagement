import React, { Ref } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

type InputType = 'text' | 'numeric';

type InputVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'neutral';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  type?: InputType;
  variant?: InputVariant;
  disabled?: boolean;
  ref?: Ref<TextInput>;
};

const variantClass: Record<InputVariant, string> = {
  default: 'border-zinc-300 focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-white',
  primary: 'border-blue-400 focus:border-blue-600',
  secondary: 'border-emerald-400 focus:border-emerald-600',
  danger: 'border-rose-400 focus:border-rose-600',
  neutral: 'border-zinc-500 focus:border-zinc-700',
};

export default function InputCustom({
  label,
  error,
  type = 'text',
  variant = 'default',
  disabled = false,
  className = '',
  ref,
  ...props
}: InputProps) {
  const keyboardType = type === 'numeric' ? 'numeric' : 'default';

  return (
    <View className="w-full">
      {!!label && (
        <Text className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</Text>
      )}

      <TextInput
        editable={!disabled}
        ref={ref}
        keyboardType={keyboardType}
        placeholderTextColor="#9ca3af"
        className={`
          min-h-12 w-full rounded-xl border bg-white px-4 py-3
          text-base text-zinc-900
          dark:bg-zinc-900 dark:text-white
          ${variantClass[error ? 'danger' : variant]}
          ${disabled ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800' : ''}
          ${className}
        `}
        {...props}
      />

      {!!error && <Text className="mt-1 text-sm text-rose-500">{error}</Text>}
    </View>
  );
}
