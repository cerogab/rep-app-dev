import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const success = await login(email, password);
    if (!success) {
      Alert.alert('Sign In Failed', 'Please check your credentials and try again.');
    }
    setLoading(false);
  };

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.content, { paddingTop: insets.top + webTopInset + 60 }]}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/bram-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={[styles.logoShadow, { backgroundColor: colors.primary }]} />
          </View>

          <Text style={[styles.tagline, { color: colors.text }]}>
            secure marketing{'\n'}intelligently.
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.white }]}
              placeholder="admin@bram.com"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              testID="login-email"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Password</Text>
            <View style={[styles.passwordContainer, { borderColor: colors.border, backgroundColor: colors.white }]}>
              <TextInput
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder="Enter password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                testID="login-password"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textTertiary}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              { backgroundColor: colors.primary, shadowColor: colors.primary },
              (!canSubmit || loading) && styles.signInButtonDisabled,
              pressed && canSubmit && styles.signInButtonPressed,
            ]}
            onPress={handleSignIn}
            disabled={!canSubmit || loading}
            testID="login-submit"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textTertiary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.faceIdSection}>
            <View style={styles.faceIdIcon}>
              <View style={[styles.faceIdCornerTL, { borderColor: colors.primary }]} />
              <View style={[styles.faceIdCornerTR, { borderColor: colors.primary }]} />
              <View style={[styles.faceIdCornerBL, { borderColor: colors.primary }]} />
              <View style={[styles.faceIdCornerBR, { borderColor: colors.primary }]} />
              <Ionicons name="scan-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.faceIdText, { color: colors.primary }]}>Face ID</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
  logoShadow: {
    width: 80,
    height: 12,
    borderRadius: 40,
    opacity: 0.15,
    marginTop: 12,
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 34,
  },
  formSection: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  signInButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonDisabled: {
    opacity: 0.5,
  },
  signInButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  signInButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  faceIdSection: {
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  faceIdIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceIdCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  faceIdCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  faceIdCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  faceIdCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  faceIdText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
});
