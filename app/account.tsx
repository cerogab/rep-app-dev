import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { userEmail, userName, userPhoto } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const displayName = userName
    ? userName
    : userEmail
    ? userEmail.split('@')[0].toUpperCase()
    : 'USER';

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={[styles.backBtn, { backgroundColor: colors.white }]}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>Account</Text>

        <View style={[styles.avatarSection]}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
          <Text style={[styles.displayName, { color: colors.text }]}>{displayName}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <View style={[styles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="mail-outline" size={20} color={colors.text} />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.rowValue, { color: colors.text }]}>{userEmail || 'Not set'}</Text>
            </View>
          </View>
          <View style={[styles.row, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="person-outline" size={20} color={colors.text} />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Name</Text>
              <Text style={[styles.rowValue, { color: colors.text }]}>{userName || displayName}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="calendar-outline" size={20} color={colors.text} />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Member Since</Text>
              <Text style={[styles.rowValue, { color: colors.text }]}>2026</Text>
            </View>
          </View>
        </View>
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
  avatarSection: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  displayName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  rowValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
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
