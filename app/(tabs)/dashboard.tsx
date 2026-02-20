import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useContacts } from '@/lib/contacts-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <View style={[statStyles.card, { borderLeftColor: color }]}>
      <View style={[statStyles.iconWrap, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

function BarChart({ data }: { data: { label: string; emails: number; calls: number }[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.emails, d.calls]), 1);
  const chartHeight = 140;

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.barsRow}>
        {data.map((item) => (
          <View key={item.label} style={chartStyles.barGroup}>
            <View style={chartStyles.barPair}>
              <View
                style={[
                  chartStyles.bar,
                  {
                    height: (item.emails / maxVal) * chartHeight,
                    backgroundColor: Colors.primary,
                  },
                ]}
              />
              <View
                style={[
                  chartStyles.bar,
                  {
                    height: (item.calls / maxVal) * chartHeight,
                    backgroundColor: Colors.chipContacted,
                  },
                ]}
              />
            </View>
            <Text style={chartStyles.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={chartStyles.legend}>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={chartStyles.legendText}>Emails</Text>
        </View>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: Colors.chipContacted }]} />
          <Text style={chartStyles.legendText}>Calls</Text>
        </View>
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barPair: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-end',
  },
  bar: {
    width: 14,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { contacts } = useContacts();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const stats = useMemo(() => {
    const newCount = contacts.filter((c) => c.category === 'New').length;
    const contactedCount = contacts.filter((c) => c.category === 'Contacted').length;
    const qualifiedCount = contacts.filter((c) => c.category === 'Qualified').length;
    return { total: contacts.length, newCount, contactedCount, qualifiedCount };
  }, [contacts]);

  const chartData = [
    { label: 'Jan', emails: 12, calls: 8 },
    { label: 'Feb', emails: 18, calls: 14 },
    { label: 'Mar', emails: 24, calls: 16 },
    { label: 'Apr', emails: 28, calls: 20 },
    { label: 'May', emails: 32, calls: 24 },
    { label: 'Jun', emails: 38, calls: 28 },
  ];

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
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.greetingCard}
      >
        <Text style={styles.greetingSmall}>Good Morning</Text>
        <Text style={styles.greetingName}>GABRIEL</Text>
        <View style={styles.greetingStats}>
          <View style={styles.greetingStat}>
            <Text style={styles.greetingStatValue}>{stats.total}</Text>
            <Text style={styles.greetingStatLabel}>Total</Text>
          </View>
          <View style={styles.greetingDivider} />
          <View style={styles.greetingStat}>
            <Text style={styles.greetingStatValue}>{stats.newCount}</Text>
            <Text style={styles.greetingStatLabel}>New</Text>
          </View>
          <View style={styles.greetingDivider} />
          <View style={styles.greetingStat}>
            <Text style={styles.greetingStatValue}>{stats.qualifiedCount}</Text>
            <Text style={styles.greetingStatLabel}>Qualified</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <StatCard icon="people" label="New Leads" value={stats.newCount} color={Colors.chipNew} />
        <StatCard icon="chatbubbles" label="Contacted" value={stats.contactedCount} color={Colors.chipContacted} />
        <StatCard icon="checkmark-circle" label="Qualified" value={stats.qualifiedCount} color={Colors.chipQualified} />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Outreach Performance</Text>
        <Text style={styles.chartSubtitle}>Emails & calls over time</Text>
        <BarChart data={chartData} />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Trends</Text>
        <Text style={styles.chartSubtitle}>Monthly growth by category</Text>
        <View style={styles.trendRow}>
          <View style={styles.trendItem}>
            <View style={[styles.trendBar, { height: 60, backgroundColor: Colors.chipNew + '30' }]}>
              <View style={[styles.trendBarFill, { height: 40, backgroundColor: Colors.chipNew }]} />
            </View>
            <Text style={styles.trendLabel}>New</Text>
          </View>
          <View style={styles.trendItem}>
            <View style={[styles.trendBar, { height: 80, backgroundColor: Colors.chipContacted + '30' }]}>
              <View style={[styles.trendBarFill, { height: 55, backgroundColor: Colors.chipContacted }]} />
            </View>
            <Text style={styles.trendLabel}>Contacted</Text>
          </View>
          <View style={styles.trendItem}>
            <View style={[styles.trendBar, { height: 100, backgroundColor: Colors.chipQualified + '30' }]}>
              <View style={[styles.trendBarFill, { height: 70, backgroundColor: Colors.chipQualified }]} />
            </View>
            <Text style={styles.trendLabel}>Qualified</Text>
          </View>
        </View>
      </View>
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
  greetingCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 4,
  },
  greetingSmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  greetingName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.white,
    marginTop: 4,
  },
  greetingStats: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  greetingStat: {
    flex: 1,
    alignItems: 'center',
  },
  greetingStatValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.white,
  },
  greetingStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  greetingDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  chartTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  chartSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingBottom: 4,
  },
  trendItem: {
    alignItems: 'center',
    gap: 8,
  },
  trendBar: {
    width: 40,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%' as any,
    borderRadius: 8,
  },
  trendLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
