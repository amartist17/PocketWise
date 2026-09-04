import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TransactionItem } from '@/components/transactions/transaction-item';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { useTransactions } from '@/contexts/transaction-context';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/utils/format';
import { summarizeTransactions } from '@/utils/transactions';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { transactions, error } = useTransactions();
  const summary = summarizeTransactions(transactions);
  return (
    <Screen scroll contentStyle={styles.screen}>
      <View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.textMuted }]}>WELCOME BACK</Text><Text style={[styles.title, { color: colors.text }]}>Hi, {user?.name.split(' ')[0]}</Text></View><View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}><Text style={{ color: colors.primary, fontWeight: '800' }}>{user?.name[0].toUpperCase()}</Text></View></View>
      <Card style={[styles.balanceCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
        <Text style={styles.balanceLabel}>Available balance</Text><Text style={styles.balance}>{formatCurrency(summary.balance)}</Text><Text style={styles.balanceNote}>Across all transactions</Text>
      </Card>
      <View style={styles.metrics}>
        <Card style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="arrow-down" color={colors.income} size={18} /></View><Text style={[styles.metricLabel, { color: colors.textMuted }]}>Income</Text><Text style={[styles.metricValue, { color: colors.text }]}>{formatCurrency(summary.income)}</Text></Card>
        <Card style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: colors.surfaceMuted }]}><Ionicons name="arrow-up" color={colors.expense} size={18} /></View><Text style={[styles.metricLabel, { color: colors.textMuted }]}>Expenses</Text><Text style={[styles.metricValue, { color: colors.text }]}>{formatCurrency(summary.expenses)}</Text></Card>
      </View>
      <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.text }]}>Recent activity</Text><Text onPress={() => router.push('/(tabs)/transactions')} style={[styles.link, { color: colors.primary }]}>See all</Text></View>
      {error ? <Text style={{ color: colors.expense }}>{error}</Text> : null}
      <Card>{transactions.length ? transactions.slice(0, 4).map((item) => <TransactionItem key={item.id} transaction={item} />) : <Text style={[styles.balanceNote, { color: colors.textMuted }]}>No transactions yet. Add one to build your dashboard.</Text>}</Card>
      <View style={styles.fabWrap}><Text onPress={() => router.push('/transaction-form')} style={[styles.fab, { backgroundColor: colors.primary }]}><Ionicons name="add" size={22} color={colors.white} />  Add transaction</Text></View>
    </Screen>
  );
}

const styles = StyleSheet.create({ screen: { gap: Spacing.xl }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md }, eyebrow: { ...Typography.caption, letterSpacing: 1.2 }, title: Typography.title, avatar: { width: 44, height: 44, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' }, balanceCard: { paddingVertical: Spacing.xl }, balanceLabel: { ...Typography.label, color: '#D9F1EA' }, balance: { ...Typography.hero, color: '#fff', marginTop: Spacing.xs }, balanceNote: { ...Typography.caption, color: '#C4E5DC', marginTop: Spacing.md }, metrics: { flexDirection: 'row', gap: Spacing.md }, metric: { flex: 1, gap: Spacing.sm }, metricIcon: { width: 34, height: 34, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' }, metricLabel: Typography.caption, metricValue: { ...Typography.heading, fontSize: 17 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: Typography.heading, link: Typography.label, fabWrap: { alignItems: 'center' }, fab: { overflow: 'hidden', color: '#fff', paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.pill, fontWeight: '700' } });
