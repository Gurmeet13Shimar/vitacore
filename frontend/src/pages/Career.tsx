import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { careerStats, mockUser } from "@/data/mockData";
import { Briefcase, Target, Award, Rocket, CheckCircle2, Circle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function Career() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
              <Briefcase className="text-pink-500" /> Career Module
            </h1>
            <p className="text-muted-foreground">Skill acquisition and professional trajectory.</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-pink-400 tracking-tighter">{careerStats.score}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Career Score</div>
          </div>
        </div>

        {/* Current vs Target */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border-pink-500/20 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-pink-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Current Node</div>
              <div className="text-2xl font-bold text-white">{mockUser.role}</div>
            </div>
            
            <div className="flex-1 px-8 flex items-center relative">
              <div className="h-px bg-white/20 flex-1 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                />
              </div>
              <Rocket className="text-pink-400 absolute left-[80%] -translate-x-1/2 bg-background p-1" size={28} />
            </div>

            <div className="text-right">
              <div className="text-sm text-pink-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                <Target size={14} /> Target Node
              </div>
              <div className="text-2xl font-bold text-white">{mockUser.targetRole}</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Radar */}
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Competency Matrix</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={careerStats.skills}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#EC4899" fill="#EC4899" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Milestones */}
          <div className="glass-card p-6 border-white/10 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6">Promotion Roadmap</h3>
            <div className="space-y-4 flex-1">
              {careerStats.milestones.map((m) => (
                <div key={m.id} className={`p-4 rounded-xl border ${m.completed ? 'bg-pink-500/10 border-pink-500/30' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {m.completed ? <CheckCircle2 className="text-pink-500" size={20} /> : <Circle className="text-muted-foreground" size={20} />}
                      <span className={`font-medium ${m.completed ? 'text-white' : 'text-gray-300'}`}>{m.title}</span>
                    </div>
                    <span className="text-sm font-bold text-pink-400">{m.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${m.completed ? 'bg-pink-500' : 'bg-pink-500/50'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Mock */}
        <div className="glass-card p-6 border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Award size={20} className="text-pink-500" /> Deep Work Consistency
          </h3>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 60 }).map((_, i) => {
              const intensity = Math.random();
              let bg = "bg-white/5";
              if (intensity > 0.8) bg = "bg-pink-500";
              else if (intensity > 0.5) bg = "bg-pink-500/60";
              else if (intensity > 0.3) bg = "bg-pink-500/30";
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className={`w-5 h-5 rounded-sm ${bg} hover:ring-2 hover:ring-white/50 transition-all cursor-crosshair`}
                  title={`Day ${i + 1}: ${Math.round(intensity * 4)} hours deep work`}
                />
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-pink-500/30" />
              <div className="w-3 h-3 rounded-sm bg-pink-500/60" />
              <div className="w-3 h-3 rounded-sm bg-pink-500" />
            </div>
            <span>More</span>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}