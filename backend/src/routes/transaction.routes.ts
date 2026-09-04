import { Router } from 'express';

import { createTransaction, deleteTransaction, getTransaction, listTransactions, updateTransaction } from '../controllers/transaction.controller.js';

export const transactionRouter = Router();
transactionRouter.route('/').get(listTransactions).post(createTransaction);
transactionRouter.route('/:id').get(getTransaction).put(updateTransaction).delete(deleteTransaction);
