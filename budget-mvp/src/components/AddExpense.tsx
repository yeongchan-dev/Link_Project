import { useState } from 'react';
import type { ExpenseCategory } from '../types';
import { addExpense, generateExpenseId } from '../lib/storage';
import { getRateForDate } from '../lib/exchange';

interface AddExpenseProps {
  onExpenseAdded?: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Clothing',
  'Transport',
  'Beauty',
  'Gifts',
  'Culture',
  'Other'
];

export default function AddExpense({ onExpenseAdded }: AddExpenseProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountUSD, setAmountUSD] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(amountUSD);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Get exchange rate for the selected date
      const exchangeRate = await getRateForDate(date);
      const amountKRW = amount * exchangeRate;

      // Create expense object
      const expense = {
        id: generateExpenseId(),
        date,
        amountUSD: amount,
        amountKRW,
        category,
        memo: memo.trim() || undefined
      };

      // Save to localStorage
      addExpense(expense);

      // Show success message
      setSuccessMessage(`Expense added! ${amount} USD = ${Math.round(amountKRW).toLocaleString()} KRW`);

      // Reset form
      setAmountUSD('');
      setCategory('Food');
      setMemo('');

      // Notify parent component
      if (onExpenseAdded) {
        onExpenseAdded();
      }

    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-expense">
      <h2>Add Expense</h2>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (USD):</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0.01"
            value={amountUSD}
            onChange={(e) => setAmountUSD(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            required
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="memo">Memo (Optional):</label>
          <textarea
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Add a note about this expense..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting || !amountUSD}
            className="submit-btn"
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>

      <div className="tips">
        <h3>Tips:</h3>
        <ul>
          <li>Exchange rates are fetched automatically for each day</li>
          <li>If the API is unavailable, you'll be prompted to enter a manual rate</li>
          <li>All expenses are saved locally in your browser</li>
        </ul>
      </div>
    </div>
  );
}