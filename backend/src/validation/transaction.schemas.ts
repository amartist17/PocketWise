import { z } from 'zod';

import { categories } from '../models/transaction.model.js';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive().max(1_000_000_000),
  category: z.enum(categories),
  description: z.string().trim().min(2).max(80),
  date: z.coerce.date().refine((value) => value <= new Date(), 'Date cannot be in the future.'),
});

export const transactionQuerySchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  category: z.enum(categories).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
