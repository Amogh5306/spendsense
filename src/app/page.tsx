"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { useAuth } from "@/context/AuthContext";

const COUNTRY_CODES = [
  { code: "+1", label: "US/CA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+91", label: "IN (+91)" },
  { code: "+61", label: "AU (+61)" },
  { code: "+81", label: "JP (+81)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+33", label: "FR (+33)" },
  { code: "+971", label: "AE (+971)" },
];

export default function LoginPage() {
  // Email Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Phone Auth State
  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  // Shared State
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { user, signIn, signUp, loading, resetPassword, setUpRecaptcha, requestOTP, verifyOTP } = useAuth();
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // If user is already logged in, push to dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Set up Recaptcha once on mount
  useEffect(() => {
    if (!loading) {
      setUpRecaptcha("recaptcha-container");
    }
  }, [loading, setUpRecaptcha]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      if (!otpSent) {
        if (!phoneNumber) {
          setError("Please enter a valid comms frequency (phone number).");
          setIsSubmitting(false);
          return;
        }
        
        const fullNumber = `${countryCode}${phoneNumber}`;
        await requestOTP(fullNumber);
        
        setOtpSent(true);
        setInfoMessage("Transmission sent. Enter the 6-digit confirmation code.");
      } else {
        if (!otp || otp.length !== 6) {
          setError("Invalid code format. Expecting 6 digits.");
          setIsSubmitting(false);
          return;
        }
        
        await verifyOTP(otp);
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      let errorMsg = "Signal interference. Action failed.";
      if (err.code === "auth/invalid-phone-number") {
        errorMsg = "Invalid frequency format. Check your phone number.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Too many attempts. Comms locked temporarily.";
      } else if (err.code === "auth/invalid-verification-code") {
        errorMsg = "Incorrect authorization code.";
      } else if (err.code) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    }
    
    setIsSubmitting(false);
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
      {/* Invisible reCAPTCHA container required for Phone Auth */}
      <div id="recaptcha-container" ref={recaptchaContainerRef} className="hidden"></div>

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
              {loginMode === "phone" 
                ? (otpSent ? "Enter authorization code" : "Establish secure comms link") 
                : (isForgotPassword ? "Reset authorization code" : "Enter clearance credentials")}
            </p>
          </div>

          {/* Form Content */}
          {loginMode === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
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

              {!isForgotPassword && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block">
                      AUTHORIZATION CODE (PASSWORD)
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError(null);
                          setInfoMessage(null);
                        }}
                        className="text-[10px] font-barlow text-silver-steel hover:text-cyan-electric tracking-wider uppercase transition-colors"
                      >
                        Forgot code?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="input-glow"
                    disabled={isSubmitting}
                  />
                </div>
              )}

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

              {infoMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-lime-400 font-barlow text-sm font-semibold tracking-wide text-center"
                  style={{ textShadow: "0 0 10px rgba(184,255,0,0.4)" }}
                >
                  ✓ {infoMessage}
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
                  isForgotPassword
                    ? "RESET PASSWORD"
                    : isSignUp
                    ? "INITIALIZE ACCOUNT"
                    : "AUTHENTICATE"
                )}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              {!otpSent ? (
                <div>
                  <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block mb-2">
                    COMMS FREQUENCY (PHONE)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={isSubmitting}
                      className="input-glow w-1/3 appearance-none cursor-pointer bg-[#0A1622] text-silver-steel"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="1234567890"
                      className="input-glow w-2/3"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-barlow font-semibold tracking-widest text-silver-steel block">
                      TRANSMISSION CODE (OTP)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                        setError(null);
                        setInfoMessage(null);
                      }}
                      className="text-[10px] font-barlow text-silver-steel hover:text-cyan-electric tracking-wider uppercase transition-colors"
                    >
                      Change frequency?
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="input-glow text-center tracking-[0.5em] font-orbitron text-lg"
                    disabled={isSubmitting}
                  />
                </div>
              )}

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

              {infoMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-lime-400 font-barlow text-sm font-semibold tracking-wide text-center"
                  style={{ textShadow: "0 0 10px rgba(184,255,0,0.4)" }}
                >
                  ✓ {infoMessage}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-xl font-orbitron text-sm tracking-widest font-bold transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: "#00F5FF",
                  color: "#050A0E",
                  boxShadow: isSubmitting ? "none" : "0 0 30px rgba(0, 245, 255, 0.4)",
                }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-space-deep border-t-transparent rounded-full animate-spin" />
                ) : (
                  otpSent ? "VERIFY TRANSMISSION" : "REQUEST LINK"
                )}
              </motion.button>
            </form>
          )}

          {/* Bottom Switcher */}
          <div className="mt-6 flex flex-col gap-3 text-center">
            {loginMode === "email" ? (
              <>
                {isForgotPassword ? (
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="font-barlow text-sm text-silver-steel hover:text-cyan-electric transition-colors uppercase tracking-wider"
                    disabled={isSubmitting}
                  >
                    Return to authentication
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="font-barlow text-sm text-silver-steel hover:text-cyan-electric transition-colors uppercase tracking-wider"
                    disabled={isSubmitting}
                  >
                    {isSignUp ? "Return to authentication" : "Register new pilot"}
                  </button>
                )}
                
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="font-orbitron text-xs text-white/30 tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
                
                <button
                  onClick={() => {
                    setLoginMode("phone");
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="font-barlow text-sm text-cyan-electric/70 hover:text-cyan-electric transition-colors uppercase tracking-wider font-semibold"
                  disabled={isSubmitting}
                >
                  Use Subspace Comms (Phone Login)
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setLoginMode("email");
                  setOtpSent(false);
                  setOtp("");
                  setError(null);
                  setInfoMessage(null);
                }}
                className="font-barlow text-sm text-silver-steel hover:text-cyan-electric transition-colors uppercase tracking-wider"
                disabled={isSubmitting}
              >
                Return to Email Login
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </BackgroundPaths>
  );
}
