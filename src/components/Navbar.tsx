"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Expenses", href: "/dashboard/expenses" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
      style={{
        background: "rgba(11, 17, 32, 0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center transition-all duration-300">
            <span className="text-teal-400 font-orbitron text-xs font-bold">
              SS
            </span>
          </div>
          <span className="font-orbitron text-sm tracking-widest text-ghost-white hidden sm:block">
            SPEND<span className="text-teal-400">SENSE</span>
          </span>
        </Link>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative px-4 py-2 text-sm font-barlow font-medium transition-all duration-300 rounded-full ${
                  isActive
                    ? "text-teal-400 bg-teal-500/10"
                    : "text-slate-400 hover:text-ghost-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="text-xs font-barlow font-medium text-slate-300 hidden sm:block">
            Connected
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
