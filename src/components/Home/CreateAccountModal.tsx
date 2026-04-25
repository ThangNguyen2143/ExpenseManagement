import { appServices } from '@/src/services/app.service';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';
type CreateAccountModalProps = {
  isVisible: boolean;
  onClose: () => void;
};
const styles = StyleSheet.create({
  modalContent: {
    height: '25%',
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

function CreateAccountModal({ isVisible, onClose }: CreateAccountModalProps) {
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const onSubmit = async () => {
    const balance = parseFloat(initialBalance);
    if (isNaN(balance)) {
      toast.error('Số dư ban đầu không hợp lệ');
      return;
    }
    try {
      await appServices.services.accountService.createAccount({ balance, name: accountName });
      onClose();
      toast.success('Tài khoản mới đã được tạo');
    } catch (error) {
      console.log('Error creating account:', error);
      toast.error('Đã xảy ra lỗi khi tạo tài khoản');
    }
  };
  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tạo tài khoản mới</Text>
          </View>
          <View>
            <TextInput
              placeholder="Tên tài khoản"
              className="m-4 rounded-md border border-zinc-600 bg-zinc-700 p-2 text-white"
              value={accountName}
              onChangeText={setAccountName}
            />
            <TextInput
              placeholder="Số dư ban đầu"
              className="mx-4 mb-4 rounded-md border border-zinc-600 bg-zinc-700 p-2 text-white"
              value={initialBalance}
              onChangeText={setInitialBalance}
            />
          </View>
          <View>
            <Pressable onPress={onSubmit} className="mx-4 items-center rounded-md bg-white p-2">
              <Text>Tạo mới</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CreateAccountModal;
