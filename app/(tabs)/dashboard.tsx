import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/lib/theme-context';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const QUARTERS: { label: string; months: number[] }[] = [
  { label: 'Q1', months: [0, 1, 2] },
  { label: 'Q2', months: [3, 4, 5] },
  { label: 'Q3', months: [6, 7, 8] },
  { label: 'Q4', months: [9, 10, 11] },
];

interface MonthData {
  discountPct: number;
  outreach: number;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const [revenue, setRevenue] = useState('');
  const [monthData, setMonthData] = useState<MonthData[]>(
    MONTHS.map(() => ({ discountPct: 0, outreach: 0 }))
  );

  const revenueNum = parseFloat(revenue) || 0;

  const updateMonth = (index: number, field: keyof MonthData, val: string) => {
    const num = parseFloat(val) || 0;
    setMonthData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: num };
      return updated;
    });
  };

  const calcValue = (discountPct: number) => (discountPct / 100) * revenueNum;

  const totals = useMemo(() => {
    const totalDiscount = monthData.reduce((s, m) => s + calcValue(m.discountPct), 0);
    const totalOutreach = monthData.reduce((s, m) => s + m.outreach, 0);
    const avgDiscount = monthData.reduce((s, m) => s + m.discountPct, 0) / 12;
    return { totalDiscount, totalOutreach, avgDiscount };
  }, [monthData, revenueNum]);

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
      <View style={[styles.revenueCard, { backgroundColor: colors.primaryDark }]}>
        <Text style={styles.revenueLabel}>MONTHLY REVENUE ($)</Text>
        <View style={[styles.revenueInputWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <TextInput
            style={styles.revenueInput}
            placeholder="Enter revenue..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={revenue}
            onChangeText={setRevenue}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
      </View>

      {QUARTERS.map((quarter) => (
        <View key={quarter.label} style={[styles.quarterCard, { backgroundColor: colors.white }]}>
          <Text style={[styles.quarterLabel, { color: colors.primary }]}>{quarter.label}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerCell, styles.monthCell, { color: colors.textSecondary }]}>MONTH</Text>
                <Text style={[styles.headerCell, styles.dataCell, { color: colors.textSecondary }]}>DISCOUNT %</Text>
                <Text style={[styles.headerCell, styles.dataCell, { color: colors.textSecondary }]}>VALUE ($)</Text>
                <Text style={[styles.headerCell, styles.dataCell, { color: colors.textSecondary }]}>OUTREACH</Text>
                <Text style={[styles.headerCell, styles.accountedCell, { color: colors.textSecondary }]}>DISCOUNTS ACCOUNTED</Text>
              </View>

              {quarter.months.map((mi) => {
                const val = calcValue(monthData[mi].discountPct);
                return (
                  <View key={mi} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.rowCell, styles.monthCell, { color: colors.text }]}>{MONTHS[mi]}</Text>
                    <View style={[styles.inputCell, styles.dataCell]}>
                      <TextInput
                        style={[styles.cellInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                        value={monthData[mi].discountPct === 0 ? '' : String(monthData[mi].discountPct)}
                        onChangeText={(v) => updateMonth(mi, 'discountPct', v)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                    <Text style={[styles.rowCell, styles.dataCell, { color: colors.textTertiary }]}>
                      {val === 0 ? '0.00' : val.toFixed(2)}
                    </Text>
                    <View style={[styles.inputCell, styles.dataCell]}>
                      <TextInput
                        style={[styles.cellInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                        value={monthData[mi].outreach === 0 ? '' : String(monthData[mi].outreach)}
                        onChangeText={(v) => updateMonth(mi, 'outreach', v)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                    <Text style={[styles.rowCell, styles.accountedCell, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                      ${val === 0 ? '0.00' : val.toFixed(2)}
                    </Text>
                  </View>
                );
              })}

              <View style={[styles.quarterTotalRow, { borderTopColor: colors.text }]}>
                <Text style={[styles.totalCell, styles.monthCell, { color: colors.text }]}>Subtotal</Text>
                <Text style={[styles.totalCell, styles.dataCell, { color: colors.chipQualified }]}>
                  {Math.round(quarter.months.reduce((s, mi) => s + monthData[mi].discountPct, 0) / 3)}%
                </Text>
                <Text style={[styles.totalCell, styles.dataCell, { color: colors.primary }]}>
                  ${quarter.months.reduce((s, mi) => s + calcValue(monthData[mi].discountPct), 0).toFixed(2)}
                </Text>
                <Text style={[styles.totalCell, styles.dataCell, { color: colors.text }]}>
                  {quarter.months.reduce((s, mi) => s + monthData[mi].outreach, 0)}
                </Text>
                <Text style={[styles.totalCell, styles.accountedCell, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>
                  ${quarter.months.reduce((s, mi) => s + calcValue(monthData[mi].discountPct), 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      ))}

      <View style={[styles.grandTotalCard, { backgroundColor: colors.primaryDark }]}>
        <Text style={styles.grandTotalLabel}>Annual Total</Text>
        <Text style={styles.grandTotalValue}>${totals.totalDiscount.toFixed(2)}</Text>
        <View style={styles.grandTotalStats}>
          <View style={styles.grandTotalStat}>
            <Text style={styles.grandTotalStatValue}>{Math.round(totals.avgDiscount)}%</Text>
            <Text style={styles.grandTotalStatLabel}>Avg Discount</Text>
          </View>
          <View style={styles.grandTotalDivider} />
          <View style={styles.grandTotalStat}>
            <Text style={styles.grandTotalStatValue}>{totals.totalOutreach}</Text>
            <Text style={styles.grandTotalStatLabel}>Total Outreach</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.pageTitle, { color: colors.primary }]}>Calculator</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  pageTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    paddingHorizontal: 4,
  },
  revenueCard: {
    borderRadius: 16,
    padding: 20,
  },
  revenueLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  revenueInputWrap: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  revenueInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
  },
  quarterCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quarterLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCell: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  monthCell: {
    width: 80,
    textAlign: 'left',
  },
  dataCell: {
    width: 80,
  },
  accountedCell: {
    width: 110,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowCell: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  inputCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    width: 56,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  quarterTotalRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: 1,
    marginTop: 4,
  },
  totalCell: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  grandTotalCard: {
    borderRadius: 20,
    padding: 24,
  },
  grandTotalLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  grandTotalValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginTop: 4,
  },
  grandTotalStats: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  grandTotalStat: {
    flex: 1,
    alignItems: 'center',
  },
  grandTotalStatValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  grandTotalStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  grandTotalDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
