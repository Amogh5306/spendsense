"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExpenses } from "@/context/ExpenseContext";
import { CATEGORIES, CATEGORY_COLORS, Category } from "@/lib/types";

export default function ExpenseForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const { addExpense } = useExpenses();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addExpense({
      amount: Number(amount),
      category,
      date,
      notes,
    });

    setAmount("");
    setNotes("");
    setIsOpen(false);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #10b981, #8b5cf6, #38bdf8)",
          boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
        }}
        aria-label="Add Expense"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Overlay + Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-white/5 overflow-y-auto"
              style={{ background: "rgba(11, 17, 32, 0.95)", backdropFilter: "blur(24px)" }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <h2 className="font-barlow text-lg font-semibold text-ghost-white">
                    Add Transaction
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-ghost-white hover:bg-white/5 transition-all"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="text-sm font-barlow font-medium text-slate-400 block mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-premium text-2xl font-semibold"
                      required
                    />
                  </div>

                  {/* Category pills */}
                  <div>
                    <label className="text-sm font-barlow font-medium text-slate-400 block mb-3">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const color = CATEGORY_COLORS[cat];
                        const isActive = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className="px-4 py-2 rounded-full text-sm font-barlow font-medium cursor-pointer transition-all duration-300 border"
                            style={{
                              borderColor: isActive ? color : "rgba(255, 255, 255, 0.1)",
                              background: isActive ? `${color}15` : "transparent",
                              color: isActive ? color : "#94a3b8",
                            }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm font-barlow font-medium text-slate-400 block mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-premium"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-barlow font-medium text-slate-400 block mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What was this for?"
                      rows={3}
                      className="input-premium resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 rounded-xl font-barlow text-[16px] font-semibold transition-all duration-300 mt-6 flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(180deg, #14b8a6 0%, #0f766e 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    Save Transaction
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
