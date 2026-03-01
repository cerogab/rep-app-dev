import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/lib/theme-context';
import { useContacts } from '@/lib/contacts-context';

export default function QRScannerScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLock = useRef(false);
  const { contacts, updateContact } = useContacts();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'bram_contact' && parsed.id) {
        const contact = contacts.find((c) => c.id === parsed.id);
        if (contact) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          updateContact(contact.id, { category: 'Outreached' });
          Alert.alert(
            'Contact Outreached',
            `${contact.fullName} has been marked as OUTREACHED.`,
            [{ text: 'Done', onPress: () => router.replace('/(tabs)') }],
          );
          return;
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert('Contact Not Found', 'This contact is not in your list.', [
            {
              text: 'Scan Again',
              onPress: () => { setScanned(false); scanLock.current = false; },
            },
            { text: 'Done', onPress: () => router.back() },
          ]);
          return;
        }
      }
    } catch {}

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('QR Code Scanned', data, [
      {
        text: 'Scan Again',
        onPress: () => { setScanned(false); scanLock.current = false; },
      },
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  const renderPermissionState = () => {
    if (!permission) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.permText, { color: colors.textSecondary }]}>Loading camera...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      const denied = permission.status === 'denied' && !permission.canAskAgain;
      return (
        <View style={styles.centered}>
          <Ionicons name="camera-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.permTitle, { color: colors.text }]}>Camera Access Needed</Text>
          <Text style={[styles.permText, { color: colors.textSecondary }]}>
            {denied
              ? 'Camera permission was denied. Please enable it in your device settings.'
              : 'Allow camera access to scan QR codes.'}
          </Text>
          {denied && Platform.OS !== 'web' ? (
            <Pressable
              style={[styles.permButton, { backgroundColor: colors.primary }]}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.permButtonText}>Open Settings</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.permButton, { backgroundColor: colors.primary }]}
              onPress={requestPermission}
            >
              <Text style={styles.permButtonText}>Grant Permission</Text>
            </Pressable>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 36 }} />
      </View>

      {permission?.granted ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanWindow}>
                <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
                <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
                <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
                <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom}>
              <Text style={styles.hintText}>Point your camera at a QR code</Text>
            </View>
          </View>
        </View>
      ) : (
        renderPermissionState()
      )}
    </View>
  );
}

const SCAN_SIZE = 250;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: '#FFFFFF',
  },
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanWindow: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    paddingTop: 32,
  },
  hintText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  permTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    marginTop: 8,
  },
  permText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  permButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  permButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
