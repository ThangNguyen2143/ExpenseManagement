import { appServices } from '@/src/services/app.service';
import { CreateJarInput } from '@/src/services/Jar/types';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import InputCustom from '../../UI/InputCustom';
import InputModal from '../../UI/InputModal';

type CreateJarModalProps = {
  accountId: string;
  isVisible: boolean;
  onClose: () => void;
};
function CreateJarModal({ accountId, isVisible, onClose }: CreateJarModalProps) {
  const [nameJar, setNameJar] = useState('');
  const [limitExpense, setLimitExpense] = useState(0);
  const onSubmit = async () => {
    const payload: CreateJarInput = {
      name: nameJar,
      limit: limitExpense,
      accountId,
    };
    try {
      await appServices.services.jarService.createJar(payload);
      setNameJar('');
      setLimitExpense(0);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Không thể tạo hũ');
    }
  };
  const onChangeLitmit = (value: string) => {
    let parse = Number.parseFloat(value);
    if (isNaN(parse)) parse = 0;
    setLimitExpense(parse);
  };
  return (
    <InputModal isVisible={isVisible} onClose={onClose} title="Tạo hũ mới">
      <View className="mt-4 gap-2 px-4">
        <InputCustom
          placeholder="Tên hũ"
          variant="primary"
          value={nameJar}
          onChangeText={setNameJar}
        />
        <InputCustom
          placeholder="Giới hạn chi tiêu"
          type="numeric"
          variant="primary"
          value={limitExpense.toString()}
          onChangeText={onChangeLitmit}
        />
        <View className="mt-2 items-center justify-center">
          <Pressable onPress={onSubmit} className="rounded-xl border border-zinc-200 bg-white p-2">
            <Text>Tạo hũ</Text>
          </Pressable>
        </View>
      </View>
    </InputModal>
  );
}

export default CreateJarModal;
