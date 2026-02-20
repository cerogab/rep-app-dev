import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise((r) => setTimeout(r, 600));

    const success = await login(email, password);
    if (!success) {
      Alert.alert('Sign In Failed', 'Please enter a valid email and password.');
    }
    setLoading(false);
  };

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + webTopInset + 40,
            paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
          <View style={styles.logoShadow} />
          <Text style={styles.tagline}>secure marketing{'\n'}intelligently.</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="admin@bram.com"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                testID="email-input"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter password"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureEntry}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                testID="password-input"
              />
              <Pressable
                onPress={() => setSecureEntry(!secureEntry)}
                hitSlop={8}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              (!canSubmit || loading) && styles.signInButtonDisabled,
              pressed && canSubmit && styles.signInButtonPressed,
            ]}
            onPress={handleSignIn}
            disabled={!canSubmit || loading}
            testID="sign-in-button"
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.faceIdSection}>
            <View style={styles.faceIdIcon}>
              <View style={styles.faceIdCorner} />
              <View style={[styles.faceIdCorner, styles.faceIdCornerTR]} />
              <View style={[styles.faceIdCorner, styles.faceIdCornerBL]} />
              <View style={[styles.faceIdCorner, styles.faceIdCornerBR]} />
            </View>
            <Text style={styles.faceIdLabel}>Face ID</Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  logoShadow: {
    width: 80,
    height: 12,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    marginTop: 12,
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 32,
  },
  formSection: {
    gap: 18,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
    flex: 1,
  },
  eyeButton: {
    padding: 4,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
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
    opacity: 0.9,
  },
  signInButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.white,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textTertiary,
  },
  faceIdSection: {
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  faceIdIcon: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  faceIdCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 14,
    height: 14,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: Colors.primary + '80',
    borderTopLeftRadius: 4,
  },
  faceIdCornerTR: {
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 2.5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 4,
  },
  faceIdCornerBL: {
    top: undefined,
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2.5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 4,
  },
  faceIdCornerBR: {
    top: undefined,
    left: undefined,
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 4,
  },
  faceIdLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.primary + '80',
  },
});
