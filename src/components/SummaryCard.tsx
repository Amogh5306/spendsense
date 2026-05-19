"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

interface SummaryCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  glowColor: string;
  borderColor: string;
  icon: React.ReactNode;
  delay: number;
}

export default function SummaryCard({
  title,
  value,
  prefix = "₹",
  suffix = "",
  glowColor,
  borderColor,
  icon,
  delay,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="tilt-card"
      style={{ perspective: "1000px" }}
    >
      <div
        className="glass-card p-6 animate-float-slow"
        style={{
          animationDelay: `${delay * 2}s`,
          borderColor,
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 25px ${glowColor}`,
        }}
      >
        {/* Scanline overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)",
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-barlow font-semibold tracking-widest text-silver-steel uppercase">
              {title}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${glowColor}` }}
            >
              {icon}
            </div>
          </div>

          <div className="font-jetbrains text-3xl font-bold glow-cyan">
            <CountUp end={value} prefix={prefix} suffix={suffix} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
