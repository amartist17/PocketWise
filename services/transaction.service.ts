import { Transaction, TransactionInput } from '@/types';

import { api } from './api';

export const transactionService = {
  async list() { return (await api.get<{ transactions: Transaction[] }>('/transactions')).data.transactions; },
  async create(input: TransactionInput) { return (await api.post<{ transaction: Transaction }>('/transactions', input)).data.transaction; },
  async update(id: string, input: TransactionInput) { return (await api.put<{ transaction: Transaction }>(`/transactions/${id}`, input)).data.transaction; },
  async remove(id: string) { await api.delete(`/transactions/${id}`); },
};
