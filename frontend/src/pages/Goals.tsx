import React, { useState, useEffect, useRef, FC } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Heart,
  DollarSign,
  Briefcase,
  Sparkles,
  ShieldCheck,
  ClipboardList,
  Clock,
  Beaker,
  TrendingUp,
  Brain,
  Moon,
  Rocket,
  Zap,
  Target,
  RefreshCw,
  ChevronRight,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGamification } from "@/hooks/useGamification";


// ── MetricCard (same pattern as Health page) ──────────────────────────────────
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  valueClassName?: string;
}

const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  unit = "",
  icon,
  description,
  valueClassName,
}) => (
  <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }} className="flex-grow">
    <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-violet-300 tracking-wide uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-1">
        <div className={`text-2xl font-extrabold text-white tracking-tight ${valueClassName}`}>
          {value}{" "}
          <span className="text-xs font-semibold text-slate-400 ml-0.5">{unit}</span>
        </div>
        {description && (
          <p className="text-[10px] text-slate-400 mt-1 font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

// ── AI Insight Card ───────────────────────────────────────────────────────────
interface AIInsightCardProps {
  icon: React.ReactNode;
  domain: string;
  text: string;
  color: string;
  bg: string;
}

const AIInsightCard: FC<AIInsightCardProps> = ({ icon, domain, text, color, bg }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-start gap-3 p-3.5 rounded-xl border border-slate-800/60 ${bg}`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-slate-900/60`}>
      <span className={color}>{icon}</span>
    </div>
    <div className="flex-1">
      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
        {domain}
      </span>
      <p className="text-xs font-semibold text-slate-200 leading-relaxed">{text}</p>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function Goals() {
  const { themeColors } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [realGoals, setRealGoals] = useState<any[]>([]);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [realIncome, setRealIncome] = useState(50000);

  // ── Simulator sliders ──────────────────────────────────────────────────────
  const [params, setParams] = useState({
    study: 2,
    exercise: 3,
    savings: 30,
    sleep: 7,
    dining: 4,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  // ── AI Insights state ─────────────────────────────────────────────────────
  interface Insight {
    domain: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    text: string;
  }

  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightError, setInsightError] = useState("");

  // ── AI Simulation (existing) ───────────────────────────────────────────────
  const [aiInsight, setAiInsight] = useState<string | null>(
    "Adjust sliders and click Generate AI Insight to get a 6-month life projection."
  );
  const [isAiLoading, setIsAiLoading] = useState(false);

  // ── Fetch telemetry and goals on mount ────────────────────────────────────
  useEffect(() => {
    const fetchTelemetryAndGoals = async () => {
      try {
        const storedUser = localStorage.getItem("vitacore_user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        // Fetch everything in parallel
        const [goalsRes, finRes, healthRes, careerRes] = await Promise.all([
          axios.get("http://localhost:5000/api/goals", config),
          axios.get("http://localhost:5000/api/finance", config),
          axios.get("http://localhost:5000/api/health", config),
          axios.get("http://localhost:5000/api/career", config),
        ]);

        if (Array.isArray(goalsRes.data)) {
          setRealGoals(goalsRes.data);
        }

        // Calculate real telemetry to initialize sliders
        const finLogs = Array.isArray(finRes.data) ? finRes.data : [];
        let loggedIncome = 0;
        let expenses = 0;
        finLogs.forEach((item) => {
          if (item.type === "Income") loggedIncome += item.amount;
          else if (item.type === "Expense") expenses += item.amount;
        });
        const userIncome = loggedIncome > 0 ? loggedIncome : (user?.income || 50000);
        setRealIncome(userIncome);
        const savings = userIncome - expenses;
        const savingsRate = userIncome > 0 ? Math.round((savings / userIncome) * 100) : 30;

        const healthLogs = Array.isArray(healthRes.data) ? healthRes.data : [];
        const latestHealth = healthLogs[0] || {};
        const realSleep = latestHealth.sleepHours || 7;
        const workoutCount = healthLogs.filter(h => h.workoutMinutes > 0).length;

        const careerLogs = Array.isArray(careerRes.data) ? careerRes.data : [];
        const totalMinutes = careerLogs.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
        const studyHoursPerDay = Math.round((totalMinutes / 60 / Math.max(1, careerLogs.length)) * 10) / 10;

        setParams({
          study: Math.min(8, Math.max(0, studyHoursPerDay)) || 2,
          exercise: Math.min(7, Math.max(0, workoutCount)) || 3,
          savings: Math.min(80, Math.max(0, savingsRate)) || 30,
          sleep: Math.min(10, Math.max(4, realSleep)) || 7,
          dining: 4,
        });

      } catch (error) {
        console.error("Error fetching telemetry and goals:", error);
      }
    };

    fetchTelemetryAndGoals();
    fetchAIInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── Fetch multi-domain AI insights ───────────────────────────────────────
  const fetchAIInsights = async () => {
    setIsLoadingInsights(true);
    setInsightError("");
    try {
      const storedUser = localStorage.getItem("vitacore_user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) {
        setInsightError("Please log in to view AI insights.");
        return;
      }

      const domains = [
        {
          domain: "Health",
          message:
            "Based on my recent health logs (sleep, exercise, stress), give me one specific actionable health insight in 1-2 sentences.",
          icon: <Moon size={16} />,
          color: "text-rose-400",
          bg: "bg-rose-500/5",
        },
        {
          domain: "Finance",
          message:
            "Based on my recent income and expenses, give me one specific actionable financial insight in 1-2 sentences.",
          icon: <Rocket size={16} />,
          color: "text-emerald-400",
          bg: "bg-emerald-500/5",
        },
        {
          domain: "Career",
          message:
            "Based on my recent study logs and topics, give me one specific actionable career insight in 1-2 sentences.",
          icon: <Zap size={16} />,
          color: "text-indigo-400",
          bg: "bg-indigo-500/5",
        },
      ];

      const results = await Promise.allSettled(
        domains.map((d) =>
          axios.post(
            "http://localhost:5000/api/ai/recommend",
            { domain: d.domain, message: d.message },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      const built: Insight[] = results.map((res, i) => ({
        domain: domains[i].domain,
        icon: domains[i].icon,
        color: domains[i].color,
        bg: domains[i].bg,
        text:
          res.status === "fulfilled"
            ? res.value.data?.recommendation || "No insight available."
            : "Could not load insight. Try again.",
      }));
      setInsights(built);
    } catch (err) {
      console.error("AI Insights error:", err);
      setInsightError("Failed to load AI insights. Please try again.");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // ── Score calculations ────────────────────────────────────────────────────
  const computeScores = () => {
    const healthScore = Math.round(
      Math.min(100, Math.max(0, 70 + params.exercise * 3 + (params.sleep - 6) * 6 - params.dining * 1.5))
    );
    const financeScore = Math.round(
      Math.min(100, Math.max(0, 40 + params.savings * 0.9 - params.dining * 1.2))
    );
    const careerScore = Math.round(
      Math.min(100, Math.max(0, 60 + params.study * 6 - (params.sleep < 6 ? 12 : 0)))
    );
    const monthlySavings = Math.round(realIncome * (params.savings / 100) - params.dining * 2000);
    return { healthScore, financeScore, careerScore, monthlySavings };
  };

  const scores = computeScores();

  const overviewScores = [
    {
      label: "Health Score",
      value: scores.healthScore,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      valueClassName: "text-rose-400",
      description: `Exercise ${params.exercise}d/wk · Sleep ${params.sleep}h`,
    },
    {
      label: "Financial Health",
      value: scores.financeScore,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      valueClassName: "text-emerald-400",
      description: `Savings rate ${params.savings}% · Dining ${params.dining}x/wk`,
    },
    {
      label: "Career Progress",
      value: scores.careerScore,
      icon: Briefcase,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      valueClassName: "text-indigo-400",
      description: `Study ${params.study}h/day`,
    },
  ];

  // ── Goal cards ────────────────────────────────────────────────────────────
  const getColorForDomain = (domain: string) => {
    if (domain === "Health") return "#f43f5e";
    if (domain === "Finance") return "#10b981";
    return "#6366f1";
  };

  const goalCards =
    realGoals.length > 0
      ? realGoals.map((g) => {
          const isFinance = g.domain === "Finance";
          const isHealth = g.domain === "Health";
          const isCareer = g.domain === "Career";
          let progress = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100)) || 0;
          let desc = isFinance
            ? `Save toward target of ₹${g.targetValue.toLocaleString()}`
            : `Target: ${g.targetValue}`;
          let deadline = g.deadline ? `Target: ${new Date(g.deadline).toLocaleDateString()}` : "Active";

          if (isFinance && g.targetValue - g.currentValue > 0) {
            const remaining = g.targetValue - g.currentValue;
            if (scores.monthlySavings <= 0) {
              desc = `Save ₹${g.targetValue.toLocaleString()} | ⚠️ Negative savings rate.`;
            } else {
              const months = remaining / scores.monthlySavings;
              const projected = new Date();
              projected.setMonth(projected.getMonth() + months);
              desc = `Save ₹${g.targetValue.toLocaleString()} | Projected: ${projected.toLocaleDateString(undefined, { year: "numeric", month: "short" })} (${months.toFixed(1)} mo)`;
            }
          } else if (isHealth) {
            if (g.title.toLowerCase().includes("exercise") || g.title.toLowerCase().includes("workout")) {
              progress = Math.min(100, Math.round((params.exercise / 4) * 100));
              desc = `4 exercise sessions/wk (simulating ${params.exercise})`;
              deadline = params.exercise >= 4 ? "Target met!" : "Needs more exercise";
            }
          } else if (isCareer) {
            if (g.title.toLowerCase().includes("study") || g.title.toLowerCase().includes("hour")) {
              const weeklyHours = params.study * 7;
              progress = Math.min(100, Math.round((weeklyHours / 15) * 100));
              desc = `15 study hrs/wk (simulating ${weeklyHours} hrs)`;
              deadline = weeklyHours >= 15 ? "Completed!" : "In progress";
            }
          }
          return { title: g.title, category: g.domain, desc, progress, color: getColorForDomain(g.domain), deadline };
        })
      : [
          {
            title: "Workout Consistency",
            category: "Health",
            desc: `Maintain 4 sessions/wk (simulating ${params.exercise})`,
            progress: Math.min(100, Math.round((params.exercise / 4) * 100)),
            color: "#f43f5e",
            deadline: params.exercise >= 4 ? "Target met!" : "In progress",
          },
          {
            title: "Liquidity Reserve",
            category: "Finance",
            desc: (() => {
              const monthlySavings = scores.monthlySavings;
              if (monthlySavings <= 0) return "⚠️ Negative savings rate.";
              const months = 40000 / monthlySavings;
              const d = new Date();
              d.setMonth(d.getMonth() + months);
              return `Target ₹1,00,000 | ~${months.toFixed(1)} months away`;
            })(),
            progress: Math.min(100, Math.round((params.savings / 30) * 60)),
            color: "#10b981",
            deadline: "Ongoing",
          },
          {
            title: "Algorithmic Focus Hours",
            category: "Career",
            desc: `15 study hrs/wk (simulating ${params.study * 7} hrs)`,
            progress: Math.min(100, Math.round((params.study * 7 / 15) * 100)),
            color: "#6366f1",
            deadline: params.study * 7 >= 15 ? "On track!" : "In progress",
          },
        ];

  // ── 6-month simulation chart ──────────────────────────────────────────────
  const generateData = () => {
    const data = [];
    let baseHealth = 70 + params.exercise * 2 + (params.sleep - 6) * 5 - params.dining;
    let baseCareer = 60 + params.study * 5 - (params.sleep < 6 ? 10 : 0);
    for (let i = 0; i < 6; i++) {
      data.push({
        month: `M${i + 1}`,
        health: Math.min(100, Math.max(0, baseHealth + i * (params.exercise * 0.5))),
        career: Math.min(100, Math.max(0, baseCareer + i * params.study)),
        finance: Math.min(100, scores.financeScore + i * 2),
      });
    }
    return data;
  };

  const chartData = generateData();

  const handleSliderChange = (key: keyof typeof params, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 500);
  };

  // ── Simulator AI insight ───────────────────────────────────────────────────
  const fetchSimAiInsight = async () => {
    setIsAiLoading(true);
    try {
      const storedUser = localStorage.getItem("vitacore_user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) { setAiInsight("Please log in to use AI Insights."); return; }

      const scenario =
        `Study ${params.study}h/day, exercise ${params.exercise}d/wk, sleep ${params.sleep}h/night, ` +
        `save ${params.savings}% income (~₹${scores.monthlySavings.toLocaleString()} monthly), ` +
        `dine out ${params.dining}x/wk. Scores: Health ${scores.healthScore}, Finance ${scores.financeScore}, Career ${scores.careerScore}. ` +
        `Predict 6-month health, financial, career outcomes. List 2-3 action steps.`;

      const response = await axios.post(
        "http://localhost:5000/api/ai/simulate",
        { scenario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiInsight(response.data.analysis || "No insight returned.");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setAiInsight("Session expired. Please log in again.");
      } else {
        setAiInsight("AI service temporarily unavailable.");
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const { level, xp, levelName } = useGamification();
  const completedGoalsCount = goalCards.filter(g => g.progress >= 100).length;
  const totalEarnedPoints = completedGoalsCount * 100;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div
        className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans flex flex-col"
        style={{ background: themeColors.background }}
      >
        {/* Faint background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url('/health_bg.png')" }}
        />

        <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start w-full flex-1">

            {/* ── LEFT PANEL (sticky, same as Health) ── */}
            <div className="xl:col-span-1 flex flex-col gap-6 xl:sticky xl:top-8 shrink-0">

              {/* AI Insights Panel */}
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
                    AI Insights
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-[10px] mt-0.5">
                    Live recommendations from your Digital Twin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-1 flex flex-col gap-3">
                  {isLoadingInsights ? (
                    <div className="flex flex-col gap-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-16 rounded-xl bg-slate-900/50 border border-slate-800/40 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : insightError ? (
                    <p className="text-xs text-red-400 font-semibold text-center py-4">{insightError}</p>
                  ) : (
                    insights.map((ins, i) => (
                      <AIInsightCard key={i} {...ins} />
                    ))
                  )}

                  <Button
                    onClick={fetchAIInsights}
                    disabled={isLoadingInsights}
                    className="w-full mt-1 h-9 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-xl border-0 text-xs flex items-center gap-2 justify-center"
                  >
                    {isLoadingInsights ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={12} />
                        Refresh Insights
                      </>
                    )}
                  </Button>

                  {/* Navigate to Simulator */}
                  <button
                    onClick={() => simulatorRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full mt-1 h-9 rounded-xl bg-gradient-to-r from-fuchsia-600/80 to-pink-600/80 hover:from-fuchsia-600 hover:to-pink-600 text-white font-black text-xs flex items-center gap-2 justify-center border-0 cursor-pointer transition-all"
                  >
                    <Beaker size={13} />
                    Run 'What-if' Simulation
                  </button>
                </CardContent>
              </Card>

              {/* Quick Stats Panel */}
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet-400" />
                    Live Simulator State
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col gap-2.5">
                  {[
                    { label: "Study", val: `${params.study}h/day`, color: "text-pink-400" },
                    { label: "Exercise", val: `${params.exercise}d/wk`, color: "text-violet-400" },
                    { label: "Savings", val: `${params.savings}%`, color: "text-blue-400" },
                    { label: "Sleep", val: `${params.sleep}h/night`, color: "text-emerald-400" },
                    { label: "Dining Out", val: `${params.dining}x/wk`, color: "text-rose-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">{row.label}</span>
                      <span className={`font-extrabold ${row.color}`}>{row.val}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-800/60 mt-1 pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">Monthly Savings:</span>
                    <span className={`font-black ${scores.monthlySavings > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      ₹{scores.monthlySavings.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── RIGHT PANEL: Main Dashboard Hub ── */}
            <div className="xl:col-span-3 flex flex-col gap-6 md:gap-8 xl:pr-4 xl:pb-12">

              {/* Header (same style as Health) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    My Digital Twin
                  </h1>
                  <p className="text-slate-200 mt-1 font-semibold text-xs md:text-sm">
                    Unified telemetry, AI insights & life simulation.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 rounded-full px-4 py-1.5">
                  <ShieldCheck className="text-emerald-500 h-4 w-4 animate-pulse shrink-0" />
                  <span className="text-sm font-semibold text-emerald-300">All Systems Nominal</span>
                </div>
              </div>

              {/* Gamification Status Banner */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full relative overflow-hidden"
              >
                <Card className="glass-card border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-5 relative overflow-hidden rounded-2xl">
                  {/* Glowing background */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-amber-500/10">
                        {level}
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Digital Twin Rank</span>
                        <h3 className="text-white text-lg font-black mt-0.5">{levelName}</h3>
                        <div className="text-[11px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                          <span>{xp} / 5000 XP</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-amber-300 font-extrabold flex items-center gap-1">
                            🏆 {totalEarnedPoints} Points
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-48 text-left">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
                        <span>XP Progress</span>
                        <span>{Math.round((xp / 5000) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full"
                          style={{ width: `${(xp / 5000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Metric Cards (same layout as Health page) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {overviewScores.map((score) => (
                  <MetricCard
                    key={score.label}
                    title={score.label}
                    value={`${score.value}%`}
                    icon={<score.icon className={`h-4 w-4 ${score.color}`} />}
                    description={score.description}
                    valueClassName={score.valueClassName}
                  />
                ))}
              </div>

              {/* Goal Trajectories */}
              <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-violet-400" />
                    Active Goal Trajectories
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Live progression indices of your personal objectives.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-0">
                  {goalCards.map((goal, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-xl flex flex-col gap-3 hover:bg-slate-800/20 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${goal.color}15`,
                              color: goal.color,
                              border: `1px solid ${goal.color}30`,
                            }}
                          >
                            {goal.category}
                          </span>
                          <h4 className="text-white font-bold text-sm">{goal.title}</h4>
                          {goal.progress >= 100 && (
                            <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold px-2 py-0.5 rounded animate-pulse shrink-0">
                              🏆 +500 XP & 100 pts
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{goal.deadline}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{goal.desc}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-300 w-8 text-right">
                          {goal.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* ── Interactive Life Simulator ── */}
              <div ref={simulatorRef} className="scroll-mt-6">
                <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
                  <CardHeader className="pb-4 border-b border-slate-800/60 flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-violet-400" />
                        Interactive Life Simulator
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs mt-1">
                        Adjust lifestyle parameters and simulate 6-month life vectors in real-time.
                      </CardDescription>
                    </div>
                    <AnimatePresence mode="wait">
                      {isSimulating ? (
                        <motion.div
                          key="processing"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-violet-500/15 border border-violet-500/30 text-white rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        >
                          <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-ping" />
                          Processing...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-slate-900/85 border border-slate-800 text-slate-300 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        >
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                          Idle
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                      {/* Sliders */}
                      <div className="lg:col-span-4 flex flex-col gap-5 bg-slate-950/25 p-4 rounded-xl border border-slate-800/40">
                        {[
                          { key: "study", label: "Study Duration", min: 0, max: 8, step: 1, unit: "h/day", color: "accent-pink-500", badge: "text-pink-400 bg-pink-500/10" },
                          { key: "exercise", label: "Exercise Frequency", min: 0, max: 7, step: 1, unit: "d/wk", color: "accent-violet-500", badge: "text-violet-400 bg-violet-500/10" },
                          { key: "savings", label: "Savings Rate", min: 0, max: 80, step: 5, unit: "%", color: "accent-blue-500", badge: "text-blue-400 bg-blue-500/10" },
                          { key: "sleep", label: "Sleep Allocation", min: 4, max: 10, step: 0.5, unit: "hrs", color: "accent-emerald-500", badge: "text-emerald-400 bg-emerald-500/10" },
                          { key: "dining", label: "Dining Out", min: 0, max: 14, step: 1, unit: "meals/wk", color: "accent-rose-500", badge: "text-rose-400 bg-rose-500/10" },
                        ].map((slider) => (
                          <div key={slider.key} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-slate-400 text-xs">{slider.label}</span>
                              <span className={`font-extrabold px-2 py-0.5 rounded text-[11px] ${slider.badge}`}>
                                {params[slider.key as keyof typeof params]} {slider.unit}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={slider.min}
                              max={slider.max}
                              step={slider.step}
                              value={params[slider.key as keyof typeof params]}
                              onChange={(e) =>
                                handleSliderChange(slider.key as keyof typeof params, Number(e.target.value))
                              }
                              className={`w-full h-1.5 rounded-lg bg-slate-950 appearance-none cursor-pointer ${slider.color}`}
                            />
                          </div>
                        ))}

                        <div className="mt-2 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400">Monthly Savings Vector:</span>
                          <span className={`font-black ${scores.monthlySavings > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            ₹{scores.monthlySavings.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Chart + Mini Projections */}
                      <div className="lg:col-span-8 flex flex-col gap-4">
                        <div className="relative bg-slate-950/25 p-4 rounded-xl border border-slate-800/40">
                          {isSimulating && (
                            <div className="absolute inset-0 z-20 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                            </div>
                          )}
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="simHealthGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id="simCareerGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e91e8c" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#e91e8c" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id="simFinanceGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} style={{ fontSize: "10px", fontWeight: "bold" }} />
                                <YAxis stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} domain={[0, 100]} style={{ fontSize: "10px", fontWeight: "bold" }} />
                                <RechartsTooltip contentStyle={{ backgroundColor: "rgba(15,12,38,0.95)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "12px", color: "#fff" }} />
                                <Area type="monotone" dataKey="health" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#simHealthGrad)" name="Health" />
                                <Area type="monotone" dataKey="career" stroke="#e91e8c" strokeWidth={2.5} fill="url(#simCareerGrad)" name="Career" />
                                <Area type="monotone" dataKey="finance" stroke="#10b981" strokeWidth={2.5} fill="url(#simFinanceGrad)" name="Finance" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Mini projection badges */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Health Trend", val: scores.healthScore > 70 ? "Optimizing" : "Declining", color: "text-violet-400", badge: "text-[9px] font-bold text-violet-400 uppercase tracking-wider" },
                            { label: "Weekly Velocity", val: params.exercise >= 3 ? "Active" : "Sedentary", color: "text-blue-400", badge: "text-[9px] font-bold text-blue-400 uppercase tracking-wider" },
                            { label: "Career Path", val: scores.careerScore > 80 ? "Promotion Ready" : "Skill Deficit", color: "text-pink-400", badge: "text-[9px] font-bold text-pink-400 uppercase tracking-wider" },
                          ].map((item) => (
                            <div key={item.label} className="bg-slate-950/20 border border-slate-800/40 p-3 rounded-xl flex flex-col gap-1">
                              <span className={item.badge}>{item.label}</span>
                              <span className={`text-sm font-black text-white`}>{item.val}</span>
                            </div>
                          ))}
                        </div>

                        {/* Simulation AI Insight */}
                        <div className="mt-2 pt-4 border-t border-slate-800/60">
                          <div className="flex justify-between items-center flex-wrap gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Brain className="h-5 w-5 text-amber-400 shrink-0" />
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Future Life Outlook
                              </span>
                            </div>
                            <Button
                              onClick={fetchSimAiInsight}
                              disabled={isAiLoading}
                              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-violet-950/20 border-0 h-8"
                            >
                              {isAiLoading ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Generate AI Insight
                                </>
                              )}
                            </Button>
                          </div>
                          {aiInsight && (
                            <div className="p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/10 text-slate-300 text-xs leading-relaxed font-medium italic">
                              {aiInsight}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-violet-400" />
                    Digital Twin Activity Ledger
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Local telemetry logs recorded for optimization loops today.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex flex-col gap-5 relative pl-4 border-l border-slate-800/80 ml-2">
                    {[
                      { time: "08:15 AM", event: "Morning Hydration Sync", detail: "2 glasses logged", status: "success" },
                      { time: "10:30 AM", event: "Algorithmic Focus session", detail: "3 hours on Career module", status: "success" },
                      { time: "02:45 PM", event: "Caloric Intake optimization", detail: "Metabolic balance updated", status: "info" },
                      { time: "06:00 PM", event: "Daily Twin Telemetry backup", detail: "System integrity verified", status: "backup" },
                    ].map((evt, i) => (
                      <div key={i} className="relative flex flex-col gap-1">
                        <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 border border-slate-950 shadow-md shadow-violet-950" />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-violet-400">{evt.time}</span>
                            <span className="text-xs font-extrabold text-slate-200">{evt.event}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">{evt.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>{/* end right panel */}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}