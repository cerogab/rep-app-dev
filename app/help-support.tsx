import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/theme-context';

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={[styles.backBtn, { backgroundColor: colors.white }]}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.primary }]}>Help & Support</Text>

        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Designated Copyright Agent</Text>

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>Gustavo</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>Attn: Copyright Agent</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <View>
              <Text style={[styles.infoText, { color: colors.text }]}>12676 SW 145TH ST</Text>
              <Text style={[styles.infoText, { color: colors.text }]}>Miami, FL 33186-5986</Text>
              <Text style={[styles.infoText, { color: colors.text }]}>United States</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable
            style={styles.infoRow}
            onPress={() => Linking.openURL('mailto:bram0001@bramllc.app')}
          >
            <Ionicons name="mail-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoText, styles.linkText, { color: colors.primary }]}>bram0001@bramllc.app</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    gap: 16,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  linkText: {
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
