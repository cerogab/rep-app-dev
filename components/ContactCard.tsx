import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Contact, ContactCategory } from '@/lib/contacts-context';

const categoryColors: Record<ContactCategory, string> = {
  New: Colors.chipNew,
  Contacted: Colors.chipContacted,
  Qualified: Colors.chipQualified,
  Unknown: Colors.chipUnknown,
};

interface ContactCardProps {
  contact: Contact;
  onPress: () => void;
  onCall: () => void;
  onEmail: () => void;
}

export function ContactCard({ contact, onPress, onCall, onEmail }: ContactCardProps) {
  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCall();
  };

  const handleEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEmail();
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
        <View style={styles.rightSection}>
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              onPress={handleCall}
              hitSlop={8}
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              onPress={handleEmail}
              hitSlop={8}
            >
              <Ionicons name="mail-outline" size={18} color={Colors.primary} />
            </Pressable>
          </View>
          <View style={[styles.badge, { backgroundColor: categoryColors[contact.category] }]}>
            <Text style={styles.badgeText}>{contact.category}</Text>
          </View>
        </View>
      </View>
      <View style={styles.frequencyRow}>
        <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.frequencyText}>{contact.frequency}</Text>
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
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: Colors.primary + '25',
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
    gap: 4,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  frequencyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
