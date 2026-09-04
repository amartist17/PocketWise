import { model, Schema } from 'mongoose';

export const categories = ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Other'] as const;

const transactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, enum: categories, required: true },
    description: { type: String, required: true, trim: true, maxlength: 80 },
    date: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

transactionSchema.index({ userId: 1, date: -1 });

export const TransactionModel = model('Transaction', transactionSchema);
