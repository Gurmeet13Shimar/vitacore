import React, { useState } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Beaker, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function Simulator() {
  const [params, setParams] = useState({
    study: 2,
    exercise: 3,
    savings: 30,
    sleep: 7,
    dining: 4,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchAiInsight = async () => {
    setIsAiLoading(true);
    try {
      const scenario = `If I study ${params.study} hours a day, exercise ${params.exercise} days a week, save ${params.savings}% of my income, sleep ${params.sleep} hours a night, and dine out ${params.dining} times a week.`;
      const response = await axios.post("http://localhost:5000/api/ai/simulate", { scenario });
      setAiInsight(response.data.analysis);
    } catch (error) {
      console.error("Error fetching AI insight:", error);
      setAiInsight("Failed to fetch AI insights. Please check if your backend is running.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Generate mock trajectory data based on params
  const generateData = () => {
    const data = [];
    let baseHealth = 70 + (params.exercise * 2) + ((params.sleep - 6) * 5) - (params.dining * 1);
    let baseFinance = 5000 + (params.savings * 100) - (params.dining * 200);
    let baseCareer = 60 + (params.study * 5) - (params.sleep < 6 ? 10 : 0);

    for(let i=0; i<6; i++) {
      data.push({
        month: `Month ${i+1}`,
        health: Math.min(100, Math.max(0, baseHealth + (i * (params.exercise * 0.5)))),
        finance: baseFinance + (i * params.savings * 50),
        career: Math.min(100, Math.max(0, baseCareer + (i * params.study))),
      });
    }
    return data;
  };

  const chartData = generateData();

  const handleSliderChange = (key: keyof typeof params, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <AppLayout>
      {/* ── Page Wrapper with Dark Background ── */}
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
        <div style={{ position: "absolute", top: "-10%", left: "5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "-5%", right: "5%", width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Subtle noise overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            opacity: 0.025,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 36, flexWrap: "wrap", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
                AI Simulation Engine
              </h1>
              <p style={{ color: "rgba(233,221,255,0.75)", marginTop: 6, fontSize: 15, fontWeight: 500 }}>
                Adjust parameters to predict future state trajectories.
              </p>
            </div>
            
            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {isSimulating ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#fff",
                    borderRadius: 99,
                    padding: "8px 18px",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 0 15px rgba(139,92,246,0.2)"
                  }}
                >
                  <div style={{ width: 8, height: 8, background: "#8b5cf6", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                  Processing
                </motion.div>
              ) : (
                <div 
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    borderRadius: 99,
                    padding: "8px 18px",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
                  Ready
                </div>
              )}
            </div>
          </div>

          {/* Main simulator grid */}
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
            
            {/* Controls panel */}
            <motion.div 
              whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
              style={{
                background: "rgba(16,12,38,0.82)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(139,92,246,0.14)",
                borderRadius: 22,
                padding: 28,
                boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 800, color: "#e2d9ff", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid rgba(139,92,246,0.1)", paddingBottom: 12 }}>
                Control Variables
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Study slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: "rgba(196,181,253,0.8)" }}>Study hours</span>
                    <span style={{ fontWeight: 800, color: "#e91e8c" }}>{params.study}h/day</span>
                  </div>
                  <input type="range" min="0" max="8" step="1" value={params.study} onChange={(e) => handleSliderChange('study', Number(e.target.value))} style={{ cursor: "pointer", accentColor: "#e91e8c" }} />
                </div>

                {/* Exercise slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: "rgba(196,181,253,0.8)" }}>Exercise days</span>
                    <span style={{ fontWeight: 800, color: "#8b5cf6" }}>{params.exercise}d/wk</span>
                  </div>
                  <input type="range" min="0" max="7" step="1" value={params.exercise} onChange={(e) => handleSliderChange('exercise', Number(e.target.value))} style={{ cursor: "pointer", accentColor: "#8b5cf6" }} />
                </div>

                {/* Savings slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: "rgba(196,181,253,0.8)" }}>Savings rate</span>
                    <span style={{ fontWeight: 800, color: "#3b82f6" }}>{params.savings}%</span>
                  </div>
                  <input type="range" min="0" max="80" step="5" value={params.savings} onChange={(e) => handleSliderChange('savings', Number(e.target.value))} style={{ cursor: "pointer", accentColor: "#3b82f6" }} />
                </div>

                {/* Sleep slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: "rgba(196,181,253,0.8)" }}>Sleep hours</span>
                    <span style={{ fontWeight: 800, color: "#22c55e" }}>{params.sleep}h/night</span>
                  </div>
                  <input type="range" min="4" max="10" step="0.5" value={params.sleep} onChange={(e) => handleSliderChange('sleep', Number(e.target.value))} style={{ cursor: "pointer", accentColor: "#22c55e" }} />
                </div>

                {/* Dining out slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: "rgba(196,181,253,0.8)" }}>Dining out</span>
                    <span style={{ fontWeight: 800, color: "#ef4444" }}>{params.dining} meals</span>
                  </div>
                  <input type="range" min="0" max="14" step="1" value={params.dining} onChange={(e) => handleSliderChange('dining', Number(e.target.value))} style={{ cursor: "pointer", accentColor: "#ef4444" }} />
                </div>
              </div>
            </motion.div>

            {/* Trajectory visualization area */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Trajectory chart */}
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
                style={{
                  background: "rgba(16,12,38,0.82)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(139,92,246,0.14)",
                  borderRadius: 22,
                  padding: 28,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#e2d9ff", margin: "0 0 24px", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={16} color="#8b5cf6" strokeWidth={2.5} /> Projected Vectors (6 Months)
                </h3>
                <div style={{ height: 260, width: "100%", position: "relative" }}>
                  {isSimulating && (
                    <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(16,12,38,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14 }}>
                      <div style={{ width: 32, height: 32, border: "4px solid rgba(139,92,246,0.3)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    </div>
                  )}
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="simHealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="simCareer" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e91e8c" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#e91e8c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,92,246,0.08)" />
                      <XAxis dataKey="month" stroke="rgba(196,181,253,0.4)" tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "bold" }} />
                      <YAxis stroke="rgba(196,181,253,0.4)" tickLine={false} axisLine={false} domain={[0, 100]} style={{ fontSize: "11px", fontWeight: "bold" }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: "rgba(10,8,28,0.95)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", color: "#fff" }} />
                      <Area type="monotone" dataKey="health" stroke="#8b5cf6" strokeWidth={3} fill="url(#simHealth)" name="Health Vector" />
                      <Area type="monotone" dataKey="career" stroke="#e91e8c" strokeWidth={3} fill="url(#simCareer)" name="Career Vector" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Projections outcome indicators */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {/* Health Trajectory */}
                <motion.div 
                  whileHover={{ y: -6, rotateX: 4, rotateY: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
                  style={{
                    background: "rgba(16,12,38,0.82)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(139,92,246,0.14)",
                    borderRadius: 20,
                    padding: 20,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#8b5cf6", letterSpacing: "0.08em", textTransform: "uppercase" }}>Health Trajectory</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#e2d9ff", marginTop: 8 }}>
                    {chartData[5].health > chartData[0].health ? 'Optimizing' : 'Degrading'}
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(196,181,253,0.5)", margin: "6px 0 0", fontWeight: 600 }}>
                    End score: {Math.round(chartData[5].health)}/100
                  </p>
                </motion.div>

                {/* Wealth Creation */}
                <motion.div 
                  whileHover={{ y: -6, rotateX: 4, rotateY: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
                  style={{
                    background: "rgba(16,12,38,0.82)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(139,92,246,0.14)",
                    borderRadius: 20,
                    padding: 20,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#3b82f6", letterSpacing: "0.08em", textTransform: "uppercase" }}>Wealth Creation</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#e2d9ff", marginTop: 8 }}>
                    ${Math.round(chartData[5].finance).toLocaleString()}
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(196,181,253,0.5)", margin: "6px 0 0", fontWeight: 600 }}>
                    Predicted net liquid capital
                  </p>
                </motion.div>

                {/* Career Velocity */}
                <motion.div 
                  whileHover={{ y: -6, rotateX: 4, rotateY: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
                  style={{
                    background: "rgba(16,12,38,0.82)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(139,92,246,0.14)",
                    borderRadius: 20,
                    padding: 20,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#e91e8c", letterSpacing: "0.08em", textTransform: "uppercase" }}>Career Velocity</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#e2d9ff", marginTop: 8 }}>
                    {chartData[5].career > 90 ? 'Promotion Ready' : 'Skill Deficit'}
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(196,181,253,0.5)", margin: "6px 0 0", fontWeight: 600 }}>
                    End score: {Math.round(chartData[5].career)}/100
                  </p>
                </motion.div>
              </div>

              {/* Neural analysis insights */}
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
                style={{
                  background: "rgba(16,12,38,0.82)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(139,92,246,0.14)",
                  borderRadius: 22,
                  padding: 28,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#e2d9ff", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8 }}>
                    <Zap size={16} color="#f5c518" strokeWidth={2.5} /> Neural Engine Analysis
                  </h3>
                  <button 
                    onClick={fetchAiInsight}
                    disabled={isAiLoading}
                    style={{
                      padding: "8px 18px",
                      background: "linear-gradient(135deg, #6b5ce7, #7c4ff0)",
                      border: "none",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 800,
                      borderRadius: 99,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(107,92,231,0.2)"
                    }}
                  >
                    {isAiLoading ? "Analyzing..." : "Generate AI Insight"}
                  </button>
                </div>
                
                {aiInsight && (
                  <div style={{ padding: 20, borderRadius: 16, background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.15)", fontSize: 13, color: "#e2d9ff", lineHeight: 1.7, fontWeight: 500, fontStyle: "italic" }}>
                    {aiInsight}
                  </div>
                )}
              </motion.div>

            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AppLayout>
  );
}