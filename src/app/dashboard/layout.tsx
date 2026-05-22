"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackgroundPaths } from "@/components/ui/background-paths";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/ExpenseForm";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <BackgroundPaths>
        <div className="w-12 h-12 border-4 border-white/10 border-t-teal-400 rounded-full animate-spin relative z-10" />
      </BackgroundPaths>
    );
  }

  return (
    <ExpenseProvider>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 pointer-events-none z-0">
          <BackgroundPaths />
        </div>

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
