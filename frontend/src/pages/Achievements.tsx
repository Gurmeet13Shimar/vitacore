import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser, achievements } from "@/data/mockData";
import { Trophy, Star, Shield, Flame, Medal, Target, PiggyBank, Moon, Sun, Code, Wind, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Achievements() {
  const nextLevelXp = 5000;
  const progress = (mockUser.xp / nextLevelXp) * 100;

  // Map icon strings to Lucide elements safely
  const getBadgeIcon = (iconName: string, color: string) => {
    const props = { size: 24, color };
    switch (iconName) {
      case "Flame": return <Flame {...props} />;
      case "PiggyBank": return <PiggyBank {...props} />;
      case "Moon": return <Moon {...props} />;
      case "Sun": return <Sun {...props} />;
      case "Code": return <Code {...props} />;
      case "Wind": return <Wind {...props} />;
      case "TrendingUp": return <Trophy {...props} />;
      case "Droplets": return <Medal {...props} />;
      case "Medal": return <Medal {...props} />;
      case "Star": return <Star {...props} />;
      case "Award": return <Award {...props} />;
      case "Brain": return <Award {...props} />;
      default: return <Target {...props} />;
    }
  };

  return (
    <AppLayout>
      {/* ── Page Wrapper with Deep Purple background ── */}
      <div
        style={{
          minHeight: "100%",
          background: "#030712",
          padding: "36px 40px 60px",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Ambient glow orbs */}
        <div style={{ position: "absolute", top: "-10%", right: "5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "5%", width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
                Gamification Center
              </h1>
              <p style={{ color: "rgba(233,221,255,0.75)", marginTop: 6, fontSize: 15, fontWeight: 500 }}>
                Rewards for consistent systemic optimization.
              </p>
            </div>
            
            {/* trophy highlight */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Trophy size={24} color="#f5c518" />
            </div>
          </div>

          {/* Level Banner (3D Tilt Card) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            whileHover={{
              y: -8,
              scale: 1.02,
              rotateX: 4,
              rotateY: -4,
              boxShadow: "0 20px 40px rgba(107,92,231,0.2)",
              borderColor: "rgba(245,197,24,0.3)"
            }}
            style={{
              background: "rgba(16,12,38,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(245,197,24,0.2)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
              position: "relative",
              overflow: "hidden",
              marginBottom: 36,
              transformStyle: "preserve-3d",
              perspective: 1000,
              transition: "all 0.3s ease",
            }}
          >
            {/* Shield watermark translated in 3D */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 40,
                transform: "translateY(-50%) translateZ(10px)",
                opacity: 0.08,
                color: "#f5c518",
              }}
            >
              <Shield size={130} strokeWidth={1.5} />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 28, position: "relative", zIndex: 10, transform: "translateZ(30px)" }}>
              <div 
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #f5c518, #e91e8c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#fff",
                  boxShadow: "0 10px 24px rgba(245,197,24,0.35)",
                  flexShrink: 0,
                }}
              >
                {mockUser.level}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#f5c518", letterSpacing: "0.15em", textTransform: "uppercase" }}>Current Rank</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f0ecff", margin: "4px 0 16px" }}>{mockUser.levelName}</h2>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "rgba(196,181,253,0.55)" }}>
                  <span>{mockUser.xp.toLocaleString()} XP</span>
                  <span style={{ color: "rgba(196,181,253,0.4)" }}>Next: {nextLevelXp.toLocaleString()} XP</span>
                </div>
                
                {/* Level Progress Bar */}
                <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #f5c518, #e91e8c)",
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badges Grid (3D Tilts) */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              <Medal size={20} color="#f5c518" strokeWidth={2.5} /> Unlocked Badges
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 16 }}>
              {achievements.map((ach, i) => {
                const colorAccent = ach.unlocked ? "#8b5cf6" : "#94a3b8";
                const colorBg = ach.unlocked ? "rgba(139,92,246,0.1)" : "rgba(148,163,184,0.05)";
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 120 }}
                    whileHover={{
                      y: ach.unlocked ? -8 : -3,
                      scale: ach.unlocked ? 1.05 : 1.01,
                      rotateX: ach.unlocked ? 5 : 2,
                      rotateY: ach.unlocked ? -5 : -2,
                      boxShadow: ach.unlocked ? "0 12px 24px rgba(107,92,231,0.15)" : "none",
                      borderColor: ach.unlocked ? "rgba(139,92,246,0.25)" : "rgba(148,163,184,0.1)",
                    }}
                    key={ach.id}
                    style={{
                      background: ach.unlocked ? "rgba(16,12,38,0.85)" : "rgba(10,8,24,0.60)",
                      backdropFilter: "blur(14px)",
                      border: ach.unlocked ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(139,92,246,0.06)",
                      borderRadius: 20,
                      padding: 24,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 12,
                      opacity: ach.unlocked ? 1 : 0.5,
                      filter: ach.unlocked ? "none" : "grayscale(80%)",
                      cursor: "default",
                      transformStyle: "preserve-3d",
                      perspective: 1000,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div 
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: colorBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colorAccent,
                        boxShadow: ach.unlocked ? "0 6px 14px rgba(139,92,246,0.2)" : "none",
                        transform: "translateZ(15px)"
                      }}
                    >
                      {getBadgeIcon(ach.icon, colorAccent)}
                    </div>
                    <div style={{ transform: "translateZ(25px)" }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "#e2d9ff", lineHeight: 1.25 }}>{ach.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(196,181,253,0.5)", marginTop: 4, lineHeight: 1.35, fontWeight: 500, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ach.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}