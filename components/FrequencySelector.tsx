import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { MessageFrequency } from '@/lib/contacts-context';

const frequencies: MessageFrequency[] = ['Weekly', 'Biweekly', 'Monthly'];

interface FrequencySelectorProps {
  selected: MessageFrequency;
  onSelect: (freq: MessageFrequency) => void;
}

export function FrequencySelector({ selected, onSelect }: FrequencySelectorProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.inputBg }]}>
      {frequencies.map((freq) => {
        const isSelected = selected === freq;
        return (
          <Pressable
            key={freq}
            style={[
              styles.option,
              isSelected && { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(freq);
            }}
          >
            <Text style={[
              styles.optionText,
              { color: colors.textSecondary },
              isSelected && { color: colors.white, fontFamily: 'Inter_600SemiBold' },
            ]}>
              {freq}
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
    borderRadius: 12,
    padding: 3,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  optionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
});
