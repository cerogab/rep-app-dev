import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useContacts } from '@/lib/contacts-context';

const MONTHLY_REVENUE = [
  { label: 'February', revenue: 4.20, discountPct: 15, value: 0.75, outreach: 5 },
  { label: 'March', revenue: 5.30, discountPct: 20, value: 1.00, outreach: 10 },
  { label: 'April', revenue: 5.50, discountPct: 10, value: 0.50, outreach: 15 },
];

const TOTAL_REVENUE = 15.00;

function RevenueBarChart({ data }: { data: typeof MONTHLY_REVENUE }) {
  const maxVal = Math.max(...data.map((d) => d.outreach), 1);
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
                    height: (item.outreach / maxVal) * chartHeight,
                    backgroundColor: Colors.primary,
                  },
                ]}
              />
              <View
                style={[
                  chartStyles.bar,
                  {
                    height: (item.discountPct / 25) * chartHeight,
                    backgroundColor: Colors.chipQualified,
                  },
                ]}
              />
            </View>
            <Text style={chartStyles.barLabel}>{item.label.slice(0, 3)}</Text>
          </View>
        ))}
      </View>
      <View style={chartStyles.legend}>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={chartStyles.legendText}>Total Outreach</Text>
        </View>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: Colors.chipQualified }]} />
          <Text style={chartStyles.legendText}>Discount %</Text>
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
    width: 20,
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
    const qualifiedCount = contacts.filter((c) => c.category === 'Qualified').length;
    const totalCount = contacts.length;
    const qualifiedRatio = totalCount > 0 ? Math.round((qualifiedCount / totalCount) * 100) : 0;
    const totalDiscount = MONTHLY_REVENUE.reduce((sum, m) => sum + m.value, 0);
    const totalOutreach = MONTHLY_REVENUE.reduce((sum, m) => sum + m.outreach, 0);
    return { total: totalCount, qualifiedCount, qualifiedRatio, totalDiscount, totalOutreach };
  }, [contacts]);

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
        <Text style={styles.greetingSmall}>Total Discount Accepted</Text>
        <Text style={styles.revenueAmount}>${TOTAL_REVENUE.toFixed(2)}</Text>
        <Text style={styles.revenuePeriod}>over 3 months</Text>
        <View style={styles.greetingStats}>
          <View style={styles.greetingStat}>
            <Text style={styles.greetingStatValue}>{stats.qualifiedCount}</Text>
            <Text style={styles.greetingStatLabel}>Qualified</Text>
          </View>
          <View style={styles.greetingDivider} />
          <View style={styles.greetingStat}>
            <Text style={styles.greetingStatValue}>${stats.totalDiscount.toFixed(2)}</Text>
            <Text style={styles.greetingStatLabel}>Saved</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={[statStyles.card, { borderLeftColor: Colors.chipQualified }]}>
          <View style={[statStyles.iconWrap, { backgroundColor: Colors.chipQualified + '15' }]}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.chipQualified} />
          </View>
          <Text style={statStyles.value}>{stats.qualifiedCount}</Text>
          <Text style={statStyles.label}>Qualified</Text>
        </View>
        <View style={[statStyles.card, { borderLeftColor: Colors.primary }]}>
          <View style={[statStyles.iconWrap, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="megaphone" size={20} color={Colors.primary} />
          </View>
          <Text style={statStyles.value}>{stats.totalOutreach}</Text>
          <Text style={statStyles.label}>Total Outreach</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue Analytics</Text>
        <Text style={styles.chartSubtitle}>Qualified revenue & discount ratio over 3 months</Text>
        <RevenueBarChart data={MONTHLY_REVENUE} />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Qualified / Discount Received</Text>
        <Text style={styles.chartSubtitle}>Breakdown per month</Text>
        <View style={styles.ratioTable}>
          <View style={styles.ratioHeaderRow}>
            <Text style={[styles.ratioCell, styles.ratioCellHeader, { flex: 1.4 }]}>Month</Text>
            <Text style={[styles.ratioCell, styles.ratioCellHeader]}>Discount %</Text>
            <Text style={[styles.ratioCell, styles.ratioCellHeader]}>Value</Text>
            <Text style={[styles.ratioCell, styles.ratioCellHeader]}>Outreach</Text>
          </View>
          {MONTHLY_REVENUE.map((item) => (
            <View key={item.label} style={styles.ratioRow}>
              <Text style={[styles.ratioCell, { flex: 1.4 }]}>{item.label}</Text>
              <Text style={[styles.ratioCell, { color: Colors.chipQualified }]}>{item.discountPct}%</Text>
              <Text style={[styles.ratioCell, { color: Colors.primary, fontFamily: 'Inter_600SemiBold' }]}>${item.value.toFixed(2)}</Text>
              <Text style={styles.ratioCell}>{item.outreach}</Text>
            </View>
          ))}
          <View style={styles.ratioTotalRow}>
            <Text style={[styles.ratioCellTotal, { flex: 1.4 }]}>Total</Text>
            <Text style={[styles.ratioCellTotal, { color: Colors.chipQualified }]}>
              {Math.round(MONTHLY_REVENUE.reduce((s, m) => s + m.discountPct, 0) / MONTHLY_REVENUE.length)}%
            </Text>
            <Text style={[styles.ratioCellTotal, { color: Colors.primary }]}>${stats.totalDiscount.toFixed(2)}</Text>
            <Text style={styles.ratioCellTotal}>{stats.totalOutreach}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    fontSize: 24,
    color: Colors.text,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

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
  revenueAmount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    color: Colors.white,
    marginTop: 4,
  },
  revenuePeriod: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
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
    fontSize: 20,
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
    backgroundColor: 'rgba(255,255,255,0.3)',
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
  ratioTable: {
    marginTop: 16,
    gap: 0,
  },
  ratioHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ratioRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  ratioTotalRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.text,
    marginTop: 2,
  },
  ratioCell: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  ratioCellHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratioCellTotal: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});
