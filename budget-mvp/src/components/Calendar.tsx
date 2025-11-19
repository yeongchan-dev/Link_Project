import { useState, useEffect } from 'react';
import type { Expense } from '../types';
import { getDailyTotals, getExpensesByDate, formatCurrency } from '../lib/storage';

interface CalendarProps {
  onDateClick?: (date: string, expenses: Expense[]) => void;
}

export default function Calendar({ onDateClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyTotals, setDailyTotals] = useState<ReturnType<typeof getDailyTotals>>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    const totals = getDailyTotals(year, month);
    setDailyTotals(totals);
  }, [year, month]);

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDayTotal = (day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return dailyTotals.find(total => total.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const expenses = getExpensesByDate(dateStr);

    setSelectedDate(dateStr);
    setSelectedExpenses(expenses);

    if (onDateClick) {
      onDateClick(dateStr, expenses);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedExpenses([]);
  };

  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth('prev')}>&lt;</button>
        <h2>{monthName}</h2>
        <button onClick={() => navigateMonth('next')}>&gt;</button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="calendar-day empty"></div>;
          }

          const total = getDayTotal(day);
          const isToday = new Date().toDateString() === new Date(year, month - 1, day).toDateString();

          return (
            <div
              key={day}
              className={`calendar-day ${total ? 'has-expenses' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="day-number">{day}</div>
              {total && (
                <div className="day-total">
                  <div className="usd">{formatCurrency(total.totalUSD, 'USD')}</div>
                  <div className="krw">{formatCurrency(total.totalKRW, 'KRW')}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="expense-details">
          <h3>Expenses for {new Date(selectedDate).toLocaleDateString()}</h3>
          {selectedExpenses.length === 0 ? (
            <p>No expenses recorded for this date.</p>
          ) : (
            <div className="expense-list">
              {selectedExpenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-category">{expense.category}</div>
                  <div className="expense-amounts">
                    <span className="usd">{formatCurrency(expense.amountUSD, 'USD')}</span>
                    <span className="krw">{formatCurrency(expense.amountKRW, 'KRW')}</span>
                  </div>
                  {expense.memo && <div className="expense-memo">{expense.memo}</div>}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setSelectedDate(null)} className="close-btn">Close</button>
        </div>
      )}
    </div>
  );
}