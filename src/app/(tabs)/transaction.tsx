import ChangeJarModal from '@/src/components/Home/Modals/ChangeJarModal';
import { OptionMenu, OptionMenuAction } from '@/src/components/Home/Modals/MenuOptionsPress';
import TransactionCards from '@/src/components/transactions/transactionCard';
import { useAccountContext } from '@/src/Context/AccountContext';
import { useTransactionEvent } from '@/src/Context/TransactionEventContext';
import { appServices } from '@/src/services/app.service';
import { JarModel } from '@/src/types/Models/Jar';
import { TransactionModel } from '@/src/types/Models/Transaction';
import { TransactionView } from '@/src/types/Views/TransactionView';
import groupTransactionByDate from '@/src/utils/groupTransactionByDate';
import { mapJarIdToNameJar } from '@/src/utils/mapJarIdToNameJar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GestureResponderEvent, SectionList, Text, View } from 'react-native';
import { toast } from 'sonner-native';

function TransactionPage() {
  const { selectedAccountId: accountSelected } = useAccountContext();

  const [listTransactions, setListTransactions] = useState<TransactionModel[]>([]);
  const [listJar, setListJar] = useState<JarModel[]>([]);
  const { transactionChange } = useTransactionEvent();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null);
  const [showModalChangeJar, setShowModalChangeJar] = useState(false);
  const fetchData = useCallback(async (accountId: string) => {
    await appServices.services.transactionService
      .getAllTransactionsByAccountId(accountId)
      .then(setListTransactions);
    await appServices.services.jarService.getAllJars(accountId).then(setListJar);
  }, []);
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

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;

    console.log('delete transaction', selectedTransaction.id);

    // gọi delete transaction ở đây
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
  useEffect(() => {
    if (!transactionChange?.version || !transactionChange?.accountId) return;
    if (!accountSelected) return;

    const isSameAccount = transactionChange.accountId === accountSelected;

    if (!isSameAccount) return;

    fetchData(accountSelected);
  }, [transactionChange, accountSelected, fetchData]);
  const groupedTransactions = useMemo(
    () => groupTransactionByDate(listTransactions),
    [listTransactions]
  );
  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-gray-400">Danh sách chi tiêu gần đây</Text>
          </View>
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text className="mb-3 mt-4 text-lg font-bold text-white">{title}</Text>
        )}
        renderItem={({ item }) => {
          const addJarNameToTransaction = {
            ...item,
            jarName: mapJarIdToNameJar({
              jarId: item.jarId,
              jars: listJar.map((j) => ({ id: j.id, name: j.name })),
            }),
          };
          return (
            <TransactionCards
              key={item.id}
              item={addJarNameToTransaction}
              onDelete={() => {}}
              onLongPress={(e) => openMenu(e, addJarNameToTransaction)}
            />
          );
        }}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
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
        JarList={listJar}
        isOpen={showModalChangeJar}
        onClose={() => {
          setShowModalChangeJar(false);
          fetchData(accountSelected!);
        }}
      />
    </View>
  );
}

export default TransactionPage;
