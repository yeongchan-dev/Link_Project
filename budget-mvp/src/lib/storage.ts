import type { Expense, DailyTotal } from '../types';

const EXPENSES_KEY = 'expenses-v1';

export function loadExpenses(): Expense[] {
  try {
    const stored = localStorage.getItem(EXPENSES_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load expenses:', error);
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses:', error);
    alert('Failed to save expense. Storage might be full.');
  }
}

export function addExpense(expense: Expense): void {
  const expenses = loadExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
}

export function getExpensesByDate(date: string): Expense[] {
  const expenses = loadExpenses();
  return expenses.filter(expense => expense.date === date);
}

export function getDailyTotals(year: number, month: number): DailyTotal[] {
  const expenses = loadExpenses();
  const totalsMap = new Map<string, DailyTotal>();

  // Get expenses for the specified month
  const targetMonth = `${year}-${month.toString().padStart(2, '0')}`;
  const monthExpenses = expenses.filter(expense =>
    expense.date.startsWith(targetMonth)
  );

  // Calculate daily totals
  monthExpenses.forEach(expense => {
    const existing = totalsMap.get(expense.date);
    if (existing) {
      existing.totalUSD += expense.amountUSD;
      existing.totalKRW += expense.amountKRW;
    } else {
      totalsMap.set(expense.date, {
        date: expense.date,
        totalUSD: expense.amountUSD,
        totalKRW: expense.amountKRW
      });
    }
  });

  return Array.from(totalsMap.values());
}

export function generateExpenseId(): string {
  return `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCurrency(amount: number, currency: 'USD' | 'KRW'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } else {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch {
    return dateStr;
  }
}