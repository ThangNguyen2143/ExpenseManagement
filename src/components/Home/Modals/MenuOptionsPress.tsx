import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';

export type OptionMenuAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

type OptionMenuProps = {
  visible: boolean;
  x: number;
  y: number;
  actions: OptionMenuAction[];
  onClose: () => void;
  width?: number;
};

export function OptionMenu({ visible, x, y, actions, onClose, width = 170 }: OptionMenuProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const itemHeight = 48;
  const menuHeight = actions.length * itemHeight;

  const left = Math.min(Math.max(12, x), screenWidth - width - 12);

  const top = Math.min(Math.max(48, y - 12), screenHeight - menuHeight - 24);

  const handleActionPress = (action: OptionMenuAction) => {
    if (action.disabled) return;

    onClose();
    action.onPress();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/25" onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            position: 'absolute',
            top,
            left,
            width,
          }}
          className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-zinc-900">
          {actions.map((action, index) => (
            <View key={action.label}>
              <Pressable
                disabled={action.disabled}
                onPress={() => handleActionPress(action)}
                className="px-4 py-3 active:bg-zinc-100 dark:active:bg-zinc-800">
                <Text
                  className={[
                    'text-sm font-medium',
                    action.destructive ? 'text-rose-500' : 'text-zinc-800 dark:text-zinc-100',
                    action.disabled ? 'opacity-40' : '',
                  ].join(' ')}>
                  {action.label}
                </Text>
              </Pressable>

              {index < actions.length - 1 && <View className="h-px bg-zinc-100 dark:bg-zinc-800" />}
            </View>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
