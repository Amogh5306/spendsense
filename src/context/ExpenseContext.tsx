"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Expense, UserProfile } from "@/lib/types";

// Demo data for showcasing the UI without Firebase
const DEMO_EXPENSES: Expense[] = [
  { id: "1", amount: 250, category: "Food", date: "2026-05-19", notes: "Lunch at campus canteen", userId: "demo", createdAt: Date.now() - 86400000 * 0 },
  { id: "2", amount: 150, category: "Transport", date: "2026-05-18", notes: "Metro pass recharge", userId: "demo", createdAt: Date.now() - 86400000 * 1 },
  { id: "3", amount: 1200, category: "Academics", date: "2026-05-17", notes: "Reference textbook", userId: "demo", createdAt: Date.now() - 86400000 * 2 },
  { id: "4", amount: 500, category: "Entertainment", date: "2026-05-16", notes: "Movie night with friends", userId: "demo", createdAt: Date.now() - 86400000 * 3 },
  { id: "5", amount: 350, category: "Food", date: "2026-05-15", notes: "Dinner at Dominos", userId: "demo", createdAt: Date.now() - 86400000 * 4 },
  { id: "6", amount: 199, category: "Subscriptions", date: "2026-05-14", notes: "Spotify Premium", userId: "demo", createdAt: Date.now() - 86400000 * 5 },
  { id: "7", amount: 800, category: "Shopping", date: "2026-05-13", notes: "New earphones", userId: "demo", createdAt: Date.now() - 86400000 * 6 },
  { id: "8", amount: 120, category: "Transport", date: "2026-05-12", notes: "Auto to college", userId: "demo", createdAt: Date.now() - 86400000 * 7 },
  { id: "9", amount: 450, category: "Food", date: "2026-05-11", notes: "Weekly groceries", userId: "demo", createdAt: Date.now() - 86400000 * 8 },
  { id: "10", amount: 300, category: "Entertainment", date: "2026-05-10", notes: "Gaming subscription", userId: "demo", createdAt: Date.now() - 86400000 * 9 },
  { id: "11", amount: 680, category: "Academics", date: "2026-05-09", notes: "Online course - Udemy", userId: "demo", createdAt: Date.now() - 86400000 * 10 },
  { id: "12", amount: 90, category: "Miscellaneous", date: "2026-05-08", notes: "Phone cover", userId: "demo", createdAt: Date.now() - 86400000 * 11 },
  { id: "13", amount: 550, category: "Food", date: "2026-05-07", notes: "Birthday treat", userId: "demo", createdAt: Date.now() - 86400000 * 12 },
  { id: "14", amount: 200, category: "Transport", date: "2026-05-06", notes: "Uber ride", userId: "demo", createdAt: Date.now() - 86400000 * 13 },
  { id: "15", amount: 1500, category: "Shopping", date: "2026-05-05", notes: "New backpack", userId: "demo", createdAt: Date.now() - 86400000 * 14 },
];

interface ExpenseContextType {
  expenses: Expense[];
  profile: UserProfile;
  addExpense: (expense: Omit<Expense, "id" | "userId" | "createdAt">) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  totalSpent: number;
  budgetLeft: number;
  topCategory: string;
  avgDaily: number;
  categoryTotals: Record<string, number>;
  monthlyTotals: number[];
  trendData: number[];
}

const ExpenseContext = createContext<ExpenseContextType>({} as ExpenseContextType);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(DEMO_EXPENSES);
  const [profile, setProfile] = useState<UserProfile>({
    budget: 8000,
    displayName: "Amogh Dey",
  });

  const addExpense = useCallback(
    (expense: Omit<Expense, "id" | "userId" | "createdAt">) => {
      const newExpense: Expense = {
        ...expense,
        id: `exp-${Date.now()}`,
        userId: "demo",
        createdAt: Date.now(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateExpense = useCallback((id: string, data: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...data } : e))
    );
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  // Computed values
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetLeft = profile.budget - totalSpent;
  const avgDaily = Math.round(totalSpent / 30);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "None";

  // Monthly totals for bar chart (last 6 months)
  const monthlyTotals = [3200, 4100, 3800, 5200, 4600, totalSpent];

  // Trend data for line chart (last 14 days)
  const trendData = expenses
    .slice(0, 14)
    .reverse()
    .map((e) => e.amount);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        profile,
        addExpense,
        deleteExpense,
        updateExpense,
        updateProfile,
        totalSpent,
        budgetLeft,
        topCategory,
        avgDaily,
        categoryTotals,
        monthlyTotals,
        trendData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
