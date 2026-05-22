"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Expense, UserProfile } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  getDoc,
} from "firebase/firestore";

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
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType>({} as ExpenseContextType);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    budget: 8000,
    displayName: "Station Commander",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const profileRef = doc(db, "users", user.uid, "settings", "profile");
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        // First time user — create default profile
        const defaultProfile: UserProfile = {
          budget: 8000,
          displayName: user.displayName || user.email?.split("@")[0] || "Station Commander",
        };
        await setDoc(profileRef, defaultProfile);
        setProfile(defaultProfile);
      }
    };

    loadProfile();
  }, [user]);

  // Real-time listener for expenses from Firestore
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Expense[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Expense[];
        setExpenses(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        alert(`Database Sync Error: ${error.message}`);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addExpense = useCallback(
    async (expense: Omit<Expense, "id" | "userId" | "createdAt">) => {
      if (!user) return;
      try {
        await addDoc(collection(db, "users", user.uid, "expenses"), {
          ...expense,
          userId: user.uid,
          createdAt: Date.now(),
        });
      } catch (error: any) {
        console.error("Error adding expense:", error);
        alert(`Failed to save expense: ${error.message}`);
      }
    },
    [user]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!user) return;
      try {
        await deleteDoc(doc(db, "users", user.uid, "expenses", id));
      } catch (error: any) {
        console.error("Error deleting expense:", error);
        alert(`Failed to delete: ${error.message}`);
      }
    },
    [user]
  );

  const updateExpense = useCallback(
    async (id: string, data: Partial<Expense>) => {
      if (!user) return;
      await setDoc(doc(db, "users", user.uid, "expenses", id), data, { merge: true });
    },
    [user]
  );

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user) return;
      const profileRef = doc(db, "users", user.uid, "settings", "profile");
      await setDoc(profileRef, data, { merge: true });
      setProfile((prev) => ({ ...prev, ...data }));
    },
    [user]
  );

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

  // Monthly totals for bar chart (last 6 months simulated)
  const monthlyTotals = [0, 0, 0, 0, 0, totalSpent];

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
        isLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
