"use client";

import SummaryCard from "@/components/SummaryCard";
import { PieChart, BarChart, LineChart } from "@/components/Charts";
import TransactionList from "@/components/TransactionList";
import { useExpenses } from "@/context/ExpenseContext";

export default function DashboardPage() {
  const { totalSpent, budgetLeft, avgDaily, profile } =
    useExpenses();

  const budgetPercent = Math.round((totalSpent / profile.budget) * 100);

  return (
    <div className="space-y-8">
      {/* Budget Warning Banner */}
      {budgetPercent >= 75 && (
        <div
          className="relative overflow-hidden rounded-xl border px-6 py-4 flex items-center gap-4 border-orange-500/30 bg-orange-500/10"
        >
          <div
            className="w-1 self-stretch rounded-full flex-shrink-0"
            style={{
              background: budgetPercent >= 90 ? "#ef4444" : "#f97316",
            }}
          />
          <div>
            <p
              className="font-barlow text-sm font-semibold"
              style={{ color: budgetPercent >= 90 ? "#ef4444" : "#f97316" }}
            >
              {budgetPercent >= 90 ? "⚠ Budget Exceeded" : "⚠ Budget Warning"}
            </p>
            <p className="font-barlow text-sm text-slate-400 mt-1">
              You have used {budgetPercent}% of your ₹
              {profile.budget.toLocaleString("en-IN")} monthly budget.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards - 2x2 floating grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Spent"
          value={totalSpent}
          glowColor="rgba(20, 184, 166, 0.1)"
          delay={0.1}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
          }
        />
        <SummaryCard
          title="Budget Left"
          value={Math.max(0, budgetLeft)}
          glowColor="rgba(16, 185, 129, 0.1)"
          delay={0.2}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          }
        />
        <SummaryCard
          title="Top Category"
          value={0}
          prefix=""
          suffix=""
          glowColor="rgba(244, 63, 94, 0.1)"
          delay={0.3}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
          }
        />
        <SummaryCard
          title="Daily Average"
          value={avgDaily}
          glowColor="rgba(148, 163, 184, 0.1)"
          delay={0.4}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          }
        />
      </div>

      {/* Override the top category card to show text instead of number */}
      <style jsx>{`
        .grid > div:nth-child(3) .summary-value {
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
