import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';
import { Category, TransactionType } from '@/types';
import { useTransactions } from '@/contexts/transaction-context';
import { getErrorMessage } from '@/services/api';

const expenseCategories: Category[] = ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment', 'Health', 'Other'];
const incomeCategories: Category[] = ['Salary', 'Freelance', 'Other'];

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { transactions, save, remove } = useTransactions();
  const existing = useMemo(() => transactions.find((item) => item.id === id), [transactions, id]);
  const { colors } = useAppTheme();
  const [type, setType] = useState<TransactionType>(existing?.type ?? 'expense');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [category, setCategory] = useState<Category>(existing?.category ?? 'Food');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [date, setDate] = useState(existing ? new Date(`${existing.date}T12:00:00`) : new Date());
  const [showDate, setShowDate] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const amountError = submitted && (!Number(amount) || Number(amount) <= 0) ? 'Enter an amount greater than zero.' : undefined;
  const descriptionError = submitted && description.trim().length < 2 ? 'Add a short description.' : undefined;
  const categories = type === 'income' ? incomeCategories : expenseCategories;

  function selectType(value: TransactionType) {
    setType(value);
    if (!(value === 'income' ? incomeCategories : expenseCategories).includes(category)) setCategory(value === 'income' ? 'Salary' : 'Food');
  }

  async function submit() {
    setSubmitted(true);
    if (!Number(amount) || Number(amount) <= 0 || description.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      await save({ type, amount: Number(amount), category, description: description.trim(), date: date.toISOString().slice(0, 10) }, id);
      router.back();
    } catch (caught) { setError(getErrorMessage(caught)); }
    finally { setLoading(false); }
  }

  function confirmDelete() {
    if (!id) return;
    Alert.alert('Delete transaction?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setLoading(true); remove(id).then(() => router.back()).catch((caught) => setError(getErrorMessage(caught))).finally(() => setLoading(false)); } },
    ]);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll contentStyle={styles.screen}>
        <View style={styles.segment}>{(['expense', 'income'] as TransactionType[]).map((item) => <Pressable accessibilityRole="button" accessibilityState={{ selected: type === item }} key={item} onPress={() => selectType(item)} style={[styles.segmentButton, { backgroundColor: type === item ? colors.primary : colors.surfaceMuted }]}><Text style={[styles.segmentText, { color: type === item ? colors.onPrimary : colors.text }]}>{item[0].toUpperCase() + item.slice(1)}</Text></Pressable>)}</View>
        <AppInput label="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" error={amountError} />
        <View style={styles.field}><Text style={[styles.label, { color: colors.text }]}>Category</Text><View style={styles.chips}>{categories.map((item) => <Pressable accessibilityRole="button" accessibilityState={{ selected: category === item }} key={item} onPress={() => setCategory(item)} style={[styles.chip, { backgroundColor: category === item ? colors.primary : colors.surface, borderColor: category === item ? colors.primary : colors.border }]}><Text style={[styles.chipText, { color: category === item ? colors.onPrimary : colors.text }]}>{item}</Text></Pressable>)}</View></View>
        <AppInput label="Description" value={description} onChangeText={setDescription} placeholder="What was this for?" error={descriptionError} maxLength={80} />
        <View style={styles.field}><Text style={[styles.label, { color: colors.text }]}>Date</Text><Pressable onPress={() => setShowDate(true)} style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.dateText, { color: colors.text }]}>{date.toLocaleDateString()}</Text></Pressable>{showDate ? <DateTimePicker value={date} maximumDate={new Date()} onChange={(_, value) => { setShowDate(Platform.OS === 'ios'); if (value) setDate(value); }} /> : null}</View>
        {error ? <Text style={{ color: colors.expense }}>{error}</Text> : null}
        <AppButton label={existing ? 'Save changes' : 'Add transaction'} onPress={() => void submit()} loading={loading} />
        {existing ? <AppButton label="Delete transaction" variant="danger" onPress={confirmDelete} disabled={loading} /> : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 }, screen: { gap: Spacing.xl, paddingTop: Spacing.md }, segment: { flexDirection: 'row', gap: Spacing.sm }, segmentButton: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, borderRadius: Radius.md }, segmentText: Typography.label, field: { gap: Spacing.sm }, label: Typography.label, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }, chip: { borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.pill }, chipText: Typography.label, dateButton: { minHeight: 52, borderRadius: Radius.md, borderWidth: 1, justifyContent: 'center', paddingHorizontal: Spacing.lg }, dateText: Typography.body });
