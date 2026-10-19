import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FILTER_OPTIONS, type MatchesFilter } from '../utils/matchesFilter';

type Props = {
  value: MatchesFilter;
  onChange: (value: MatchesFilter) => void;
};

export function FilterBar({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {FILTER_OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Фильтр матчей: ${option.label}`}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && !selected && styles.chipPressed,
            ]}
          >
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  chipPressed: {
    backgroundColor: '#f9fafb',
  },
  chipSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
