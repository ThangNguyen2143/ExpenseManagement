import { useSelectedAccount } from '@/src/Context/AccountContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';
export default function FAB() {
  const { selectedAccountId, isLoading, isReady } = useSelectedAccount();
  const onPressAdd = () => {
    if (!selectedAccountId) {
      return;
    }

    router.push({
      pathname: '/transactions/quick-create',
      params: {
        accountId: selectedAccountId,
      },
    });
  };
  if (isLoading || !isReady) return null;
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
        onPress={onPressAdd}>
        <Text className="text-lg font-bold text-white">
          <Ionicons name="add" size={28} />
        </Text>
      </Pressable>
    </>
  );
}
