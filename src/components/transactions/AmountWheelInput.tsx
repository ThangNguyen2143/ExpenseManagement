import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Unit = 'k' | 'm';

type AmountWheelValue = {
  digits: [number, number, number];
  unit: Unit;
  rawText: string;
  amount: number;
};

type AmountWheelInputProps = {
  initialDigits?: [number, number, number];
  initialUnit?: Unit;
  onChange?: (value: AmountWheelValue) => void;
  showPreview?: boolean;
};

type WheelColumnProps<T extends string | number> = {
  data: T[];
  value: T;
  width?: number;
  itemHeight?: number;
  visibleItems?: number;
  onChange: (value: T) => void;
  renderLabel?: (value: T) => string;
};

function WheelColumn<T extends string | number>({
  data,
  value,
  width = 70,
  itemHeight = 64,
  visibleItems = 5,
  onChange,
  renderLabel,
}: WheelColumnProps<T>) {
  const listRef = useRef<FlatList<T>>(null);

  const selectedIndex = Math.max(
    0,
    data.findIndex((item) => item === value)
  );

  const containerHeight = itemHeight * visibleItems;
  const verticalPadding = (containerHeight - itemHeight) / 2;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [selectedIndex]);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const nextIndex = Math.round(offsetY / itemHeight);
    const safeIndex = Math.min(Math.max(nextIndex, 0), data.length - 1);

    onChange(data[safeIndex]);
  };

  return (
    <View style={[styles.column, { width, height: containerHeight }]}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item, index) => `${String(item)}-${index}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        bounces={false}
        onMomentumScrollEnd={handleMomentumEnd}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentContainerStyle={{
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
        }}
        renderItem={({ item }) => {
          const active = item === value;

          return (
            <View style={[styles.item, { height: itemHeight }]}>
              <Text style={[styles.itemText, active && styles.itemTextActive]}>
                {renderLabel ? renderLabel(item) : String(item)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

export function AmountWheelInput({
  initialDigits = [0, 0, 0],
  initialUnit = 'k',
  onChange,
  showPreview = true,
}: AmountWheelInputProps) {
  const onChangeRef = useRef(onChange);
  const numbers = useMemo(() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], []);
  const units = useMemo<Unit[]>(() => ['k', 'm'], []);

  const [digit1, setDigit1] = useState(initialDigits[0]);
  const [digit2, setDigit2] = useState(initialDigits[1]);
  const [digit3, setDigit3] = useState(initialDigits[2]);
  const [unit, setUnit] = useState<Unit>(initialUnit);

  const value = useMemo<AmountWheelValue>(() => {
    const baseNumber = Number(`${digit1}${digit2}${digit3}`);
    const multiplier = unit === 'k' ? 1_000 : 1_000_000;
    const amount = baseNumber * multiplier;

    return {
      digits: [digit1, digit2, digit3],
      unit,
      rawText: `${baseNumber}${unit}`,
      amount,
    };
  }, [digit1, digit2, digit3, unit]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(value);
  }, [value]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.wheelBox}>
        <WheelColumn data={numbers} value={digit1} onChange={setDigit1} />
        <WheelColumn data={numbers} value={digit2} onChange={setDigit2} />
        <WheelColumn data={numbers} value={digit3} onChange={setDigit3} />

        <WheelColumn
          data={units}
          value={unit}
          width={76}
          onChange={setUnit}
          renderLabel={(value) => value}
        />

        <View pointerEvents="none" style={styles.centerHighlight} />
      </View>

      {showPreview && (
        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>Số tiền</Text>
          <Text style={styles.previewValue}>{value.amount.toLocaleString('vi-VN')}đ</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },

  wheelBox: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F7F7F7',
    borderRadius: 28,
    overflow: 'hidden',
  },

  column: {
    overflow: 'hidden',
  },

  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 42,
    fontWeight: '300',
    color: '#C9C9C9',
  },

  itemTextActive: {
    color: '#111111',
    fontSize: 48,
    fontWeight: '400',
  },

  centerHighlight: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: '50%',
    height: 64,
    marginTop: -32,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },

  previewBox: {
    marginTop: 16,
    alignItems: 'center',
  },

  previewLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },

  previewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
});
