"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { label: "DASHBOARD", href: "/dashboard" },
  { label: "EXPENSES", href: "/dashboard/expenses" },
  { label: "REPORTS", href: "/dashboard/reports" },
  { label: "PROFILE", href: "/dashboard/profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-cyan-dim"
      style={{
        background: "rgba(5, 10, 14, 0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-electric/10 border border-cyan-electric/30 flex items-center justify-center group-hover:shadow-glow-cyan transition-all duration-300">
            <span className="text-cyan-electric font-orbitron text-xs font-bold">
              SS
            </span>
          </div>
          <span className="font-orbitron text-sm tracking-widest text-ghost-white hidden sm:block">
            SPEND<span className="text-cyan-electric">SENSE</span>
          </span>
        </Link>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative px-4 py-2 text-xs font-barlow font-semibold tracking-wider transition-all duration-300 ${
                  isActive
                    ? "text-cyan-electric"
                    : "text-silver-steel hover:text-ghost-white"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-electric"
                    style={{
                      boxShadow: "0 0 10px rgba(0, 245, 255, 0.5)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lime-acid animate-pulse" />
          <span className="text-xs font-barlow text-silver-steel hidden sm:block">
            SYSTEMS ONLINE
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
