"use client";

import { motion } from "framer-motion";
import { useExpenses } from "@/context/ExpenseContext";
import { CATEGORY_COLORS, Category } from "@/lib/types";
import CountUp from "@/components/CountUp";

export default function ReportsPage() {
  const { totalSpent, budgetLeft, avgDaily, profile, categoryTotals, expenses } =
    useExpenses();

  const budgetPercent = Math.min(
    100,
    Math.round((totalSpent / profile.budget) * 100)
  );

  const barColor =
    budgetPercent >= 90
      ? "#FF3C3C"
      : budgetPercent >= 75
      ? "#FF6B2B"
      : "#00F5FF";

  // Smart insights
  const topCatEntry = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];
  const recentAvg =
    expenses.slice(0, 7).reduce((s, e) => s + e.amount, 0) / 7;

  const insights = [
    {
      title: "HIGHEST SPENDING",
      text: topCatEntry
        ? `${topCatEntry[0]} accounts for ₹${topCatEntry[1].toLocaleString("en-IN")} — ${Math.round((topCatEntry[1] / totalSpent) * 100)}% of total spending.`
        : "No data yet.",
      color: "#FF6B2B",
    },
    {
      title: "7-DAY AVERAGE",
      text: `Your recent daily average is ₹${Math.round(recentAvg).toLocaleString("en-IN")}. ${recentAvg > avgDaily ? "This is above your monthly average — consider cutting back." : "You're spending below your monthly average. Great discipline!"}`,
      color: recentAvg > avgDaily ? "#FF6B2B" : "#B8FF00",
    },
    {
      title: "BUDGET STATUS",
      text:
        budgetPercent >= 90
          ? "Critical! You've used over 90% of your budget. Immediate action recommended."
          : budgetPercent >= 75
          ? "Caution — you're approaching your budget limit. Monitor closely."
          : "Systems nominal. Budget utilization is within safe parameters.",
      color: barColor,
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-orbitron text-xl tracking-wider text-ghost-white">
        MISSION <span className="text-cyan-electric">REPORT</span>
      </h1>

      {/* Monthly summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "TOTAL EXPENDITURE", value: totalSpent, color: "#00F5FF" },
          { label: "REMAINING BUDGET", value: Math.max(0, budgetLeft), color: "#B8FF00" },
          { label: "DAILY AVERAGE", value: avgDaily, color: "#8A9BB0" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="glass-card p-8 text-center"
          >
            <p className="font-barlow text-xs tracking-widest text-silver-steel mb-3">
              {item.label}
            </p>
            <p
              className="font-orbitron text-4xl font-bold"
              style={{
                color: item.color,
                textShadow: `0 0 20px ${item.color}60`,
              }}
            >
              <CountUp end={item.value} prefix="₹" />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Budget utilization bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-orbitron text-xs tracking-widest text-silver-steel">
            BUDGET UTILIZATION
          </h3>
          <span
            className="font-jetbrains text-sm font-bold"
            style={{ color: barColor, textShadow: `0 0 10px ${barColor}60` }}
          >
            {budgetPercent}%
          </span>
        </div>

        <div className="budget-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${budgetPercent}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
            className="budget-bar-fill"
            style={{
              background: `linear-gradient(90deg, ${barColor}CC, ${barColor})`,
              color: barColor,
              animation:
                budgetPercent >= 75 ? "pulseOrange 2s ease-in-out infinite" : undefined,
            }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span className="font-jetbrains text-xs text-silver-steel">
            ₹0
          </span>
          <span className="font-jetbrains text-xs text-silver-steel">
            ₹{profile.budget.toLocaleString("en-IN")}
          </span>
        </div>
      </motion.div>

      {/* Smart Insights */}
      <div>
        <h3 className="font-orbitron text-xs tracking-widest text-silver-steel mb-4">
          SIGNAL INTELLIGENCE
        </h3>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
              className="glass-card p-5 flex items-start gap-4 relative overflow-hidden"
            >
              {/* Pulsing left border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                style={{
                  background: insight.color,
                  boxShadow: `0 0 10px ${insight.color}60`,
                  animation: "pulseCyan 2s ease-in-out infinite",
                }}
              />

              <div className="pl-3">
                <p
                  className="font-orbitron text-xs tracking-widest font-bold mb-1"
                  style={{ color: insight.color }}
                >
                  {insight.title}
                </p>
                <p className="font-barlow text-sm text-silver-steel leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category breakdown table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="glass-card p-6"
      >
        <h3 className="font-orbitron text-xs tracking-widest text-silver-steel mb-4">
          CATEGORY ALLOCATION
        </h3>
        <div className="space-y-3">
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const pct = Math.round((amount / totalSpent) * 100);
              const color = CATEGORY_COLORS[cat as Category];
              return (
                <div key={cat} className="flex items-center gap-4">
                  <span
                    className="w-20 text-xs font-barlow font-semibold"
                    style={{ color }}
                  >
                    {cat}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-cyan-dim/30">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: color,
                        boxShadow: `0 0 8px ${color}60`,
                      }}
                    />
                  </div>
                  <span className="font-jetbrains text-xs text-silver-steel w-16 text-right">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
}
