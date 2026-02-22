import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { useContacts, ContactCategory } from '@/lib/contacts-context';
import { FrequencySelector } from '@/components/FrequencySelector';
import { MessageFrequency } from '@/lib/contacts-context';

export default function ContactDetailScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contacts, updateContact, deleteContact } = useContacts();
  const contact = useMemo(() => contacts.find((c) => c.id === id), [contacts, id]);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(contact?.notes || '');
  const [editingName, setEditingName] = useState(false);
  const [nameText, setNameText] = useState(contact?.fullName || '');

  const categoryColors: Record<ContactCategory, string> = {
    New: colors.chipNew,
    Contacted: colors.chipContacted,
    Qualified: colors.chipQualified,
    Unknown: colors.chipUnknown,
  };

  if (!contact) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Contact not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go Back</Text>
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

  const handleSaveName = async () => {
    const trimmed = nameText.trim();
    if (trimmed.length > 0) {
      await updateContact(contact.id, { fullName: trimmed });
    } else {
      setNameText(contact.fullName);
    }
    setEditingName(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleFrequencyChange = async (freq: MessageFrequency) => {
    await updateContact(contact.id, { frequency: freq });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8), backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={[styles.backBtn, { backgroundColor: colors.white }]}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Pressable onPress={handleDelete} hitSlop={12}>
          <Ionicons name="trash-outline" size={22} color={colors.error} />
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
          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={[styles.nameInput, { color: colors.text, borderBottomColor: colors.primary }]}
                value={nameText}
                onChangeText={setNameText}
                autoFocus
                selectTextOnFocus
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
              />
              <Pressable onPress={handleSaveName} hitSlop={8}>
                <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => {
                setNameText(contact.fullName);
                setEditingName(true);
              }}
              style={styles.nameRow}
            >
              <Text style={[styles.name, { color: colors.text }]}>{contact.fullName}</Text>
              <Ionicons name="create-outline" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
          <View style={[styles.categoryBadge, { backgroundColor: categoryColors[contact.category] }]}>
            <Text style={styles.categoryBadgeText}>{contact.category}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Message Frequency</Text>
          <FrequencySelector selected={contact.frequency} onSelect={handleFrequencyChange} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <View style={styles.notesHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
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
                color={colors.primary}
              />
            </Pressable>
          </View>
          {editingNotes ? (
            <TextInput
              style={[styles.notesInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
              value={notesText}
              onChangeText={setNotesText}
              placeholder="Add notes..."
              placeholderTextColor={colors.textTertiary}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          ) : (
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>
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
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  backLink: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  nameInput: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    borderBottomWidth: 2,
    paddingVertical: 6,
    textAlign: 'center',
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
    color: '#FFFFFF',
  },
  card: {
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
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notesInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    borderWidth: 1,
  },
  notesText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
});
