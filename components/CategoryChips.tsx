import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { ContactCategory } from '@/lib/contacts-context';

const categories: ContactCategory[] = ['New', 'Contacted', 'Qualified', 'Unknown'];

const categoryColors: Record<ContactCategory, string> = {
  New: Colors.chipNew,
  Contacted: Colors.chipContacted,
  Qualified: Colors.chipQualified,
  Unknown: Colors.chipUnknown,
};

interface CategoryChipsProps {
  selected: ContactCategory;
  onSelect: (category: ContactCategory) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
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
                { color: isSelected ? Colors.white : color },
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
