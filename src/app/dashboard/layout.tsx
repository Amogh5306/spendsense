"use client";

import { ReactNode } from "react";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/ExpenseForm";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ExpenseProvider>
      <div className="relative min-h-screen">
        <Starfield />

        {/* Diagonal grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.02] z-[1]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(15deg, transparent, transparent 60px, rgba(0,245,255,0.12) 60px, rgba(0,245,255,0.12) 61px)",
          }}
        />

        <Navbar />

        <main className="relative z-10 pt-20 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <ExpenseForm />
      </div>
    </ExpenseProvider>
  );
}
