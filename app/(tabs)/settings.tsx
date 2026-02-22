import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors, ThemeColors } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

interface MenuRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  showDivider?: boolean;
  color?: string;
  colors: ThemeColors;
}

function MenuRow({ icon, label, onPress, showDivider = true, color, colors }: MenuRowProps) {
  return (
    <>
      <Pressable
        style={({ pressed }) => [menuStyles.row, pressed && { backgroundColor: colors.background }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
      >
        <View style={[menuStyles.iconWrap, { backgroundColor: color ? color + '15' : colors.inputBg }]}>
          <Ionicons name={icon as any} size={20} color={color || colors.text} />
        </View>
        <Text style={[menuStyles.label, { color: color || colors.text }]}>{label}</Text>
        {!color && <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />}
      </Pressable>
      {showDivider && <View style={[menuStyles.divider, { backgroundColor: colors.border }]} />}
    </>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },
});

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { logout, userEmail } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const showAlert = (title: string) => {
    Alert.alert(title, 'This feature will be available in a future update.');
  };

  const doLogout = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
    logout();
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) {
        doLogout();
      }
      return;
    }
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: doLogout,
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + webTopInset + 8,
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 20,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Settings</Text>

      <View style={[styles.profileCard, { backgroundColor: colors.white }]}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.profileInitial}>G</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>GABRIEL</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{userEmail || 'admin@bramllc.com'}</Text>
        </View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.white }]}>
        <MenuRow icon="person-outline" label="Account" onPress={() => showAlert('Account')} colors={colors} />
        <MenuRow icon="notifications-outline" label="Notifications" onPress={() => showAlert('Notifications')} colors={colors} />
        <MenuRow icon="color-palette-outline" label="Appearance" onPress={() => router.push('/appearance')} showDivider={false} colors={colors} />
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.white }]}>
        <MenuRow icon="shield-outline" label="Privacy" onPress={() => showAlert('Privacy')} colors={colors} />
        <MenuRow icon="help-circle-outline" label="Help & Support" onPress={() => showAlert('Help & Support')} showDivider={false} colors={colors} />
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.white }]}>
        <MenuRow
          icon="log-out-outline"
          label="Log Out"
          onPress={handleLogout}
          showDivider={false}
          color={colors.error}
          colors={colors}
        />
      </View>

      <Text style={[styles.version, { color: colors.textTertiary }]}>BRAM v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  profileEmail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginTop: 2,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});
