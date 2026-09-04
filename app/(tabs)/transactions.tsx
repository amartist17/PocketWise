import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { TransactionItem } from '@/components/transactions/transaction-item';
import { AppInput } from '@/components/ui/app-input';
import { EmptyState } from '@/components/ui/empty-state';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { useTransactions } from '@/contexts/transaction-context';
import { TransactionType } from '@/types';

type Filter = 'all' | TransactionType;

export default function TransactionsScreen() {
  const { colors } = useAppTheme();
  const { transactions, refreshing, refresh, error } = useTransactions();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const data = useMemo(() => transactions.filter((item) => (filter === 'all' || item.type === filter) && `${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [transactions, filter, query]);
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}><Text style={[styles.title, { color: colors.text }]}>Transactions</Text><Pressable onPress={() => router.push('/transaction-form')} style={[styles.add, { backgroundColor: colors.primary }]}><Ionicons name="add" color={colors.white} size={24} /></Pressable></View>
      <AppInput label="Search" value={query} onChangeText={setQuery} placeholder="Description or category" />
      <View style={styles.filters}>{(['all', 'income', 'expense'] as Filter[]).map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, { backgroundColor: filter === item ? colors.primary : colors.surface, borderColor: filter === item ? colors.primary : colors.border }]}><Text style={[styles.filterText, { color: filter === item ? colors.white : colors.text }]}>{item[0].toUpperCase() + item.slice(1)}</Text></Pressable>)}</View>
      {error ? <Text style={{ color: colors.expense }}>{error}</Text> : null}
      <FlatList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => <TransactionItem transaction={item} onPress={() => router.push({ pathname: '/transaction-form', params: { id: item.id } })} />} contentContainerStyle={styles.list} ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />} ListEmptyComponent={<EmptyState title="Nothing found" message="Try another filter or add your first matching transaction." />} refreshing={refreshing} onRefresh={() => void refresh()} keyboardShouldPersistTaps="handled" />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 54 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg }, title: Typography.title, add: { width: 44, height: 44, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' }, filters: { flexDirection: 'row', gap: Spacing.sm, marginVertical: Spacing.lg }, filter: { borderWidth: 1, borderRadius: Radius.pill, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }, filterText: Typography.label, list: { paddingBottom: 100 }, separator: { height: 1, marginLeft: 54 } });
