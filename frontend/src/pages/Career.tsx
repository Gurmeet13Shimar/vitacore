import React, { useState, useEffect, FC } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import {
  Briefcase, Target, Award, Rocket, CheckCircle2, Circle, Plus,
  Activity, ExternalLink, Flame, Github, Sparkles, RefreshCw, Unlink, Code
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import api from "@/lib/api";

/* ─── Metric Card (mirrors Health's MetricCard) ─── */
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  valueClassName?: string;
}

const MetricCard: FC<MetricCardProps> = ({ title, value, unit = '', icon, description, valueClassName }) => (
  <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }} className="flex-grow">
    <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-violet-300 tracking-wide uppercase">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-1">
        <div className={`text-2xl font-extrabold text-white tracking-tight ${valueClassName}`}>
          {value} <span className="text-xs font-semibold text-slate-400 ml-0.5">{unit}</span>
        </div>
        {description && <p className="text-[10px] text-slate-400 mt-1 font-medium">{description}</p>}
      </CardContent>
    </Card>
  </motion.div>
);

/* ─── Component ─── */
export default function Career() {
  const { themeColors } = useTheme();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* GitHub */
  const [githubUsername, setGithubUsername] = useState("");
  const [connectUsername, setConnectUsername] = useState("");
  const [githubData, setGithubData] = useState<any>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");

  /* Platform streaks */
  const [platformStreaks, setPlatformStreaks] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("vitacore_platform_streaks");
      return saved ? JSON.parse(saved) : { leetcode: 0, hackerrank: 0, kaggle: 0, huggingface: 0, freecodecamp: 0 };
    } catch { return { leetcode: 0, hackerrank: 0, kaggle: 0, huggingface: 0, freecodecamp: 0 }; }
  });
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editStreak, setEditStreak] = useState<string>("");
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  /* LeetCode */
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [leetcodeError, setLeetcodeError] = useState("");
  const [leetcodeData, setLeetcodeData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("vitacore_leetcode_data");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [showLeetCodeInput, setShowLeetCodeInput] = useState(false);

  /* Custom platforms */
  const [customPlatforms, setCustomPlatforms] = useState<Array<{ key: string; name: string; url: string; emoji: string; accent: string; bg: string; border: string; desc: string }>>(() => {
    try {
      const saved = localStorage.getItem("vitacore_custom_platforms");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [newPlatform, setNewPlatform] = useState({ name: "", url: "", desc: "" });

  /* Study path filter */
  const [selectedPath, setSelectedPath] = useState("all");

  /* Study log form */
  const [formData, setFormData] = useState({ topic: "", durationMinutes: 0, notes: "" });

  /* ── Platform definitions ── */
  const codingPlatforms = [
    { key: "leetcode",     name: "LeetCode",     url: "https://leetcode.com",            emoji: "⚡", accent: "#FFA116", bg: "rgba(255,161,22,0.08)",  border: "rgba(255,161,22,0.2)",  desc: "DSA & Interview Prep" },
    { key: "hackerrank",   name: "HackerRank",   url: "https://www.hackerrank.com",      emoji: "💻", accent: "#00EA64", bg: "rgba(0,234,100,0.08)",   border: "rgba(0,234,100,0.2)",   desc: "Skill Certifications" },
    { key: "kaggle",       name: "Kaggle",        url: "https://www.kaggle.com",          emoji: "🐍", accent: "#20BEFF", bg: "rgba(32,190,255,0.08)",  border: "rgba(32,190,255,0.2)",  desc: "ML Competitions & Datasets" },
    { key: "huggingface",  name: "Hugging Face",  url: "https://huggingface.co",          emoji: "🤗", accent: "#FFD21E", bg: "rgba(255,210,30,0.08)",  border: "rgba(255,210,30,0.2)",  desc: "AI Models & NLP" },
    { key: "freecodecamp", name: "freeCodeCamp",  url: "https://www.freecodecamp.org",    emoji: "🔥", accent: "#A3A3A3", bg: "rgba(163,163,163,0.08)", border: "rgba(163,163,163,0.2)", desc: "Web Dev Projects" },
  ];

  const allPlatforms = [...codingPlatforms, ...customPlatforms];

  const filteredPlatforms = allPlatforms.filter(p => {
    if (selectedPath === "all")          return true;
    if (selectedPath === "competitive")  return ["leetcode"].includes(p.key);
    if (selectedPath === "fundamentals") return ["leetcode", "freecodecamp"].includes(p.key);
    if (selectedPath === "software")     return ["hackerrank", "leetcode", "freecodecamp"].includes(p.key);
    if (selectedPath === "ml")           return ["kaggle", "huggingface", "leetcode"].includes(p.key);
    if (selectedPath === "custom")       return customPlatforms.some(cp => cp.key === p.key);
    return true;
  });

  /* ── Handlers ── */
  const updateStreak = (key: string, value: number) => {
    const updated = { ...platformStreaks, [key]: value };
    setPlatformStreaks(updated);
    localStorage.setItem("vitacore_platform_streaks", JSON.stringify(updated));
    setEditingPlatform(null);
  };

  const handleConnectLeetCode = async (username: string) => {
    if (!username.trim()) return;
    setLeetcodeLoading(true);
    setLeetcodeError("");
    try {
      const res = await api.get(`/api/career/leetcode/${username.trim()}`);
      setLeetcodeData(res.data);
      localStorage.setItem("vitacore_leetcode_data", JSON.stringify(res.data));
      const updated = { ...platformStreaks, leetcode: res.data.streak };
      setPlatformStreaks(updated);
      localStorage.setItem("vitacore_platform_streaks", JSON.stringify(updated));
      setShowLeetCodeInput(false);
    } catch (err: any) {
      setLeetcodeError(err.response?.data?.message || "Failed to fetch LeetCode user.");
    } finally {
      setLeetcodeLoading(false);
    }
  };

  const handleDisconnectLeetCode = () => {
    setLeetcodeData(null);
    localStorage.removeItem("vitacore_leetcode_data");
    const updated = { ...platformStreaks, leetcode: 0 };
    setPlatformStreaks(updated);
    localStorage.setItem("vitacore_platform_streaks", JSON.stringify(updated));
    setLeetcodeUsername("");
  };

  const addCustomPlatform = () => {
    if (!newPlatform.name.trim() || !newPlatform.url.trim()) return;
    const key = newPlatform.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (allPlatforms.some(p => p.key === key)) return;
    const accents = ["#A78BFA", "#34D399", "#F472B6", "#60A5FA", "#FBBF24", "#F87171", "#38BDF8"];
    const accent = accents[customPlatforms.length % accents.length];
    const hex = accent.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const newEntry = {
      key,
      name: newPlatform.name.trim(),
      url: newPlatform.url.trim().startsWith("http") ? newPlatform.url.trim() : `https://${newPlatform.url.trim()}`,
      emoji: "🔗", accent,
      bg: `rgba(${r},${g},${b},0.08)`,
      border: `rgba(${r},${g},${b},0.2)`,
      desc: newPlatform.desc.trim() || "Custom Platform",
    };
    const updated = [...customPlatforms, newEntry];
    setCustomPlatforms(updated);
    localStorage.setItem("vitacore_custom_platforms", JSON.stringify(updated));
    setNewPlatform({ name: "", url: "", desc: "" });
    setShowAddPlatform(false);
  };

  const removeCustomPlatform = (key: string) => {
    const updated = customPlatforms.filter(p => p.key !== key);
    setCustomPlatforms(updated);
    localStorage.setItem("vitacore_custom_platforms", JSON.stringify(updated));
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/career");
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch { setLogs([]); }
    finally { setIsLoading(false); }
  };

  const fetchGithubProfile = async () => {
    setGithubLoading(true);
    try {
      const res = await api.get("/api/github");
      if (res.data?.githubUsername) {
        setGithubData(res.data);
        setGithubUsername(res.data.githubUsername);
        setConnectUsername(res.data.githubUsername);
      } else {
        setGithubData(null);
      }
      setGithubError("");
    } catch { /* silent */ }
    finally { setGithubLoading(false); }
  };

  const handleConnectGithub = async (usernameToConnect: string) => {
    if (!usernameToConnect.trim()) return;
    setGithubLoading(true);
    setGithubError("");
    try {
      const res = await api.get(`/api/github/${usernameToConnect.trim()}`);
      setGithubData(res.data);
      setGithubUsername(res.data.githubUsername);
      setConnectUsername(res.data.githubUsername);
    } catch (err: any) {
      setGithubError(err.response?.data?.message || "Failed to fetch GitHub profile.");
    } finally {
      setGithubLoading(false);
    }
  };

  const handleDisconnectGithub = async () => {
    setGithubLoading(true);
    try {
      await api.delete("/api/github");
      setGithubData(null);
      setGithubUsername("");
      setConnectUsername("");
    } catch { setGithubError("Failed to disconnect."); }
    finally { setGithubLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/career", formData);
      fetchLogs();
      setFormData({ topic: "", durationMinutes: 0, notes: "" });
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchLogs(); fetchGithubProfile(); }, []);

  useEffect(() => {
    if (leetcodeData && leetcodeData.streak !== platformStreaks.leetcode) {
      const updated = { ...platformStreaks, leetcode: leetcodeData.streak };
      setPlatformStreaks(updated);
      localStorage.setItem("vitacore_platform_streaks", JSON.stringify(updated));
    }
  }, [leetcodeData]);

  /* ── Derived data ── */
  const safeLogs = Array.isArray(logs) ? logs : [];
  const totalMinutes = safeLogs.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const score = Math.min(100, 80 + Math.round(totalHours / 2));

  const topicMap: Record<string, number> = { React: 50, "Node.js": 40, MongoDB: 30, "System Design": 35, Security: 25, DevOps: 20 };
  safeLogs.forEach(item => {
    const hours = item.durationMinutes / 60;
    topicMap[item.topic] = topicMap[item.topic] !== undefined
      ? Math.min(100, topicMap[item.topic] + hours * 5)
      : Math.min(100, 30 + hours * 5);
  });

  const milestones = [
    { id: 1, title: "Study Core Topics (10 Hours)",     progress: Math.min(100, Math.round((totalHours / 10) * 100)), completed: totalHours >= 10 },
    { id: 2, title: "Build Personal Project (25 Hours)", progress: Math.min(100, Math.round((totalHours / 25) * 100)), completed: totalHours >= 25 },
    { id: 3, title: "Master Full-Stack App (50 Hours)",  progress: Math.min(100, Math.round((totalHours / 50) * 100)), completed: totalHours >= 50 },
  ];

  const skillData = Object.keys(topicMap).map(key => ({ subject: key, A: topicMap[key], fullMark: 100 }));

  const heatmapData = Array.from({ length: 60 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const dayLogs = safeLogs.filter(l => new Date(l.date || l.createdAt).toDateString() === dateStr);
    const hours = dayLogs.reduce((sum, l) => sum + l.durationMinutes, 0) / 60;
    let intensity = 0;
    if (hours > 4) intensity = 1.0;
    else if (hours > 2) intensity = 0.7;
    else if (hours > 0) intensity = 0.3;
    return { date: date.toLocaleDateString(), hours, intensity };
  }).reverse();

  /* ── Render ── */
  return (
    <AppLayout>
      <div
        className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans flex flex-col"
        style={{ background: themeColors.background }}
      >
        {/* Ambient glow */}
        <div className="absolute top-[-10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="absolute bottom-[-5%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(233,30,140,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start w-full flex-1">

            {/* ── LEFT PANEL: Study Log Form (sticky) ── */}
            <div className="xl:col-span-1 flex flex-col gap-6 xl:sticky xl:top-8 shrink-0">
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-pink-400" /> Log Study Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3.5">

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Study Time</label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="e.g. 60"
                            value={formData.durationMinutes === 0 ? "" : formData.durationMinutes}
                            onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) || 0 })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-pink-500 text-white font-semibold text-sm h-10 no-spinner pr-14"
                            required
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500">mins</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Topic / Skill</label>
                        <Input
                          type="text"
                          list="topic-suggestions"
                          placeholder="e.g. React"
                          value={formData.topic}
                          onChange={e => setFormData({ ...formData, topic: e.target.value })}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-pink-500 text-white font-semibold text-sm h-10"
                          required
                        />
                        <datalist id="topic-suggestions">
                          <option value="React" /><option value="Node.js" /><option value="MongoDB" />
                          <option value="System Design" /><option value="Security" /><option value="DevOps" />
                          <option value="Machine Learning" /><option value="Deep Learning" /><option value="Python" />
                        </datalist>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Notes</label>
                        <Input
                          type="text"
                          placeholder="e.g. Practiced React hooks"
                          value={formData.notes}
                          onChange={e => setFormData({ ...formData, notes: e.target.value })}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-pink-500 text-white font-semibold text-sm h-10"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-2 h-10 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black rounded-xl border-0 shadow-lg shadow-pink-950/20"
                    >
                      SAVE SESSION
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Stats mini-card */}
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet-400" /> Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-1">
                  {[
                    { label: "Total Hours", value: `${totalHours} hrs`, color: "text-violet-400" },
                    { label: "Sessions", value: `${safeLogs.length}`, color: "text-pink-400" },
                    { label: "Skills Tracked", value: `${Object.keys(topicMap).length}`, color: "text-cyan-400" },
                    { label: "Milestones Hit", value: `${milestones.filter(m => m.completed).length} / ${milestones.length}`, color: "text-amber-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[11px] font-semibold text-slate-400">{label}</span>
                      <span className={`text-[11px] font-extrabold ${color}`}>{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* ── RIGHT PANEL: Main Career Hub ── */}
            <div className="xl:col-span-3 flex flex-col gap-6 md:gap-8 xl:pr-4 xl:pb-12">

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    My Career Hub
                  </h1>
                  <p className="text-slate-200 mt-1 font-semibold text-xs md:text-sm">
                    Track study sessions, platforms, and grow your technical skills.
                  </p>
                </div>

                {/* Score pill (like Health's risk pill) */}
                <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                  <span className="text-sm font-semibold text-pink-300">Career Score: {score}</span>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Study Hours"
                  value={totalHours}
                  unit="hrs"
                  icon={<Activity className="h-4.5 w-4.5 text-violet-500" />}
                  description="Total logged time"
                  valueClassName="text-violet-400"
                />
                <MetricCard
                  title="Sessions"
                  value={safeLogs.length}
                  unit="logs"
                  icon={<Briefcase className="h-4.5 w-4.5 text-pink-500" />}
                  description="All recorded sessions"
                  valueClassName="text-pink-400"
                />
                <MetricCard
                  title="Platform Streak"
                  value={Object.values(platformStreaks).reduce((a, b) => a + b, 0)}
                  unit="days"
                  icon={<Flame className="h-4.5 w-4.5 text-orange-500" />}
                  description="Combined streaks"
                  valueClassName="text-orange-400"
                />
                <MetricCard
                  title="Milestones"
                  value={`${milestones.filter(m => m.completed).length} / ${milestones.length}`}
                  icon={<Rocket className="h-4.5 w-4.5 text-amber-500" />}
                  description="Goals completed"
                  valueClassName="text-amber-400"
                />
              </div>

              {/* Career Trajectory Bar */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
                <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6 relative overflow-hidden">
                  <div className="flex items-center flex-wrap gap-4 justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Level</span>
                      <div className="text-xl font-extrabold text-slate-200 mt-1">Associate Engineer</div>
                    </div>
                    <div className="flex-1 mx-8 relative min-w-[200px]">
                      <div className="h-2 bg-slate-800/80 rounded-full w-full relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (totalHours / 50) * 100)}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-600 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                        />
                        <motion.div
                          style={{ position: "absolute", top: "50%", left: `${Math.min(95, (totalHours / 50) * 100)}%`, transform: "translate(-50%, -50%)" }}
                          className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg"
                        >
                          <Rocket size={14} className="text-pink-500" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">Next Level</span>
                      <div className="text-xl font-extrabold text-slate-200 mt-1">Principal Architect</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* GitHub Integration */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {!githubData ? (
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-8 flex flex-col items-center text-center gap-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-b from-violet-600/10 to-transparent blur-3xl pointer-events-none" />
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shadow-inner">
                      <Github size={28} className="text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Connect GitHub Profile</h3>
                      <p className="text-sm text-slate-400 max-w-[480px] leading-relaxed">
                        Link your GitHub to automatically track repos, commits, and career activity in real-time.
                      </p>
                    </div>
                    <div className="flex gap-3 w-full max-w-[420px] mt-2">
                      <Input
                        type="text"
                        placeholder="Enter GitHub username"
                        value={connectUsername}
                        onChange={e => setConnectUsername(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleConnectGithub(connectUsername); }}
                        className="bg-slate-950/60 border-slate-800 focus:border-violet-500/50 text-slate-200"
                      />
                      <Button
                        onClick={() => handleConnectGithub(connectUsername)}
                        disabled={githubLoading}
                        className="bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold flex items-center gap-2 px-6"
                      >
                        {githubLoading ? <RefreshCw className="animate-spin" size={15} /> : <Sparkles size={15} />}
                        {githubLoading ? "Syncing..." : "Connect"}
                      </Button>
                    </div>
                    {githubError && <p className="text-red-400 text-xs font-semibold mt-1">⚠️ {githubError}</p>}
                  </Card>
                ) : (
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6 flex flex-col gap-6 relative overflow-hidden">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800/50 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={githubData.avatarUrl} alt={githubData.name} className="w-12 h-12 rounded-full border-2 border-violet-500" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                            <Github size={11} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-200">{githubData.name}</h3>
                            <a href={githubData.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
                              <ExternalLink size={12} />
                            </a>
                          </div>
                          <p className="text-xs text-slate-400">@{githubData.githubUsername}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleConnectGithub(githubUsername)}
                          disabled={githubLoading}
                          variant="outline"
                          className="border-slate-800 hover:bg-slate-800/50 text-slate-300 text-xs flex items-center gap-1.5 h-9"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${githubLoading ? "animate-spin" : ""}`} />
                          {githubLoading ? "Syncing..." : "Sync Activity"}
                        </Button>
                        <Button
                          onClick={handleDisconnectGithub}
                          variant="outline"
                          className="border-red-950/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 text-xs flex items-center gap-1.5 h-9"
                        >
                          <Unlink size={13} /> Disconnect
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-4">
                        <div className="bg-gradient-to-r from-violet-500/5 to-pink-500/5 border border-violet-500/10 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-violet-600/10 blur-xl pointer-events-none" />
                          <div>
                            <span className="text-[9px] font-bold text-violet-300 tracking-wider uppercase">Future Readiness Score</span>
                            <h4 className="text-xs font-bold text-slate-300 mt-1">Career Activity</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-extrabold text-white">{githubData.careerActivityScore}</span>
                            <span className="text-[10px] text-slate-500 font-bold ml-1">/100</span>
                          </div>
                        </div>
                        <div className="bg-slate-950/30 border border-slate-900 rounded-2xl p-4 flex-grow flex flex-col gap-2 justify-center">
                          <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Insights</span>
                          <div className="flex flex-col gap-2">
                            {githubData.insights?.slice(0, 2).map((insight: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                                <p className="text-[11px] text-slate-300 leading-normal font-medium">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-950/30 border border-slate-900 rounded-xl p-3">
                            <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">Repos</span>
                            <div className="text-base font-extrabold text-white mt-0.5">{githubData.repositories}</div>
                          </div>
                          <div className="bg-slate-950/30 border border-slate-900 rounded-xl p-3">
                            <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">Commits / Wk</span>
                            <div className="text-base font-extrabold text-white mt-0.5">{githubData.commitsThisWeek}</div>
                          </div>
                        </div>
                        <div className="bg-slate-950/30 border border-slate-900 rounded-xl p-3 flex-grow flex flex-col gap-1.5">
                          <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">Tech</span>
                          <div className="flex flex-wrap gap-1">
                            {githubData.topLanguages?.slice(0, 3).map((lang: string, index: number) => {
                              const colors = ["#f1e05a", "#3178c6", "#3572A5", "#f1a0e4", "#41b883"];
                              return (
                                <div key={lang} className="flex items-center gap-1 bg-slate-900/50 border border-slate-800/60 rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[index % colors.length] }} />
                                  {lang}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>

              {/* Learning Platforms Hub */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6">
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                          <Flame size={18} className="text-pink-500" /> Learning Platforms Hub
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Click a row to track its streak. Click LeetCode to connect your username.
                        </p>
                      </div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Total Streak: {Object.values(platformStreaks).reduce((a, b) => a + b, 0)} Days
                      </div>
                    </div>

                    {/* Path filter tabs */}
                    <div className="flex flex-wrap gap-2 bg-slate-950/40 p-1.5 rounded-xl border border-slate-800/60 w-fit">
                      {[
                        { id: "all", label: "All Paths" },
                        { id: "competitive", label: "Competitive Coding" },
                        { id: "fundamentals", label: "DSA & CS Fundamentals" },
                        { id: "software", label: "Web Dev & Certifications" },
                        { id: "ml", label: "ML & Data Science" },
                        { id: "custom", label: `My Platforms${customPlatforms.length > 0 ? ` (${customPlatforms.length})` : ""}` },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedPath(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedPath === tab.id
                              ? "bg-violet-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-950/20 overflow-hidden mb-4">
                    <table className="w-full border-collapse text-left text-xs md:text-sm font-medium">
                      <thead>
                        <tr className="border-b border-slate-800/80 bg-slate-900/30">
                          <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Platform</th>
                          <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                          <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Active Streak</th>
                          <th className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlatforms.map(p => {
                          const isExpanded = expandedPlatform === p.key;
                          const streak = platformStreaks[p.key] || 0;
                          const isLeetCode = p.key === "leetcode";

                          const platformHeatmapData = Array.from({ length: 60 }).map((_, idx) => ({
                            active: idx >= (60 - streak)
                          }));

                          return (
                            <React.Fragment key={p.key}>
                              <tr
                                onClick={() => setExpandedPlatform(isExpanded ? null : p.key)}
                                className={`border-b border-slate-900/40 cursor-pointer transition-colors ${
                                  isExpanded ? "bg-violet-500/5" : "hover:bg-slate-900/20"
                                }`}
                              >
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-xl">{p.emoji}</span>
                                    <span className="font-bold text-slate-200">{p.name}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-slate-400 text-xs">{p.desc}</td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    <Flame size={14} style={{ color: p.accent }} />
                                    <span className="font-bold" style={{ color: p.accent }}>{streak} Days</span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      ({isExpanded ? "click to hide" : "click to expand"})
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
                                  <a
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center justify-center"
                                    onMouseEnter={e => (e.currentTarget.style.color = p.accent)}
                                    onMouseLeave={e => (e.currentTarget.style.color = "")}
                                    title={`Open ${p.name}`}
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                </td>
                              </tr>

                              {isExpanded && (
                                <tr className="bg-slate-950/60 border-b border-slate-900/80">
                                  <td colSpan={4} className="px-6 py-5">
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      transition={{ duration: 0.3 }}
                                      className="flex flex-col gap-4"
                                    >
                                      {/* LeetCode username connect (only for LeetCode row) */}
                                      {isLeetCode && (
                                        <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/40 border border-amber-500/10">
                                          <div className="flex items-center justify-between flex-wrap gap-2">
                                            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                              <Code size={14} /> LeetCode Integration
                                            </h4>
                                            {leetcodeData && (
                                              <button
                                                onClick={handleDisconnectLeetCode}
                                                className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                                              >
                                                <Unlink size={11} /> Disconnect
                                              </button>
                                            )}
                                          </div>

                                          {!leetcodeData ? (
                                            <div className="flex gap-2 items-center flex-wrap">
                                              <Input
                                                type="text"
                                                placeholder="Enter LeetCode username"
                                                value={leetcodeUsername}
                                                onChange={e => setLeetcodeUsername(e.target.value)}
                                                onKeyDown={e => { if (e.key === "Enter") handleConnectLeetCode(leetcodeUsername); }}
                                                className="bg-slate-950/60 border-slate-800 text-slate-200 h-9 text-xs flex-1 min-w-[160px]"
                                              />
                                              <Button
                                                onClick={() => handleConnectLeetCode(leetcodeUsername)}
                                                disabled={leetcodeLoading}
                                                size="sm"
                                                className="h-9 text-xs font-bold px-4"
                                                style={{ background: p.accent, color: "#000" }}
                                              >
                                                {leetcodeLoading ? <RefreshCw className="animate-spin" size={13} /> : <Sparkles size={13} />}
                                                {leetcodeLoading ? "Loading..." : "Connect"}
                                              </Button>
                                              {leetcodeError && <p className="w-full text-red-400 text-[10px] font-semibold">⚠️ {leetcodeError}</p>}
                                            </div>
                                          ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                              {[
                                                { label: "Username", value: leetcodeData.username, color: p.accent },
                                                { label: "Solved", value: leetcodeData.totalSolved, color: "#34D399" },
                                                { label: "Streak", value: `${leetcodeData.streak} days`, color: p.accent },
                                                { label: "Ranking", value: leetcodeData.ranking ? `#${leetcodeData.ranking.toLocaleString()}` : "N/A", color: "#A78BFA" },
                                              ].map(item => (
                                                <div key={item.label} className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-3">
                                                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</div>
                                                  <div className="text-sm font-extrabold mt-0.5" style={{ color: item.color }}>{item.value}</div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Streak Heatmap */}
                                      <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                          <Flame size={14} style={{ color: p.accent }} /> {p.name} Study Streak (Last 60 Days)
                                        </h4>
                                        <div className="flex items-center gap-2.5">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase">Adjust Streak:</span>
                                          <input
                                            type="number"
                                            value={editingPlatform === p.key ? editStreak : String(streak)}
                                            onChange={e => { setEditingPlatform(p.key); setEditStreak(e.target.value); }}
                                            onFocus={() => { setEditingPlatform(p.key); setEditStreak(String(streak)); }}
                                            onKeyDown={e => {
                                              if (e.key === "Enter") updateStreak(p.key, parseInt(editStreak) || 0);
                                              if (e.key === "Escape") setEditingPlatform(null);
                                            }}
                                            className="w-14 h-8 px-2 bg-slate-950 border border-slate-800 focus:border-violet-500/50 rounded-lg text-slate-200 text-xs font-bold text-center outline-none"
                                          />
                                          {editingPlatform === p.key && (
                                            <Button
                                              onClick={() => updateStreak(p.key, parseInt(editStreak) || 0)}
                                              size="sm"
                                              className="h-8 text-[10px] font-bold text-white px-3"
                                              style={{ background: p.accent }}
                                            >
                                              Save
                                            </Button>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-1 py-1">
                                        {platformHeatmapData.map((d, index) => (
                                          <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.002 }}
                                            className="w-4 h-4 rounded-[3px] border border-slate-950/10 cursor-pointer"
                                            style={{
                                              background: d.active ? p.accent : "rgba(107,92,231,0.06)",
                                              boxShadow: d.active ? `0 0 6px ${p.accent}55` : "none"
                                            }}
                                            whileHover={{ scale: 1.25 }}
                                            title={d.active ? `Day ${index + 1}: Active` : `Day ${index + 1}: Inactive`}
                                          />
                                        ))}
                                      </div>

                                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                                        <span>Inactive</span>
                                        <div className="w-3 h-3 rounded-[3px] bg-slate-900/30" />
                                        <div className="w-3 h-3 rounded-[3px]" style={{ background: p.accent }} />
                                        <span>Active Streak</span>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Custom Platform */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Don't see your platform?</span>
                      <Button
                        onClick={() => setShowAddPlatform(!showAddPlatform)}
                        variant="outline"
                        className={`border-slate-800 text-xs flex items-center gap-1.5 h-9 ${
                          showAddPlatform ? "text-pink-400 bg-pink-950/10 hover:bg-pink-950/25 border-pink-950/20" : "text-violet-400 hover:bg-violet-950/10"
                        }`}
                      >
                        <Plus size={14} /> {showAddPlatform ? "Cancel" : "Add Custom Platform"}
                      </Button>
                    </div>

                    {showAddPlatform && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950/30 border border-slate-900 rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                      >
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Platform Name *</label>
                          <Input type="text" value={newPlatform.name} onChange={e => setNewPlatform({ ...newPlatform, name: e.target.value })} placeholder="e.g. Kaggle" className="bg-slate-950/60 border-slate-800 text-slate-200 h-10" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Website URL *</label>
                          <Input type="text" value={newPlatform.url} onChange={e => setNewPlatform({ ...newPlatform, url: e.target.value })} placeholder="e.g. kaggle.com" className="bg-slate-950/60 border-slate-800 text-slate-200 h-10" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                          <Input type="text" value={newPlatform.desc} onChange={e => setNewPlatform({ ...newPlatform, desc: e.target.value })} placeholder="e.g. ML Competitions" className="bg-slate-950/60 border-slate-800 text-slate-200 h-10" />
                        </div>
                        <Button onClick={addCustomPlatform} className="bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold h-10 hover:from-violet-700 hover:to-pink-600">+ Add</Button>
                      </motion.div>
                    )}

                    {customPlatforms.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900/50 mt-1">
                        {customPlatforms.map(cp => (
                          <div key={cp.key} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 rounded-full px-3 py-1.5 text-xs text-violet-300">
                            <span className="font-bold">{cp.emoji} {cp.name}</span>
                            <button onClick={() => removeCustomPlatform(cp.key)} className="hover:text-red-400 transition-colors text-sm font-extrabold cursor-pointer ml-1 leading-none" title={`Remove ${cp.name}`}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Competency & Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Skill Radar */}
                <motion.div whileHover={{ y: -2 }}>
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6 h-full flex flex-col justify-between">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-sm font-bold text-slate-300">My Skill Level</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow flex items-center justify-center">
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
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Growth Milestones */}
                <motion.div whileHover={{ y: -2 }}>
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6 h-full flex flex-col justify-between">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-sm font-bold text-slate-300">My Growth Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow flex flex-col gap-4">
                      {milestones.map(m => (
                        <div
                          key={m.id}
                          className={`p-4 rounded-xl border ${
                            m.completed ? "bg-pink-500/5 border-pink-500/20" : "bg-slate-900/40 border-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {m.completed ? <CheckCircle2 className="text-pink-500" size={16} /> : <Circle className="text-slate-500" size={16} />}
                              <span className={`text-xs font-bold ${m.completed ? "text-slate-200" : "text-slate-400"}`}>
                                {m.title} {m.completed && <span className="text-[9px] text-yellow-400 font-extrabold ml-1 animate-pulse">(+500 XP)</span>}
                              </span>
                            </div>
                            <span className="text-xs font-extrabold text-pink-500">{m.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.progress}%` }}
                              transition={{ duration: 1 }}
                              className={`h-full rounded-full ${m.completed ? "bg-pink-500" : "bg-pink-500/40"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Study Habit Tracker Heatmap */}
              <motion.div whileHover={{ y: -2 }}>
                <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Award size={16} className="text-pink-500" /> Study Habit Tracker
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto pr-2 mb-4">
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
                            transition={{ delay: i * 0.002 }}
                            className="w-4 h-4 rounded-[3px] cursor-crosshair border border-slate-950/40"
                            style={{ background: bg }}
                            whileHover={{ scale: 1.25 }}
                            title={`${d.date}: ${d.hours.toFixed(1)} hours`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 mb-4">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-[3px] bg-slate-800/20" />
                        <div className="w-3 h-3 rounded-[3px] bg-pink-500/25" />
                        <div className="w-3 h-3 rounded-[3px] bg-pink-500/60" />
                        <div className="w-3 h-3 rounded-[3px] bg-pink-500" />
                      </div>
                      <span>More</span>
                    </div>
                    <div className="border-t border-slate-800/60 pt-4 flex justify-between text-xs text-slate-400 font-bold">
                      <span>Total Study Time:</span>
                      <span className="text-slate-200">{totalHours} Hours</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}