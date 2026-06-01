import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ParallaxScrollFeatureSection } from "@/components/ui/parallax-scroll-feature-section";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Briefcase, Zap, Shield, BarChart3 } from "lucide-react";

// VitaCore feature sections content
const vitacoreFeatures = [
  {
    id: 1,
    title: "Health Optimization",
    description:
      "Track your biometrics, sleep cycles, nutrition, and mental well-being with AI-powered insights. Your health digital twin continuously learns and adapts to help you achieve peak performance.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&fit=crop",
    reverse: false,
  },
  {
    id: 2,
    title: "Finance Intelligence",
    description:
      "Monitor cash flow, investments, and financial goals with predictive analytics. Simulate future financial scenarios and let AI surface opportunities you'd otherwise miss.",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80&fit=crop",
    reverse: true,
  },
  {
    id: 3,
    title: "Career Trajectory",
    description:
      "Map your skills, track learning velocity, and plot your promotion roadmap. VitaCore's career module aligns your daily work with your long-term professional goals.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop",
    reverse: false,
  },
];

// Stats banner data
const stats = [
  { label: "Life Vectors Tracked", value: "3", icon: <BarChart3 size={20} className="text-violet-400" /> },
  { label: "AI Insights Daily", value: "∞", icon: <Zap size={20} className="text-amber-400" /> },
  { label: "Privacy First", value: "100%", icon: <Shield size={20} className="text-emerald-400" /> },
  { label: "Uptime Guarantee", value: "99.9%", icon: <TrendingUp size={20} className="text-pink-400" /> },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { themeColors, theme } = useTheme();

  return (
    <div className="bg-[#08060f] text-white overflow-x-hidden">

      {/* ── Section 1: Hero ─────────────────────────────────────────── */}
      <HeroGeometric
        badge="Digital Twin Platform"
        title1="One Vision."
        title2="Two Worlds."
        subtitle="Where digital meets physical. Optimize your Health, Finance, and Career vectors through AI-powered analytics and real-time simulations."
        ctaLabel="Get Started"
        ctaSecondary="See How It Works"
        onCtaClick={() => navigate("/dashboard")}
        onSecondaryClick={() => navigate("/simulator")}
      />

      {/* ── Section 2: Stats Banner ─────────────────────────────────── */}
      <div className="relative z-10 border-y" style={{ background: themeColors.background, borderColor: themeColors.cardBorder }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{ background: `${themeColors.cardBg}`, borderColor: themeColors.cardBorder }}>
                {s.icon}
              </div>
              <span className="text-3xl font-black" style={{ color: themeColors.textWhite }}>{s.value}</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: themeColors.textMuted }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Dashboard Preview (Container Scroll) ─────────── */}
      <div className="relative" style={{ background: themeColors.background }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(ellipse, rgba(109,40,217,0.6) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <ContainerScroll
          titleComponent={
            <div className="mb-6">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{
                  background: "rgba(109,40,217,0.2)",
                  border: "1px solid rgba(139,92,246,0.35)",
                  color: "rgba(196,181,253,0.9)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Live Dashboard
              </motion.span>
              <h2
                className="text-4xl md:text-6xl font-black text-center leading-tight"
                style={{
                  background: "linear-gradient(135deg, #e9d5ff 0%, #a78bfa 50%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your Life, At A Glance
              </h2>
              <p className="mt-4 text-violet-300/60 text-lg text-center max-w-xl mx-auto">
                A unified command center for every dimension of your life — all updated in real time.
              </p>
            </div>
          }
        >
          {/* Dashboard Preview Image */}
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&fit=crop"
            alt="VitaCore Dashboard Preview"
            className="mx-auto rounded-2xl object-cover h-full w-full object-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* ── Section 4: Pillars (Parallax Feature Scroll) ────────────── */}
      <ParallaxScrollFeatureSection features={vitacoreFeatures} />

      {/* ── Section 5: Feature Pills ─────────────────────────────────── */}
      <div className="py-24 px-6 relative overflow-hidden" style={{ background: themeColors.background }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(109,40,217,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                background: "linear-gradient(135deg, #f9a8d4, #c084fc, #818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Everything You Need
            </h2>
            <p className="text-violet-300/50 text-lg max-w-xl mx-auto">
              Built for people who take their growth seriously.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart size={24} className="text-pink-400" />,
                title: "Health Module",
                desc: "Biometrics, sleep, nutrition, workouts, and mental health — tracked, visualized, and optimized.",
                color: "from-pink-500/10 to-rose-500/5",
                border: "border-pink-500/20",
              },
              {
                icon: <TrendingUp size={24} className="text-emerald-400" />,
                title: "Finance Module",
                desc: "Income, spending, investments, and savings goals — predict, simulate, and act with confidence.",
                color: "from-emerald-500/10 to-teal-500/5",
                border: "border-emerald-500/20",
              },
              {
                icon: <Briefcase size={24} className="text-violet-400" />,
                title: "Career Module",
                desc: "Skills matrix, study logs, milestones, and promotion roadmap — your career in hyperdrive.",
                color: "from-violet-500/10 to-indigo-500/5",
                border: "border-violet-500/20",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`p-7 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-sm`}
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 6: Final CTA ─────────────────────────────────────── */}
      <div className="bg-[#0d0a1e] border-t border-violet-500/10 py-28 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(109,40,217,0.18) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            style={{
              background: "linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Start Your Digital Twin
          </h2>
          <p className="text-violet-300/60 text-lg mb-10">
            Join thousands optimizing every dimension of their life with VitaCore.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard")}
              className="relative overflow-hidden font-bold rounded-xl px-10 py-4 text-base text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #4f46e5 100%)",
                border: "1px solid rgba(196,181,253,0.2)",
                boxShadow: "0 0 30px rgba(109,40,217,0.4), 0 4px 20px rgba(109,40,217,0.3)",
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
              />
              <span className="relative z-10">Launch Dashboard →</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/simulator")}
              className="font-semibold rounded-xl px-10 py-4 text-base cursor-pointer"
              style={{
                background: "rgba(139,92,246,0.08)",
                color: "rgba(196,181,253,0.9)",
                border: "1px solid rgba(139,92,246,0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              Try Simulator
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#08060f] border-t border-white/5 py-8 px-6 text-center">
        <p className="text-white/20 text-xs font-semibold tracking-widest uppercase">
          VitaCore Digital Twin OS — © 2026
        </p>
      </footer>
    </div>
  );
}
