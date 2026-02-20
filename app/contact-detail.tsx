import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useContacts, ContactCategory } from '@/lib/contacts-context';
import { CategoryChips } from '@/components/CategoryChips';
import { FrequencySelector } from '@/components/FrequencySelector';
import { MessageFrequency } from '@/lib/contacts-context';

const categoryColors: Record<ContactCategory, string> = {
  New: Colors.chipNew,
  Contacted: Colors.chipContacted,
  Qualified: Colors.chipQualified,
  Unknown: Colors.chipUnknown,
};

export default function ContactDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contacts, updateContact, deleteContact } = useContacts();
  const contact = useMemo(() => contacts.find((c) => c.id === id), [contacts, id]);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(contact?.notes || '');

  if (!contact) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Contact not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Contact', `Remove ${contact.fullName} from your contacts?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await deleteContact(contact.id);
          router.back();
        },
      },
    ]);
  };

  const handleSaveNotes = async () => {
    await updateContact(contact.id, { notes: notesText.trim() });
    setEditingNotes(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCategoryChange = async (cat: ContactCategory) => {
    await updateContact(contact.id, { category: cat });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleFrequencyChange = async (freq: MessageFrequency) => {
    await updateContact(contact.id, { frequency: freq });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSendMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/send-message', params: { id: contact.id } });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </Pressable>
        <Pressable onPress={handleDelete} hitSlop={12}>
          <Ionicons name="trash-outline" size={22} color={Colors.error} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: categoryColors[contact.category] + '20' }]}>
            <Text style={[styles.avatarText, { color: categoryColors[contact.category] }]}>
              {contact.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <Text style={styles.name}>{contact.fullName}</Text>
          {contact.company ? <Text style={styles.company}>{contact.company}</Text> : null}
          <View style={[styles.categoryBadge, { backgroundColor: categoryColors[contact.category] }]}>
            <Text style={styles.categoryBadgeText}>{contact.category}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => Linking.openURL(`tel:${contact.phone.replace(/[^+\d]/g, '')}`)}
          >
            <Ionicons name="call" size={22} color={Colors.primary} />
            <Text style={styles.actionLabel}>Call</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => Linking.openURL(`mailto:${contact.email}`)}
          >
            <Ionicons name="mail" size={22} color={Colors.primary} />
            <Text style={styles.actionLabel}>Email</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionCard, styles.actionCardPrimary, pressed && styles.actionCardPressed]}
            onPress={handleSendMessage}
          >
            <Ionicons name="chatbubble" size={22} color={Colors.white} />
            <Text style={[styles.actionLabel, { color: Colors.white }]}>Message</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{contact.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{contact.phone || 'No phone'}</Text>
          </View>
          {contact.company ? (
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{contact.company}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Category</Text>
          <CategoryChips selected={contact.category} onSelect={handleCategoryChange} />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Message Frequency</Text>
          <FrequencySelector selected={contact.frequency} onSelect={handleFrequencyChange} />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Pressable
              onPress={() => {
                if (editingNotes) {
                  handleSaveNotes();
                } else {
                  setNotesText(contact.notes);
                  setEditingNotes(true);
                }
              }}
              hitSlop={8}
            >
              <Ionicons
                name={editingNotes ? 'checkmark' : 'create-outline'}
                size={22}
                color={Colors.primary}
              />
            </Pressable>
          </View>
          {editingNotes ? (
            <TextInput
              style={styles.notesInput}
              value={notesText}
              onChangeText={setNotesText}
              placeholder="Add notes..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.notesText}>
              {contact.notes || 'No notes yet. Tap the edit icon to add notes.'}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  backLink: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.primary,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    gap: 14,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.text,
  },
  company: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 4,
  },
  categoryBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.white,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionCardPrimary: {
    backgroundColor: Colors.primary,
  },
  actionCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  actionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notesInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
