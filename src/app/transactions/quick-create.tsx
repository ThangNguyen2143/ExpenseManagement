import { useQuickTransactionSuggestions } from '@/src/components/transactions/hooks/useQuickCreateTransaction';
import { ButtonGroup } from '@/src/components/UI/ButtonGroup';
import InputCustom from '@/src/components/UI/InputCustom';
import { SelectableButtonGroup } from '@/src/components/UI/SelectableButtonGroup';
import { useAccountContext, useSelectedAccount } from '@/src/Context/AccountContext';
import { useTransactionEvent } from '@/src/Context/TransactionEventContext';
import { appServices } from '@/src/services/app.service';
import { TypeTransactionModel } from '@/src/types/Models/Transaction';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

function QuickCreateTransactionScreen() {
  const params = useLocalSearchParams<{ accountId?: string }>();
  const { selectedAccountId } = useSelectedAccount();
  const { refreshAccounts } = useAccountContext();
  const { notifyTransactionChanged } = useTransactionEvent();
  const [text, onChangeText] = useState('');
  const [selectedJarId, setSelectedJarId] = useState<string | null>(null);
  const [typeTransactionSelected, setTypeTransactionSelected] =
    useState<TypeTransactionModel>('expense');
  const accountId = useMemo(() => {
    return params.accountId ?? selectedAccountId;
  }, [params.accountId, selectedAccountId]);
  const { suggestedJars } = useQuickTransactionSuggestions(text, accountId!);
  const onAddTransaction = async () => {
    try {
      if (!accountId) return;
      const newTransaction = await appServices.services.transactionService.createQuickTransaction(
        text,
        accountId,
        typeTransactionSelected,
        selectedJarId ?? undefined
      );
      notifyTransactionChanged({
        type: 'created',
        accountId,
        transactionId: newTransaction.id,
      });

      await refreshAccounts();
      onChangeText('');
      router.back();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Thêm giao dịch',
        }}
      />
      <View className="m-4 overflow-hidden rounded-lg ">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="font-bold text-zinc-900 dark:text-zinc-100">Thêm giao dịch</Text>
          <ButtonGroup
            options={[
              { label: 'Chi', value: 'expense' },
              { label: 'Thu', value: 'income' },
            ]}
            value={typeTransactionSelected}
            onChange={(value) => setTypeTransactionSelected(value as TypeTransactionModel)}
          />
        </View>
        <InputCustom placeholder="Vd: Cafe 25k" onChangeText={onChangeText} value={text} />
        <Text className="mx-4 mb-2 mt-4 font-medium text-zinc-700 dark:text-zinc-300">
          Gợi ý lọ thu chi
        </Text>
        <Text>
          {suggestedJars.length > 0 ? `Có ${suggestedJars.length} lọ gợi ý` : 'Không có lọ gợi ý'}
        </Text>
        <SelectableButtonGroup
          options={suggestedJars.map((jar) => ({
            label: jar.name,
            id: jar.id,
          }))}
          value={selectedJarId}
          onChange={(value: string) => {
            setSelectedJarId(value);
          }}
        />
        <View className="flex-row items-center justify-end space-x-4 px-4 py-3">
          <Pressable
            onPress={onAddTransaction}
            className="rounded-full bg-blue-600 px-6 py-4 active:bg-blue-700">
            <Text className="text-lg font-bold text-white">Lưu</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

export default QuickCreateTransactionScreen;
