import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { useTransactions } from '@/contexts/transaction-context';
import { formatCurrency } from '@/utils/format';
import { spendingByCategory, summarizeTransactions } from '@/utils/transactions';

export default function AnalyticsScreen() {
  const { colors } = useAppTheme();
  const { transactions } = useTransactions();
  const summary = summarizeTransactions(transactions);
  const categories = spendingByCategory(transactions);
  const max = Math.max(...categories.map((item) => item.amount), 1);
  return (
    <Screen scroll contentStyle={styles.screen}>
      <View><Text style={[styles.title, { color: colors.text }]}>Analytics</Text><Text style={[styles.subtitle, { color: colors.textMuted }]}>Your September snapshot</Text></View>
      <Card><Text style={[styles.cardLabel, { color: colors.textMuted }]}>INCOME VS EXPENSES</Text><View style={styles.compare}><View><Text style={[styles.value, { color: colors.income }]}>{formatCurrency(summary.income)}</Text><Text style={[styles.caption, { color: colors.textMuted }]}>Income</Text></View><View><Text style={[styles.value, { color: colors.expense }]}>{formatCurrency(summary.expenses)}</Text><Text style={[styles.caption, { color: colors.textMuted }]}>Expenses</Text></View></View><View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}><View style={[styles.progress, { backgroundColor: colors.expense, width: `${Math.min((summary.expenses / summary.income) * 100, 100)}%` }]} /></View></Card>
      <Card><Text style={[styles.cardLabel, { color: colors.textMuted }]}>SPENDING BY CATEGORY</Text><View style={styles.categories}>{categories.map((item) => <View key={item.category} style={styles.category}><View style={styles.categoryHeading}><Text style={[styles.categoryName, { color: colors.text }]}>{item.category}</Text><Text style={[styles.categoryAmount, { color: colors.text }]}>{formatCurrency(item.amount)}</Text></View><View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}><View style={[styles.progress, { backgroundColor: colors.primary, width: `${(item.amount / max) * 100}%` }]} /></View></View>)}</View></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ screen: { gap: Spacing.xl, paddingTop: Spacing.md }, title: Typography.title, subtitle: Typography.body, cardLabel: { ...Typography.caption, letterSpacing: 1 }, compare: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: Spacing.xl }, value: Typography.heading, caption: Typography.caption, track: { height: 8, borderRadius: Radius.pill, overflow: 'hidden' }, progress: { height: '100%', borderRadius: Radius.pill }, categories: { gap: Spacing.lg, marginTop: Spacing.xl }, category: { gap: Spacing.sm }, categoryHeading: { flexDirection: 'row', justifyContent: 'space-between' }, categoryName: Typography.label, categoryAmount: Typography.label });
