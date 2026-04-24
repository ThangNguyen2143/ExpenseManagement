import CustomTabBar from '@/src/components/layouts/CustomTabBar';
import FAB from '@/src/components/layouts/FAB';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
          tabBar={(props) => <CustomTabBar {...props} />}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} size={24} />,
            }}
          />
          <Tabs.Screen
            name="transaction"
            options={{
              title: 'Giao dịch',
              tabBarIcon: ({ color }) => (
                <FontAwesome6 name="arrow-right-arrow-left" color={color} size={24} />
              ),
            }}
          />
          <Tabs.Screen
            name="analytics"
            options={{
              title: 'Phân tích',
              tabBarIcon: ({ color }) => <Ionicons name="analytics" color={color} size={24} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Cài đặt',
              tabBarIcon: ({ color }) => <Ionicons name="settings" color={color} size={24} />,
            }}
          />
        </Tabs>
        <FAB />
      </View>
    </GestureHandlerRootView>
  );
}
