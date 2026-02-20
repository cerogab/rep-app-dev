import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useContacts, ContactCategory, MessageFrequency } from '@/lib/contacts-context';
import { CategoryChips } from '@/components/CategoryChips';
import { FrequencySelector } from '@/components/FrequencySelector';

export default function AddContactScreen() {
  const insets = useSafeAreaInsets();
  const { addContact } = useContacts();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<ContactCategory>('New');
  const [frequency, setFrequency] = useState<MessageFrequency>('Monthly');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = fullName.trim().length > 0 && email.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addContact({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      category,
      frequency,
      notes: notes.trim(),
    });
    setSaving(false);
    router.back();
  };

  const handleCancel = () => {
    if (fullName || email || phone) {
      Alert.alert('Discard Changes?', 'You have unsaved changes.', [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Pressable onPress={handleCancel} hitSlop={12}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Client</Text>
        <Pressable onPress={handleSave} disabled={!canSave || saving} hitSlop={12}>
          <Text style={[styles.saveText, (!canSave || saving) && styles.saveDisabled]}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <ScrollView
        style={styles.form}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor={Colors.textTertiary}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoFocus
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor={Colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={Colors.textTertiary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Company</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter company name"
            placeholderTextColor={Colors.textTertiary}
            value={company}
            onChangeText={setCompany}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Category</Text>
          <CategoryChips selected={category} onSelect={setCategory} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Message Frequency</Text>
          <FrequencySelector selected={frequency} onSelect={setFrequency} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add notes..."
            placeholderTextColor={Colors.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  cancelText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    color: Colors.accent,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.text,
  },
  saveText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.accent,
  },
  saveDisabled: {
    opacity: 0.4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesInput: {
    height: 120,
    paddingTop: 14,
  },
});
