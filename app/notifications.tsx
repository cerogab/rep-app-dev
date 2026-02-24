import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '@/lib/theme-context';

const NOTIFICATIONS_KEY = '@bram_notifications';

interface NotificationPrefs {
  allowNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  allowNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_KEY).then((stored) => {
      if (stored) {
        try {
          setPrefs(JSON.parse(stored));
        } catch {}
      }
    });
  }, []);

  const toggle = (key: keyof NotificationPrefs) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(prefs));
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={[styles.backBtn, { backgroundColor: colors.white }]}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>Notifications</Text>

        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <View style={[styles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Allow Notifications</Text>
            <Switch
              value={prefs.allowNotifications}
              onValueChange={() => toggle('allowNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
          <View style={[styles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Email Notifications</Text>
            <Switch
              value={prefs.emailNotifications}
              onValueChange={() => toggle('emailNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>SMS Notifications</Text>
            <Switch
              value={prefs.smsNotifications}
              onValueChange={() => toggle('smsNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.saveText, { color: colors.primary }]}>Save Changes</Text>
        </Pressable>
      </View>

      <Text style={[styles.version, { color: colors.textTertiary }]}>BRAM v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: 20,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  rowLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  saveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
});
