import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import { AccountProvider } from '../Context/AccountContext';
import { TransactionEventProvider } from '../Context/TransactionEventContext';
import '../styles/global.css';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const bg = colorScheme === 'dark' ? '#09090b' : '#fff';
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AccountProvider>
        <TransactionEventProvider>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: bg,
              },
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </TransactionEventProvider>
      </AccountProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor={bg} />
      <Toaster />
    </GestureHandlerRootView>
  );
}
