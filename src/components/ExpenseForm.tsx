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
        className="fab-pulse"
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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-cyan-dim overflow-y-auto"
              style={{ background: "rgba(5, 10, 14, 0.95)", backdropFilter: "blur(20px)" }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-orbitron text-lg tracking-wider text-cyan-electric">
                    NEW EXPENSE
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg border border-cyan-dim flex items-center justify-center text-silver-steel hover:text-ghost-white hover:border-cyan-electric/40 transition-all"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                      AMOUNT (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-glow text-2xl font-jetbrains glow-cyan"
                      required
                    />
                  </div>

                  {/* Category pills */}
                  <div>
                    <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-3">
                      CATEGORY
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
                            className="cat-pill"
                            style={{
                              borderColor: isActive ? color : "rgba(138, 155, 176, 0.2)",
                              background: isActive ? `${color}20` : "transparent",
                              color: isActive ? color : "#8A9BB0",
                              boxShadow: isActive ? `0 0 15px ${color}40` : "none",
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
                    <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                      DATE
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-glow font-jetbrains"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                      NOTES
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What was this expense for?"
                      rows={3}
                      className="input-glow resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold text-space-deep transition-all duration-300"
                    style={{
                      background: "#00F5FF",
                      boxShadow: "0 0 30px rgba(0, 245, 255, 0.3)",
                    }}
                  >
                    🚀 LAUNCH EXPENSE
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
