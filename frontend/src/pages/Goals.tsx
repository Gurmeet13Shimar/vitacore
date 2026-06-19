import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, DollarSign, Briefcase, Sparkles, Compass, 
  ArrowRight, ShieldCheck, ClipboardList, Clock, CheckCircle2,
  Beaker, TrendingUp, Brain
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function Goals() {
  const { themeColors, theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [realGoals, setRealGoals] = useState<any[]>([]);

  // Simulator State
  const [params, setParams] = useState({
    study: 2,
    exercise: 3,
    savings: 30,
    sleep: 7,
    dining: 4,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(
    "Adjust sliders and click Generate AI Insight to get a 6-month life projection."
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const simulatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/goals");
        if (Array.isArray(res.data)) {
          setRealGoals(res.data);
        }
      } catch (error) {
        console.error("Error fetching goals in twin dashboard:", error);
      }
    };
    fetchGoals();
  }, []);

  // =========================
  // LOCAL SCORE CALCULATIONS (instant, no backend)
  // =========================
  const computeScores = () => {
    const healthScore = Math.round(
      Math.min(100, Math.max(0,
        70 + (params.exercise * 3) + ((params.sleep - 6) * 6) - (params.dining * 1.5)
      ))
    );
    const financeScore = Math.round(
      Math.min(100, Math.max(0,
        40 + (params.savings * 0.9) - (params.dining * 1.2)
      ))
    );
    const careerScore = Math.round(
      Math.min(100, Math.max(0,
        60 + (params.study * 6) - (params.sleep < 6 ? 12 : 0)
      ))
    );
    const monthlySavings = Math.round(50000 * (params.savings / 100) - params.dining * 2000);
    return { healthScore, financeScore, careerScore, monthlySavings };
  };

  const scores = computeScores();

  // Dynamic scores for the digital twin
  const overviewScores = [
    { label: "Health Score", value: scores.healthScore, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Financial Health", value: scores.financeScore, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Career Progress", value: scores.careerScore, icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  ];

  const getColorForDomain = (domain: string) => {
    if (domain === "Health") return "#f43f5e";
    if (domain === "Finance") return "#10b981";
    return "#6366f1";
  };

  // Interactive Goal Calculations
  const goalCards = realGoals.length > 0 
    ? realGoals.map(g => {
        const isFinance = g.domain === "Finance";
        const isHealth = g.domain === "Health";
        const isCareer = g.domain === "Career";

        let progress = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100)) || 0;
        let desc = isFinance 
          ? `Save toward target of ₹${g.targetValue.toLocaleString()}`
          : `Target objective: ${g.targetValue}`;
        let deadline = g.deadline ? `Target: ${new Date(g.deadline).toLocaleDateString()}` : "Active";

        if (isFinance) {
          const remaining = g.targetValue - g.currentValue;
          if (remaining > 0) {
            const monthlySavings = scores.monthlySavings;
            if (monthlySavings <= 0) {
              desc = `Save toward target of ₹${g.targetValue.toLocaleString()} | ⚠️ Warning: Negative savings rate. Will not reach goal.`;
            } else {
              const months = remaining / monthlySavings;
              const projectedDate = new Date();
              projectedDate.setMonth(projectedDate.getMonth() + months);
              desc = `Save toward target of ₹${g.targetValue.toLocaleString()} | Projected Reached: ${projectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} (${months.toFixed(1)} months remaining)`;
            }
          }
        } else if (isHealth) {
          if (g.title.toLowerCase().includes("exercise") || g.title.toLowerCase().includes("workout")) {
            progress = Math.min(100, Math.round((params.exercise / 4) * 100));
            desc = `Maintain 4 exercise sessions per week (Currently simulating ${params.exercise} sessions/wk)`;
            deadline = params.exercise >= 4 ? "Target met!" : "Needs more exercise";
          }
        } else if (isCareer) {
          if (g.title.toLowerCase().includes("study") || g.title.toLowerCase().includes("hour")) {
            const weeklyHours = params.study * 7;
            progress = Math.min(100, Math.round((weeklyHours / 15) * 100));
            desc = `Log 15 study hours weekly (Simulating ${weeklyHours} hrs/wk)`;
            deadline = weeklyHours >= 15 ? "Completed this week" : "In progress";
          }
        }

        return {
          title: g.title,
          category: g.domain,
          desc: desc,
          progress: progress,
          color: getColorForDomain(g.domain),
          deadline: deadline
        };
      })
    : [
        { 
          title: "Workout Consistency", 
          category: "Health",
          desc: `Maintain 4 exercise sessions per week (Currently simulating ${params.exercise} sessions/wk)`, 
          progress: Math.min(100, Math.round((params.exercise / 4) * 100)), 
          color: "#f43f5e", 
          deadline: params.exercise >= 4 ? "Target met!" : "Needs more exercise" 
        },
        { 
          title: "Liquidity Reserve Target", 
          category: "Finance", 
          desc: (() => {
            const target = 100000;
            const current = 60000;
            const remaining = target - current;
            const monthlySavings = scores.monthlySavings;
            if (monthlySavings <= 0) return "Save assets | ⚠️ Warning: Negative savings rate. Will not reach goal.";
            const months = remaining / monthlySavings;
            const targetDate = new Date();
            targetDate.setMonth(targetDate.getMonth() + months);
            return `Save assets | Projected Reached: ${targetDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} (${months.toFixed(1)} months remaining)`;
          })(), 
          progress: Math.min(100, Math.round((params.savings / 30) * 60)), 
          color: "#10b981", 
          deadline: "8 days remaining" 
        },
        { 
          title: "Algorithmic Focus Hours", 
          category: "Career", 
          desc: `Log 15 study hours weekly (Simulating ${params.study * 7} hrs/wk)`, 
          progress: Math.min(100, Math.round((params.study * 7 / 15) * 100)), 
          color: "#6366f1", 
          deadline: params.study * 7 >= 15 ? "Completed this week" : "In progress" 
        },
      ];

  // AI Recommendation feed - interactive
  const recommendations = [
    {
      id: 1,
      domain: "Health",
      insight: "Dehydration state detected during late night work cycle. Replenish fluid volume.",
      actionText: "Log Hydration",
      onClick: () => navigate("/health"),
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      id: 2,
      domain: "Finance",
      insight: "A 5% savings rate adjustment will accelerate your Net Capital milestone by 18 days.",
      actionText: "Adjust Savings Rate",
      onClick: () => {
        setParams(p => ({ ...p, savings: Math.min(80, p.savings + 5) }));
        simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
      },
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      id: 3,
      domain: "Career",
      insight: "Excellent daily focus consistency logged. Your profile is ready for promotion simulation.",
      actionText: "View Career Tracker",
      onClick: () => navigate("/career"),
      icon: Briefcase,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    }
  ];

  // Mock activity timeline
  const timelineEvents = [
    { time: "08:15 AM", event: "Morning Hydration Sync completed", detail: "2 glasses logged", status: "success" },
    { time: "10:30 AM", event: "Algorithmic Focus session logged", detail: "3 hours on Career module", status: "success" },
    { time: "02:45 PM", event: "Caloric Intake optimization update", detail: "Metabolic balance updated", status: "info" },
    { time: "06:00 PM", event: "Daily Twin Telemetry backup created", detail: "System integrity verified", status: "backup" }
  ];

  // =========================
  // AI BACKEND CALL → Express /api/ai/simulate (JWT protected, LLM powered)
  // =========================
  const fetchAiInsight = async () => {
    setIsAiLoading(true);
    try {
      const storedUser = localStorage.getItem("vitacore_user");
      const token = storedUser ? JSON.parse(storedUser).token : null;

      if (!token) {
        setAiInsight("Please log in to use AI Insights.");
        return;
      }

      const scenario =
        `My current lifestyle: I study ${params.study} hours/day, ` +
        `exercise ${params.exercise} days/week, sleep ${params.sleep} hours/night, ` +
        `save ${params.savings}% of my income (~₹${scores.monthlySavings.toLocaleString()} saved monthly), ` +
        `and dine out ${params.dining} meals/week. ` +
        `Projected scores: Health ${scores.healthScore}/100, Finance ${scores.financeScore}/100, Career ${scores.careerScore}/100. ` +
        `If I maintain this exact lifestyle for 6 months, what are my predicted health, financial, and career outcomes? ` +
        `List specific risks, benefits, and 2-3 action steps I should take.`;

      const response = await axios.post(
        "http://localhost:5000/api/ai/simulate",
        { scenario },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAiInsight(response.data.analysis || "No insight returned from AI.");
    } catch (error: any) {
      console.error("AI Insight Error:", error);
      if (error.response?.status === 401) {
        setAiInsight("Session expired. Please log in again to use AI Insights.");
      } else if (error.response?.status === 429) {
        setAiInsight("Rate limit reached. Please wait a moment before generating another insight.");
      } else {
        setAiInsight("AI service temporarily unavailable. Please try again shortly.");
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  // =========================
  // CHART DATA GENERATION
  // =========================
  const generateData = () => {
    const data = [];

    let baseHealth =
      70 +
      (params.exercise * 2) +
      ((params.sleep - 6) * 5) -
      (params.dining * 1);

    let baseFinance =
      5000 +
      (params.savings * 100) -
      (params.dining * 200);

    let baseCareer =
      60 +
      (params.study * 5) -
      (params.sleep < 6 ? 10 : 0);

    for (let i = 0; i < 6; i++) {
      data.push({
        month: `Month ${i + 1}`,
        health: Math.min(100, Math.max(0, baseHealth + (i * (params.exercise * 0.5)))),
        finance: baseFinance + (i * params.savings * 50),
        career: Math.min(
          100,
          Math.max(0, baseCareer + (i * params.study))
        ),
      });
    }

    return data;
  };

  const chartData = generateData();

  const handleSliderChange = (
    key: keyof typeof params,
    value: number
  ) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <AppLayout>
      <div className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans" style={{ background: themeColors.background }}>
        
        {/* Faint cover background icons */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url('/health_bg.png')" }}
        />

        {/* Ambient glow orbs for simulator integration */}
        <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-radial-gradient from-violet-500/5 to-transparent pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-radial-gradient from-pink-500/5 to-transparent pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6 md:gap-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <span className="text-xs font-bold text-violet-400 tracking-widest uppercase block mb-1">Telemetry Dashboard</span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Your Digital Twin Today
              </h1>
              <p className="text-slate-400 mt-1 font-semibold text-xs md:text-sm">
                Unified live metrics, active performance milestones, and instant optimization channels.
              </p>
            </div>

            <div className="glass-card border border-slate-800/80 bg-slate-900/85 backdrop-blur-md px-5 py-2.5 flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-violet-400 tracking-wider uppercase block">Sync Integrity</span>
                <h3 className="text-white text-lg font-black">All Systems Nominal</h3>
              </div>
              <ShieldCheck className="text-emerald-500 h-6 w-6 animate-pulse" />
            </div>
          </div>

          {/* Scores Overview Row (Now Fully Interactive) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {overviewScores.map((score, i) => (
              <motion.div
                key={score.label}
                whileHover={{ y: -2 }}
                className={`glass-card border ${score.border} bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${score.bg} flex items-center justify-center`}>
                    <score.icon className={`h-6 w-6 ${score.color}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{score.label}</span>
                    <h3 className="text-white text-2xl font-black mt-0.5">{score.value}%</h3>
                  </div>
                </div>
                
                {/* Score Dial Meter Indicator */}
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 relative flex items-center justify-center">
                  <span className="text-[10px] font-extrabold text-slate-300">{score.value}</span>
                  <div 
                    className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-violet-500 opacity-60"
                    style={{ transform: `rotate(${(score.value / 100) * 360}deg)` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Simulation Engine (Merged Section) */}
          <div ref={simulatorRef} className="scroll-mt-6">
            <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
              <CardHeader className="pb-4 border-b border-slate-800/60 flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-violet-400" />
                    Interactive Life Simulator
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-1">
                    Adjust control parameters to simulate 6-month life vector trajectories in real-time.
                  </CardDescription>
                </div>
                {/* Status indicator */}
                <div className="flex items-center">
                  {isSimulating ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-violet-500/15 border border-violet-500/30 text-white rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-violet-950/20"
                    >
                      <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-ping" />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    <div className="bg-slate-900/85 border border-slate-800 text-slate-300 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      <span>Simulation Idle</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Sliders Panel - 4 Cols */}
                  <div className="lg:col-span-4 flex flex-col gap-5 bg-slate-950/25 p-4 rounded-xl border border-slate-800/40">
                    
                    {/* Study slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-400 text-xs">Study duration</span>
                        <span className="font-extrabold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded text-[11px]">{params.study} h/day</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="8" 
                        step="1" 
                        value={params.study} 
                        onChange={(e) => handleSliderChange('study', Number(e.target.value))} 
                        className="w-full h-1.5 rounded-lg bg-slate-950 appearance-none cursor-pointer accent-pink-500" 
                      />
                    </div>

                    {/* Exercise slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-400 text-xs">Exercise frequency</span>
                        <span className="font-extrabold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded text-[11px]">{params.exercise} days/wk</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="7" 
                        step="1" 
                        value={params.exercise} 
                        onChange={(e) => handleSliderChange('exercise', Number(e.target.value))} 
                        className="w-full h-1.5 rounded-lg bg-slate-950 appearance-none cursor-pointer accent-violet-500" 
                      />
                    </div>

                    {/* Savings slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-400 text-xs">Savings Rate</span>
                        <span className="font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-[11px]">{params.savings}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="80" 
                        step="5" 
                        value={params.savings} 
                        onChange={(e) => handleSliderChange('savings', Number(e.target.value))} 
                        className="w-full h-1.5 rounded-lg bg-slate-950 appearance-none cursor-pointer accent-blue-500" 
                      />
                    </div>

                    {/* Sleep slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-400 text-xs">Sleep Allocation</span>
                        <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">{params.sleep} hrs/night</span>
                      </div>
                      <input 
                        type="range" 
                        min="4" 
                        max="10" 
                        step="0.5" 
                        value={params.sleep} 
                        onChange={(e) => handleSliderChange('sleep', Number(e.target.value))} 
                        className="w-full h-1.5 rounded-lg bg-slate-950 appearance-none cursor-pointer accent-emerald-500" 
                      />
                    </div>

                    {/* Dining out slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-400 text-xs">Dining Out frequency</span>
                        <span className="font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[11px]">{params.dining} meals/wk</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="14" 
                        step="1" 
                        value={params.dining} 
                        onChange={(e) => handleSliderChange('dining', Number(e.target.value))} 
                        className="w-full h-1.5 rounded-lg bg-slate-950 appearance-none cursor-pointer accent-rose-500" 
                      />
                    </div>

                    {/* Savings detail block */}
                    <div className="mt-2 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">Monthly Savings Vector:</span>
                      <span className={`font-black ${scores.monthlySavings > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        ₹{scores.monthlySavings.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Chart and AI Projections - 8 Cols */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    {/* Chart Container */}
                    <div className="relative bg-slate-950/25 p-4 rounded-xl border border-slate-800/40">
                      {isSimulating && (
                        <div className="absolute inset-0 z-20 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                          <div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                        </div>
                      )}
                      <div className="h-[210px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="simHealthGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="simCareerGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e91e8c" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#e91e8c" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                            <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.4)" tickLine={false} axisLine={false} style={{ fontSize: "10px", fontWeight: "bold" }} />
                            <YAxis stroke="rgba(255, 255, 255, 0.4)" tickLine={false} axisLine={false} domain={[0, 100]} style={{ fontSize: "10px", fontWeight: "bold" }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: "rgba(15, 12, 38, 0.95)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "12px", color: "#fff" }} />
                            <Area type="monotone" dataKey="health" stroke="#8b5cf6" strokeWidth={3} fill="url(#simHealthGrad)" name="Health Vector" />
                            <Area type="monotone" dataKey="career" stroke="#e91e8c" strokeWidth={3} fill="url(#simCareerGrad)" name="Career Vector" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Mini Projections outcome indicators */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-950/20 border border-slate-800/40 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider block">Health Trend</span>
                        <div className="text-sm font-black text-white mt-1">
                          {scores.healthScore > 70 ? 'Optimizing' : 'Degrading'}
                        </div>
                      </div>
                      <div className="bg-slate-950/20 border border-slate-800/40 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider block">Weekly Velocity</span>
                        <div className="text-sm font-black text-white mt-1">
                          {params.exercise >= 3 ? 'Active Routine' : 'Sedentary'}
                        </div>
                      </div>
                      <div className="bg-slate-950/20 border border-slate-800/40 p-3 rounded-xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-pink-400 uppercase tracking-wider block">Career Path</span>
                        <div className="text-sm font-black text-white mt-1">
                          {scores.careerScore > 80 ? 'Promotion Ready' : 'Skill Deficit'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights Segment */}
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <div className="flex justify-between items-center flex-wrap gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Future Life Outlook Analysis</span>
                    </div>
                    <Button 
                      onClick={fetchAiInsight}
                      disabled={isAiLoading}
                      className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-violet-950/20 border-0 h-8"
                    >
                      {isAiLoading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Generate AI Insight</span>
                        </>
                      )}
                    </Button>
                  </div>
                  {aiInsight ? (
                    <div className="p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/10 text-slate-300 text-xs leading-relaxed font-medium italic">
                      {aiInsight}
                    </div>
                  ) : (
                    <div className="p-3.5 text-center rounded-xl bg-slate-950/40 border border-slate-800 text-slate-500 text-xs font-semibold">
                      Click 'Generate AI Insight' to analyze this simulation scenario.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals & AI Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Goal progress cards - 7 cols */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-violet-400" />
                    Active Goal Trajectories
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Live progression indices of logged personal objectives.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 pt-0">
                  {goalCards.map((goal) => (
                    <div 
                      key={goal.title} 
                      className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-xl flex flex-col gap-3 hover:bg-slate-800/20 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: `${goal.color}15`, 
                              color: goal.color,
                              border: `1px solid ${goal.color}30`
                            }}
                          >
                            {goal.category}
                          </span>
                          <h4 className="text-white font-bold text-sm">{goal.title}</h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{goal.deadline}</span>
                      </div>
                      
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{goal.desc}</p>
                      
                      <div className="flex items-center gap-3 mt-1">
                        {/* Custom Progress bar */}
                        <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${goal.progress}%`,
                              backgroundColor: goal.color 
                            }} 
                          />
                        </div>
                        <span className="text-xs font-black text-slate-300 w-8 text-right">{goal.progress}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recommendation feed with active buttons - 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
                    AI Actionable Telemetry Recommendation
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Live dynamic recommendations generated by your Digital Twin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-0">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      className="p-4 bg-slate-950/40 border border-slate-800/40 rounded-xl flex flex-col gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${rec.bg} flex items-center justify-center shrink-0`}>
                          <rec.icon className={`h-4 w-4 ${rec.color}`} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{rec.domain} Recommendation</span>
                          <p className="text-xs font-semibold text-slate-300 leading-relaxed mt-1">{rec.insight}</p>
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-slate-800/50 pt-2.5">
                        <Button 
                          onClick={rec.onClick}
                          className="bg-violet-600/90 hover:bg-violet-600 text-white font-extrabold text-[10px] h-8 rounded-lg border-0 px-3 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{rec.actionText}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Activity Timeline Card */}
          <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-violet-400" />
                Digital Twin Activity Ledger Timeline
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Local telemetry logs recorded for optimization loops today.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col gap-5 relative pl-4 border-l border-slate-800/80 ml-2">
                {timelineEvents.map((evt, i) => (
                  <div key={i} className="relative flex flex-col gap-1">
                    {/* Timeline Node dot */}
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

        </div>
      </div>
    </AppLayout>
  );
}