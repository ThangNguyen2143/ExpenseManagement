import { AmountWheelInput } from '@/src/components/transactions/AmountWheelInput';
import { ButtonGroup } from '@/src/components/UI/ButtonGroup';
import InputCustom from '@/src/components/UI/InputCustom';
import { SelectableButtonGroup } from '@/src/components/UI/SelectableButtonGroup';
import { useAccountContext } from '@/src/Context/AccountContext';
import { useTransactionEvent } from '@/src/Context/TransactionEventContext';
import { useQuickTransactionSuggestions } from '@/src/hooks/useQuickCreateTransaction';
import { appServices } from '@/src/services/app.service';
import { TypeTransactionModel } from '@/src/types/Models/Transaction';
import { TransactionTemplate } from '@/src/types/Models/TransactionTemplate';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
type QuickTransactionState = {
  type: TypeTransactionModel;
  title: string;
  amount: number;
  selectedJarId?: string;
  selectedTemplateId?: string;
};
enum listTypeActions {
  SET_TYPE = 'setType',
  SET_TITLE = 'setTitle',
  SET_AMOUNT = 'setAmount',
  SET_SELECTED_JAR_ID = 'setSelectedJarId',
  SET_SELECTED_TEMPLATE_ID = 'setSelectedTemplateId',
}
function CreateQuickTransactionReducer(
  state: QuickTransactionState,
  action: { type: listTypeActions; payload: any }
) {
  switch (action.type) {
    case listTypeActions.SET_TYPE:
      if (state.type === action.payload) return state;
      return { ...state, type: action.payload };
    case listTypeActions.SET_TITLE:
      if (state.title === action.payload) return state;
      return { ...state, title: action.payload };
    case listTypeActions.SET_AMOUNT:
      if (state.amount === action.payload) return state;
      return { ...state, amount: action.payload };
    case listTypeActions.SET_SELECTED_JAR_ID:
      if (state.selectedJarId === action.payload) return state;
      return { ...state, selectedJarId: action.payload };
    case listTypeActions.SET_SELECTED_TEMPLATE_ID:
      if (state.selectedTemplateId === action.payload) return state;
      return { ...state, selectedTemplateId: action.payload };
    default:
      return state;
  }
}
function QuickCreateTransactionScreen() {
  const isMobileNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const params = useLocalSearchParams<{ accountId?: string }>();
  const { selectedAccountId, refreshAccounts } = useAccountContext();
  const { notifyTransactionChanged } = useTransactionEvent();
  const [newTransaction, dispatchNewTransaction] = useReducer(CreateQuickTransactionReducer, {
    type: 'expense',
    title: '',
    amount: 0,
    selectedJarId: undefined,
    selectedTemplateId: undefined,
  });
  const accountId = useMemo(() => {
    return params.accountId ?? selectedAccountId;
  }, [params.accountId, selectedAccountId]);
  const [templateTransactionList, setTemplateTransactionList] = useState<TransactionTemplate[]>([]);
  useEffect(() => {
    async function loadTemplates(accountId: string) {
      try {
        const templates = await appServices.services.transactionService.getTransactionTemplates(
          accountId,
          {}
        );
        if (!templates) return;

        setTemplateTransactionList(templates);
      } catch (error) {
        console.error('Failed to load transaction templates', error);
      }
    }
    if (accountId) {
      loadTemplates(accountId);
    }
  }, [accountId]);
  const templateTransactionByType = useMemo(() => {
    return templateTransactionList.filter((t) => t.type === newTransaction.type);
  }, [templateTransactionList, newTransaction.type]);
  const { suggestedJars } = useQuickTransactionSuggestions(newTransaction.title, accountId!);
  const onAddTransaction = async () => {
    try {
      if (!accountId) return;
      const newcreatedTransaction =
        await appServices.services.transactionService.createQuickTransaction(accountId, {
          text:
            newTransaction.title + (newTransaction.amount > 0 ? `${newTransaction.amount}` : ''),
          type: newTransaction.type,
          jarId: newTransaction.selectedJarId ?? undefined,
          templateId: newTransaction.selectedTemplateId,
        });
      notifyTransactionChanged({
        type: 'created',
        accountId,
        transactionId: newcreatedTransaction.id,
      });

      await refreshAccounts();
      router.back();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };
  const onChangeType = useCallback((type: string) => {
    if (type !== 'expense' && type !== 'income') return;
    dispatchNewTransaction({ type: listTypeActions.SET_TYPE, payload: type });
  }, []);
  const onAmountWheelChange = useCallback((amount: number) => {
    dispatchNewTransaction({ type: listTypeActions.SET_AMOUNT, payload: amount });
  }, []);
  const onChangeJar = useCallback((jarId: string) => {
    dispatchNewTransaction({ type: listTypeActions.SET_SELECTED_JAR_ID, payload: jarId });
  }, []);
  const onChangeTitle = useCallback((title: string) => {
    dispatchNewTransaction({ type: listTypeActions.SET_TITLE, payload: title });
  }, []);
  const onChangeTemplate = useCallback(
    (templateId: string) => {
      if (templateId === '')
        return dispatchNewTransaction({
          type: listTypeActions.SET_SELECTED_TEMPLATE_ID,
          payload: undefined,
        });
      dispatchNewTransaction({
        type: listTypeActions.SET_SELECTED_TEMPLATE_ID,
        payload: templateId,
      });
      const selectedTemplate = templateTransactionList.find((t) => t.id === templateId);
      if (selectedTemplate) {
        dispatchNewTransaction({
          type: listTypeActions.SET_TITLE,
          payload: selectedTemplate.title,
        });
        if (
          newTransaction.amount === 0 &&
          selectedTemplate.lastAmount &&
          selectedTemplate.lastAmount > 0
        ) {
          dispatchNewTransaction({
            type: listTypeActions.SET_AMOUNT,
            payload: selectedTemplate.lastAmount,
          });
        }
      }
    },
    [templateTransactionList]
  );
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Thêm giao dịch',
          navigationBarHidden: true,
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
            value={newTransaction.type}
            onChange={onChangeType}
          />
        </View>
        <SelectableButtonGroup
          options={templateTransactionByType.map((transaction) => ({
            label: transaction.title,
            id: transaction.id,
          }))}
          value={newTransaction.selectedTemplateId}
          onChange={onChangeTemplate}
        />
        <InputCustom
          placeholder="Vd: Cafe sáng"
          onChangeText={(v) => {
            onChangeTitle(v);
            onChangeTemplate('');
          }}
          value={newTransaction.title}
        />
        {isMobileNative && (
          <AmountWheelInput
            showPreview={true}
            onChange={({ amount }) => onAmountWheelChange(amount)}
          />
        )}
        <Text className="mx-4 mb-2 mt-4 font-medium text-zinc-700 dark:text-zinc-300">
          Gợi ý lọ thu chi
        </Text>
        <SelectableButtonGroup
          options={suggestedJars.map((jar) => ({
            label: jar.name,
            id: jar.id,
          }))}
          value={newTransaction.selectedJarId}
          onChange={onChangeJar}
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
