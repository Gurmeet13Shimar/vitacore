import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Activity,
  Droplets,
  Moon,
  Flame,
  Plus,
  ArrowLeft
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Health() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* FORM STATE */
  const [formData, setFormData] = useState({
    workoutMinutes: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    sleepHours: 0,
    waterGlasses: 0,
    mood: "Good"
  });

  /* FETCH LOGS */
  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/health");
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

  /* SUBMIT DATA */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/health", formData);
      fetchLogs();
      setFormData({
        workoutMinutes: 0,
        caloriesBurned: 0,
        caloriesConsumed: 0,
        sleepHours: 0,
        waterGlasses: 0,
        mood: "Good"
      });
    } catch (error) {
      console.error(error);
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  const latestLog: any = safeLogs[0] || {
    caloriesConsumed: 0,
    sleepHours: 0,
    waterGlasses: 0
  };

  const calories = latestLog.caloriesConsumed || 0;
  const sleep = latestLog.sleepHours || 0;
  const water = latestLog.waterGlasses || 0;

  const score = safeLogs.length > 0 ? 85 + Math.min(10, safeLogs.length) : 0;

  /* RECHARTS CONFIGURATION */
  const sleepData = safeLogs
    .slice(0, 7)
    .reverse()
    .map((l: any, i: number) => ({
      day: `Log ${i + 1}`,
      hours: l.sleepHours || 0
    }));

  if (sleepData.length === 0) {
    for (let i = 0; i < 7; i++) {
      sleepData.push({ day: `Log ${i + 1}`, hours: 0 });
    }
  }

  const calData = [
    { name: "Consumed", value: calories },
    { name: "Remaining", value: Math.max(0, 3000 - calories) }
  ];

  return (
    <AppLayout theme="health">
      {/* CHANGED HERE: Main background switched from blue-tint to a soft light mint-green theme gradient */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#EDF7F2] to-[#F4FAF7] text-[#1E293B] font-sans p-6 md:p-10 space-y-8">
        
        {/* HEADER BLOCK */}
        <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-2 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1E293B] mb-1 flex items-center gap-2">
              Health Module <span className="text-[#22C55E]">🍏</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-normal">
              Biometric telemetry and structural physical optimization engines.
            </p>
          </div>

          {/* Health Score Container */}
          <div className="bg-white border border-slate-100 rounded-[24px] px-8 py-4 shadow-[0_4px_20px_rgba(34,197,94,0.05)] text-center min-w-[150px]">
            <div className="text-4xl font-bold text-[#22C55E] tracking-tight">
              {score || 92}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Health Score
            </div>
          </div>
        </header>

        {/* METRICS GRID - Restored to match your screenshot colors */}
        <section className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Calories", value: calories, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Sleep Duration", value: sleep, unit: "hrs", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Hydration Data", value: water, unit: "glasses", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Biometric Logs", value: safeLogs.length, unit: "total", icon: Activity, color: "text-[#22C55E]", bg: "bg-green-50" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-100/80 rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-[0_6px_20px_rgba(0,0,0,0.015)]"
            >
              <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-bold text-[#1E293B]">{stat.value}</span>
                <span className="text-xs text-slate-400 font-medium">{stat.unit}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </section>

        {/* ANALYTICS CHARTS SECTION */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PIE CHART METABOLIC LOAD */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 flex flex-col items-center justify-center relative min-h-[320px] shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] absolute top-6 left-6">
              Metabolic Load
            </h3>

            <div className="h-48 w-full relative mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calData}
                    innerRadius={70}
                    outerRadius={82}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#22C55E" />
                    <Cell fill="#E2E8F0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-[#1E293B]">{calories}</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                  / 3000 kcal
                </span>
              </div>
            </div>
          </div>

          {/* SPLINE AREA SHEET */}
          <div className="lg:col-span-2 bg-white border border-slate-100/80 rounded-[24px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-6">
              Sleep Architecture (Last 7 Cycles)
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="healthSleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 12]} dx={-5} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      color: '#1E293B'
                    }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#healthSleepGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* INPUT INTERACTION AND LOG ENGINE */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* DATA INPUT PANEL */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-5 flex items-center gap-2">
              <Plus className="text-[#22C55E]" size={16} /> Log Today's Data
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "caloriesConsumed", label: "Calories Consumed", type: "number" },
                  { id: "sleepHours", label: "Sleep Hours", type: "number", step: "0.5" },
                  { id: "waterGlasses", label: "Water (Glasses)", type: "number" },
                  { id: "workoutMinutes", label: "Workout Mins", type: "number" }
                ].map((input) => (
                  <div key={input.id} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {input.label}
                    </label>
                    <Input
                      type={input.type}
                      step={input.step}
                      value={(formData as any)[input.id]}
                      onChange={(e) => setFormData({ ...formData, [input.id]: Number(e.target.value) })}
                      className="h-10 bg-slate-50 border border-slate-200/60 rounded-xl text-[#1E293B] focus-visible:ring-[#22C55E] focus-visible:ring-offset-0 transition-all text-sm"
                      required
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full h-11 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-xl transition-all text-sm tracking-wide mt-2 shadow-sm">
                SUBMIT TELEMETRY
              </Button>
            </form>
          </div>

          {/* RECENT DATABASE LOGS */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 max-h-[310px] flex flex-col shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-4">
              Recent Database Logs
            </h3>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 scrollbar-none">
              {safeLogs.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No data logged yet.</p>
              ) : (
                safeLogs.slice(0, 5).map((l: any) => (
                  <div key={l._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-[#22C55E] shrink-0">
                        <Activity size={15} />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-[#1E293B]">
                          {new Date(l.date).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {l.workoutMinutes}m workout • {l.waterGlasses} glasses
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-[#1E293B]">
                        {l.caloriesConsumed} kcal
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {l.sleepHours}h sleep
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}