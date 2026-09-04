import { Transaction } from '@/types';

export function summarizeTransactions(transactions: Transaction[]) {
  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function spendingByCategory(transactions: Transaction[]) {
  const totals = new Map<string, number>();
  transactions.filter((item) => item.type === 'expense').forEach((item) => {
    totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
  });
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
