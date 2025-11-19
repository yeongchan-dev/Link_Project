import { useState } from 'react';
import Calendar from './components/Calendar';
import AddExpense from './components/AddExpense';
import './styles.css';

type Tab = 'calendar' | 'add-expense';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    // Trigger a refresh of the calendar data
    setRefreshKey(prev => prev + 1);
    // Switch back to calendar to see the new expense
    setActiveTab('calendar');
  };

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Budget Tracker</h1>
        <p>Track your spending in USD and KRW</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => handleTabClick('calendar')}
        >
          📅 Calendar
        </button>
        <button
          className={`tab-button ${activeTab === 'add-expense' ? 'active' : ''}`}
          onClick={() => handleTabClick('add-expense')}
        >
          ➕ Add Expense
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'calendar' ? (
          <Calendar key={refreshKey} />
        ) : (
          <AddExpense onExpenseAdded={handleExpenseAdded} />
        )}
      </main>

      <footer className="app-footer">
        <p>Budget Tracker MVP - Korean Students in the US</p>
      </footer>
    </div>
  );
}
