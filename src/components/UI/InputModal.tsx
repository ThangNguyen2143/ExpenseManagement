import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren, RefObject } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = PropsWithChildren<{
  title?: string;
  isVisible: boolean;
  onClose: () => void;
  initialFocusRef?: RefObject<TextInput | null>;
}>;

export default function InputModal({
  isVisible,
  children,
  onClose,
  title,
  initialFocusRef,
}: Props) {
  const handleModalShow = () => {
    if (!initialFocusRef?.current) return;

    setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 80);
  };
  return (
    <View className="p-2">
      <Modal animationType="fade" transparent={true} visible={isVisible} onShow={handleModalShow}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title || 'Thêm giao dịch'}</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color="#fff" size={22} />
            </Pressable>
          </View>
          {children}
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContent: {
    minHeight: '30%',
    height: 'auto',
    width: '80%',
    backgroundColor: '#25292e',
    borderRadius: 18,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});
