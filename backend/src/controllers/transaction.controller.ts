import { TransactionModel } from '../models/transaction.model.js';
import { AppError } from '../utils/app-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { transactionQuerySchema, transactionSchema } from '../validation/transaction.schemas.js';

const present = (item: { _id: unknown; type: string; amount: number; category: string; description: string; date: Date; createdAt: Date; updatedAt: Date }) => ({
  id: String(item._id), type: item.type, amount: item.amount, category: item.category, description: item.description,
  date: item.date.toISOString().slice(0, 10), createdAt: item.createdAt, updatedAt: item.updatedAt,
});

export const listTransactions = asyncHandler(async (request, response) => {
  const query = transactionQuerySchema.parse(request.query);
  const filter: Record<string, unknown> = { userId: request.userId };
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.from || query.to) filter.date = { ...(query.from ? { $gte: query.from } : {}), ...(query.to ? { $lte: query.to } : {}) };
  const items = await TransactionModel.find(filter).sort({ date: -1, createdAt: -1 });
  response.json({ transactions: items.map(present) });
});

export const getTransaction = asyncHandler(async (request, response) => {
  const item = await TransactionModel.findOne({ _id: request.params.id, userId: request.userId });
  if (!item) throw new AppError(404, 'Transaction not found.');
  response.json({ transaction: present(item) });
});

export const createTransaction = asyncHandler(async (request, response) => {
  const input = transactionSchema.parse(request.body);
  const item = await TransactionModel.create({ ...input, userId: request.userId });
  response.status(201).json({ transaction: present(item) });
});

export const updateTransaction = asyncHandler(async (request, response) => {
  const input = transactionSchema.parse(request.body);
  const item = await TransactionModel.findOneAndUpdate({ _id: request.params.id, userId: request.userId }, input, { new: true, runValidators: true });
  if (!item) throw new AppError(404, 'Transaction not found.');
  response.json({ transaction: present(item) });
});

export const deleteTransaction = asyncHandler(async (request, response) => {
  const item = await TransactionModel.findOneAndDelete({ _id: request.params.id, userId: request.userId });
  if (!item) throw new AppError(404, 'Transaction not found.');
  response.status(204).send();
});
