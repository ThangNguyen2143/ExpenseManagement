import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import InputModal from '../InputModal';
export default function FAB() {
  const [showModalInput, setShowModalInput] = useState(false);
  const [text, onChangeText] = useState('');
  const onAddTransaction = () => {
    // Handle adding transaction logic here
    setShowModalInput(false);
  };
  return (
    <>
      <Pressable
        className="
        absolute 
        bottom-8 
        h-20 w-20
        items-center 
        justify-center 
        self-center 
        rounded-full 
        bg-blue-600 
        shadow-xl
      "
        onPress={() => {
          setShowModalInput(true);
        }}>
        <Text className="text-lg font-bold text-white">
          <Ionicons name="add" size={28} />
        </Text>
      </Pressable>
      <InputModal
        isVisible={showModalInput}
        onClose={() => setShowModalInput(false)}
        title="Thêm giao dịch">
        <TextInput
          className="border border-zinc-300 bg-white p-4 text-zinc-800"
          placeholder="Vd: Cafe 25k"
          onChangeText={onChangeText}
          value={text}
        />
        <View className="flex-row items-center justify-end space-x-4 px-4 py-3">
          <Pressable
            onPress={onAddTransaction}
            className="rounded-full bg-blue-600 px-6 py-4 active:bg-blue-700">
            <Text className="text-lg font-bold text-white">Lưu</Text>
          </Pressable>
        </View>
      </InputModal>
    </>
  );
}
