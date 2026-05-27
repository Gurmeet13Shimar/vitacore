import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Activity, Droplets, Moon, Zap, Flame, Plus } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Health() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    workoutMinutes: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    sleepHours: 0,
    waterGlasses: 0,
    mood: "Good"
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/health");
      if (Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        console.error("Backend returned non-array data:", res.data);
        setLogs([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/health", formData);
      localStorage.setItem(
        "sleepHours",
        formData.sleepHours.toString()
      );

      localStorage.setItem(
        "waterGlasses",
        formData.waterGlasses.toString()
      );

      localStorage.setItem(
        "caloriesConsumed",
        formData.caloriesConsumed.toString()
      );

      localStorage.setItem(
        "workoutMinutes",
        formData.workoutMinutes.toString()
      );

      localStorage.setItem(
        "mood",
        formData.mood
      );
      fetchLogs(); // Refresh data
      setFormData({ workoutMinutes: 0, caloriesBurned: 0, caloriesConsumed: 0, sleepHours: 0, waterGlasses: 0, mood: "Good" });
    } catch (error) {
      console.error(error);
    }
  };

  // Derive stats from logs safely
  const safeLogs = Array.isArray(logs) ? logs : [];
  const latestLog: any = safeLogs[0] || { caloriesConsumed: 0, sleepHours: 0, waterGlasses: 0 };
  const calories = latestLog.caloriesConsumed || 0;
  const sleep = latestLog.sleepHours || 0;
  const water = latestLog.waterGlasses || 0;
  const score = safeLogs.length > 0 ? 85 + Math.min(10, safeLogs.length) : 0;

  const sleepData = safeLogs.slice(0, 7).reverse().map((l: any, i: number) => ({
    day: `Day ${i + 1}`,
    hours: l.sleepHours || 0
  }));

  if (sleepData.length === 0) {
    for (let i = 0; i < 7; i++) sleepData.push({ day: `Day ${i + 1}`, hours: 0 });
  }

  const COLORS = ['#8b5cf6', '#e2e8f0'];
  const calData = [
    { name: 'Consumed', value: calories },
    { name: 'Remaining', value: Math.max(0, 3000 - calories) }
  ];

  return (
    <AppLayout>
      {/* ── Page Wrapper with Ambient Deep-Purple Background ── */}
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

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
                Health Module
              </h1>
              <p style={{ color: "rgba(233,221,255,0.75)", marginTop: 6, fontSize: 15, fontWeight: 500 }}>
                Biometric telemetry and physical optimization.
              </p>
            </div>

            {/* Health Score Shield */}
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20,
                padding: "12px 24px",
                textAlign: "right",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#f5c518", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>
                Health Score
              </div>
            </div>
          </div>

          {/* Top 4 Stats (3D Tilts) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 24,
            }}
          >
            {[
              { label: "Calories", value: calories, unit: "kcal", icon: Flame, color: "#ea580c", bgColor: "rgba(234,88,12,0.1)" },
              { label: "Sleep", value: sleep, unit: "hrs", icon: Moon, color: "#6366f1", bgColor: "rgba(99,102,241,0.1)" },
              { label: "Hydration", value: water, unit: "glasses", icon: Droplets, color: "#3b82f6", bgColor: "rgba(59,130,246,0.1)" },
              { label: "Logs", value: safeLogs.length, unit: "total", icon: Activity, color: "#8b5cf6", bgColor: "rgba(139,92,246,0.1)" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  rotateX: 4,
                  rotateY: -4,
                  boxShadow: "0 16px 32px rgba(107,92,231,0.15)",
                  borderColor: "rgba(107,92,231,0.15)",
                }}
                style={{
                  background: "rgba(16,12,38,0.82)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(139,92,246,0.14)",
                  borderRadius: 22,
                  padding: "24px 28px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    background: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: "translateZ(15px)"
                  }}
                >
                  <stat.icon size={22} color={stat.color} strokeWidth={2.5} />
                </div>
                <div style={{ transform: "translateZ(25px)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>
                    {stat.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: "#e2d9ff" }}>{stat.value}</span>
                    <span style={{ fontSize: 13, color: "rgba(196,181,253,0.45)", fontWeight: 600 }}>{stat.unit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
            {/* Metabolic Load Pie */}
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
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", margin: 0, width: "100%", textAlign: "left", marginBottom: 20 }}>
                Metabolic Load
              </h3>
              <div style={{ height: 200, width: "100%", position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={calData} innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                      {calData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#e2d9ff", lineHeight: 1 }}>{calories}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(196,181,253,0.45)", textTransform: "uppercase", marginTop: 4 }}>/ 3000 kcal</div>
                </div>
              </div>
            </motion.div>

            {/* Sleep Area Chart */}
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
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", margin: "0 0 20px" }}>
                Sleep Architecture (Last 7 Logs)
              </h3>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,92,246,0.08)" />
                    <XAxis dataKey="day" stroke="rgba(196,181,253,0.4)" tickLine={false} axisLine={false} style={{ fontSize: "11px", fontWeight: "bold" }} />
                    <YAxis stroke="rgba(196,181,253,0.4)" tickLine={false} axisLine={false} domain={[0, 12]} style={{ fontSize: "11px", fontWeight: "bold" }} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(10,8,28,0.95)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", color: "#e2d9ff" }} />
                    <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3.5} fillOpacity={1} fill="url(#colorSleep)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Forms Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20 }}>
            {/* Form */}
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
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#e2d9ff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={18} color="#8b5cf6" strokeWidth={3} /> Log Today's Data
              </h3>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>Calories Consumed</label>
                    <Input type="number" value={formData.caloriesConsumed} onChange={e => setFormData({ ...formData, caloriesConsumed: Number(e.target.value) })} style={{ height: 42, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, color: "#e2d9ff", fontWeight: 600 }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>Sleep Hours</label>
                    <Input type="number" step="0.5" value={formData.sleepHours} onChange={e => setFormData({ ...formData, sleepHours: Number(e.target.value) })} style={{ height: 42, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, color: "#e2d9ff", fontWeight: 600 }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>Water (Glasses)</label>
                    <Input type="number" value={formData.waterGlasses} onChange={e => setFormData({ ...formData, waterGlasses: Number(e.target.value) })} style={{ height: 42, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, color: "#e2d9ff", fontWeight: 600 }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>Workout Mins</label>
                    <Input type="number" value={formData.workoutMinutes} onChange={e => setFormData({ ...formData, workoutMinutes: Number(e.target.value) })} style={{ height: 42, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, color: "#e2d9ff", fontWeight: 600 }} required />
                  </div>
                </div>
                <Button type="submit" style={{ height: 46, background: "linear-gradient(135deg, #6b5ce7, #7c4ff0)", color: "#fff", fontWeight: 800, borderRadius: 99, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(107,92,231,0.25)" }}>
                  SUBMIT TELEMETRY
                </Button>
              </form>
            </motion.div>

            {/* List */}
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
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", margin: "0 0 20px" }}>
                Recent Database Logs
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", maxHeight: 220, paddingRight: 4 }}>
                {safeLogs.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: 13, fontStyle: "italic", margin: 0 }}>
                    No data logged yet. Initiate your first sync.
                  </p>
                ) : (
                  safeLogs.slice(0, 5).map((l: any, i: number) => (
                    <div
                      key={l._id || i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderRadius: 14,
                        background: "rgba(139,92,246,0.05)",
                        border: "1px solid rgba(139,92,246,0.10)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                          <Activity size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#e2d9ff" }}>
                            {new Date(l.date || Date.now()).toLocaleDateString()}
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(196,181,253,0.45)", fontWeight: 600 }}>
                            {l.workoutMinutes}m workout • {l.waterGlasses} glasses
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#e2d9ff" }}>{l.caloriesConsumed} kcal</div>
                        <div style={{ fontSize: 11, color: "rgba(196,181,253,0.45)", fontWeight: 600 }}>{l.sleepHours}h sleep</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}