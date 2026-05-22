import { useTransactionEvent } from '@/src/Context/TransactionEventContext';
import { appServices } from '@/src/services/app.service';
import { JarDashboardItem } from '@/src/services/Jar/types';
import { TransactionView } from '@/src/types/Views/TransactionView';
import { useMemo, useState } from 'react';
import { GestureResponderEvent, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import TransactionCards from '../transactions/transactionCard';
import ChangeJarModal from './Modals/ChangeJarModal';
import { OptionMenu, OptionMenuAction } from './Modals/MenuOptionsPress';
function RecentTransaction({
  transactions,
  JarList,
  onRefresh,
}: {
  transactions: TransactionView[];
  JarList: JarDashboardItem[];
  onRefresh?: () => void;
}) {
  const { notifyTransactionChanged } = useTransactionEvent();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null);
  const [showModalChangeJar, setShowModalChangeJar] = useState(false);
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const openMenu = (event: GestureResponderEvent, item: TransactionView) => {
    const { pageX, pageY } = event.nativeEvent;

    setSelectedTransaction(item);

    setMenu({
      visible: true,
      x: pageX,
      y: pageY,
    });
  };

  const closeMenu = () => {
    setMenu((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const handleEditTransaction = () => {
    if (!selectedTransaction) return;

    console.log('edit transaction', selectedTransaction.id);
    toast.info('Tính năng đang được phát triển');
    // mở modal edit hoặc navigate sang màn edit
  };

  const handleChangeJar = async () => {
    if (!selectedTransaction) return;
    setShowModalChangeJar(true);
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;
    try {
      await appServices.services.transactionService.deleteTransaction(selectedTransaction.id);
      toast.success('Xóa giao dịch thành công');
      onRefresh && onRefresh();
      notifyTransactionChanged({
        type: 'deleted',
        accountId: selectedTransaction.accountId,
        transactionId: selectedTransaction.id,
      });
    } catch {
      toast.error('Xóa giao dịch thất bại');
      return;
    }
  };

  const menuActions: OptionMenuAction[] = useMemo(
    () => [
      {
        label: 'Sửa giao dịch',
        onPress: handleEditTransaction,
      },
      {
        label: 'Đổi hũ',
        onPress: handleChangeJar,
      },
      {
        label: 'Xóa',
        destructive: true,
        onPress: handleDeleteTransaction,
      },
    ],
    [selectedTransaction]
  );
  return (
    <View className="mb-6 p-4">
      <Text className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
        📜 Giao dịch gần đây
      </Text>
      {transactions.map((item) => (
        <TransactionCards
          key={item.id}
          item={item}
          onDelete={() => {}}
          onLongPress={(e) => openMenu(e, item)}
        />
      ))}
      <OptionMenu
        visible={menu.visible}
        x={menu.x}
        y={menu.y}
        actions={menuActions}
        onClose={closeMenu}
      />
      <ChangeJarModal
        transactionId={selectedTransaction?.id || ''}
        JarIdCurrent={selectedTransaction?.jarId || ''}
        JarList={JarList}
        isOpen={showModalChangeJar}
        onClose={() => {
          setShowModalChangeJar(false);
          onRefresh && onRefresh();
        }}
      />
    </View>
  );
}

export default RecentTransaction;
