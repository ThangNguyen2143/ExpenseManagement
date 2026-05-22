import { appServices } from '@/src/services/app.service';
import { JarModel } from '@/src/types/Models/Jar';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import InputModal from '../../UI/InputModal';
import { SelectableButtonGroup } from '../../UI/SelectableButtonGroup';
type ChangeJarModalProps = {
  transactionId: string;
  JarIdCurrent: string;
  JarList: JarModel[];
  isOpen: boolean;
  onClose: () => void;
};
function ChangeJarModal({
  transactionId,
  JarIdCurrent,
  JarList,
  isOpen,
  onClose,
}: ChangeJarModalProps) {
  const JarCurrent = JarList.find((jar) => jar.id === JarIdCurrent);
  const [newJarIdSelected, setNewJarIdSelected] = useState<string | null>(null);
  const handleSaveChangeJar = async () => {
    if (!newJarIdSelected) return;
    try {
      await appServices.services.transactionService.changeJar(transactionId, newJarIdSelected);
      toast.success('Đổi hũ thành công');
      onClose();
    } catch (error) {
      console.error('Error changing jar:', error);
      toast.error('Đã có lỗi xảy ra khi đổi hũ. Vui lòng thử lại.');
    }
  };
  return (
    <InputModal isVisible={isOpen} onClose={onClose} title="Đổi hủ">
      <View className="flex-col p-4">
        <View className="flex-row items-center justify-around p-4">
          <Text className="color-zinc-100">{JarCurrent ? JarCurrent.name : 'Không xác định'}</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
          <SelectableButtonGroup
            options={JarList.filter((j) => j.id !== JarIdCurrent).map((j) => ({
              id: j.id,
              label: j.name,
            }))}
            value={newJarIdSelected}
            onChange={setNewJarIdSelected}
            direction="column"
          />
        </View>
        <View className="flex-row justify-end gap-4 px-4 py-2">
          <Pressable
            className="rounded-md border border-blue-800 bg-blue-600 p-2 text-zinc-100"
            onPress={handleSaveChangeJar}>
            <Text className="text-zinc-100">Lưu</Text>
          </Pressable>
        </View>
      </View>
    </InputModal>
  );
}

export default ChangeJarModal;
