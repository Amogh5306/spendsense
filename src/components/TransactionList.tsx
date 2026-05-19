"use client";

import { motion } from "framer-motion";
import { useExpenses } from "@/context/ExpenseContext";
import { CATEGORY_COLORS, Category } from "@/lib/types";

export default function TransactionList({ limit }: { limit?: number }) {
  const { expenses } = useExpenses();
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="glass-card p-6 scanline-overlay"
    >
      <h3 className="font-orbitron text-xs tracking-widest text-silver-steel mb-4">
        {limit ? "LATEST TRANSMISSIONS" : "ALL TRANSMISSIONS"}
      </h3>

      <div className="space-y-1">
        {displayExpenses.map((expense, i) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative flex items-center justify-between py-3 px-4 rounded-lg hover:bg-cyan-dim/30 transition-all duration-300 cursor-default"
          >
            {/* Cyan left border sweep on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-cyan-electric scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

            <div className="flex items-center gap-4">
              {/* Category dot */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: CATEGORY_COLORS[expense.category as Category],
                  boxShadow: `0 0 8px ${CATEGORY_COLORS[expense.category as Category]}80`,
                }}
              />
              <div>
                <p className="font-jetbrains text-sm text-ghost-white">
                  {expense.notes || expense.category}
                </p>
                <p className="text-xs font-barlow text-silver-steel mt-0.5">
                  {expense.category} · {expense.date}
                </p>
              </div>
            </div>

            <span className="font-jetbrains text-sm font-semibold glow-cyan">
              -₹{expense.amount.toLocaleString("en-IN")}
            </span>
          </motion.div>
        ))}

        {displayExpenses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🧑‍🚀</p>
            <p className="font-barlow text-silver-steel text-sm">
              No transactions detected in this orbit.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
