import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { healthStats } from "@/data/mockData";
import { Activity, Droplets, Moon, Zap, ArrowUpRight, Flame } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function Health() {
  const COLORS = ['#A855F7', '#1F2937']; // Primary and dark grey
  const calData = [
    { name: 'Consumed', value: healthStats.calories },
    { name: 'Remaining', value: Math.max(0, 3000 - healthStats.calories) }
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
            <div className="text-4xl font-black text-purple-400 tracking-tighter">{healthStats.score}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Health Score</div>
          </div>
        </div>

        {/* Top 4 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Calories", value: healthStats.calories, unit: "kcal", icon: Flame, color: "text-orange-500" },
            { label: "Sleep", value: healthStats.sleep, unit: "hrs", icon: Moon, color: "text-indigo-400" },
            { label: "Hydration", value: healthStats.water, unit: "glasses", icon: Droplets, color: "text-blue-400" },
            { label: "Resting HR", value: healthStats.bpm, unit: "bpm", icon: Activity, color: "text-red-400" },
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
                  <Pie
                    data={calData}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {calData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-3xl font-black text-white">{healthStats.calories}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">/ 3000 kcal</span>
              </div>
            </div>
          </div>

          {/* Sleep Area Chart */}
          <div className="lg:col-span-2 glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Sleep Architecture (7 Days)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthStats.sleepData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="day" stroke="#666" tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" tickLine={false} axisLine={false} domain={[4, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activity & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Workouts</h3>
            <div className="space-y-4">
              {healthStats.workouts.map((w, i) => (
                <div key={w.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-white">{w.type}</div>
                      <div className="text-sm text-muted-foreground">{w.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{w.calories} kcal</div>
                    <div className="text-sm text-muted-foreground">{w.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">AI Protocol Tweaks</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <Zap size={16} /> Recovery Deficit Detected
                </h4>
                <p className="text-sm text-gray-300">Heart rate variability is trending downwards. Substitute tomorrow's HIIT session with active recovery (yoga or light walking) to prevent overtraining.</p>
                <button className="mt-4 text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1 hover:text-purple-300">
                  Apply Schedule Change <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <Droplets size={16} /> Hydration Optimization
                </h4>
                <p className="text-sm text-gray-300">You consistently fall short of water intake by 2PM. Suggesting we add a persistent alert to your workstation display.</p>
                <button className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1 hover:text-blue-300">
                  Enable Alert <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}