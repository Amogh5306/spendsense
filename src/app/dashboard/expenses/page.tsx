"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useExpenses } from "@/context/ExpenseContext";
import { CATEGORY_COLORS, Category } from "@/lib/types";

export default function ExpensesPage() {
  const { expenses, deleteExpense } = useExpenses();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = expenses
    .filter(
      (e) =>
        e.notes.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "amount") return (a.amount - b.amount) * dir;
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (col: "date" | "amount") => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-orbitron text-xl tracking-wider text-ghost-white">
          EXPENSE <span className="text-cyan-electric">LOG</span>
        </h1>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search transmissions..."
          className="input-glow pl-10 w-full"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-steel"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-cyan-dim text-xs font-barlow font-semibold tracking-widest text-silver-steel">
          <div className="col-span-1">#</div>
          <div
            className="col-span-3 cursor-pointer hover:text-cyan-electric transition-colors flex items-center gap-1"
            onClick={() => toggleSort("date")}
          >
            DATE {sortBy === "date" && (sortDir === "asc" ? "↑" : "↓")}
          </div>
          <div className="col-span-2">CATEGORY</div>
          <div className="col-span-3">NOTES</div>
          <div
            className="col-span-2 text-right cursor-pointer hover:text-cyan-electric transition-colors flex items-center justify-end gap-1"
            onClick={() => toggleSort("amount")}
          >
            AMOUNT {sortBy === "amount" && (sortDir === "asc" ? "↑" : "↓")}
          </div>
          <div className="col-span-1 text-right">ACT</div>
        </div>

        {/* Rows */}
        {paged.map((expense, i) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group relative grid grid-cols-12 gap-4 px-6 py-4 border-b border-cyan-dim/30 hover:bg-cyan-dim/20 transition-all duration-300"
          >
            {/* Left border sweep */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-cyan-electric scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

            <div className="col-span-1 font-jetbrains text-xs text-silver-steel">
              {(page - 1) * perPage + i + 1}
            </div>
            <div className="col-span-3 font-jetbrains text-sm text-ghost-white">
              {expense.date}
            </div>
            <div className="col-span-2">
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs font-barlow font-semibold"
                style={{
                  color: CATEGORY_COLORS[expense.category as Category],
                  background: `${CATEGORY_COLORS[expense.category as Category]}20`,
                  border: `1px solid ${CATEGORY_COLORS[expense.category as Category]}40`,
                }}
              >
                {expense.category}
              </span>
            </div>
            <div className="col-span-3 font-barlow text-sm text-silver-steel truncate">
              {expense.notes}
            </div>
            <div className="col-span-2 text-right font-jetbrains text-sm font-semibold glow-cyan">
              ₹{expense.amount.toLocaleString("en-IN")}
            </div>
            <div className="col-span-1 text-right">
              <button
                onClick={() => deleteExpense(expense.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 hover:text-red-300"
                style={{ textShadow: "0 0 10px rgba(255,60,60,0.5)" }}
                title="Delete"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}

        {paged.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🧑‍🚀</p>
            <p className="font-barlow text-silver-steel text-sm">
              No transactions detected in this orbit.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                page === i + 1
                  ? "bg-cyan-electric shadow-glow-cyan scale-125"
                  : "bg-silver-steel/30 hover:bg-silver-steel/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
