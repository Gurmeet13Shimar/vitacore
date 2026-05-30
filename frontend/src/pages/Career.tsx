import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Briefcase, Target, Award, Rocket, CheckCircle2, Circle, Plus, Activity, ExternalLink, Flame } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Career() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Coding platform streaks (saved locally)
  const [platformStreaks, setPlatformStreaks] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("vitacore_platform_streaks");
      return saved ? JSON.parse(saved) : {
        leetcode: 0, codingninjas: 0, gfg: 0, hackerrank: 0, codechef: 0, codeforces: 0
      };
    } catch { return { leetcode: 0, codingninjas: 0, gfg: 0, hackerrank: 0, codechef: 0, codeforces: 0 }; }
  });
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editStreak, setEditStreak] = useState<string>("");

  // Study Path State
  const [selectedPath, setSelectedPath] = useState("all");

  const codingPlatforms = [
    { key: "leetcode",    name: "LeetCode",      url: "https://leetcode.com",                emoji: "⚡", accent: "#FFA116", bg: "rgba(255,161,22,0.08)",  border: "rgba(255,161,22,0.2)",  desc: "DSA & Interview Prep" },
    { key: "codingninjas",name: "Coding Ninjas",  url: "https://www.naukri.com/code360",      emoji: "🥷", accent: "#FF4B45", bg: "rgba(255,75,69,0.08)",   border: "rgba(255,75,69,0.2)",   desc: "Courses & Contests" },
    { key: "gfg",         name: "GeeksforGeeks",  url: "https://www.geeksforgeeks.org",        emoji: "🌿", accent: "#2F8D46", bg: "rgba(47,141,70,0.08)",   border: "rgba(47,141,70,0.2)",   desc: "CS Fundamentals" },
    { key: "hackerrank",  name: "HackerRank",     url: "https://www.hackerrank.com",           emoji: "💻", accent: "#00EA64", bg: "rgba(0,234,100,0.08)",   border: "rgba(0,234,100,0.2)",   desc: "Skill Certifications" },
    { key: "codechef",    name: "CodeChef",        url: "https://www.codechef.com",             emoji: "👨‍🍳", accent: "#F9A12E", bg: "rgba(249,161,46,0.08)",  border: "rgba(249,161,46,0.2)",  desc: "Competitive Coding" },
    { key: "codeforces",  name: "Codeforces",      url: "https://codeforces.com",               emoji: "🏆", accent: "#3B82F6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.2)",  desc: "CP & Rounds" },
  ];

  // Filter coding platforms based on chosen study path
  const filteredPlatforms = codingPlatforms.filter(p => {
    if (selectedPath === "all") return true;
    if (selectedPath === "competitive") {
      return ["leetcode", "codingninjas", "codechef", "codeforces"].includes(p.key);
    }
    if (selectedPath === "fundamentals") {
      return ["leetcode", "codingninjas", "gfg"].includes(p.key);
    }
    if (selectedPath === "software") {
      return ["hackerrank", "leetcode", "codingninjas"].includes(p.key);
    }
    return true;
  });

  const updateStreak = (key: string, value: number) => {
    const updated = { ...platformStreaks, [key]: value };
    setPlatformStreaks(updated);
    localStorage.setItem("vitacore_platform_streaks", JSON.stringify(updated));
    setEditingPlatform(null);
  };

  const [formData, setFormData] = useState({
    topic: "React",
    durationMinutes: 0,
    notes: ""
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/career");
      if (Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error(error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const safeLogs = Array.isArray(logs) ? logs : [];

  // Group study logs by topic to populate competency matrix
  const topicMap: { [key: string]: number } = {
    "React": 50,
    "Node.js": 40,
    "MongoDB": 30,
    "System Design": 35,
    "Security": 25,
    "DevOps": 20
  };

  safeLogs.forEach((item) => {
    const hours = item.durationMinutes / 60;
    if (topicMap[item.topic] !== undefined) {
      topicMap[item.topic] = Math.min(100, topicMap[item.topic] + hours * 5);
    } else {
      topicMap[item.topic] = Math.min(100, 30 + hours * 5);
    }
  });

  // Calculate total study time
  const totalMinutes = safeLogs.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const score = Math.min(100, 80 + Math.round(totalHours / 2));

  // Milestones
  const milestones = [
    { id: 1, title: "Study Core Topics (10 Hours)", progress: Math.min(100, Math.round((totalHours / 10) * 100)), completed: totalHours >= 10 },
    { id: 2, title: "Build Personal Project (25 Hours)", progress: Math.min(100, Math.round((totalHours / 25) * 100)), completed: totalHours >= 25 },
    { id: 3, title: "Master Full-Stack App (50 Hours)", progress: Math.min(100, Math.round((totalHours / 50) * 100)), completed: totalHours >= 50 }
  ];

  const skillData = Object.keys(topicMap).map(key => ({
    subject: key,
    A: topicMap[key],
    fullMark: 100
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/career", formData);
      localStorage.setItem("studyHours", totalHours.toString());
      localStorage.setItem("completedTasks", milestones.filter(m => m.completed).length.toString());
      localStorage.setItem("focusScore", score.toString());
      localStorage.setItem("skills", Object.keys(topicMap).join(", "));
      fetchLogs(); // Refresh
      setFormData({ topic: "React", durationMinutes: 0, notes: "" });
    } catch (error) {
      console.error(error);
    }
  };

  // Heatmap for the last 60 days
  const heatmapData = Array.from({ length: 60 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();

    const dayLogs = safeLogs.filter((l) => {
      const logDateStr = new Date(l.date || l.createdAt).toDateString();
      return logDateStr === dateStr;
    });

    const sumMinutes = dayLogs.reduce((sum, l) => sum + l.durationMinutes, 0);
    const hours = sumMinutes / 60;

    let intensity = 0;
    if (hours > 4) intensity = 1.0;
    else if (hours > 2) intensity = 0.7;
    else if (hours > 0) intensity = 0.3;

    return {
      date: date.toLocaleDateString(),
      hours: hours,
      intensity: intensity
    };
  }).reverse();

  return (
    <AppLayout>
      <div
        style={{
          minHeight: "100%",
          background: "#030712",
          padding: "36px 40px 60px",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Glow effects */}
        <div style={{ position: "absolute", top: "-10%", left: "5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "-5%", right: "5%", width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Noise overlay */}
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
                Career Goals
              </h1>
              <p style={{ color: "rgba(233,221,255,0.75)", marginTop: 6, fontSize: 15, fontWeight: 500 }}>
                Track your study sessions and build your skills.
              </p>
            </div>

            {/* Score Badge */}
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
                Career Score
              </div>
            </div>
          </div>

          {/* Top Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginBottom: 24,
            }}
          >
            {/* Study hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              whileHover={{
                y: -8,
                scale: 1.03,
                rotateX: 5,
                rotateY: -5,
                boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
                borderColor: "rgba(139,92,246,0.25)",
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
              <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", flexShrink: 0, transform: "translateZ(15px)", justifyContent: "center" }}>
                <Activity size={22} color="#8b5cf6" strokeWidth={2.5} />
              </div>
              <div style={{ transform: "translateZ(25px)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>
                  Total Study Time
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#e2d9ff" }}>{totalHours}</span>
                  <span style={{ fontSize: 13, color: "rgba(196,181,253,0.45)", fontWeight: 600 }}>hours</span>
                </div>
              </div>
            </motion.div>

            {/* Competency Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{
                y: -8,
                scale: 1.03,
                rotateX: 5,
                rotateY: -5,
                boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
                borderColor: "rgba(139,92,246,0.25)",
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
              <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(233,30,140,0.1)", display: "flex", alignItems: "center", flexShrink: 0, transform: "translateZ(15px)", justifyContent: "center" }}>
                <Briefcase size={22} color="#e91e8c" strokeWidth={2.5} />
              </div>
              <div style={{ transform: "translateZ(25px)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>
                  Skills Tracked
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#e2d9ff" }}>{Object.keys(topicMap).length}</span>
                  <span style={{ fontSize: 13, color: "rgba(196,181,253,0.45)", fontWeight: 600 }}>topics</span>
                </div>
              </div>
            </motion.div>

            {/* Milestones Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              whileHover={{
                y: -8,
                scale: 1.03,
                rotateX: 5,
                rotateY: -5,
                boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
                borderColor: "rgba(139,92,246,0.25)",
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
              <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(245,197,24,0.1)", display: "flex", alignItems: "center", flexShrink: 0, transform: "translateZ(15px)", justifyContent: "center" }}>
                <Rocket size={22} color="#f5c518" strokeWidth={2.5} />
              </div>
              <div style={{ transform: "translateZ(25px)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>
                  Milestones Hit
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#e2d9ff" }}>{milestones.filter(m => m.completed).length}</span>
                  <span style={{ fontSize: 13, color: "rgba(196,181,253,0.45)", fontWeight: 600 }}>/ {milestones.length}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trajectory timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
            style={{
              background: "rgba(16,12,38,0.82)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(139,92,246,0.14)",
              borderRadius: 22,
              padding: "28px 32px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
              position: "relative",
              overflow: "hidden",
              marginBottom: 24,
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16, justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Current Level</span>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#e2d9ff", marginTop: 4 }}>Associate Engineer</div>
              </div>

              {/* Trajectory Timeline Bar */}
              <div style={{ flex: 1, margin: "0 32px", position: "relative", minWidth: 200 }}>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, width: "100%", position: "relative" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalHours / 50) * 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      borderRadius: 99,
                      background: "linear-gradient(90deg, #e91e8c, #8b5cf6)",
                      boxShadow: "0 0 12px rgba(233,30,140,0.5)",
                    }}
                  />
                  <motion.div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${Math.min(95, (totalHours / 50) * 100)}%`,
                      transform: "translate(-50%, -50%)",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#100c26",
                      border: "1px solid rgba(139,92,246,0.3)",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.40)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Rocket size={16} color="#e91e8c" />
                  </motion.div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#e91e8c", textTransform: "uppercase", letterSpacing: "0.08em" }}>Next Level</span>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#e2d9ff", marginTop: 4 }}>Principal Architect</div>
              </div>
            </div>
          </motion.div>

          {/* Coding Platforms Hub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <Flame size={18} color="#e91e8c" /> Recommended Coding Platforms
                  </h3>
                  <p style={{ color: "rgba(196,181,253,0.5)", fontSize: 12, marginTop: 4, fontWeight: 500 }}>
                    Select a path below to see suitable study platforms. Click streak to update.
                  </p>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Total Streak: {Object.values(platformStreaks).reduce((a, b) => a + b, 0)} Days
                </div>
              </div>

              {/* Study Path Selection tabs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, background: "rgba(16,12,38,0.6)", padding: 6, borderRadius: 12, border: "1px solid rgba(139,92,246,0.15)", width: "fit-content" }}>
                {[
                  { id: "all", label: "All Paths" },
                  { id: "competitive", label: "Competitive Coding" },
                  { id: "fundamentals", label: "DSA & CS Fundamentals" },
                  { id: "software", label: "Web Dev & Certifications" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedPath(tab.id)}
                    style={{
                      background: selectedPath === tab.id ? "#8b5cf6" : "transparent",
                      color: selectedPath === tab.id ? "#ffffff" : "#94a3b8",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {filteredPlatforms.map((p) => (
                <motion.div
                  key={p.key}
                  whileHover={{ y: -5, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${p.border}` }}
                  style={{
                    background: "rgba(16,12,38,0.88)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${p.border}`,
                    borderRadius: 18,
                    padding: "20px 22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: p.bg, pointerEvents: "none" }} />

                  {/* Top row: emoji + name + external link */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 24 }}>{p.emoji}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#e2d9ff" }}>{p.name}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(196,181,253,0.45)", marginTop: 1 }}>{p.desc}</div>
                      </div>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: p.bg,
                        border: `1px solid ${p.border}`,
                        color: p.accent,
                        textDecoration: "none",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}
                      title={`Open ${p.name}`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  {/* Streak row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Flame size={14} color={p.accent} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.55)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Streak
                      </span>
                    </div>
                    {editingPlatform === p.key ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="number"
                          value={editStreak}
                          onChange={(e) => setEditStreak(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") updateStreak(p.key, parseInt(editStreak) || 0);
                            if (e.key === "Escape") setEditingPlatform(null);
                          }}
                          autoFocus
                          style={{
                            width: 60,
                            padding: "4px 8px",
                            background: "rgba(255,255,255,0.06)",
                            border: `1px solid ${p.accent}`,
                            borderRadius: 8,
                            color: "#e2d9ff",
                            fontSize: 13,
                            fontWeight: 700,
                            outline: "none",
                            textAlign: "center",
                          }}
                        />
                        <button
                          onClick={() => updateStreak(p.key, parseInt(editStreak) || 0)}
                          style={{ background: p.accent, border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 8px", cursor: "pointer" }}
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingPlatform(p.key); setEditStreak(String(platformStreaks[p.key] || 0)); }}
                        title="Click to update streak"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <span style={{ fontSize: 22, fontWeight: 900, color: p.accent, fontVariantNumeric: "tabular-nums" }}>
                          {platformStreaks[p.key] || 0}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(196,181,253,0.4)", alignSelf: "flex-end", marginBottom: 2 }}>days</span>
                      </button>
                    )}
                  </div>

                  {/* Streak bar */}
                  <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((platformStreaks[p.key] || 0) / 100) * 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ height: "100%", background: p.accent, borderRadius: 99 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Competency & Milestones Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

            {/* Skill Level Radar Chart */}
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
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", margin: "0 0 20px" }}>My Skill Level</h3>
              <div style={{ height: 280, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                    <PolarGrid stroke="rgba(139,92,246,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(196,181,253,0.5)", fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skills" dataKey="A" stroke="#e91e8c" fill="#e91e8c" fillOpacity={0.15} strokeWidth={2.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Promotion Roadmap */}
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
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", margin: "0 0 20px" }}>My Growth Milestones</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      background: m.completed ? "rgba(233,30,140,0.06)" : "rgba(107,92,231,0.03)",
                      border: m.completed ? "1px solid rgba(233,30,140,0.15)" : "1px solid rgba(107,92,231,0.08)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {m.completed ? <CheckCircle2 className="text-pink-500" size={18} /> : <Circle className="text-slate-500" size={18} />}
                        <span style={{ fontWeight: 700, fontSize: 13, color: m.completed ? "#e2d9ff" : "rgba(196,181,253,0.5)" }}>{m.title}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#e91e8c" }}>{m.progress}%</span>
                    </div>
                    <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.progress}%` }}
                        transition={{ duration: 1 }}
                        style={{ height: "100%", background: m.completed ? "#e91e8c" : "rgba(233,30,140,0.4)", borderRadius: 99 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form and Consistency Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20 }}>

            {/* Study Log Form */}
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
                <Plus size={18} color="#e91e8c" strokeWidth={3} /> Log a Study Session
              </h3>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>Study Time (Minutes)</label>
                    <Input type="number" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })} style={{ height: 42, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, color: "#e2d9ff", fontWeight: 600 }} required />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>Topic</label>
                    <select value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} style={{ height: 42, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, color: "#e2d9ff", fontWeight: 600, padding: "0 10px", outline: "none", cursor: "pointer" }}>
                      <option value="React" style={{ background: "#100c26", color: "#e2d9ff" }}>React</option>
                      <option value="Node.js" style={{ background: "#100c26", color: "#e2d9ff" }}>Node.js</option>
                      <option value="MongoDB" style={{ background: "#100c26", color: "#e2d9ff" }}>MongoDB</option>
                      <option value="System Design" style={{ background: "#100c26", color: "#e2d9ff" }}>System Design</option>
                      <option value="Security" style={{ background: "#100c26", color: "#e2d9ff" }}>Security</option>
                      <option value="DevOps" style={{ background: "#100c26", color: "#e2d9ff" }}>DevOps</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)", textTransform: "uppercase" }}>What did you study?</label>
                  <Input type="text" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="e.g. Practiced React context and customized hooks" style={{ height: 42, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, color: "#e2d9ff", fontWeight: 600 }} />
                </div>
                <Button type="submit" style={{ height: 46, background: "linear-gradient(135deg, #e91e8c, #f472b6)", color: "#fff", fontWeight: 800, borderRadius: 99, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(233,30,140,0.25)" }}>
                  SAVE STUDY SESSION
                </Button>
              </form>
            </motion.div>

            {/* Consistency Grid */}
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
                justifyContent: "space-between",
                transition: "all 0.3s ease",
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Award size={18} color="#e91e8c" /> My Study Habit tracker (Last 60 Days)
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 150, overflowY: "auto", paddingRight: 4 }}>
                  {heatmapData.map((d, i) => {
                    let bg = "rgba(107,92,231,0.06)";
                    if (d.intensity > 0.8) bg = "#e91e8c";
                    else if (d.intensity > 0.5) bg = "rgba(233,30,140,0.6)";
                    else if (d.intensity > 0.1) bg = "rgba(233,30,140,0.25)";

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.003 }}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          background: bg,
                          cursor: "crosshair",
                          flexShrink: 0,
                          border: "1px solid rgba(139,92,246,0.1)",
                        }}
                        whileHover={{ scale: 1.15, borderColor: "rgba(139,92,246,0.3)" }}
                        title={`${d.date}: ${d.hours.toFixed(1)} hours`}
                      />
                    );
                  })}
                </div>
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontWeight: 700, color: "rgba(196,181,253,0.5)" }}>
                  <span>Less</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(107,92,231,0.06)" }} />
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(233,30,140,0.25)" }} />
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(233,30,140,0.6)" }} />
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "#e91e8c" }} />
                  </div>
                  <span>More</span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(139,92,246,0.1)", paddingTop: 16, marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>
                <span>Total Study Time:</span>
                <span style={{ fontWeight: 800, color: "#e2d9ff" }}>{totalHours} Hours</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}