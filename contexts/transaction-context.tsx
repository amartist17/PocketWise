import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getErrorMessage } from '@/services/api';
import { transactionService } from '@/services/transaction.service';
import { Transaction, TransactionInput } from '@/types';
import { useAuth } from './auth-context';

interface TransactionContextValue {
  transactions: Transaction[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (input: TransactionInput, id?: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (!user) { setTransactions([]); return; }
    refresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try { setTransactions(await transactionService.list()); }
    catch (caught) { setError(getErrorMessage(caught)); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const value = useMemo<TransactionContextValue>(() => ({
    transactions, loading, refreshing, error,
    refresh: () => load(true),
    save: async (input, id) => { if (id) await transactionService.update(id, input); else await transactionService.create(input); await load(); },
    remove: async (id) => { await transactionService.remove(id); setTransactions((items) => items.filter((item) => item.id !== id)); },
  }), [transactions, loading, refreshing, error, load]);

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used inside TransactionProvider');
  return context;
}
