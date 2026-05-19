"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useExpenses } from "@/context/ExpenseContext";

export default function ProfilePage() {
  const { profile, updateProfile } = useExpenses();
  const [budget, setBudget] = useState(profile.budget);
  const [name, setName] = useState(profile.displayName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ budget, displayName: name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-orbitron text-xl tracking-wider text-ghost-white">
        PILOT <span className="text-cyan-electric">PROFILE</span>
      </h1>

      {/* Avatar section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 flex flex-col items-center"
      >
        {/* Avatar with orbital ring */}
        <div className="relative mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center font-orbitron text-2xl font-bold text-space-deep"
            style={{
              background: "linear-gradient(135deg, #00F5FF, #00C4CC)",
              boxShadow: "0 0 30px rgba(0, 245, 255, 0.3)",
            }}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          {/* Orbital ring */}
          <div
            className="absolute -inset-3 rounded-full border-2 border-dashed animate-spin"
            style={{
              borderColor: "rgba(0, 245, 255, 0.2)",
              animationDuration: "12s",
            }}
          />
          {/* Orbiting dot */}
          <div
            className="absolute -inset-3 rounded-full animate-spin"
            style={{ animationDuration: "4s" }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-electric"
              style={{ boxShadow: "0 0 8px rgba(0, 245, 255, 0.6)" }}
            />
          </div>
        </div>

        <p className="font-orbitron text-lg text-ghost-white">{name}</p>
        <p className="font-barlow text-xs text-silver-steel tracking-widest mt-1">
          STATION COMMANDER
        </p>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 space-y-6"
      >
        <h3 className="font-orbitron text-xs tracking-widest text-silver-steel">
          COCKPIT SETTINGS
        </h3>

        {/* Display name */}
        <div>
          <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
            DISPLAY NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-glow"
          />
        </div>

        {/* Budget slider */}
        <div>
          <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
            MONTHLY BUDGET
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00F5FF ${((budget - 1000) / 49000) * 100}%, rgba(138,155,176,0.2) ${((budget - 1000) / 49000) * 100}%)`,
              }}
            />
            <span className="font-jetbrains text-lg font-bold glow-cyan w-28 text-right">
              ₹{budget.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-jetbrains text-[10px] text-silver-steel">
              ₹1,000
            </span>
            <span className="font-jetbrains text-[10px] text-silver-steel">
              ₹50,000
            </span>
          </div>
        </div>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold transition-all duration-300"
          style={{
            background: saved ? "#B8FF00" : "#00F5FF",
            color: "#050A0E",
            boxShadow: saved
              ? "0 0 30px rgba(184, 255, 0, 0.4)"
              : "0 0 30px rgba(0, 245, 255, 0.3)",
          }}
        >
          {saved ? "✓ SAVED" : "SAVE CONFIGURATION"}
        </motion.button>
      </motion.div>

    </div>
  );
}
