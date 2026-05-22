"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

interface SummaryCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  glowColor: string;
  icon: React.ReactNode;
  delay: number;
}

export default function SummaryCard({
  title,
  value,
  prefix = "₹",
  suffix = "",
  glowColor,
  icon,
  delay,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]"
        style={{
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-barlow font-medium text-slate-400">
              {title}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${glowColor}` }}
            >
              {icon}
            </div>
          </div>

          <div className="font-barlow text-3xl font-semibold text-ghost-white summary-value">
            <CountUp end={value} prefix={prefix} suffix={suffix} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
