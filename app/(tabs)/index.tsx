import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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
  const [reduceMotion, setReduceMotion] = useState(false);
  const [balanceScale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (reduceMotion || transactions.length === 0) return;
    balanceScale.setValue(0.985);
    Animated.timing(balanceScale, { toValue: 1, duration: 260, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [balanceScale, reduceMotion, transactions.length]);
  return (
    <Screen scroll contentStyle={styles.screen}>
      <View style={styles.header}><View><Text style={[styles.greeting, { color: colors.textMuted }]}>Good to see you</Text><Text style={[styles.title, { color: colors.text }]}>Hi, {user?.name.split(' ')[0]}</Text></View><View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}><Text style={{ color: colors.primary, fontWeight: '800' }}>{user?.name[0].toUpperCase()}</Text></View></View>
      <Animated.View style={{ transform: [{ scale: balanceScale }] }}>
      <LinearGradient colors={[colors.heroStart, colors.heroEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
        <View style={styles.balanceTop}><Text style={styles.balanceLabel}>Available balance</Text><Ionicons name="wallet-outline" size={23} color="#D9F1EA" /></View>
        <Text style={styles.balance}>{formatCurrency(summary.balance)}</Text><Text style={styles.balanceNote}>Income minus expenses</Text>
        <View style={styles.balanceDivider} />
        <View style={styles.balanceActions}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/transaction-form')} style={styles.balanceAction}><Ionicons name="add-circle-outline" size={19} color="#FFFFFF" /><Text style={styles.balanceActionText}>Add entry</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/analytics')} style={styles.balanceAction}><Ionicons name="pulse-outline" size={19} color="#FFFFFF" /><Text style={styles.balanceActionText}>View insights</Text></Pressable>
        </View>
      </LinearGradient>
      </Animated.View>
      <View style={styles.metrics}>
        <Card style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="arrow-down" color={colors.income} size={18} /></View><Text style={[styles.metricLabel, { color: colors.textMuted }]}>Income</Text><Text style={[styles.metricValue, { color: colors.text }]}>{formatCurrency(summary.income)}</Text></Card>
        <Card style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: colors.surfaceMuted }]}><Ionicons name="arrow-up" color={colors.expense} size={18} /></View><Text style={[styles.metricLabel, { color: colors.textMuted }]}>Expenses</Text><Text style={[styles.metricValue, { color: colors.text }]}>{formatCurrency(summary.expenses)}</Text></Card>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/tools' as Href)} style={({ pressed }) => [styles.splitPrompt, { backgroundColor: colors.primarySoft, opacity: pressed ? 0.82 : 1 }]}>
        <View style={[styles.splitIcon, { backgroundColor: colors.primary }]}><Ionicons name="people-outline" size={21} color={colors.onPrimary} /></View>
        <View style={{ flex: 1 }}><Text style={[styles.splitTitle, { color: colors.primaryStrong }]}>Sharing an expense?</Text><Text style={[styles.splitText, { color: colors.textMuted }]}>Split it evenly and send the summary.</Text></View>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </Pressable>
      <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.text }]}>Recent activity</Text><Text onPress={() => router.push('/(tabs)/transactions')} style={[styles.link, { color: colors.primary }]}>See all</Text></View>
      {error ? <Text style={{ color: colors.expense }}>{error}</Text> : null}
      <Card>{transactions.length ? transactions.slice(0, 4).map((item) => <TransactionItem key={item.id} transaction={item} />) : <Text style={[styles.balanceNote, { color: colors.textMuted }]}>No transactions yet. Add one to build your dashboard.</Text>}</Card>
      <View style={styles.fabWrap}><Pressable accessibilityRole="button" onPress={() => router.push('/transaction-form')} style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}><Ionicons name="add" size={22} color={colors.onPrimary} /><Text style={[styles.fabText, { color: colors.onPrimary }]}>Add transaction</Text></Pressable></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: Spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md },
  greeting: Typography.caption,
  title: Typography.title,
  avatar: { width: 44, height: 44, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  balanceCard: { borderRadius: Radius.lg, padding: Spacing.xl },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { ...Typography.label, color: '#D9F1EA' },
  balance: { ...Typography.hero, color: '#fff', marginTop: Spacing.xs },
  balanceNote: { ...Typography.caption, color: '#C4E5DC', marginTop: Spacing.xs },
  balanceDivider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.28)', marginVertical: Spacing.lg },
  balanceActions: { flexDirection: 'row', gap: Spacing.xl },
  balanceAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  balanceActionText: { ...Typography.label, color: '#FFFFFF' },
  metrics: { flexDirection: 'row', gap: Spacing.md },
  metric: { flex: 1, gap: Spacing.sm },
  metricIcon: { width: 34, height: 34, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  metricLabel: Typography.caption,
  metricValue: { ...Typography.heading, fontSize: 17 },
  splitPrompt: { minHeight: 72, borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  splitIcon: { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  splitTitle: Typography.label,
  splitText: Typography.caption,
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: Typography.heading,
  link: Typography.label,
  fabWrap: { alignItems: 'center' },
  fab: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xl, borderRadius: Radius.pill },
  fabText: Typography.label,
});
