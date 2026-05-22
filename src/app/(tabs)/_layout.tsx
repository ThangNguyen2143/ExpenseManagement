import CustomTabBar from '@/src/components/layouts/CustomTabBar';
import FAB from '@/src/components/layouts/FAB';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';

  const bg = isDark ? '#09090b' : '#ffffff';
  const surface = isDark ? '#25292e' : '#ffffff';
  const text = isDark ? '#ffffff' : '#111827';
  const inactive = isDark ? '#9ca3af' : '#6b7280';
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ffd33d',
          tabBarInactiveTintColor: inactive,

          headerStyle: {
            backgroundColor: bg,
          },
          headerShadowVisible: false,
          headerTintColor: text,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: text,
          },

          sceneStyle: {
            backgroundColor: bg,
          },

          tabBarStyle: {
            backgroundColor: surface,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },

          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          },
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
  );
}
