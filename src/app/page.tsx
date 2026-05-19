"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Starfield from "@/components/Starfield";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { user, signIn, signUp, loading } = useAuth();

  // If user is already logged in, push to dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      // Router push is handled by useEffect when 'user' changes
    } catch (err: any) {
      // Clean up firebase error messages
      let errorMsg = "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        errorMsg = "Invalid pilot credentials. Access denied.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "This pilot is already registered.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Security protocol failure. Password must be at least 6 characters.";
      } else if (err.code) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Starfield />
        <div className="w-12 h-12 border-4 border-cyan-dim border-t-cyan-electric rounded-full animate-spin relative z-10" />
      </div>
    );
  }

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
            <p className="font-barlow text-silver-steel text-sm tracking-widest uppercase">
              Enter clearance credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                PILOT ID (EMAIL)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilot@spendsense.io"
                className="input-glow"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                AUTHORIZATION CODE (PASSWORD)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="input-glow"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 font-barlow text-sm font-semibold tracking-wide text-center"
                style={{ textShadow: "0 0 10px rgba(255,60,60,0.4)" }}
              >
                ⚠ {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="w-full py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "#FF6B2B",
                color: "#050A0E",
                boxShadow: isSubmitting ? "none" : "0 0 30px rgba(255, 107, 43, 0.4)",
              }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-space-deep border-t-transparent rounded-full animate-spin" />
              ) : (
                isSignUp ? "INITIALIZE ACCOUNT" : "AUTHENTICATE"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="font-barlow text-sm text-silver-steel hover:text-cyan-electric transition-colors uppercase tracking-wider"
              disabled={isSubmitting}
            >
              {isSignUp
                ? "Return to authentication"
                : "Register new pilot"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
