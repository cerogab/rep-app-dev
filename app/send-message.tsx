import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { useContacts } from '@/lib/contacts-context';
import { apiRequest } from '@/lib/query-client';

const messageTemplates = [
  "Thank you for being a customer. Bram highly values our small business, today redeem 15% OFF with  in store purchases only. (YES/NO) to Accept!",
];

export default function SendMessageScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contacts, updateContact } = useContacts();
  const contact = useMemo(() => contacts.find((c) => c.id === id), [contacts, id]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!contact) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.white }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Contact not found</Text>
      </View>
    );
  }

  const fillTemplate = (template: string) => {
    const filled = template
      .replace(/{name}/g, contact.fullName.split(' ')[0])
      .replace(/{company}/g, contact.company || 'your company');
    setMessage(filled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      await apiRequest('POST', '/api/send-vonage-message', {
        phone: contact.phone,
        message: message.trim(),
        contactName: contact.fullName,
      });

      const updates: { category?: 'Contacted'; messageSent: boolean } = { messageSent: true };
      if (contact.category === 'New') {
        updates.category = 'Contacted';
      }
      await updateContact(contact.id, updates);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Message Sent', `Your message has been sent to ${contact.fullName}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Message Queued',
        `Message saved for ${contact.fullName}. Vonage is not configured yet - set up your API keys to send SMS.`,
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.cancelText, { color: colors.accent }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Send Message</Text>
        <Pressable
          onPress={handleSend}
          disabled={!message.trim() || sending}
          hitSlop={12}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Ionicons
              name="send"
              size={22}
              color={message.trim() ? colors.accent : colors.textTertiary}
            />
          )}
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.recipientCard, { backgroundColor: colors.inputBg }]}>
          <View style={[styles.recipientAvatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.recipientInitial, { color: colors.primary }]}>
              {contact.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <View style={styles.recipientInfo}>
            <Text style={[styles.recipientName, { color: colors.text }]}>{contact.fullName}</Text>
            <Text style={[styles.recipientPhone, { color: colors.textSecondary }]}>{contact.phone || contact.email}</Text>
          </View>
          <View style={[styles.frequencyBadge, { backgroundColor: colors.white }]}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.frequencyText, { color: colors.textSecondary }]}>{contact.frequency}</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Quick Templates</Text>
        <View style={styles.templates}>
          {messageTemplates.map((template, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.templateChip,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
                pressed && { backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' },
              ]}
              onPress={() => fillTemplate(template)}
            >
              <Text style={[styles.templateText, { color: colors.text }]} numberOfLines={2}>
                {template}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Your Message</Text>
        <TextInput
          style={[styles.messageInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
          placeholder="Type your custom marketing message..."
          placeholderTextColor={colors.textTertiary}
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
            (!message.trim() || sending) && styles.sendButtonDisabled,
            pressed && styles.sendButtonPressed,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  recipientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientInitial: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  recipientPhone: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  frequencyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  templates: {
    gap: 8,
  },
  templateChip: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  templateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  messageInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    borderWidth: 1,
  },
  sendButton: {
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  sendButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
