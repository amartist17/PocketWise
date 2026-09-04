export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food'
  | 'Shopping'
  | 'Travel'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Salary'
  | 'Freelance'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
