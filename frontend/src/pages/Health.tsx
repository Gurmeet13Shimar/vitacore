import React, { useState, useEffect, useMemo, FC } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { 
  Activity, Droplets, Moon, Zap, Flame, Plus, Clock, TrendingUp, Sparkles, 
  Smile, Dumbbell, Coffee, HeartPulse, ShieldAlert, Heart, ClipboardCheck
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
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State - Utilizing simple numbers allowing clean direct typing without spin lockups
  const [formData, setFormData] = useState({
    workoutMinutes: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    sleepHours: 0,
    waterGlasses: 0,
    mood: "Good" as "Great" | "Good" | "Neutral" | "Bad" | "Terrible"
  });

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

  // Generate Typical Human Routine Log
  const generateRandomHumanLog = () => {
    const workoutOptions = [
      { min: 30, burn: 280, cal: 400, water: 3, sleep: 7.5, mood: "Great" as const },
      { min: 0, burn: 0, cal: 950, water: 1, sleep: 6.0, mood: "Good" as const },
      { min: 20, burn: 150, cal: 320, water: 2, sleep: 8.0, mood: "Great" as const },
      { min: 60, burn: 550, cal: 1200, water: 4, sleep: 7.0, mood: "Good" as const },
      { min: 0, burn: 0, cal: 250, water: 2, sleep: 8.5, mood: "Neutral" as const }
    ];

    const template = workoutOptions[Math.floor(Math.random() * workoutOptions.length)];
    const finalWorkout = Math.max(0, template.min + Math.floor(Math.random() * 11) - 5);
    const finalBurn = Math.max(0, template.burn + Math.floor(Math.random() * 51) - 25);
    const finalCal = Math.max(0, template.cal + Math.floor(Math.random() * 101) - 50);
    const finalWater = Math.max(0, template.water + Math.floor(Math.random() * 3) - 1);
    const finalSleep = parseFloat(Math.max(4.0, template.sleep + (Math.random() * 1.5) - 0.75).toFixed(1));

    setFormData({
      workoutMinutes: finalWorkout,
      caloriesBurned: finalBurn,
      caloriesConsumed: finalCal,
      sleepHours: finalSleep,
      waterGlasses: finalWater,
      mood: template.mood
    });
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

  // Sleep Architecture Chart (Static metric derived from logs)
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

  return (
    <AppLayout>
      {/* ── Page Container with opacity-controlled subtle Background Image ── */}
      <div className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans bg-[#070513]">
        
        {/* Subtle, faint background pattern overlay (2% opacity) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url('/health_bg.png')" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
            
            {/* ── LEFT PANEL: Direct-Entry Form (25% / 1 Column) ── */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                      <Plus className="h-5 w-5 text-violet-400" /> Log Biometrics
                    </CardTitle>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={generateRandomHumanLog}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold px-2.5 py-1 rounded-lg border-0 text-[10px] flex items-center gap-1 shadow-md shadow-violet-950/20"
                          >
                            <Sparkles className="h-3 w-3" />
                            Auto-Gen
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border border-slate-700 text-white text-xs">
                          <p>Quick fill form with a typical randomized human log.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-slate-400 text-xs">
                    Directly type your biological telemetry metrics.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-2">
                  {/* Presets Chips */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 block">Quick Presets</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyPreset("morning_run")}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all text-left flex items-center gap-1"
                      >
                        🏃 Run
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset("cheat_breakfast")}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all text-left flex items-center gap-1"
                      >
                        🥐 Cheat
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset("desk_focus")}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all text-left flex items-center gap-1"
                      >
                        💻 Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset("deep_sleep")}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all text-left flex items-center gap-1"
                      >
                        💤 Sleep
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3.5">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calories Consumed</label>
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
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calories Burned</label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            value={formData.caloriesBurned || ""} 
                            onChange={e => setFormData({ ...formData, caloriesBurned: e.target.value === "" ? 0 : Number(e.target.value) })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
                            required 
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500">kcal</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sleep Hours</label>
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
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Water Intake</label>
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
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">General Mood</label>
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
                      SYNC BIOMETRICS
                    </Button>
                  </form>
                </CardContent>
              </Card>

            </div>

            {/* ── RIGHT PANEL: Gorgeous Health-Themed Console (75% / 3 Columns) ── */}
            <div className="xl:col-span-3 flex flex-col gap-6 md:gap-8">
              
              {/* Header inside right panel */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    Health Console
                  </h1>
                  <p className="text-slate-200 mt-1 font-semibold text-xs md:text-sm">
                    Futuristic biological twins telemetry and molecular tracking algorithms.
                  </p>
                </div>

                {/* System integrity score badge */}
                <div className="glass-card border border-slate-800/80 bg-slate-900/85 backdrop-blur-md px-5 py-2.5 flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-violet-400 tracking-wider uppercase block">System Index</span>
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
                  title="Calories Consumed"
                  value={calories}
                  unit="kcal"
                  icon={<Flame className="h-4.5 w-4.5 text-orange-500" />}
                  description="Target: 3000 kcal limit"
                  valueClassName="text-orange-400"
                />
                <MetricCard
                  title="Sleep Architecture"
                  value={sleep}
                  unit="hrs"
                  icon={<Moon className="h-4.5 w-4.5 text-indigo-500" />}
                  description="Target: 8.0h restful REM"
                  valueClassName="text-indigo-400"
                />
                <MetricCard
                  title="Fluid Intake"
                  value={water}
                  unit="glasses"
                  icon={<Droplets className="h-4.5 w-4.5 text-cyan-500" />}
                  description="Target: 8 daily glasses"
                  valueClassName="text-cyan-400"
                />
                <MetricCard
                  title="Sync Log cycles"
                  value={totalLogs}
                  unit="cycles"
                  icon={<ClipboardCheck className="h-4.5 w-4.5 text-emerald-500" />}
                  description="Overall database entries"
                  valueClassName="text-emerald-400"
                />
              </div>

              {/* Sleep Area Chart & Pie chart section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Balance Wheel */}
                <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-white text-md font-bold">Metabolic Balance Wheel</CardTitle>
                    <CardDescription className="text-slate-400 text-xs">Calorie limits loading allocation.</CardDescription>
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

                {/* Area chart */}
                <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white text-md font-bold">Sleep Architecture History</CardTitle>
                    <CardDescription className="text-slate-400 text-xs">Last 7 logged cycles (total sleep hours).</CardDescription>
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

              </div>

              {/* Database Feed */}
              <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl max-h-[380px] overflow-hidden flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-violet-400" /> Biometric Sync Ledger Feed
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    List of recently synchronized telemetry items.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0 overflow-hidden flex-grow">
                  <ScrollArea className="h-[200px] px-4 pb-2">
                    <div className="flex flex-col gap-2">
                      {safeLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                          <ShieldAlert className="text-slate-600 h-7 w-7" />
                          <p className="text-slate-500 text-xs font-semibold">No sync cycles detected. Initiate telemetry.</p>
                        </div>
                      ) : (
                        safeLogs.map((l: any, i: number) => {
                          const dateStr = l.date ? new Date(l.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : "Today";
                          return (
                            <div 
                              key={l._id || i} 
                              className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl hover:bg-slate-800/20 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                                  <Activity size={14} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-200 text-xs">{dateStr}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {l.workoutMinutes}m workout • {l.waterGlasses} glasses
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-extrabold text-xs text-white">{l.caloriesConsumed} kcal</div>
                                <div className="text-[9px] text-slate-400 font-semibold">{l.sleepHours}h sleep • {l.mood || "Good"}</div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-semibold bg-slate-900/40">
                  <p>Displaying localized biometric ledger streams.</p>
                </CardFooter>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}