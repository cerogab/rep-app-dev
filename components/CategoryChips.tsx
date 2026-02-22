import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { ContactCategory } from '@/lib/contacts-context';

const categories: ContactCategory[] = ['New', 'Contacted', 'Qualified', 'Unknown'];

interface CategoryChipsProps {
  selected: ContactCategory;
  onSelect: (category: ContactCategory) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const colors = useColors();

  const categoryColors: Record<ContactCategory, string> = {
    New: colors.chipNew,
    Contacted: colors.chipContacted,
    Qualified: colors.chipQualified,
    Unknown: colors.chipUnknown,
  };

  return (
    <View style={styles.container}>
      {categories.map((cat) => {
        const isSelected = selected === cat;
        const color = categoryColors[cat];
        return (
          <Pressable
            key={cat}
            style={[
              styles.chip,
              { borderColor: color },
              isSelected && { backgroundColor: color },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(cat);
            }}
          >
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : color },
              ]}
            >
              {cat}
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
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});
