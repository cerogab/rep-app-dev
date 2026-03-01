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

const PRIVACY_LINK = 'https://www.iubenda.com/privacy-policy/65011295';

const SECTIONS = [
  {
    title: 'PRIVACY POLICY',
    body: `We care about data privacy and security. Please review our Privacy Policy: ${PRIVACY_LINK}. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in the United States. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in the United States, then through your continued use of the Services, you are transferring your data to the United States, and you expressly consent to have your data transferred to and processed in the United States. Further, we do not knowingly accept, request, or solicit information from children or knowingly market to children. Therefore, in accordance with the U.S. Children's Online Privacy Protection Act, if we receive actual knowledge that anyone under the age of 13 has provided personal information to us without the requisite and verifiable parental consent, we will delete that information from the Services as quickly as is reasonably practical.`,
  },
  {
    title: 'DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY',
    subtitle: 'Notifications',
    body: `We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify our Designated Copyright Agent using the contact information provided below (a "Notification"). A copy of your Notification will be sent to the person who posted or stored the material addressed in the Notification. Please be advised that pursuant to federal law you may be held liable for damages if you make material misrepresentations in a Notification. Thus, if you are not sure that material located on or linked to by the Services infringes your copyright, you should consider first contacting an attorney.`,
  },
  {
    body: `All Notifications should meet the requirements of DMCA 17 U.S.C. § 512(c)(3) and include the following information: (1) A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed; (2) identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works on the Services are covered by the Notification, a representative list of such works on the Services; (3) identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material; (4) information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and, if available, an email address at which the complaining party may be contacted; (5) a statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and (6) a statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed upon.`,
  },
  {
    subtitle: 'Counter Notification',
    body: `If you believe your own copyrighted material has been removed from the Services as a result of a mistake or misidentification, you may submit a written counter notification to our Designated Copyright Agent using the contact information provided below (a "Counter Notification"). To be an effective Counter Notification under the DMCA, your Counter Notification must include substantially the following: (1) identification of the material that has been removed or disabled and the location at which the material appeared before it was removed or disabled; (2) a statement that you consent to the jurisdiction of the Federal District Court in which your address is located, or if your address is outside of the United States, for any judicial district in which we are located; (3) a statement that you will accept service of process from the party that filed the Notification or the party's agent; (4) your name, address, and telephone number; (5) a statement under penalty of perjury that you have a good faith belief that the material in question was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled; and (6) your physical or electronic signature.`,
  },
  {
    body: `If you send us a valid, written Counter Notification meeting the requirements described above, we will restore your removed or disabled material, unless we first receive notice from the party filing the Notification informing us that such party has filed a court action to restrain you from engaging in infringing activity related to the material in question. Please note that if you materially misrepresent that the disabled or removed content was removed by mistake or misidentification, you may be liable for damages, including costs and attorney's fees. Filing a false Counter Notification constitutes perjury.`,
  },
  {
    subtitle: 'Designated Copyright Agent',
    body: `Gustavo\nAttn: Copyright Agent\n12676 SW 145TH ST\nMiami, FL 33186-5986\nUnited States\nbram0001@bramllc.app`,
  },
];

export default function PrivacyScreen() {
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
        <Text style={[styles.title, { color: colors.primary }]}>Privacy</Text>

        {SECTIONS.map((section, i) => (
          <View key={i} style={[styles.card, { backgroundColor: colors.white }]}>
            {section.title && (
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            )}
            {section.subtitle && (
              <Text style={[styles.sectionSubtitle, { color: colors.primary }]}>{section.subtitle}</Text>
            )}
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{section.body}</Text>
          </View>
        ))}

        <Pressable
          style={[styles.linkButton, { backgroundColor: colors.primary }]}
          onPress={() => Linking.openURL(PRIVACY_LINK)}
        >
          <Ionicons name="open-outline" size={18} color="#FFFFFF" />
          <Text style={styles.linkButtonText}>View Full Privacy Policy</Text>
        </Pressable>
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
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 8,
  },
  sectionBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  linkButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
