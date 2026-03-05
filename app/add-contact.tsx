import React, { useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { useContacts, ContactCategory, MessageFrequency } from '@/lib/contacts-context';
import { CategoryChips } from '@/components/CategoryChips';
import { FrequencySelector } from '@/components/FrequencySelector';
import { apiRequest } from '@/lib/query-client';

export default function AddContactScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { addContact } = useContacts();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ContactCategory>('New');
  const [frequency, setFrequency] = useState<MessageFrequency>('Monthly');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0.3)).current;

  const canSave = fullName.trim().length > 0 && phone.trim().length > 0;

  const animateSuccess = () => {
    setShowSuccess(true);
    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          router.back();
        });
      }, 1200);
    });
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);

    try {
      await apiRequest('POST', '/api/save-contact', {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        category,
        frequency,
        notes: notes.trim() || null,
      });

      await addContact({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        category,
        frequency,
        notes: notes.trim(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      animateSuccess();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Save Failed',
        'Could not save contact to the database. Please try again.',
        [{ text: 'OK' }],
      );
      setSaving(false);
    }
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
      style={[styles.container, { backgroundColor: colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Pressable onPress={handleCancel} hitSlop={12}>
          <Text style={[styles.cancelText, { color: colors.accent }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Client</Text>
        <Pressable onPress={handleSave} disabled={!canSave || saving} hitSlop={12}>
          <Text style={[styles.saveText, { color: colors.accent }, (!canSave || saving) && styles.saveDisabled]}>Save</Text>
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <ScrollView
        style={styles.form}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            placeholder="Enter full name"
            placeholderTextColor={colors.textTertiary}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoFocus
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Phone</Text>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            placeholder="Enter phone number"
            placeholderTextColor={colors.textTertiary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Email (Optional)</Text>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            placeholder="Enter email address"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Category</Text>
          <CategoryChips selected={category} onSelect={setCategory} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Message Frequency</Text>
          <FrequencySelector selected={frequency} onSelect={setFrequency} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            placeholder="Add notes..."
            placeholderTextColor={colors.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {showSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: successOpacity }]}>
          <Animated.View style={[styles.successContent, { transform: [{ scale: checkScale }] }]}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={64} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Saved Contact</Text>
          </Animated.View>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
  },
  saveText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
  },
  saveDisabled: {
    opacity: 0.4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
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
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  notesInput: {
    height: 120,
    paddingTop: 14,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  successContent: {
    alignItems: 'center',
    gap: 16,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
});
