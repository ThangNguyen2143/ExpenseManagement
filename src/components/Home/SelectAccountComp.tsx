import React, { useState } from 'react';
import { Modal, Pressable, Text } from 'react-native';

export type SelectOption = {
  id: string;
  label: string;
};

type AccountSelectProps = {
  data: SelectOption[];
  id_select?: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
};

export default function AccountSelect({
  data,
  id_select,
  onChange,
  placeholder = 'Chọn tài khoản',
}: AccountSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedItem = data.find((item) => item.id === id_select);

  const handleSelect = (item: SelectOption) => {
    onChange(item.id);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3">
        <Text className={selectedItem ? 'text-white' : 'text-zinc-400'}>
          {selectedItem?.label ?? placeholder}
        </Text>

        <Text className="text-zinc-400">▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} className="flex-1 justify-end bg-black/60">
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="rounded-t-3xl bg-zinc-900 px-5 pb-8 pt-5">
            <Text className="mb-4 text-lg font-bold text-white">Chọn tài khoản</Text>

            {data.map((item) => {
              const active = item.id === id_select;

              return (
                <Pressable
                  key={String(item.id)}
                  onPress={() => handleSelect(item)}
                  className={`mb-3 rounded-2xl px-4 py-4 ${
                    active ? 'bg-amber-400' : 'bg-zinc-800'
                  }`}>
                  <Text className={`text-base font-medium ${active ? 'text-black' : 'text-white'}`}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
