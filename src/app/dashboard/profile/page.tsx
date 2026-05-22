"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useExpenses } from "@/context/ExpenseContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { profile, updateProfile } = useExpenses();
  const { signOut } = useAuth();
  const router = useRouter();
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
      <h1 className="font-barlow text-2xl font-semibold tracking-wide text-ghost-white">
        Account <span className="text-teal-400">Profile</span>
      </h1>

      {/* Avatar section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 flex flex-col items-center"
      >
        {/* Avatar */}
        <div className="relative mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center font-barlow text-2xl font-bold text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #10b981, #8b5cf6, #38bdf8)",
            }}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        </div>

        <p className="font-barlow text-lg font-semibold text-ghost-white">{name}</p>
        <p className="font-barlow text-sm text-slate-400 mt-1">
          Premium Member
        </p>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 space-y-6"
      >
        <h3 className="font-barlow text-sm font-medium tracking-wide text-slate-400 border-b border-white/5 pb-2">
          Account Settings
        </h3>

        {/* Display name */}
        <div>
          <label className="text-sm font-barlow text-ghost-white block mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-premium"
          />
        </div>

        {/* Budget slider */}
        <div>
          <label className="text-sm font-barlow text-ghost-white block mb-2">
            Monthly Budget Goal
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-slate-800"
              style={{
                background: `linear-gradient(to right, #2dd4bf ${((budget - 1000) / 49000) * 100}%, rgba(255,255,255,0.05) ${((budget - 1000) / 49000) * 100}%)`,
              }}
            />
            <span className="font-barlow text-lg font-bold text-teal-400 w-28 text-right">
              ₹{budget.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-barlow text-[11px] text-slate-500">
              ₹1,000
            </span>
            <span className="font-barlow text-[11px] text-slate-500">
              ₹50,000
            </span>
          </div>
        </div>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 rounded-xl font-barlow text-[16px] font-semibold transition-all duration-300 mt-4 flex items-center justify-center gap-2"
          style={{
            background: saved ? "#10b981" : "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
            border: saved ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            boxShadow: saved ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          {saved ? "✓ Saved successfully" : "Save Changes"}
        </motion.button>
      </motion.div>

      {/* Disconnect button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-8"
      >
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="px-6 py-2.5 rounded-lg font-barlow text-sm font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          Sign Out
        </button>
      </motion.div>

    </div>
  );
}
