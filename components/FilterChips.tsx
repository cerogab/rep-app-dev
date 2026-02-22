import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';

type FilterOption = 'All' | 'New' | 'Qualified';

interface FilterChipsProps {
  selected: FilterOption;
  onSelect: (filter: FilterOption) => void;
}

const filters: FilterOption[] = ['All', 'New', 'Qualified'];

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  const colors = useColors();

  const handleSelect = (filter: FilterOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(filter);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const isSelected = selected === filter;
        return (
          <Pressable
            key={filter}
            style={[
              styles.chip,
              { backgroundColor: colors.white, borderColor: colors.border },
              isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => handleSelect(filter)}
          >
            <Text style={[
              styles.chipText,
              { color: colors.text },
              isSelected && { color: colors.white },
            ]}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
});
