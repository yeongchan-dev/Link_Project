# SPEC.md

## Project Overview
This project is a **budget tracking app for Korean international students in the U.S.**
Many students studying abroad struggle to understand how much they actually spend in won terms because they pay in dollars.
Our app automatically converts each spending entry into both **USD and KRW** using the **average exchange rate of the day**, helping users visualize their actual daily and monthly consumption in both currencies.

---

## Main Concept
The app provides a simple and intuitive way to record expenses, view daily summaries, and check overall spending patterns.
It focuses on **daily awareness**, not complex asset management — a practical companion for Korean students living on allowances or part-time income in the U.S.

---

## Core Features
### 📆 Daily Expense Calendar
- The main screen displays a **calendar view**.
- Each date shows **how much money was spent that day** (in USD and the KRW equivalent).
- Users can tap on a specific date to view detailed spending records.

### ✍️ Expense Input Screen
- A separate screen allows users to **add spending manually**.
- Input fields:
  - Amount (in USD)
  - Category (Food, Clothing, Transportation, Beauty, Gifts, Culture/Leisure, Other)
  - Optional note or memo
- The app automatically converts the USD amount to KRW based on that day's exchange rate.

### 💰 Income Tracking
- Users can record sources of income, such as **allowance** or **part-time wages**.
- Displays total income for the month to help track savings potential.

### 📊 Summary & Analytics
- Monthly summary page with:
  - Total expenses (USD / KRW)
  - Category breakdown (pie chart)
  - Highest spending day
  - Spending trend over time

### 💵 Exchange Rate Integration
- Automatically fetches the **mid-market exchange rate** once per day.
- Ensures all conversions reflect realistic values close to actual spending.

### 🍽 Tip Calculator (Future Feature)
- Helps students calculate tips in restaurants, showing total price in both USD and KRW.

---

## Future Improvements
- Add **budget goal setting** (e.g., limit spending per week or month).
- Support **multiple currencies** (e.g., JPY, CAD).
- Show **state-based average living costs** for comparison between students in different regions.
- Provide **data export** (CSV / Excel) for finance tracking.

---

## Tech Stack (Proposed)
- **Frontend:** Flutter (cross-platform mobile) or React Native
- **Backend:** FastAPI (Python)
- **Database:** SQLite (local) or Firebase for sync
- **Exchange Rate API:** exchangerate.host or Open Exchange Rates

---

## App Flow (Simplified)
1. User opens the app → Calendar view displays total spending per day.
2. Click on a date → Detailed spending list appears.
3. Add a new expense → Input amount (USD) → App auto-calculates KRW.
4. Monthly view → Shows charts, totals, and insights.

---

## Target Users
- Korean students studying in the U.S.
- People who receive allowances or part-time income in USD but think in KRW.
- Anyone who wants a simple dual-currency daily expense tracker.

---

## Project Goal
To help Korean international students **understand their true spending** by showing all expenses in both USD and KRW,
making it easier to budget, save, and plan for life abroad.

---