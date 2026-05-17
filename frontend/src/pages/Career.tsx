import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Briefcase, Target, Award, Rocket, CheckCircle2, Circle, Plus } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Career() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    topic: "React",
    durationMinutes: 0,
    notes: ""
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/career");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/career", formData);
      fetchLogs(); // Refresh
      setFormData({ topic: "React", durationMinutes: 0, notes: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  // Group study logs by topic to populate competency matrix
  const topicMap: { [key: string]: number } = {
    "React": 50,
    "Node.js": 40,
    "MongoDB": 30,
    "System Design": 35,
    "Security": 25,
    "DevOps": 20
  };

  safeLogs.forEach((item) => {
    const hours = item.durationMinutes / 60;
    if (topicMap[item.topic] !== undefined) {
      topicMap[item.topic] = Math.min(100, topicMap[item.topic] + hours * 5);
    } else {
      topicMap[item.topic] = Math.min(100, 30 + hours * 5);
    }
  });

  const skillData = Object.keys(topicMap).map(key => ({
    subject: key,
    A: topicMap[key],
    fullMark: 100
  }));

  // Calculate total study time
  const totalMinutes = safeLogs.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const score = Math.min(100, 80 + Math.round(totalHours / 2));

  // Promotion Roadmap milestones
  const milestones = [
    { id: 1, title: "Master Core Stack (10 Hours)", progress: Math.min(100, Math.round((totalHours / 10) * 100)), completed: totalHours >= 10 },
    { id: 2, title: "Deploy Production Subsystem (25 Hours)", progress: Math.min(100, Math.round((totalHours / 25) * 100)), completed: totalHours >= 25 },
    { id: 3, title: "Full Architecture Audit (50 Hours)", progress: Math.min(100, Math.round((totalHours / 50) * 100)), completed: totalHours >= 50 }
  ];

  // Heatmap for the last 60 days
  const heatmapData = Array.from({ length: 60 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();

    // Check if any study logs occurred on this day
    const dayLogs = safeLogs.filter((l) => {
      const logDateStr = new Date(l.date || l.createdAt).toDateString();
      return logDateStr === dateStr;
    });

    const sumMinutes = dayLogs.reduce((sum, l) => sum + l.durationMinutes, 0);
    const hours = sumMinutes / 60;
    
    let intensity = 0;
    if (hours > 4) intensity = 1.0;
    else if (hours > 2) intensity = 0.7;
    else if (hours > 0) intensity = 0.3;

    return {
      date: date.toLocaleDateString(),
      hours: hours,
      intensity: intensity
    };
  }).reverse();

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
            <div className="text-4xl font-black text-pink-400 tracking-tighter">{score}</div>
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
              <div className="text-2xl font-bold text-white">Associate Engineer</div>
            </div>
            
            <div className="flex-1 px-8 flex items-center relative">
              <div className="h-px bg-white/20 flex-1 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (totalHours / 50) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                />
              </div>
              <Rocket className="text-pink-400 absolute bg-background p-1" style={{ left: `${Math.min(95, (totalHours / 50) * 100)}%`, transform: "translateX(-50%)" }} size={28} />
            </div>

            <div className="text-right">
              <div className="text-sm text-pink-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                Target Node
              </div>
              <div className="text-2xl font-bold text-white">Principal Architect</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Radar */}
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Competency Matrix</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
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
              {milestones.map((m) => (
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

        {/* Heatmap & Deep Work Session Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Study Log Form */}
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Plus className="text-pink-400" size={20} /> Log Deep Work Session
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Duration (Minutes)</label>
                  <Input type="number" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})} className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Topic</label>
                  <select value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="flex h-10 w-full rounded-md border border-white/10 bg-[#1e293b] px-3 py-2 text-sm text-white select-custom focus:outline-none">
                    <option value="React" className="bg-[#1e293b] text-white">React</option>
                    <option value="Node.js" className="bg-[#1e293b] text-white">Node.js</option>
                    <option value="MongoDB" className="bg-[#1e293b] text-white">MongoDB</option>
                    <option value="System Design" className="bg-[#1e293b] text-white">System Design</option>
                    <option value="Security" className="bg-[#1e293b] text-white">Security</option>
                    <option value="DevOps" className="bg-[#1e293b] text-white">DevOps</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase">Study Notes</label>
                <Input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="e.g. Mastered React concurrent rendering" className="bg-white/5 border-white/10 text-white" />
              </div>
              <Button type="submit" className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors">
                RECORD WORK NODE
              </Button>
            </form>
          </div>

          <div className="glass-card p-6 border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Award size={20} className="text-pink-500" /> Deep Work Consistency (Last 60 Days)
              </h3>
              <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
                {heatmapData.map((d, i) => {
                  let bg = "bg-white/5";
                  if (d.intensity > 0.8) bg = "bg-pink-500";
                  else if (d.intensity > 0.5) bg = "bg-pink-500/60";
                  else if (d.intensity > 0.1) bg = "bg-pink-500/30";
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.005 }}
                      className={`w-5 h-5 rounded-sm ${bg} hover:ring-2 hover:ring-white/50 transition-all cursor-crosshair shrink-0`}
                      title={`${d.date}: ${d.hours.toFixed(1)} hours`}
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
            <div className="mt-6 border-t border-white/5 pt-4 text-sm text-gray-400 flex justify-between">
              <span>Total Accrued Focus:</span>
              <span className="font-bold text-white">{totalHours} Hours</span>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}