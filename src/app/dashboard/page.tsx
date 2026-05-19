"use client";

import SummaryCard from "@/components/SummaryCard";
import { PieChart, BarChart, LineChart } from "@/components/Charts";
import TransactionList from "@/components/TransactionList";
import { useExpenses } from "@/context/ExpenseContext";

export default function DashboardPage() {
  const { totalSpent, budgetLeft, topCategory, avgDaily, profile } =
    useExpenses();

  const budgetPercent = Math.round((totalSpent / profile.budget) * 100);

  return (
    <div className="space-y-8">
      {/* Budget Warning Banner */}
      {budgetPercent >= 75 && (
        <div
          className="relative overflow-hidden rounded-xl border px-6 py-4 flex items-center gap-4"
          style={{
            borderColor:
              budgetPercent >= 90
                ? "rgba(255, 60, 60, 0.5)"
                : "rgba(255, 107, 43, 0.5)",
            background:
              budgetPercent >= 90
                ? "rgba(255, 60, 60, 0.08)"
                : "rgba(255, 107, 43, 0.08)",
          }}
        >
          {/* Scanline sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-y-0 w-[200px] animate-scanline"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,107,43,0.1), transparent)",
              }}
            />
          </div>

          <div
            className="w-1 self-stretch rounded-full flex-shrink-0"
            style={{
              background: budgetPercent >= 90 ? "#FF3C3C" : "#FF6B2B",
            }}
          />
          <div>
            <p
              className="font-orbitron text-xs tracking-widest font-bold"
              style={{ color: budgetPercent >= 90 ? "#FF3C3C" : "#FF6B2B" }}
            >
              {budgetPercent >= 90 ? "⚠ BUDGET EXCEEDED" : "⚠ BUDGET WARNING"}
            </p>
            <p className="font-barlow text-sm text-silver-steel mt-1">
              You have used {budgetPercent}% of your ₹
              {profile.budget.toLocaleString("en-IN")} monthly budget.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards - 2x2 floating grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="TOTAL SPENT"
          value={totalSpent}
          glowColor="rgba(0, 245, 255, 0.15)"
          borderColor="rgba(0, 245, 255, 0.3)"
          delay={0.1}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00F5FF" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
          }
        />
        <SummaryCard
          title="BUDGET LEFT"
          value={Math.max(0, budgetLeft)}
          glowColor="rgba(184, 255, 0, 0.15)"
          borderColor="rgba(184, 255, 0, 0.3)"
          delay={0.2}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8FF00" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          }
        />
        <SummaryCard
          title="TOP CATEGORY"
          value={0}
          prefix=""
          suffix=""
          glowColor="rgba(255, 107, 43, 0.15)"
          borderColor="rgba(255, 107, 43, 0.3)"
          delay={0.3}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
          }
        />
        <SummaryCard
          title="AVG DAILY"
          value={avgDaily}
          glowColor="rgba(0, 245, 255, 0.15)"
          borderColor="rgba(138, 155, 176, 0.3)"
          delay={0.4}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A9BB0" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          }
        />
      </div>

      {/* Override the top category card to show text instead of number */}
      <style jsx>{`
        .grid > div:nth-child(3) .glow-cyan {
          font-size: 1.5rem;
        }
      `}</style>

      {/* Charts Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PieChart />
        <BarChart />
        <LineChart />
      </div>

      {/* Latest Transactions */}
      <TransactionList limit={5} />
    </div>
  );
}
