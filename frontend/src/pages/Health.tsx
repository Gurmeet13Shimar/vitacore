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
  HeartPulse, ShieldAlert, ClipboardCheck, Apple, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [logs, setLogs] = useState<any[]>([]);
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

  // Form State
  const [formData, setFormData] = useState({
    workoutMinutes: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    sleepHours: 0,
    waterGlasses: 0,
    mood: "Good" as "Great" | "Good" | "Neutral" | "Bad" | "Terrible"
  });

  // CalorieNinjas Search State
  const [foodQuery, setFoodQuery] = useState("");
  const [isSearchingFood, setIsSearchingFood] = useState(false);
  const [foodResult, setFoodResult] = useState<any[] | null>(null);
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

      fetchLogs(); // Refresh DB entries
      setFormData({ 
        workoutMinutes: 0, 
        caloriesBurned: 0, 
        caloriesConsumed: 0, 
        sleepHours: 0, 
        waterGlasses: 0, 
        mood: "Good" 
      });
      setFoodResult(null);
      setFoodQuery("");
    } catch (error) {
      console.error("Error submitting health log:", error);
    }
  };

  // Autocomplete Presets
  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case "morning_run":
        setFormData({
          workoutMinutes: 45,
          caloriesBurned: 420,
          caloriesConsumed: 0,
          sleepHours: 0,
          waterGlasses: 2,
          mood: "Great"
        });
        break;
      case "cheat_breakfast":
        setFormData({
          workoutMinutes: 0,
          caloriesBurned: 0,
          caloriesConsumed: 850,
          sleepHours: 0,
          waterGlasses: 1,
          mood: "Good"
        });
        break;
      case "desk_focus":
        setFormData({
          workoutMinutes: 15,
          caloriesBurned: 110,
          caloriesConsumed: 180,
          sleepHours: 0,
          waterGlasses: 3,
          mood: "Neutral"
        });
        break;
      case "deep_sleep":
        setFormData({
          workoutMinutes: 0,
          caloriesBurned: 0,
          caloriesConsumed: 0,
          sleepHours: 8.5,
          waterGlasses: 0,
          mood: "Great"
        });
        break;
      default:
        break;
    }
  };

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
  const latestLog = safeLogs[0] || { caloriesConsumed: 0, sleepHours: 0, waterGlasses: 0, workoutMinutes: 0, caloriesBurned: 0 };
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
  const sleepHistoryData = useMemo(() => {
    const historicalPoints = safeLogs.slice(0, 7).reverse().map((l: any, i: number) => ({
      day: l.date ? new Date(l.date).toLocaleDateString([], { weekday: 'short' }) : `Day ${i + 1}`,
      hours: l.sleepHours || 0
    }));

    if (historicalPoints.length === 0) {
      for (let i = 0; i < 7; i++) {
        historicalPoints.push({ day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], hours: 0 });
      }
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

    const cells = [];

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
    const matchedLogs = cells.map(cell => {
      const cellDateStr = cell.date.toDateString();
      const log = safeLogs.find(l => {
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
      <div className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans" style={{ background: themeColors.background }}>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url('/health_bg.png')" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
            
            {/* ── LEFT PANEL: Food Search & Logging ── */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              
              {/* CalorieNinjas Smart Logger */}
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl overflow-hidden">
                {!showCalorieLookup ? (
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                      <Apple className="h-6 w-6 text-violet-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-white text-sm font-bold tracking-tight">
                        Excited to know how many calories you have consumed?
                      </h4>
                      <p className="text-slate-400 text-[11px] font-medium">
                        Look up any food to check its calories instantly.
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowCalorieLookup(true)}
                      className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl h-9 border-0 cursor-pointer shadow-lg shadow-violet-950/30"
                    >
                      Check Food Calories
                    </Button>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-md font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Apple className="h-5 w-5 text-violet-400" /> Food Calorie Lookup
                        </span>
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowCalorieLookup(false)}
                          className="text-[10px] text-slate-400 hover:text-white h-6 px-2 hover:bg-slate-900 border-0"
                        >
                          Back
                        </Button>
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs">
                        Type what you ate (e.g., "2 bananas and 1 glass milk") to find the calories instantly.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 pb-4">
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
                          className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-9 px-3 shrink-0 flex items-center justify-center border-0"
                        >
                          <Search size={14} />
                        </Button>
                      </form>

                      {/* Loading/Error/Results */}
                      {isSearchingFood && (
                        <div className="text-xs text-violet-400 font-semibold mt-3 animate-pulse text-center">
                          Searching foods...
                        </div>
                      )}

                      {foodError && (
                        <div className="text-[11px] text-red-400 font-semibold mt-3 text-center leading-relaxed">
                          {foodError}
                        </div>
                      )}

                      {foodResult && (
                        <div className="mt-3 p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col gap-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foods Detected</div>
                          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {foodResult.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs font-semibold text-slate-200">
                                <span className="capitalize">{item.name}</span>
                                <span className="text-slate-400 text-[11px]">{Math.round(item.calories)} kcal</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-slate-800/60 pt-2 mt-1 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">Total Calories</span>
                              <span className="text-sm font-black text-violet-300">
                                {Math.round(foodResult.reduce((sum, item) => sum + (item.calories || 0), 0))} kcal
                              </span>
                            </div>
                            <Button 
                              type="button" 
                              onClick={applyFoodToLog}
                              className="bg-violet-500 hover:bg-violet-600 text-white font-black text-[10px] py-1 h-7 rounded-lg border-0 px-2.5"
                            >
                              Use this number
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </>
                )}
              </Card>

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
                            value={formData.caloriesConsumed || ""} 
                            onChange={e => setFormData({ ...formData, caloriesConsumed: e.target.value === "" ? 0 : Number(e.target.value) })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
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
                            step="0.5"
                            value={formData.sleepHours || ""} 
                            onChange={e => setFormData({ ...formData, sleepHours: e.target.value === "" ? 0 : Number(e.target.value) })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
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
                            value={formData.waterGlasses || ""} 
                            onChange={e => setFormData({ ...formData, waterGlasses: e.target.value === "" ? 0 : Number(e.target.value) })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
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
                            value={formData.workoutMinutes || ""} 
                            onChange={e => setFormData({ ...formData, workoutMinutes: e.target.value === "" ? 0 : Number(e.target.value) })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
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
            <div className="xl:col-span-3 flex flex-col gap-6 md:gap-8">
              
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

                {/* Score badge */}
                <div className="glass-card border border-slate-800/80 bg-slate-900/85 backdrop-blur-md px-5 py-2.5 flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-violet-400 tracking-wider uppercase block">Health Score</span>
                    <h3 className="text-white text-xl font-black">{score}%</h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                    <HeartPulse className="text-violet-400 h-4.5 w-4.5 animate-pulse" />
                  </div>
                </div>
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

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Balance Wheel */}
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

                {/* Sleep Area chart */}
                <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white text-md font-bold">Sleep History</CardTitle>
                    <CardDescription className="text-slate-400 text-xs">Total hours slept over your last 7 logs.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-36 w-full">
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

                {/* Activity Log */}
                <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between overflow-visible p-4">
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
                  <div className="flex flex-col select-none overflow-visible">
                    {/* Header Month Selector */}
                    <div className="flex items-center justify-between mb-5 px-2">
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
                    <div className="grid grid-cols-7 gap-1 text-center mb-3">
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                        <span key={d} className="text-[10px] font-black text-slate-500 tracking-wider">
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Grid Cells */}
                    <div className="grid grid-cols-7 gap-y-2 gap-x-1 relative overflow-visible">
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
                            className="group relative flex items-center justify-center aspect-square overflow-visible"
                          >
                            {/* Cell circle */}
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative ${
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
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 bg-slate-950/95 border border-slate-800 rounded-2xl p-3.5 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 flex flex-col gap-2"
                                style={{ backdropFilter: "blur(12px)", transformOrigin: "bottom center" }}
                              >
                                {/* Mood on Top */}
                                <div className="flex items-center justify-between border-b border-slate-850 pb-1.5 mb-1">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Mood</span>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${moodBadgeColor}`}>
                                    {moodEmoji}
                                  </span>
                                </div>

                                {/* Metrics List */}
                                <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                      <Flame size={12} className="text-orange-500" /> Calories:
                                    </span>
                                    <span className="font-extrabold text-white">{log.caloriesConsumed} kcal</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                      <Droplets size={12} className="text-cyan-500" /> Water:
                                    </span>
                                    <span className="font-extrabold text-white">{log.waterGlasses} glasses</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                      <Activity size={12} className="text-violet-400" /> Workout:
                                    </span>
                                    <span className="font-extrabold text-white">{log.workoutMinutes} mins</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                      <Moon size={12} className="text-indigo-400" /> Sleep:
                                    </span>
                                    <span className="font-extrabold text-white">{log.sleepHours} hrs</span>
                                  </div>
                                </div>

                                {/* Small Arrow indicator for the tooltip */}
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

            </div>

          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}