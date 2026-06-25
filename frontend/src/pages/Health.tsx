import React, { useState, useEffect, useMemo, FC } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { 
  Activity, Droplets, Moon, Flame, Plus, Clock, Search,
  HeartPulse, ShieldAlert, ClipboardCheck, Apple, ChevronLeft, ChevronRight,
  Brain, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Play, Tv, Video, Music, Trophy, Sparkles, CheckCircle2, X
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HealthLog {
  _id?: string;
  date?: string;
  caloriesConsumed: number;
  sleepHours: number;
  waterGlasses: number;
  workoutMinutes: number;
  caloriesBurned: number;
  mood?: string;
  age?: number;
  qualityOfSleep?: number;
  stressLevel?: number;
  heartRate?: number;
  dailySteps?: number;
  prediction?: string;
  confidence?: number;
  riskLevel?: string;
}

interface SleepDataPoint {
  day: string;
  hours: number;
}

interface FoodItem {
  name: string;
  calories: number;
}

interface Exercise {
  name: string;
  target: string;
  equipment: string;
  bodyPart: string;
  gifUrl: string;
}

interface FitnessPlan {
  category: string;
  issues: string[];
  exercises: Exercise[];
}

interface CalendarCell {
  day: number;
  isCurrentMonth: boolean;
  date: Date;
  log?: HealthLog;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  valueClassName?: string;
}

const MetricCard: FC<MetricCardProps> = ({ title, value, unit = '', icon, description, valueClassName }) => (
  <motion.div
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className="flex-grow"
  >
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

const chartConfig = {
  hours: {
    label: "Sleep Hours",
    color: "#a78bfa",
  },
} satisfies ChartConfig;

export default function Health() {
  const { themeColors, theme } = useTheme();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const nextD = new Date(prev);
      nextD.setMonth(nextD.getMonth() - 1);
      return nextD;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const nextD = new Date(prev);
      nextD.setMonth(nextD.getMonth() + 1);
      return nextD;
    });
  };

  // Interactive Recommendations state
  const [recTab, setRecTab] = useState<"videos" | "activities">("videos");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  // Timer state for interactive stress busters
  const [timerActive, setTimerActive] = useState(false);
  const [timerType, setTimerType] = useState<"dance" | "breathing" | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);

  // Timer effect for breathing/dance exercises
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      if (timerType === "breathing") {
        interval = setInterval(() => {
          setBreathCountdown(prev => {
            if (prev === 1) {
              setBreathPhase(curr => {
                if (curr === "inhale") return "hold1";
                if (curr === "hold1") return "exhale";
                if (curr === "exhale") return "hold2";
                return "inhale";
              });
              return 4;
            }
            return prev - 1;
          });
          setSecondsLeft(s => {
            if (s <= 1) {
              setTimerActive(false);
              handleActivityComplete("breathing");
              return 0;
            }
            return s - 1;
          });
        }, 1000);
      } else if (timerType === "dance") {
        interval = setInterval(() => {
          setSecondsLeft(s => {
            if (s <= 1) {
              setTimerActive(false);
              handleActivityComplete("dance");
              return 0;
            }
            return s - 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerType]);

  const handleActivityComplete = async (type: "dance" | "breathing" | "movie") => {
    setShowConfetti(true);
    setXpEarned(true);
    setTimeout(() => setShowConfetti(false), 5000);
    
    const dur = type === "dance" ? 5 : type === "breathing" ? 2 : 0;
    const cBurn = type === "dance" ? 35 : type === "breathing" ? 5 : 0;
    const strDecrease = type === "breathing" ? 3 : type === "dance" ? 2 : 1;

    try {
      await axios.post("http://localhost:5000/api/health", {
        workoutMinutes: dur,
        caloriesBurned: cBurn,
        caloriesConsumed: 0,
        sleepHours: logs[0]?.sleepHours || 8,
        waterGlasses: logs[0]?.waterGlasses || 0,
        mood: "Excellent",
        age: quizAnswers.age || formData.age || 25,
        qualityOfSleep: quizAnswers.qualityOfSleep || formData.qualityOfSleep || 7,
        stressLevel: Math.max(1, (quizAnswers.stressLevel || formData.stressLevel || 5) - strDecrease),
        heartRate: 68,
        dailySteps: type === "dance" ? 800 : 50
      });
      fetchLogs();
    } catch (err) {
      console.error("Error auto-logging stress-buster log:", err);
    }
  };

  const getTherapyData = (pred: string) => {
    switch (pred) {
      case "Insomnia":
        return {
          videos: [
            {
              id: "inpok4MKVLM",
              title: "5-Min Guided Meditation for Insomnia & Deep Sleep",
              duration: "5 min",
              channel: "Goodful",
              desc: "A calming guided meditation to quiet racing thoughts and ease you into restful sleep. Perfect for insomnia."
            }
          ],
          activities: [
            {
              type: "breathing",
              title: "🫁 1-Min Relaxing Box Breathing",
              desc: "A powerful parasympathetic regulator used by Navy SEALs to instantly drop stress levels.",
              benefit: "Triggers the relaxation response, lowers heart rate, and stops stress-induced insomnia."
            },
            {
              type: "movie",
              title: "🍿 Wholesome Movie Watchlist",
              desc: "Watch a warm, low-tempo comforting film tonight instead of browsing social media.",
              films: ["My Neighbor Totoro", "Chef", "Amélie", "The Secret Life of Walter Mitty"],
              benefit: "Triggers dopamine release and decreases pre-sleep cortisol spikes."
            }
          ]
        };
      case "Sleep Apnea":
        return {
          videos: [
            {
              id: "inpok4MKVLM",
              title: "5-Min Breathing Meditation for Better Sleep",
              duration: "5 min",
              channel: "Goodful",
              desc: "Guided diaphragmatic breathing to expand lung capacity, relax airway muscles, and improve overnight oxygenation."
            }
          ],
          activities: [
            {
              type: "breathing",
              title: "🫁 1-Min Diaphragmatic Breathwork",
              desc: "Strengthen the diaphragm and throat support muscles with focused rhythmic breathing.",
              benefit: "Improves lung elasticity and supports open airways while sleeping."
            },
            {
              type: "dance",
              title: "🕺 Anti-Apnea throat activation (Sing & Dance!)",
              desc: "Singing out loud activates your pharyngeal muscles, which helps prevent collapse during sleep. Dance to double the fun!",
              benefit: "Combines aerobic conditioning with pharyngeal throat muscle training."
            }
          ]
        };
      default:
        return {
          videos: [
            {
              id: "inpok4MKVLM",
              title: "5-Min Mindfulness Meditation — Reduce Stress & Sleep Better",
              duration: "5 min",
              channel: "Goodful",
              desc: "A quick mindfulness reset to release daytime tension, lower cortisol, and prepare your mind for deep, quality sleep."
            }
          ],
          activities: [
            {
              type: "dance",
              title: "💃 1-Min Stress-Buster Solo Dance Party",
              desc: "Put on your favorite track and let loose for 60 seconds! No judgments, just movement.",
              benefit: "Shakes off daytime fatigue, burns calories, and resets mood."
            },
            {
              type: "breathing",
              title: "🫁 1-Min Box Breathing Exercise",
              desc: "Deep chest breathing to oxygenate your blood cells and sharpen focus.",
              benefit: "Boosts alert awareness and physical performance."
            }
          ]
        };
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    workoutMinutes: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    sleepHours: 0,
    waterGlasses: 0,
    mood: "Good" as "Great" | "Good" | "Neutral" | "Bad" | "Terrible",
    age: Number(localStorage.getItem("age")) || 25,
    qualityOfSleep: Number(localStorage.getItem("qualityOfSleep")) || 6,
    stressLevel: Number(localStorage.getItem("stressLevel")) || 5,
    heartRate: Number(localStorage.getItem("heartRate")) || 72,
    dailySteps: Number(localStorage.getItem("dailySteps")) || 5000
  });

  // ── Sleep Quiz State ──────────────────────────────────────────────────────
  const QUIZ_QUESTIONS = [
    { key: "age",             label: "How old are you?",                                         hint: "e.g. 28",   unit: "yrs",   desc: "" },
    { key: "sleepDuration",  label: "How many hours did you sleep last night?",                  hint: "e.g. 7.5", unit: "hrs",   desc: "" },
    { key: "qualityOfSleep", label: "How would you rate that sleep? (1 = awful, 10 = great)",   hint: "e.g. 6",   unit: "/10",   desc: "Think about how rested you actually felt" },
    { key: "heartRate",      label: "What\'s your resting heart rate right now?",                hint: "e.g. 72",  unit: "bpm",   desc: "Check your phone health app or just estimate" },
    { key: "stressLevel",    label: "Stress level today? (1 = totally calm, 10 = overwhelmed)", hint: "e.g. 4",   unit: "/10",   desc: "" },
    { key: "dailySteps",     label: "How many steps have you walked today?",                     hint: "e.g. 6000",unit: "steps", desc: "Rough number is fine" },
    { key: "physicalActivity",label: "Minutes of exercise today?",                              hint: "e.g. 30",  unit: "mins",  desc: "Any movement counts — gym, walk, yoga" },
  ];
  type QuizState = "idle" | "asking" | "loading" | "done";
  const [quizState, setQuizState]       = useState<QuizState>("idle");
  const [quizStep, setQuizStep]         = useState(0);
  const [quizInput, setQuizInput]       = useState("");
  const [quizAnswers, setQuizAnswers]   = useState<Record<string, number>>({});
  const [quizResult, setQuizResult]     = useState<{
    prediction: string; confidence: number; riskLevel: string; recommendation: string;
  } | null>(null);

  const quizNext = async () => {
    const val = Number(quizInput);
    if (!quizInput || isNaN(val)) return;
    const updated = { ...quizAnswers, [QUIZ_QUESTIONS[quizStep].key]: val };
    setQuizAnswers(updated);
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(s => s + 1);
      setQuizInput("");
    } else {
      setQuizState("loading");
      try {
        const res = await axios.post("http://127.0.0.1:8000/predict-health-risk", {
          age:              updated.age,
          sleepDuration:   updated.sleepDuration,
          qualityOfSleep:  updated.qualityOfSleep,
          physicalActivity:updated.physicalActivity,
          stressLevel:     updated.stressLevel,
          heartRate:       updated.heartRate,
          dailySteps:      updated.dailySteps,
        });
        setQuizResult(res.data);
        setQuizState("done");
      } catch { setQuizState("idle"); }
    }
  };

  const quizBack = () => {
    if (quizStep === 0) { setQuizState("idle"); return; }
    setQuizStep(s => s - 1);
    setQuizInput(String(quizAnswers[QUIZ_QUESTIONS[quizStep - 1].key] ?? ""));
  };

  const quizReset = () => {
    setQuizState("idle"); setQuizStep(0);
    setQuizInput(""); setQuizAnswers({}); setQuizResult(null);
  };

  // CalorieNinjas Search State
  const [foodQuery, setFoodQuery] = useState("");
  const [isSearchingFood, setIsSearchingFood] = useState(false);
  const [foodResult, setFoodResult] = useState<FoodItem[] | null>(null);
  const [foodError, setFoodError] = useState("");
  const [showCalorieLookup, setShowCalorieLookup] = useState(false);

  // Fetch Database Logs
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

  // AI Fitness Coach State
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [fitnessError, setFitnessError] = useState("");

  const generateFitnessPlan = async () => {
    setIsGeneratingPlan(true);
    setFitnessError("");
    setFitnessPlan(null);
    try {
      const res = await axios.get("http://localhost:5000/api/health/fitness-plan");
      setFitnessPlan(res.data);
    } catch (err: any) {
      console.error("Error generating fitness plan:", err);
      if (err?.response?.data?.message) {
        setFitnessError(err.response.data.message);
      } else {
        setFitnessError("Failed to connect to the fitness coach. Please check your network and try again.");
      }
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/health", formData);
      localStorage.setItem("sleepHours", formData.sleepHours.toString());
      localStorage.setItem("waterGlasses", formData.waterGlasses.toString());
      localStorage.setItem("caloriesConsumed", formData.caloriesConsumed.toString());
      localStorage.setItem("workoutMinutes", formData.workoutMinutes.toString());
      localStorage.setItem("mood", formData.mood);
      localStorage.setItem("age", formData.age.toString());
      localStorage.setItem("qualityOfSleep", formData.qualityOfSleep.toString());
      localStorage.setItem("stressLevel", formData.stressLevel.toString());
      localStorage.setItem("heartRate", formData.heartRate.toString());
      localStorage.setItem("dailySteps", formData.dailySteps.toString());

      fetchLogs(); // Refresh DB entries
      setFormData(prev => ({ 
        ...prev,
        workoutMinutes: 0, 
        caloriesBurned: 0, 
        caloriesConsumed: 0, 
        sleepHours: 0, 
        waterGlasses: 0, 
        mood: "Good" 
      }));
      setFoodResult(null);
      setFoodQuery("");
    } catch (error) {
      console.error("Error submitting health log:", error);
    }
  };

  // (Presets removed — form is purely user-driven)

  // Food Calorie Search handler
  const handleFoodSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodQuery.trim()) return;

    setIsSearchingFood(true);
    setFoodError("");
    setFoodResult(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/health/nutrition?query=${encodeURIComponent(foodQuery)}`);
      if (res.data && Array.isArray(res.data.items)) {
        if (res.data.items.length === 0) {
          const hint = res.data.hint || "";
          setFoodError(
            `We couldn't find those foods. ${hint || "Try names like 'oatmeal', 'banana', 'rice', 'dal', 'roti'."}`
          );
        } else {
          setFoodResult(res.data.items);
        }
      } else {
        setFoodError("Something went wrong. Please try again!");
      }
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) {
        setFoodError("Please log in first to use this feature.");
      } else {
        setFoodError("Could not connect. Please check your connection and try again.");
      }
    } finally {
      setIsSearchingFood(false);
    }
  };

  const applyFoodToLog = () => {
    if (!foodResult) return;
    const totalCalories = foodResult.reduce((sum, item) => sum + (item.calories || 0), 0);
    setFormData(prev => ({
      ...prev,
      caloriesConsumed: Math.round(totalCalories)
    }));
    // Clear search so it feels completed
    setFoodResult(null);
    setFoodQuery("");
  };

  // Derive status from logs
  const safeLogs = Array.isArray(logs) ? logs : [];
  const latestLog = safeLogs[0] || { 
    caloriesConsumed: 0, 
    sleepHours: 0, 
    waterGlasses: 0, 
    workoutMinutes: 0, 
    caloriesBurned: 0,
    prediction: "None",
    confidence: 1.0,
    riskLevel: "Low",
    age: 25,
    qualityOfSleep: 6,
    stressLevel: 5,
    heartRate: 72,
    dailySteps: 5000
  };
  const calories = latestLog.caloriesConsumed || 0;
  const sleep = latestLog.sleepHours || 0;
  const water = latestLog.waterGlasses || 0;
  const workoutMinutes = latestLog.workoutMinutes || 0;
  const totalLogs = safeLogs.length;
  const score = safeLogs.length > 0 ? 85 + Math.min(10, safeLogs.length) : 0;

  // Pie chart calculation
  const COLORS = ["#c084fc", "rgba(255,255,255,0.06)"];
  const calData = [
    { name: "Consumed", value: calories },
    { name: "Remaining", value: Math.max(0, 3000 - calories) }
  ];

  // Sleep history calculation
  const sleepHistoryData = useMemo((): SleepDataPoint[] => {
    const historicalPoints: SleepDataPoint[] = safeLogs.slice(0, 7).reverse().map((l: HealthLog, i: number) => ({
      day: l.date ? new Date(l.date).toLocaleDateString([], { weekday: 'short' }) : `Day ${i + 1}`,
      hours: l.sleepHours || 0
    }));

    if (historicalPoints.length === 0) {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
        day,
        hours: 0
      }));
    }
    return historicalPoints;
  }, [logs]);

  // Calendar month calculation
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Monday = 0, Sunday = 6 index:
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; 
    const prevDaysInMonth = new Date(year, month, 0).getDate();

    const cells: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Previous month padding cells (faded)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        day: prevDaysInMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevDaysInMonth - i)
      });
    }

    // Current month cells
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month padding cells to fill grid (42 cells total)
    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    // Map each cell to matched log in safeLogs
    const matchedLogs = cells.map((cell): CalendarCell => {
      const cellDateStr = cell.date.toDateString();
      const log = safeLogs.find((l: HealthLog) => {
        if (!l.date) return false;
        return new Date(l.date).toDateString() === cellDateStr;
      });
      return { ...cell, log };
    });

    return {
      year,
      month,
      monthName: monthNames[month],
      matchedLogs
    };
  }, [logs, currentDate]);


  return (
    <AppLayout>
      <div className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans flex flex-col" style={{ background: themeColors.background }}>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url('/health_bg.png')" }}
        />

        <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start w-full flex-1">
                        {/* ── LEFT PANEL: Food Search & Logging ── */}
            <div className="xl:col-span-1 flex flex-col gap-6 xl:sticky xl:top-8 shrink-0">
              
              {/* Standard Health Form */}
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-violet-400" /> Enter today's log
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-1">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3.5">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calories Eaten</label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="e.g. 1800"
                            value={formData.caloriesConsumed === 0 ? "" : formData.caloriesConsumed} 
                            onChange={e => setFormData({ ...formData, caloriesConsumed: Number(e.target.value) || 0 })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10 no-spinner pr-10"
                            required 
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500">kcal</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hours Slept</label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="e.g. 7.5"
                            value={formData.sleepHours === 0 ? "" : formData.sleepHours} 
                            onChange={e => setFormData({ ...formData, sleepHours: Number(e.target.value) || 0 })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10 no-spinner pr-10"
                            required 
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500">hrs</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Water Drunk</label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="e.g. 8"
                            value={formData.waterGlasses === 0 ? "" : formData.waterGlasses} 
                            onChange={e => setFormData({ ...formData, waterGlasses: Number(e.target.value) || 0 })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10 no-spinner pr-14"
                            required 
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500">glasses</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Workout Minutes</label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="e.g. 45"
                            value={formData.workoutMinutes === 0 ? "" : formData.workoutMinutes} 
                            onChange={e => setFormData({ ...formData, workoutMinutes: Number(e.target.value) || 0 })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10 no-spinner pr-12"
                            required 
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500">mins</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">My Mood</label>
                        <select 
                          value={formData.mood}
                          onChange={e => setFormData({ ...formData, mood: e.target.value as any })}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm px-3 h-10 cursor-pointer outline-none"
                        >
                          <option value="Great">😄 Great</option>
                          <option value="Good">🙂 Good</option>
                          <option value="Neutral">😐 Neutral</option>
                          <option value="Bad">🙁 Bad</option>
                          <option value="Terrible">😫 Terrible</option>
                        </select>
                      </div>






                    </div>

                    <Button 
                      type="submit" 
                      className="w-full mt-2 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-xl border-0 shadow-lg shadow-violet-950/20"
                    >
                      SAVE DAILY LOG
                    </Button>
                  </form>
                </CardContent>
              </Card>

            </div>

            {/* ── RIGHT PANEL: Main Health Stats Hub ── */}
            <div className="xl:col-span-3 flex flex-col gap-6 md:gap-8 xl:pr-4 xl:pb-12">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    My Health Hub
                  </h1>
                  <p className="text-slate-200 mt-1 font-semibold text-xs md:text-sm">
                    Simple charts to track your energy, sleep, and workouts.
                  </p>
                </div>

                {/* Sleep risk pill — updates from quiz result OR saved log */}
                {(() => {
                  // Quiz result takes priority when available
                  const activePred    = quizResult?.prediction  || latestLog.prediction || "None";
                  const activeRisk    = quizResult?.riskLevel   || latestLog.riskLevel  || "Low";
                  const dot =
                    activeRisk === "High"   ? "bg-red-400" :
                    activeRisk === "Medium" ? "bg-amber-400" :
                                             "bg-emerald-400";
                  const label =
                    activeRisk === "High"   ? "text-red-300" :
                    activeRisk === "Medium" ? "text-amber-300" :
                                             "text-emerald-300";
                  return (
                    <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 rounded-full px-4 py-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                      <span className={`text-sm font-semibold ${label}`}>
                        {activePred === "None" ? "No disorder" : activePred}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Glowing Metrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Calories Eaten"
                  value={calories}
                  unit="kcal"
                  icon={<Flame className="h-4.5 w-4.5 text-orange-500" />}
                  description="Goal: Under 3000 kcal"
                  valueClassName="text-orange-400"
                />
                <MetricCard
                  title="Hours Slept"
                  value={sleep}
                  unit="hrs"
                  icon={<Moon className="h-4.5 w-4.5 text-indigo-500" />}
                  description="Goal: 8.0 hrs sleep"
                  valueClassName="text-indigo-400"
                />
                <MetricCard
                  title="Water Drunk"
                  value={water}
                  unit="glasses"
                  icon={<Droplets className="h-4.5 w-4.5 text-cyan-500" />}
                  description="Goal: 8 glasses daily"
                  valueClassName="text-cyan-400"
                />
                <MetricCard
                  title="Days Logged"
                  value={totalLogs}
                  unit="days"
                  icon={<ClipboardCheck className="h-4.5 w-4.5 text-emerald-500" />}
                  description="Total database entries"
                  valueClassName="text-emerald-400"
                />
              </div>

              {/* ── Interactive Sleep Quiz ── */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="bg-slate-900/50 border border-slate-800/70 rounded-2xl overflow-hidden">

                  {/* IDLE */}
                  {quizState === "idle" && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">🛌</span>
                        <div>
                          <p className="text-white font-semibold text-sm">Want to know your sleep health?</p>
                          <p className="text-slate-500 text-xs mt-0.5">7 quick questions. Takes about 30 seconds.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setQuizState("asking"); setQuizStep(0); setQuizInput(""); }}
                        className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                      >
                        Check now &rarr;
                      </button>
                    </div>
                  )}

                  {/* ASKING */}
                  {quizState === "asking" && (
                    <div className="p-6 flex flex-col gap-5">
                      {/* Progress dots */}
                      <div className="flex items-center gap-1.5">
                        {QUIZ_QUESTIONS.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              i < quizStep ? "bg-violet-500 w-4" :
                              i === quizStep ? "bg-violet-400 w-6" :
                              "bg-slate-700 w-3"
                            }`}
                          />
                        ))}
                        <span className="text-[11px] text-slate-500 ml-2">{quizStep + 1} of {QUIZ_QUESTIONS.length}</span>
                      </div>

                      {/* Question */}
                      <div>
                        <p className="text-white font-semibold text-base leading-snug">{QUIZ_QUESTIONS[quizStep].label}</p>
                        {QUIZ_QUESTIONS[quizStep].desc && (
                          <p className="text-slate-500 text-xs mt-1">{QUIZ_QUESTIONS[quizStep].desc}</p>
                        )}
                      </div>

                      {/* Input */}
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="number"
                          placeholder={QUIZ_QUESTIONS[quizStep].hint}
                          value={quizInput}
                          onChange={e => setQuizInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && quizNext()}
                          className="bg-slate-800/80 border border-slate-700 rounded-xl text-white font-semibold text-sm px-4 h-10 w-36 outline-none focus:border-violet-500 no-spinner transition-colors"
                        />
                        <span className="text-slate-500 text-sm">{QUIZ_QUESTIONS[quizStep].unit}</span>
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={quizBack}
                          className="text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
                        >
                          &larr; Back
                        </button>
                        <button
                          onClick={quizNext}
                          disabled={!quizInput}
                          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                        >
                          {quizStep < QUIZ_QUESTIONS.length - 1 ? "Next →" : "Get my report"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LOADING */}
                  {quizState === "loading" && (
                    <div className="flex items-center gap-3 p-6">
                      <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                      <span className="text-slate-400 text-sm">Running your data through the model...</span>
                    </div>
                  )}

                  {/* RESULT */}
                  {quizState === "done" && quizResult && (() => {
                    const { prediction: pred, confidence: conf, riskLevel, recommendation } = quizResult;
                    const pct = Math.round(conf * 100);

                    const theme = {
                      "Sleep Apnea": { condColor: "text-red-400",    bar: "bg-red-400",     pill: "bg-red-400/10 text-red-300 border-red-400/20" },
                      "Insomnia":    { condColor: "text-amber-400",  bar: "bg-amber-400",   pill: "bg-amber-400/10 text-amber-300 border-amber-400/20" },
                      "None":        { condColor: "text-emerald-400",bar: "bg-emerald-400", pill: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20" },
                    };
                    const t = theme[pred as keyof typeof theme] || theme["None"];

                    const confNote =
                      pct >= 90 ? "Pretty confident about this — strong signal in your data" :
                      pct >= 75 ? "Fairly sure — worth paying attention to" :
                      pct >= 60 ? "Moderate certainty — take this as a nudge, not a verdict" :
                                  "Low certainty — try logging more consistently for better results";

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-6 flex flex-col gap-5"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400 text-xs font-medium">Here\'s what we found</p>
                          <span className={`text-xs px-2.5 py-1 rounded-full border ${t.pill}`}>
                            {riskLevel === "High" ? "High risk" : riskLevel === "Medium" ? "Moderate" : "All clear"}
                          </span>
                        </div>

                        {/* Three rows */}
                        <div className="flex flex-col gap-4">

                          {/* Condition */}
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-slate-500">Condition</span>
                            <span className={`text-2xl font-bold tracking-tight ${t.condColor}`}>
                              {pred === "None" ? "No sleep disorder" : pred}
                            </span>
                          </div>

                          {/* Confidence */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">Confidence</span>
                              <span className="text-xs font-semibold text-slate-300">{pct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${t.bar}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-500 leading-snug">{confNote}</span>
                          </div>

                          {/* What to do */}
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-500">What to do</span>
                            <p className={`text-sm font-medium leading-relaxed ${
                              pred === "None" ? "text-emerald-300" :
                              pred === "Insomnia" ? "text-amber-300" :
                              "text-red-300"
                            }`}>{recommendation}</p>
                          </div>

                          {/* 🧘 Interactive Telemetry Recommendations */}
                          <div className="border-t border-slate-800/80 pt-4 mt-2 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Interactive Therapy Recommendations</span>
                              </div>
                              <span className="text-[10px] font-black text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                {xpEarned ? "🎉 logged +15 XP" : "🎁 Earn +15 XP"}
                              </span>
                            </div>

                            {/* Confetti celebration panel if completed */}
                            {showConfetti && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center flex flex-col items-center gap-1.5 shadow-lg shadow-emerald-950/20"
                              >
                                <Trophy className="h-6 w-6 text-yellow-400 animate-bounce" />
                                <p className="text-xs font-bold text-emerald-300">Stress-Buster Action Logged successfully!</p>
                                <p className="text-[10px] text-slate-400 font-semibold">Your biometrics have been updated & database XP awarded.</p>
                              </motion.div>
                            )}

                            {/* TIMER SCREEN (If an active exercise is running) */}
                            {timerActive && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-violet-950/20 border border-violet-500/20 rounded-xl flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden"
                              >
                                <div className="absolute top-[-20%] left-[-20%] w-24 h-24 rounded-full bg-violet-500/10 blur-xl pointer-events-none" />
                                <div className="absolute bottom-[-20%] right-[-20%] w-24 h-24 rounded-full bg-pink-500/10 blur-xl pointer-events-none" />

                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  {timerType === "breathing" ? "Box Breathing Exercise" : "Stress-Relief Dance Party"}
                                </span>

                                {timerType === "breathing" && (
                                  <div className="flex flex-col items-center gap-3">
                                    <motion.div 
                                      animate={{ 
                                        scale: breathPhase === "inhale" ? 1.25 : breathPhase === "exhale" ? 0.9 : breathPhase === "hold1" ? 1.25 : 0.9 
                                      }}
                                      transition={{ duration: 4, ease: "easeInOut" }}
                                      className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-colors duration-500 border ${
                                        breathPhase === "inhale" ? "bg-violet-600/20 border-violet-500 shadow-violet-950/40" :
                                        breathPhase === "hold1" ? "bg-amber-600/20 border-amber-500 shadow-amber-950/40" :
                                        breathPhase === "exhale" ? "bg-teal-600/20 border-teal-500 shadow-teal-950/40" :
                                        "bg-slate-800/20 border-slate-700 shadow-slate-950/40"
                                      }`}
                                    >
                                      <Brain className={`h-6 w-6 animate-pulse ${
                                        breathPhase === "inhale" ? "text-violet-400" :
                                        breathPhase === "hold1" ? "text-amber-400" :
                                        breathPhase === "exhale" ? "text-teal-400" :
                                        "text-slate-400"
                                      }`} />
                                      <span className="text-[10px] font-black text-white mt-1">
                                        {breathCountdown}s
                                      </span>
                                    </motion.div>

                                    <span className="text-sm font-black text-white uppercase tracking-wider h-5 transition-all">
                                      {breathPhase === "inhale" ? "😤 Inhale Deeply" :
                                       breathPhase === "hold1" ? "🧘 Hold Breath" :
                                       breathPhase === "exhale" ? "😮 Exhale Slowly" :
                                       "🧘 Hold Empty"}
                                    </span>
                                  </div>
                                )}

                                {timerType === "dance" && (
                                  <div className="flex flex-col items-center gap-2">
                                    <motion.div 
                                      animate={{ rotate: [0, 15, -15, 15, 0], scale: [1, 1.1, 1, 1.1, 1] }}
                                      transition={{ repeat: Infinity, duration: 1.5 }}
                                      className="text-4xl"
                                    >
                                      💃🕺🎵
                                    </motion.div>
                                    <span className="text-xs font-semibold text-slate-400">Put on a song and dance!</span>
                                  </div>
                                )}

                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-2xl font-black text-white tracking-tight">{secondsLeft}s</span>
                                  <span className="text-[10px] text-slate-500">Remaining</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Button 
                                    onClick={() => setTimerActive(false)} 
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-8 px-4 rounded-lg border border-slate-700 cursor-pointer"
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => { setTimerActive(false); handleActivityComplete(timerType || "breathing"); }} 
                                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs h-8 px-4 rounded-lg border-0 cursor-pointer"
                                  >
                                    Skip to complete
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {/* REGULAR SELECTION DISPLAY */}
                            {!timerActive && (() => {
                              const therapy = getTherapyData(pred);

                              return (
                                <div className="flex flex-col gap-3">
                                  
                                  {/* Tabs selector */}
                                  <div className="flex bg-slate-950/40 p-1 rounded-xl border border-slate-800/40 gap-1">
                                    <button
                                      onClick={() => setRecTab("videos")}
                                      className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        recTab === "videos" 
                                          ? "bg-slate-800 text-violet-400 border border-slate-700" 
                                          : "text-slate-400 hover:text-slate-200"
                                      }`}
                                    >
                                      📺 Therapy Videos
                                    </button>
                                    <button
                                      onClick={() => setRecTab("activities")}
                                      className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        recTab === "activities" 
                                          ? "bg-slate-800 text-violet-400 border border-slate-700" 
                                          : "text-slate-400 hover:text-slate-200"
                                      }`}
                                    >
                                      🎭 Stress-Busters
                                    </button>
                                  </div>

                                  {/* VIDEOS TAB */}
                                  {recTab === "videos" && (
                                    <div className="flex flex-col gap-2.5">
                                      
                                      {activeVideoId ? (
                                        <div className="flex flex-col gap-2">
                                          <div 
                                            className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-black"
                                            style={{ position: "relative", width: "100%", paddingBottom: "56.25%", height: 0 }}
                                          >
                                            <iframe
                                              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                                              title="Yoga/Meditation therapy player"
                                              frameBorder="0"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                              allowFullScreen
                                              className="absolute inset-0 w-full h-full"
                                              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                                            />
                                          </div>
                                          <div className="flex justify-between items-center bg-slate-950/20 p-2 rounded-xl border border-slate-800/40">
                                            <span className="text-[10px] text-slate-400 font-semibold">Watching guided therapy...</span>
                                            <div className="flex gap-2">
                                              <Button 
                                                onClick={() => handleActivityComplete("breathing")}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] h-6 px-2.5 rounded-md border-0 cursor-pointer"
                                              >
                                                Log completed (+15 XP)
                                              </Button>
                                              <Button 
                                                onClick={() => setActiveVideoId(null)}
                                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[9px] h-6 px-2 rounded-md border border-slate-700 cursor-pointer"
                                              >
                                                Close Video
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        therapy.videos.map((vid) => (
                                          <div 
                                            key={vid.id}
                                            className="p-3 bg-slate-950/20 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/10 rounded-xl flex items-start justify-between gap-3 transition-all"
                                          >
                                            <div className="flex-1">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[9px] font-bold text-violet-400 uppercase bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">YouTube</span>
                                                <span className="text-[10px] text-slate-500 font-semibold">{vid.duration} | {vid.channel}</span>
                                              </div>
                                              <h5 className="text-xs font-bold text-white leading-snug mt-1.5">{vid.title}</h5>
                                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">{vid.desc}</p>
                                            </div>

                                            <button 
                                              onClick={() => setActiveVideoId(vid.id)}
                                              className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-950/30 transition-colors cursor-pointer border-0"
                                            >
                                              <Play className="h-4 w-4 fill-white" />
                                            </button>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  )}

                                  {/* ACTIVITIES TAB */}
                                  {recTab === "activities" && (
                                    <div className="flex flex-col gap-2.5">
                                      {therapy.activities.map((act, i) => (
                                        <div 
                                          key={i}
                                          className="p-3 bg-slate-950/20 border border-slate-800 rounded-xl flex flex-col gap-2.5"
                                        >
                                          <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                              <h5 className="text-xs font-bold text-white leading-snug">{act.title}</h5>
                                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">{act.desc}</p>
                                              
                                              {act.type === "movie" && act.films && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                  {act.films.map(film => (
                                                    <span key={film} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                                                      🎬 {film}
                                                    </span>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex justify-between items-center border-t border-slate-900/60 pt-2 flex-wrap gap-2">
                                            <span className="text-[9px] text-slate-500 font-medium leading-relaxed max-w-[70%]">
                                              💡 {act.benefit}
                                            </span>
                                            
                                            {act.type === "breathing" && (
                                              <Button 
                                                onClick={() => { setTimerType("breathing"); setSecondsLeft(60); setBreathPhase("inhale"); setBreathCountdown(4); setTimerActive(true); }}
                                                className="bg-violet-600/90 hover:bg-violet-600 text-white font-extrabold text-[9px] h-7 px-3 rounded-lg border-0 cursor-pointer"
                                              >
                                                Start Breathing (1-Min)
                                              </Button>
                                            )}

                                            {act.type === "dance" && (
                                              <Button 
                                                onClick={() => { setTimerType("dance"); setSecondsLeft(60); setTimerActive(true); }}
                                                className="bg-violet-600/90 hover:bg-violet-600 text-white font-extrabold text-[9px] h-7 px-3 rounded-lg border-0 cursor-pointer"
                                              >
                                                Start Dance Party (1-Min)
                                              </Button>
                                            )}

                                            {act.type === "movie" && (
                                              <Button 
                                                onClick={() => handleActivityComplete("movie")}
                                                className="bg-violet-600/90 hover:bg-violet-600 text-white font-extrabold text-[9px] h-7 px-3 rounded-lg border-0 cursor-pointer"
                                              >
                                                Log Wholesome Movie Night (+15 XP)
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                </div>
                              );
                            })()}
                          </div>

                        </div>

                        <button
                          onClick={quizReset}
                          className="self-start text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors mt-1"
                        >
                          ↺ Check again
                        </button>
                      </motion.div>
                    );
                  })()}

                </div>
              </motion.div>

              {/* Charts Container */}
              <div className="flex flex-col gap-6">
                
                {/* Row 1: Calorie Tracker and Sleep History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Balance Wheel (Daily Calorie Tracker) (Left 1/3 column) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-white text-md font-bold">Daily Calorie Tracker</CardTitle>
                      <CardDescription className="text-slate-400 text-xs">Track how close you are to your daily calorie limit.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center flex-grow pt-0 pb-4">
                      <div className="relative w-36 h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={calData} innerRadius={52} outerRadius={68} paddingAngle={4} dataKey="value" stroke="none">
                              {calData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-2xl font-black text-white leading-none">{calories}</span>
                          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wide">/ 3000 kcal</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sleep Area chart (Right 2/3 column) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white text-md font-bold">Sleep History</CardTitle>
                      <CardDescription className="text-slate-400 text-xs">Total hours slept over your last 7 logs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-44 w-full">
                        <AreaChart data={sleepHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSleepHealth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-hours)" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="var(--color-hours)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                          <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.4)" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={9} tickLine={false} axisLine={false} domain={[0, 12]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={3.5} fillOpacity={1} fill="url(#colorSleepHealth)" name="hours" />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                </div>

                {/* Row 2: Calendar and Calorie Lookup */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Activity Log (Calendar) (Left 2/3 column) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:col-span-2 flex flex-col justify-between overflow-visible p-4">
                    <CardHeader className="pb-4 px-2">
                      <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-violet-400" /> My Activity History
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs">
                        Hover over active dates to see your logged metrics.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0 overflow-visible flex-grow">
                      {/* Calendar Container */}
                      <div className="flex flex-col select-none overflow-visible max-w-md mx-auto w-full">
                        {/* Header Month Selector */}
                        <div className="flex items-center justify-between mb-2 px-2">
                          <button 
                            onClick={handlePrevMonth}
                            type="button"
                            className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <h3 className="text-white font-extrabold text-sm tracking-wide">
                            {calendarData.monthName} {calendarData.year}
                          </h3>
                          <button 
                            onClick={handleNextMonth}
                            type="button"
                            className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        {/* Day Titles MON -> SUN */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                            <span key={d} className="text-[10px] font-black text-slate-500 tracking-wider">
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Grid Cells */}
                        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 relative overflow-visible">
                          {calendarData.matchedLogs.map((cell, idx) => {
                            const isLogged = !!cell.log;
                            const log = cell.log;

                            // Get mood details
                            let moodEmoji = "🙂 Good";
                            let moodBadgeColor = "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30";
                            if (log) {
                              switch (log.mood) {
                                case "Great":
                                  moodEmoji = "😄 Great";
                                  moodBadgeColor = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                                  break;
                                case "Good":
                                  moodEmoji = "🙂 Good";
                                  moodBadgeColor = "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30";
                                  break;
                                case "Neutral":
                                  moodEmoji = "😐 Neutral";
                                  moodBadgeColor = "bg-slate-500/20 text-slate-300 border border-slate-500/30";
                                  break;
                                case "Bad":
                                  moodEmoji = "🙁 Bad";
                                  moodBadgeColor = "bg-amber-500/20 text-amber-400 border border-amber-500/30";
                                  break;
                                case "Terrible":
                                  moodEmoji = "😫 Terrible";
                                  moodBadgeColor = "bg-red-500/20 text-red-400 border border-red-500/30";
                                  break;
                              }
                            }

                            return (
                              <div 
                                key={idx}
                                className="group relative flex items-center justify-center h-9 overflow-visible"
                              >
                                {/* Cell circle */}
                                <div 
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all relative ${
                                    !cell.isCurrentMonth 
                                      ? "text-slate-700 font-medium" 
                                      : isLogged 
                                        ? "bg-violet-600 text-white font-extrabold shadow-md shadow-violet-600/30 cursor-pointer scale-105" 
                                        : "text-slate-300 hover:bg-slate-800/30 cursor-pointer"
                                  }`}
                                >
                                  {cell.day}
                                  
                                  {/* Small indicator dot for active day */}
                                  {isLogged && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white opacity-80" />
                                  )}
                                </div>

                                {/* Tooltip on Hover */}
                                {isLogged && log && (
                                  <div 
                                    className="absolute bottom-10 left-1/2 -translate-x-1/2 w-44 bg-slate-950/95 border border-slate-800 rounded-2xl p-3 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 flex flex-col gap-2"
                                    style={{ backdropFilter: "blur(12px)", transformOrigin: "bottom center" }}
                                  >
                                    {/* Metrics */}
                                    <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                          <Moon size={11} className="text-indigo-400" /> Sleep
                                        </span>
                                        <span className="font-bold text-white">{log.sleepHours} hrs</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                          <Activity size={11} className="text-violet-400" /> Steps
                                        </span>
                                        <span className="font-bold text-white">{(log as any).dailySteps ?? "—"}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                          <HeartPulse size={11} className="text-red-400" /> Heart rate
                                        </span>
                                        <span className="font-bold text-white">{(log as any).heartRate ?? "—"} bpm</span>
                                      </div>
                                      {(log as any).prediction && (
                                        <div className="flex items-center justify-between border-t border-slate-800 pt-1.5 mt-0.5">
                                          <span className="text-slate-500 text-[10px]">Sleep risk</span>
                                          <span className={`text-[10px] font-bold ${
                                            (log as any).riskLevel === "High" ? "text-red-400" :
                                            (log as any).riskLevel === "Medium" ? "text-amber-400" :
                                            "text-emerald-400"
                                          }`}>
                                            {(log as any).prediction === "None" ? "None" : (log as any).prediction}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calorie Lookup Card (Upgraded UI, Right 1/3 column) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-full">
                    {!showCalorieLookup ? (
                      <CardContent className="p-4 flex flex-col gap-3 flex-grow">
                        {/* Header */}
                        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-4">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500/20 to-fuchsia-500/20 flex items-center justify-center border border-orange-500/30 shrink-0">
                            <Flame className="h-4 w-4 text-orange-400" />
                          </div>
                          <div>
                            <h4 className="text-white text-sm font-black tracking-tight">Today's Calories</h4>
                            <p className="text-slate-500 text-[10px] font-medium">Daily calorie summary</p>
                          </div>
                        </div>

                        {/* Big calorie number */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-white tracking-tight">{calories}</span>
                            <span className="text-slate-400 text-sm font-bold">/ 3000</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">kcal consumed</span>
                        </div>

                        {/* Progress bar */}
                        <div className="flex flex-col gap-2">
                          <div className="w-full h-1.5 rounded-full bg-slate-800/60 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.round((calories / 3000) * 100))}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-1.5 rounded-full ${
                                calories > 2700
                                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                                  : calories > 2000
                                  ? "bg-gradient-to-r from-amber-500 to-orange-400"
                                  : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                              }`}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-500">0 kcal</span>
                            <span className={`${calories > 2700 ? "text-red-400" : calories > 2000 ? "text-amber-400" : "text-violet-400"}`}>
                              {Math.min(100, Math.round((calories / 3000) * 100))}% of goal
                            </span>
                            <span className="text-slate-500">3000 kcal</span>
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-900/50 rounded-xl border border-slate-800/60 p-3 flex flex-col gap-0.5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Consumed</span>
                            <span className="text-base font-black text-orange-400">{calories}</span>
                            <span className="text-[9px] text-slate-600 font-semibold">kcal</span>
                          </div>
                          <div className="bg-slate-900/50 rounded-xl border border-slate-800/60 p-3 flex flex-col gap-0.5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Remaining</span>
                            <span className={`text-base font-black ${Math.max(0, 3000 - calories) < 300 ? "text-red-400" : "text-emerald-400"}`}>
                              {Math.max(0, 3000 - calories)}
                            </span>
                            <span className="text-[9px] text-slate-600 font-semibold">kcal left</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className={`px-3.5 py-2.5 rounded-xl border text-center ${
                          calories > 2700
                            ? "bg-red-950/20 border-red-900/40 text-red-400"
                            : calories > 2000
                            ? "bg-amber-950/20 border-amber-900/40 text-amber-400"
                            : calories === 0
                            ? "bg-slate-900/30 border-slate-800/40 text-slate-400"
                            : "bg-green-950/20 border-green-900/40 text-green-400"
                        }`}>
                          <span className="text-[11px] font-black">
                            {calories > 2700 ? "⚠️ Near limit — watch intake" :
                             calories > 2000 ? "🔥 Good progress today" :
                             calories === 0 ? "📋 No entry logged yet" :
                             "✅ On track — keep it up!"}
                          </span>
                        </div>

                        {/* Divider with label */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-slate-800/60" />
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Food Lookup</span>
                          <div className="flex-1 h-px bg-slate-800/60" />
                        </div>

                        {/* Lookup trigger */}
                        <div className="flex flex-col gap-2 mt-auto">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.08, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/30 shrink-0 cursor-pointer"
                              onClick={() => setShowCalorieLookup(true)}
                            >
                              <Apple className="h-5 w-5 text-violet-400" />
                            </motion.div>
                          </div>
                          <Button
                            onClick={() => setShowCalorieLookup(true)}
                            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-black text-[10px] py-1 rounded-xl h-8 border-0 cursor-pointer shadow-lg shadow-violet-950/40"
                          >
                            Lookup Food
                          </Button>
                        </div>
                      </CardContent>
                    ) : (
                      <>
                        <CardHeader className="p-3 pb-1">
                          <CardTitle className="text-white text-xs font-black flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Apple className="h-4.5 w-4.5 text-violet-400" /> Food Telemetry
                            </span>
                            <Button 
                              variant="ghost" 
                              onClick={() => setShowCalorieLookup(false)}
                              className="text-[10px] text-slate-400 hover:text-white h-7 px-2 hover:bg-slate-900 border-0"
                            >
                              Back
                            </Button>
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-[11px] leading-relaxed">
                            Specify foods and quantities (e.g., "2 bananas and 1 glass milk").
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="py-2 pb-5 flex flex-col gap-4 flex-grow justify-between">
                          <div className="flex flex-col gap-3">
                            <form onSubmit={handleFoodSearch} className="flex gap-2">
                              <Input 
                                placeholder="e.g. 1 bowl oatmeal and 1 apple"
                                value={foodQuery}
                                onChange={e => setFoodQuery(e.target.value)}
                                className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-medium text-xs h-9 flex-grow"
                              />
                              <Button 
                                type="submit" 
                                disabled={isSearchingFood}
                                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-9 px-3 shrink-0 flex items-center justify-center border-0 cursor-pointer"
                              >
                                <Search size={14} />
                              </Button>
                            </form>

                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {[
                                { label: "Dal & Rice", query: "1 bowl dal and 1 cup rice" },
                                { label: "Oatmeal", query: "1 bowl oatmeal with banana" },
                                { label: "Egg Toast", query: "2 boiled eggs and 2 slices brown bread" },
                                { label: "Apple Shake", query: "1 apple and 1 glass milk" }
                              ].map((chip) => (
                                <button
                                  key={chip.label}
                                  type="button"
                                  onClick={() => {
                                    setFoodQuery(chip.query);
                                  }}
                                  className="text-[9px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/50 hover:bg-violet-950/40 text-slate-400 hover:text-violet-300 border border-slate-800/80 hover:border-violet-800/50 transition-all cursor-pointer"
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dynamic Content */}
                          <div className="flex-grow flex flex-col justify-center min-h-[120px]">
                            {isSearchingFood && (
                              <div className="flex flex-col items-center justify-center gap-2 py-4">
                                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-violet-400 font-bold tracking-wide animate-pulse">Running Food Telemetry...</span>
                              </div>
                            )}

                            {foodError && !isSearchingFood && (
                              <div className="text-[11px] text-red-400 font-bold text-center leading-relaxed bg-red-950/20 border border-red-900/30 p-2.5 rounded-xl">
                                ⚠️ {foodError}
                              </div>
                            )}

                            {foodResult && !isSearchingFood && (
                              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex flex-col gap-2 shadow-inner">
                                <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Matched Biometrics</div>
                                <div className="flex flex-col gap-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                                  {foodResult.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs font-semibold text-slate-200">
                                      <span className="capitalize text-slate-350">{item.name}</span>
                                      <span className="text-violet-300 font-extrabold text-[11px]">{Math.round(item.calories)} kcal</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="border-t border-slate-800/80 pt-2 mt-1 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Total Consumed</span>
                                    <span className="text-sm font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                      {Math.round(foodResult.reduce((sum, item) => sum + (item.calories || 0), 0))} kcal
                                    </span>
                                  </div>
                                  <Button 
                                    type="button" 
                                    onClick={applyFoodToLog}
                                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-extrabold text-[10px] py-1 h-8 rounded-lg border-0 px-3 cursor-pointer shadow-md shadow-violet-950/20"
                                  >
                                    Apply to Daily Log
                                  </Button>
                                </div>
                              </div>
                            )}

                            {!isSearchingFood && !foodError && !foodResult && (
                              <div className="flex flex-col items-center justify-center text-slate-500 py-6 text-center">
                                <div className="w-8 h-8 rounded-full bg-slate-900/30 flex items-center justify-center mb-1.5 border border-slate-800/40">
                                  <Search size={14} className="text-slate-450" />
                                </div>
                                <span className="text-[10px] font-semibold">No food loaded yet</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>

                </div>

              </div>

              {/* AI Fitness Coach Card */}
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg font-black flex items-center gap-2">
                    <Activity className="h-5 w-5 text-violet-400 animate-pulse" />
                    AI Fitness Coach
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Get a customized exercise plan generated instantly based on your latest logged metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col gap-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <Button
                      onClick={generateFitnessPlan}
                      disabled={isGeneratingPlan}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl h-11 border-0 cursor-pointer shadow-lg shadow-violet-950/30 flex items-center gap-2"
                    >
                      {isGeneratingPlan ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing &amp; Generating...
                        </>
                      ) : (
                        "Generate My Fitness Plan"
                      )}
                    </Button>

                    {fitnessError && (
                      <span className="text-red-400 text-xs font-bold bg-red-950/30 border border-red-900/50 px-3.5 py-1.5 rounded-xl">
                        ⚠️ {fitnessError}
                      </span>
                    )}
                  </div>

                  {isGeneratingPlan && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-350 text-xs font-bold animate-pulse">Running health logs analysis and retrieving exercises...</p>
                    </div>
                  )}

                  {fitnessPlan && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Health Analysis Status */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-slate-200 text-sm font-bold tracking-tight border-l-2 border-violet-500 pl-2">Health Analysis</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sleep Status</span>
                              <span className="text-white text-xs font-semibold">{sleep} hrs</span>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                              sleep < 6 ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              sleep < 7.5 ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                              "bg-green-500/10 text-green-400 border border-green-500/20"
                            }`}>
                              {sleep < 6 ? "Critical" : sleep < 7.5 ? "Moderate" : "Good"}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hydration Status</span>
                              <span className="text-white text-xs font-semibold">{water} glasses</span>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                              water < 6 ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              water < 8 ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                              "bg-green-500/10 text-green-400 border border-green-500/20"
                            }`}>
                              {water < 6 ? "Critical" : water < 8 ? "Moderate" : "Good"}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Activity Status</span>
                              <span className="text-white text-xs font-semibold">{workoutMinutes} mins</span>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                              workoutMinutes < 20 ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              workoutMinutes < 45 ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                              "bg-green-500/10 text-green-400 border border-green-500/20"
                            }`}>
                              {workoutMinutes < 20 ? "Critical" : workoutMinutes < 45 ? "Moderate" : "Good"}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mood Status</span>
                              <span className="text-white text-xs font-semibold">{latestLog.mood || 'Good'}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                              (latestLog.mood === 'Bad' || latestLog.mood === 'Terrible') ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              latestLog.mood === 'Neutral' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                              "bg-green-500/10 text-green-400 border border-green-500/20"
                            }`}>
                              {(latestLog.mood === 'Bad' || latestLog.mood === 'Terrible') ? "Critical" : latestLog.mood === 'Neutral' ? "Moderate" : "Good"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detected Issues */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-slate-200 text-sm font-bold tracking-tight border-l-2 border-violet-500 pl-2">Detected Issues</h4>
                        {fitnessPlan.issues.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {fitnessPlan.issues.map((issue) => {
                              let text = "";
                              switch (issue) {
                                case "poor_sleep": text = "Poor Sleep (< 6 hours slept)"; break;
                                case "dehydration": text = "Dehydration (< 6 glasses of water)"; break;
                                case "high_calories": text = "High Calories consumed (> 2500 kcal)"; break;
                                case "inactive": text = "Inactive Day (< 20 mins workout)"; break;
                                case "stress": text = "Elevated Stress (Mood reported as Bad/Terrible)"; break;
                                default: text = issue;
                              }
                              return (
                                <span key={issue} className="bg-red-95/30 text-red-400 border border-red-900/50 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                                  <ShieldAlert size={14} className="text-red-500" />
                                  {text}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-green-950/10 border border-green-900/30 text-green-400 text-xs font-bold">
                            ✅ No major health issues detected in your latest log. Amazing job maintaining your routine!
                          </div>
                        )}
                      </div>

                      {/* Recommended Goal */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/30 to-indigo-950/30 border border-violet-800/40">
                        <span className="text-[10px] text-violet-400 font-extrabold uppercase tracking-widest block mb-1">Recommended Goal</span>
                        <h5 className="text-white text-md font-black capitalize">{fitnessPlan.category} Training Plan</h5>
                        <p className="text-slate-300 text-xs mt-1.5 leading-relaxed font-semibold">
                          {fitnessPlan.category === 'yoga' && "Focus on slow, mindful movements, deep breathing, and light stretching to reduce cortisol (stress) and prepare your body for deep restorative sleep."}
                          {fitnessPlan.category === 'cardio' && "Focus on active cardiovascular work to burn off high calorie intake, improve circulation, and build aerobic capacity."}
                          {fitnessPlan.category === 'strength' && "Focus on muscle engagement and strength exercises to wake up inactive muscle groups, improve core stability, and kickstart metabolism."}
                          {fitnessPlan.category === 'general fitness' && "Focus on a balanced routine of strength, mobility, and steady-state cardiovascular work to maintain your excellent current health status."}
                        </p>
                      </div>

                      {/* Recommended Exercises */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-slate-200 text-sm font-bold tracking-tight border-l-2 border-violet-500 pl-2">Recommended Exercises</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {fitnessPlan.exercises.map((ex, i) => (
                            <motion.div
                              whileHover={{ y: -3 }}
                              key={i}
                              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between shadow-lg"
                            >
                              <div className="w-full h-40 bg-slate-950/80 flex items-center justify-center relative overflow-hidden border-b border-slate-850">
                                <img
                                  src={ex.gifUrl}
                                  alt={ex.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230f172a'/><text x='50' y='50' font-family='sans-serif' font-size='10' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'>No Animation</text></svg>";
                                  }}
                                />
                              </div>
                              <div className="p-4 flex flex-col gap-3.5">
                                <div>
                                  <h6 className="text-white text-sm font-black capitalize line-clamp-1">{ex.name}</h6>
                                  <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block mt-1">Target: {ex.target}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                  <div className="bg-slate-950/40 border border-slate-850 p-1.5 rounded-lg text-center">
                                    <span className="text-slate-500 block text-[9px] mb-0.5">Equipment</span>
                                    <span className="text-slate-200 line-clamp-1">{ex.equipment}</span>
                                  </div>
                                  <div className="bg-slate-950/40 border border-slate-850 p-1.5 rounded-lg text-center">
                                    <span className="text-slate-500 block text-[9px] mb-0.5">Body Part</span>
                                    <span className="text-slate-200 line-clamp-1">{ex.bodyPart}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}