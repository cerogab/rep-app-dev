import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';

interface MenuRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  showDivider?: boolean;
  color?: string;
}

function MenuRow({ icon, label, onPress, showDivider = true, color }: MenuRowProps) {
  return (
    <>
      <Pressable
        style={({ pressed }) => [menuStyles.row, pressed && menuStyles.rowPressed]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
      >
        <View style={[menuStyles.iconWrap, color ? { backgroundColor: color + '15' } : {}]}>
          <Ionicons name={icon as any} size={20} color={color || Colors.text} />
        </View>
        <Text style={[menuStyles.label, color ? { color } : {}]}>{label}</Text>
        {!color && <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />}
      </Pressable>
      {showDivider && <View style={menuStyles.divider} />}
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
  rowPressed: {
    backgroundColor: Colors.background,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBg,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 60,
  },
});

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { logout, userEmail } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const showAlert = (title: string) => {
    Alert.alert(title, 'This feature will be available in a future update.');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + webTopInset + 8,
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 20,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>G</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>GABRIEL</Text>
          <Text style={styles.profileEmail}>{userEmail || 'admin@bramllc.com'}</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        <MenuRow icon="person-outline" label="Account" onPress={() => showAlert('Account')} />
        <MenuRow icon="notifications-outline" label="Notifications" onPress={() => showAlert('Notifications')} />
        <MenuRow icon="color-palette-outline" label="Appearance" onPress={() => showAlert('Appearance')} showDivider={false} />
      </View>

      <View style={styles.menuCard}>
        <MenuRow icon="shield-outline" label="Privacy" onPress={() => showAlert('Privacy')} />
        <MenuRow icon="help-circle-outline" label="Help & Support" onPress={() => showAlert('Help & Support')} showDivider={false} />
      </View>

      <View style={styles.menuCard}>
        <MenuRow
          icon="log-out-outline"
          label="Log Out"
          onPress={handleLogout}
          showDivider={false}
          color={Colors.error}
        />
      </View>

      <Text style={styles.version}>BRAM v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.primary,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  profileCard: {
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  profileEmail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: Colors.white,
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
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
});
