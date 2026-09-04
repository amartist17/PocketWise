import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = { Food: 'restaurant', Shopping: 'bag-handle', Travel: 'train', Bills: 'receipt', Entertainment: 'film', Health: 'medkit', Salary: 'wallet', Freelance: 'laptop', Other: 'shapes' };

export function TransactionItem({ transaction, onPress }: { transaction: Transaction; onPress?: () => void }) {
  const { colors } = useAppTheme();
  const positive = transaction.type === 'income';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}>
      <View style={[styles.icon, { backgroundColor: positive ? colors.primarySoft : colors.surfaceMuted }]}><Ionicons name={icons[transaction.category]} size={20} color={positive ? colors.income : colors.textMuted} /></View>
      <View style={styles.copy}><Text numberOfLines={1} style={[styles.description, { color: colors.text }]}>{transaction.description}</Text><Text style={[styles.meta, { color: colors.textMuted }]}>{transaction.category} · {formatDate(transaction.date)}</Text></View>
      <Text style={[styles.amount, { color: positive ? colors.income : colors.expense }]}>{positive ? '+' : '−'}{formatCurrency(transaction.amount)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({ row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, icon: { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, gap: 2 }, description: Typography.label, meta: Typography.caption, amount: { ...Typography.label, fontVariant: ['tabular-nums'] } });
