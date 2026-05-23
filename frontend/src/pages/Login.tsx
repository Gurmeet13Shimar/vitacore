import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Circle } from "lucide-react";
import { HeroGeometric } from "@/components/ui/hero-geometric";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.3 + custom * 0.12, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex relative overflow-hidden">

      {/* ── Left Panel: Hero with floating shapes ── */}
      <div className="hidden lg:flex flex-1 relative">
        <HeroGeometric
          badge="Digital Twin Platform"
          title1="The Cockpit For"
          title2="Your Life System."
          subtitle="Optimize your Health, Finance, and Career vectors through AI-powered analytics and real-time simulations."
          className="w-full"
        >
          {/* Status pills inside hero */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.10]">
              <Bot size={14} className="text-violet-400" />
              <span className="text-white/60 text-xs font-medium">Neural Engine Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.10]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white/60 text-xs font-medium">Systems Nominal</span>
            </div>
          </motion.div>
        </HeroGeometric>
      </div>

      {/* Right edge divider on desktop */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent z-20" />

      {/* ── Right Panel: Auth Form ── */}
      <div className="flex flex-1 items-center justify-center p-8 z-10 relative">
        {/* Background ambient orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-rose-500/8 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "rgba(14, 10, 36, 0.80)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(139, 92, 246, 0.20)",
            borderRadius: 28,
            padding: "40px 36px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Inner top gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent rounded-[28px] pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg, #7c3aed, #e91e8c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 15, color: "#fff",
              boxShadow: "0 6px 20px rgba(124,58,237,0.5)",
            }}>
              VC
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 17, color: "#f0ecff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>VitaCore</p>
              <p style={{ fontSize: 11, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>Digital Twin OS</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 relative z-10">
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f0ecff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              {isRegistering ? "Create Profile" : "Welcome Back"}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(196,181,253,0.5)", fontWeight: 500 }}>
              {isRegistering ? "Initialize your digital twin instance." : "Enter credentials to access the grid."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13, fontWeight: 500 }}>
                {error}
              </div>
            )}

            {isRegistering && (
              <div className="space-y-1.5">
                <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Subject Name
                </label>
                <Input
                  type="text" placeholder="John Doe" value={name}
                  onChange={(e) => setName(e.target.value)} required
                  style={{ height: 46, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12, color: "#f0ecff", fontWeight: 600 }}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Identity Identifier
              </label>
              <Input
                type="email" placeholder="name@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email" required
                style={{ height: 46, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12, color: "#f0ecff", fontWeight: 600 }}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Access Node
                </label>
                {!isRegistering && (
                  <a href="#" style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600 }} className="hover:text-violet-300 transition-colors">
                    Recover access
                  </a>
                )}
              </div>
              <Input
                type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password" required
                style={{ height: 46, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12, color: "#f0ecff", fontWeight: 600 }}
              />
            </div>

            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(124,58,237,0.5)" }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%", height: 50, marginTop: 8,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "#fff", border: "none", borderRadius: 14,
                fontWeight: 800, fontSize: 14, cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              data-testid="button-submit-login"
            >
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  PROCESSING...
                </>
              ) : (
                <>
                  <Zap size={15} fill="#f5c518" color="#f5c518" />
                  {isRegistering ? "INITIALIZE UPLINK" : "ESTABLISH UPLINK"}
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle register/login */}
          <div className="mt-6 text-center relative z-10" style={{ fontSize: 13, color: "rgba(196,181,253,0.45)" }}>
            {isRegistering ? "Already connected?" : "Don't have an access node?"}
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
              style={{ marginLeft: 6, fontWeight: 700, color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
              className="hover:text-violet-300 transition-colors"
            >
              {isRegistering ? "Sign In" : "Request Access"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}