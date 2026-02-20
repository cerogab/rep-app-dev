import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Contact, ContactCategory, MessageFrequency } from '@/lib/contacts-context';

const categoryColors: Record<ContactCategory, string> = {
  New: Colors.chipNew,
  Contacted: Colors.chipContacted,
  Qualified: Colors.chipQualified,
  Unknown: Colors.chipUnknown,
};

const FREQUENCIES: MessageFrequency[] = ['Weekly', 'Biweekly', 'Monthly'];

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
  onFrequencyChange: (frequency: MessageFrequency) => void;
}

export function ContactCard({ contact, onPress, onFrequencyChange }: ContactCardProps) {
  const handleFrequencySelect = (freq: MessageFrequency) => {
    if (freq !== contact.frequency) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onFrequencyChange(freq);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={[styles.avatar, { backgroundColor: categoryColors[contact.category] + '20' }]}>
            <Text style={[styles.avatarText, { color: categoryColors[contact.category] }]}>
              {contact.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{contact.fullName}</Text>
            <Text style={styles.company} numberOfLines={1}>{contact.company || contact.email}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: categoryColors[contact.category] }]}>
          <Text style={styles.badgeText}>{contact.category}</Text>
        </View>
      </View>
      <View style={styles.frequencyRow}>
        <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
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
                  isActive && styles.frequencyChipActive,
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
                    isActive && styles.frequencyChipTextActive,
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
    backgroundColor: Colors.white,
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
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  company: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.white,
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  frequencyChips: {
    flexDirection: 'row',
    gap: 6,
  },
  frequencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  frequencyChipActive: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary,
  },
  frequencyChipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textTertiary,
  },
  frequencyChipTextActive: {
    color: Colors.primary,
  },
});
