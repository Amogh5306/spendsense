"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  // Email Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Shared State
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { user, signIn, signUp, loading, resetPassword, signInWithGoogle } = useAuth();
  
  // If user is already logged in, push to dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSubmit = async () => {
    setError(null);
    setInfoMessage(null);
    setIsSubmitting(true);
    
    try {
      await signInWithGoogle();
      // Router push is handled by useEffect when 'user' changes
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      let errorMsg = "Google authentication failed.";
      if (err.code === "auth/popup-closed-by-user") {
        errorMsg = "Login window was closed before completion.";
      } else if (err.code) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      if (!email) {
        setError("Please provide your pilot ID (email) to reset password.");
        return;
      }
      setError(null);
      setInfoMessage(null);
      setIsSubmitting(true);
      try {
        await resetPassword(email);
        setInfoMessage("Reset instructions dispatched. Check your communication channels.");
        setIsForgotPassword(false);
        setIsSubmitting(false);
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        let errorMsg = "Password reset failed.";
        if (err.code === "auth/user-not-found") {
          errorMsg = "No pilot registered with this ID.";
        } else if (err.code === "auth/invalid-email") {
          errorMsg = "Invalid email format.";
        } else if (err.code) {
          errorMsg = err.message;
        }
        setError(errorMsg);
        setIsSubmitting(false);
      }
      return;
    }

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setError(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setInfoMessage("Security protocol initiated. Verification link sent to your email.");
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setIsSubmitting(false);
      } else {
        await signIn(email, password);
      }
      // Router push is handled by useEffect when 'user' changes
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      // Clean up firebase error messages
      let errorMsg = "Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        errorMsg = "Invalid pilot credentials. Access denied.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "This pilot is already registered.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Security protocol failure. Password must be at least 6 characters.";
      } else if (err.code === "auth/email-not-verified") {
        errorMsg = "Access restricted. Please verify your email via the link sent to your inbox.";
      } else if (err.code) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <BackgroundPaths>
        <div className="w-12 h-12 border-4 border-cyan-dim border-t-cyan-electric rounded-full animate-spin relative z-10" />
      </BackgroundPaths>
    );
  }

  return (
    <BackgroundPaths>
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
              <span className="text-cyan-electric">SENSE</span>
            </h1>
            <p className="font-barlow text-silver-steel text-base">
              {isForgotPassword ? "Reset your password" : "Sign in to your account"}
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {!isForgotPassword && !isSignUp && (
              <>
                <motion.button
                  type="button"
                  onClick={handleGoogleSubmit}
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02, backgroundColor: "#f3f4f6" } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className="w-full py-3.5 rounded-xl font-barlow text-[15px] font-semibold transition-all duration-300 flex items-center justify-center gap-3 bg-white text-gray-900 shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </motion.button>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="font-barlow text-sm text-white/40">or continue with email</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
              </>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-barlow text-ghost-white block mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-premium"
                  disabled={isSubmitting}
                />
              </div>

              {!isForgotPassword && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-barlow text-ghost-white block">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError(null);
                          setInfoMessage(null);
                        }}
                        className="text-sm font-barlow text-silver-steel hover:text-white transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-premium"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-400 font-barlow text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}

              {infoMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-green-400 font-barlow text-sm text-center bg-green-500/10 py-2 rounded-lg border border-green-500/20"
                >
                  {infoMessage}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                className="w-full py-3.5 rounded-xl font-barlow text-[16px] font-semibold transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isForgotPassword
                    ? "Send Reset Instructions"
                    : isSignUp
                    ? "Create Account"
                    : "Sign In"
                )}
              </motion.button>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 flex flex-col gap-3 text-center">
            {isForgotPassword ? (
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setError(null);
                  setInfoMessage(null);
                }}
                className="font-barlow text-sm text-silver-steel hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                Back to sign in
              </button>
            ) : (
              <p className="font-barlow text-sm text-silver-steel">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-white hover:underline transition-all"
                  disabled={isSubmitting}
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </BackgroundPaths>
  );
}
