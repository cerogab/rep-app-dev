import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors, ThemeColors } from '@/lib/theme-context';
import { Contact, ContactCategory, MessageFrequency } from '@/lib/contacts-context';

const FREQUENCIES: MessageFrequency[] = ['Weekly', 'Biweekly', 'Monthly'];

function getCategoryColors(colors: ThemeColors): Record<ContactCategory, string> {
  return {
    New: colors.chipNew,
    Contacted: colors.chipContacted,
    Qualified: colors.chipQualified,
    Unknown: colors.chipUnknown,
  };
}

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
  onFrequencyChange: (frequency: MessageFrequency) => void;
}

export function ContactCard({ contact, onPress, onFrequencyChange }: ContactCardProps) {
  const colors = useColors();
  const categoryColors = getCategoryColors(colors);

  const handleFrequencySelect = (freq: MessageFrequency) => {
    if (freq !== contact.frequency) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onFrequencyChange(freq);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { backgroundColor: colors.white }, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={[styles.avatar, { backgroundColor: categoryColors[contact.category] + '20' }]}>
            <Text style={[styles.avatarText, { color: categoryColors[contact.category] }]}>
              {contact.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{contact.fullName}</Text>
        </View>
        {contact.category !== 'Contacted' && (
          <View style={[styles.badge, { backgroundColor: categoryColors[contact.category] }]}>
            <Text style={styles.badgeText}>{contact.category}</Text>
          </View>
        )}
      </View>
      <View style={[styles.frequencyRow, { borderTopColor: colors.border }]}>
        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.frequencyChips}
          scrollEnabled={false}
        >
          {FREQUENCIES.map((freq) => {
            const isActive = contact.frequency === freq;
            return (
              <Pressable
                key={freq}
                style={[
                  styles.frequencyChip,
                  { backgroundColor: colors.inputBg },
                  isActive && { backgroundColor: colors.primary + '12', borderColor: colors.primary },
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleFrequencySelect(freq);
                }}
                hitSlop={4}
              >
                <Text
                  style={[
                    styles.frequencyChipText,
                    { color: colors.textTertiary },
                    isActive && { color: colors.primary },
                  ]}
                >
                  {freq}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  frequencyChips: {
    flexDirection: 'row',
    gap: 6,
  },
  frequencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  frequencyChipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
});
