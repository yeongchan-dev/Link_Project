export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD format
  amountUSD: number;
  amountKRW: number;
  category: string;
  memo?: string;
}

export type ExpenseCategory =
  | 'Food'
  | 'Clothing'
  | 'Transport'
  | 'Beauty'
  | 'Gifts'
  | 'Culture'
  | 'Other';

export interface DailyTotal {
  date: string;
  totalUSD: number;
  totalKRW: number;
}

export interface ExchangeRate {
  date: string;
  rate: number;
  isManual?: boolean;
}