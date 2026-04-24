import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const routes = state.routes;

  const leftRoutes = routes.slice(0, 2);
  const rightRoutes = routes.slice(2, 4);

  const renderTab = (route: any, indexInState: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === indexInState;

    const color = isFocused ? '#ffd33d' : '#9ca3af';

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        className="flex-1 items-center justify-center py-3">
        {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
        <Text style={{ color }} className="mt-1 text-xs">
          {typeof options.title === 'string' ? options.title : route.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{ backgroundColor: '#25292e' }}
      className="flex-row items-center border-t border-zinc-800">
      <View className="flex-1 flex-row">{leftRoutes.map((route, i) => renderTab(route, i))}</View>

      {/* khoảng trống cho FAB */}
      <View style={{ width: 84 }} />

      <View className="flex-1 flex-row">
        {rightRoutes.map((route, i) => renderTab(route, i + 2))}
      </View>
    </View>
  );
}
