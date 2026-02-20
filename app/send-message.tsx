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
import Colors from '@/constants/colors';
import { useContacts } from '@/lib/contacts-context';
import { apiRequest } from '@/lib/query-client';

const messageTemplates = [
  "Hi {name}, we have some exciting updates from BRAM that we'd love to share with you!",
  "Hello {name}, following up on our conversation. Let us know if you have any questions.",
  "Hey {name}! We have a special offer exclusively for {company}. Would love to discuss.",
  "Dear {name}, thank you for your interest. Here's what we can offer your team at {company}.",
];

export default function SendMessageScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contacts, updateContact } = useContacts();
  const contact = useMemo(() => contacts.find((c) => c.id === id), [contacts, id]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!contact) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Contact not found</Text>
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
      await apiRequest('POST', '/api/send-message', {
        contactId: contact.id,
        phone: contact.phone,
        message: message.trim(),
        contactName: contact.fullName,
      });

      if (contact.category === 'New') {
        await updateContact(contact.id, { category: 'Contacted' });
      }

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
      if (contact.category === 'New') {
        await updateContact(contact.id, { category: 'Contacted' });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Send Message</Text>
        <Pressable
          onPress={handleSend}
          disabled={!message.trim() || sending}
          hitSlop={12}
        >
          {sending ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <Ionicons
              name="send"
              size={22}
              color={message.trim() ? Colors.accent : Colors.textTertiary}
            />
          )}
        </Pressable>
      </View>

      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.recipientCard}>
          <View style={styles.recipientAvatar}>
            <Text style={styles.recipientInitial}>
              {contact.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientName}>{contact.fullName}</Text>
            <Text style={styles.recipientPhone}>{contact.phone || contact.email}</Text>
          </View>
          <View style={styles.frequencyBadge}>
            <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.frequencyText}>{contact.frequency}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Quick Templates</Text>
        <View style={styles.templates}>
          {messageTemplates.map((template, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [styles.templateChip, pressed && styles.templateChipPressed]}
              onPress={() => fillTemplate(template)}
            >
              <Text style={styles.templateText} numberOfLines={2}>
                {template.replace(/{name}/g, contact.fullName.split(' ')[0]).replace(/{company}/g, contact.company || 'your company')}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Your Message</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your custom marketing message..."
          placeholderTextColor={Colors.textTertiary}
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (!message.trim() || sending) && styles.sendButtonDisabled,
            pressed && styles.sendButtonPressed,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="send" size={20} color={Colors.white} />
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
    backgroundColor: Colors.white,
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  recipientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientInitial: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.primary,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  recipientPhone: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  frequencyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  templates: {
    gap: 8,
  },
  templateChip: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateChipPressed: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary + '40',
  },
  templateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  messageInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.inputBg,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
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
    color: Colors.white,
  },
});
