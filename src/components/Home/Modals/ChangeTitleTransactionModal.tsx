import { TransactionModel } from '@/src/types/Models/Transaction';
import { Text, View } from 'react-native';
import InputCustom from '../../UI/InputCustom';
import InputModal from '../../UI/InputModal';

type ChangeTitleTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transactionData?: TransactionModel;
};
function ChangeTitleTransactionModal({
  isOpen,
  onClose,
  transactionData,
}: ChangeTitleTransactionModalProps) {
  return (
    <InputModal isVisible={isOpen} onClose={onClose} title="Đổi tên giao dịch">
      <View className="flex-col p-4">
        <Text className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Tên giao dịch</Text>
        <InputCustom placeholder="Nhập tên giao dịch mới" value={transactionData?.title} />
        <Text className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Số tiền giao dịch
        </Text>
        <InputCustom
          placeholder="Nhập số tiền giao dịch"
          type="numeric"
          value={transactionData?.amount.toString()}
        />
      </View>
    </InputModal>
  );
}

export default ChangeTitleTransactionModal;
