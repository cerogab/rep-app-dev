import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors, ThemeColors } from '@/lib/theme-context';
import { useContacts } from '@/lib/contacts-context';

const MONTHLY_REVENUE = [
  { label: 'February', revenue: 4.20, discountPct: 15, value: 0.75, outreach: 5 },
  { label: 'March', revenue: 5.30, discountPct: 20, value: 1.00, outreach: 10 },
  { label: 'April', revenue: 5.50, discountPct: 10, value: 0.50, outreach: 15 },
];

const TOTAL_REVENUE = 15.00;

function RevenueBarChart({ data, colors }: { data: typeof MONTHLY_REVENUE; colors: ThemeColors }) {
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
                    backgroundColor: colors.primary,
                  },
                ]}
              />
              <View
                style={[
                  chartStyles.bar,
                  {
                    height: (item.discountPct / 25) * chartHeight,
                    backgroundColor: colors.chipQualified,
                  },
                ]}
              />
            </View>
            <Text style={[chartStyles.barLabel, { color: colors.textSecondary }]}>{item.label.slice(0, 3)}</Text>
          </View>
        ))}
      </View>
      <View style={chartStyles.legend}>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[chartStyles.legendText, { color: colors.textSecondary }]}>Total Outreach</Text>
        </View>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: colors.chipQualified }]} />
          <Text style={[chartStyles.legendText, { color: colors.textSecondary }]}>Discount %</Text>
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
  },
});

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
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
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
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
        <View style={[styles.statCard, { backgroundColor: colors.white, borderLeftColor: colors.chipQualified }]}>
          <View style={[styles.statIconWrap, { backgroundColor: colors.chipQualified + '15' }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.chipQualified} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.qualifiedCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Qualified</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white, borderLeftColor: colors.primary }]}>
          <View style={[styles.statIconWrap, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="megaphone" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalOutreach}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Outreach</Text>
        </View>
      </View>

      <View style={[styles.chartCard, { backgroundColor: colors.white }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Revenue Analytics</Text>
        <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>Qualified revenue & discount ratio over 3 months</Text>
        <RevenueBarChart data={MONTHLY_REVENUE} colors={colors} />
      </View>

      <View style={[styles.chartCard, { backgroundColor: colors.white }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Qualified / Discount Received</Text>
        <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>Breakdown per month</Text>
        <View style={styles.ratioTable}>
          <View style={[styles.ratioHeaderRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.ratioCell, styles.ratioCellHeader, { flex: 1.4, color: colors.textSecondary }]}>Month</Text>
            <Text style={[styles.ratioCell, styles.ratioCellHeader, { color: colors.textSecondary }]}>Discount %</Text>
            <Text style={[styles.ratioCell, styles.ratioCellHeader, { color: colors.textSecondary }]}>Value</Text>
            <Text style={[styles.ratioCell, styles.ratioCellHeader, { color: colors.textSecondary }]}>Outreach</Text>
          </View>
          {MONTHLY_REVENUE.map((item) => (
            <View key={item.label} style={[styles.ratioRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.ratioCell, { flex: 1.4, color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.ratioCell, { color: colors.chipQualified }]}>{item.discountPct}%</Text>
              <Text style={[styles.ratioCell, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>${item.value.toFixed(2)}</Text>
              <Text style={[styles.ratioCell, { color: colors.text }]}>{item.outreach}</Text>
            </View>
          ))}
          <View style={[styles.ratioTotalRow, { borderTopColor: colors.text }]}>
            <Text style={[styles.ratioCellTotal, { flex: 1.4, color: colors.text }]}>Total</Text>
            <Text style={[styles.ratioCellTotal, { color: colors.chipQualified }]}>
              {Math.round(MONTHLY_REVENUE.reduce((s, m) => s + m.discountPct, 0) / MONTHLY_REVENUE.length)}%
            </Text>
            <Text style={[styles.ratioCellTotal, { color: colors.primary }]}>${stats.totalDiscount.toFixed(2)}</Text>
            <Text style={[styles.ratioCellTotal, { color: colors.text }]}>{stats.totalOutreach}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
  statCard: {
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
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  chartCard: {
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
  },
  chartSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
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
  },
  ratioRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ratioTotalRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    marginTop: 2,
  },
  ratioCell: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  ratioCellHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratioCellTotal: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
