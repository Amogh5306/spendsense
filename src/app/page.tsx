"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Starfield from "@/components/Starfield";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo mode — skip auth, go straight to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Starfield />

      {/* Diagonal grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(15deg, transparent, transparent 40px, rgba(0,245,255,0.15) 40px, rgba(0,245,255,0.15) 41px)",
        }}
      />

      {/* Floating login card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="glass-card p-10 animate-float-slow"
          style={{
            boxShadow:
              "0 20px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 245, 255, 0.1)",
          }}
        >
          {/* Wordmark */}
          <div className="text-center mb-10">
            <h1 className="font-orbitron text-4xl font-bold tracking-wider mb-2">
              <span className="text-ghost-white">SPEND</span>
              <span className="glow-cyan">SENSE</span>
            </h1>
            <p className="font-barlow text-silver-steel text-sm tracking-widest">
              MISSION CONTROL FOR YOUR FINANCES
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilot@spendsense.io"
                className="input-glow"
              />
            </div>

            <div>
              <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="input-glow"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold transition-all duration-300 mt-4"
              style={{
                background: "#FF6B2B",
                color: "#050A0E",
                boxShadow: "0 0 30px rgba(255, 107, 43, 0.4)",
              }}
            >
              {isSignUp ? "CREATE ACCOUNT" : "LAUNCH SESSION"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-barlow text-sm text-silver-steel hover:text-cyan-electric transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "New pilot? Create account"}
            </button>
          </div>

          {/* Demo note */}
          <div className="mt-6 pt-4 border-t border-cyan-dim text-center">
            <p className="font-barlow text-xs text-silver-steel/60">
              Demo mode — click launch to enter with sample data
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
