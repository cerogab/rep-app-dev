import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { MessageFrequency } from '@/lib/contacts-context';

const frequencies: MessageFrequency[] = ['Weekly', 'Biweekly', 'Monthly'];

interface FrequencySelectorProps {
  selected: MessageFrequency;
  onSelect: (freq: MessageFrequency) => void;
}

export function FrequencySelector({ selected, onSelect }: FrequencySelectorProps) {
  return (
    <View style={styles.container}>
      {frequencies.map((freq) => {
        const isSelected = selected === freq;
        return (
          <Pressable
            key={freq}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(freq);
            }}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
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
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 3,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  optionTextSelected: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
});
