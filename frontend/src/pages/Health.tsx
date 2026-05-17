import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Activity, Droplets, Moon, Zap, Flame, Plus } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Health() {
  const [logs, setLogs] = useState([]);
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
    day: `Day ${i+1}`,
    hours: l.sleepHours || 0
  }));
  // If empty, put mock data
  if (sleepData.length === 0) {
    for(let i=0; i<7; i++) sleepData.push({ day: `Day ${i+1}`, hours: 0 });
  }

  const COLORS = ['#A855F7', '#1F2937'];
  const calData = [
    { name: 'Consumed', value: calories },
    { name: 'Remaining', value: Math.max(0, 3000 - calories) }
  ];

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
              <Activity className="text-purple-500" /> Health Module
            </h1>
            <p className="text-muted-foreground">Biometric telemetry and physical optimization.</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-purple-400 tracking-tighter">{score}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Health Score</div>
          </div>
        </div>

        {/* Top 4 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Calories", value: calories, unit: "kcal", icon: Flame, color: "text-orange-500" },
            { label: "Sleep", value: sleep, unit: "hrs", icon: Moon, color: "text-indigo-400" },
            { label: "Hydration", value: water, unit: "glasses", icon: Droplets, color: "text-blue-400" },
            { label: "Logs", value: safeLogs.length, unit: "total", icon: Activity, color: "text-red-400" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 border-white/10 flex flex-col items-center justify-center text-center"
            >
              <stat.icon className={`mb-3 ${stat.color}`} size={24} />
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.unit}</span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calorie Ring */}
          <div className="glass-card p-6 border-white/10 flex flex-col items-center justify-center relative">
            <h3 className="text-lg font-semibold text-white absolute top-6 left-6">Metabolic Load</h3>
            <div className="h-64 w-full relative mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={calData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {calData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-3xl font-black text-white">{calories}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">/ 3000 kcal</span>
              </div>
            </div>
          </div>

          {/* Sleep Area Chart */}
          <div className="lg:col-span-2 glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Sleep Architecture (Last 7 Logs)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="day" stroke="#666" tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" tickLine={false} axisLine={false} domain={[0, 12]} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                  <Area type="monotone" dataKey="hours" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Form and Recent Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Plus className="text-purple-400" size={20} /> Log Today's Data
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Calories Consumed</label>
                  <Input type="number" value={formData.caloriesConsumed} onChange={e => setFormData({...formData, caloriesConsumed: Number(e.target.value)})} className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Sleep Hours</label>
                  <Input type="number" step="0.5" value={formData.sleepHours} onChange={e => setFormData({...formData, sleepHours: Number(e.target.value)})} className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Water (Glasses)</label>
                  <Input type="number" value={formData.waterGlasses} onChange={e => setFormData({...formData, waterGlasses: Number(e.target.value)})} className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Workout Mins</label>
                  <Input type="number" value={formData.workoutMinutes} onChange={e => setFormData({...formData, workoutMinutes: Number(e.target.value)})} className="bg-white/5 border-white/10 text-white" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors">
                SUBMIT TELEMETRY
              </Button>
            </form>
          </div>

          <div className="glass-card p-6 border-white/10 overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Database Logs</h3>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {safeLogs.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No data logged yet. Initiate your first sync.</p>
              ) : (
                safeLogs.slice(0, 5).map((l: any) => (
                  <div key={l._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                        <Activity size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white">{new Date(l.date).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{l.workoutMinutes}m workout • {l.waterGlasses} glasses</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-white">{l.caloriesConsumed} kcal</div>
                      <div className="text-xs text-muted-foreground">{l.sleepHours}h sleep</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}