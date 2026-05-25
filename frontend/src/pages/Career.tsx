import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Briefcase, 
  Target, 
  Award, 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ArrowLeft 
} from "lucide-react";
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
    <AppLayout theme="career">
      {/* Main background switched to a soft light purple/lavender gradient */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#F3EFF9] to-[#F8F5FC] text-[#1E293B] font-sans p-6 md:p-10 space-y-8">
        
        {/* HEADER BLOCK */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-2 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1E293B] mb-1 flex items-center gap-3">
              Career Module <span className="text-[#9333EA]">🔮</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-normal">Skill acquisition and professional trajectory.</p>
          </div>
          
          {/* Career Score Container matching health & finance signature architecture */}
          <div className="bg-white border border-slate-100 rounded-[24px] px-8 py-4 shadow-[0_4px_20px_rgba(147,51,234,0.04)] text-center min-w-[150px]">
            <div className="text-4xl font-bold text-[#9333EA] tracking-tight">{score || 90}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Career Score</div>
          </div>
        </div>

        {/* CURRENT VS TARGET NODE TRACKER */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto bg-white border border-slate-100/80 rounded-[24px] p-6 md:p-8 relative overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.015)]"
        >
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#9333EA]/5 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Node</div>
              <div className="text-xl md:text-2xl font-bold text-[#1E293B]">Associate Engineer</div>
            </div>
            
            <div className="flex-1 w-full px-2 sm:px-8 flex items-center relative min-h-[32px]">
              <div className="h-0.5 bg-slate-100 flex-1 relative rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (totalHours / 50) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute left-0 top-0 h-full bg-[#9333EA] rounded-full shadow-[0_0_8px_rgba(147,51,234,0.3)]"
                />
              </div>
              <Rocket className="text-[#9333EA] absolute bg-white p-1 rounded-full shadow-sm border border-slate-100" style={{ left: `${Math.min(95, (totalHours / 50) * 100)}%`, transform: "translateX(-50%)" }} size={28} />
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-bold text-[#9333EA] uppercase tracking-wider mb-1 flex items-center sm:justify-end gap-1">
                Target Node
              </div>
              <div className="text-xl md:text-2xl font-bold text-[#1E293B]">Principal Architect</div>
            </div>
          </div>
        </motion.div>

        {/* ANALYTICS SECTION */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Skills Radar Chart */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-6">Competency Matrix</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                  <PolarGrid stroke="#F1F5F9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#9333EA" fill="#9333EA" fillOpacity={0.12} strokeWidth={2.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Promotion Roadmap Milestones */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 flex flex-col shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-6">Promotion Roadmap</h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-none">
              {milestones.map((m) => (
                <div key={m.id} className={`p-4 rounded-xl border transition-colors ${m.completed ? 'bg-purple-50/50 border-purple-100' : 'bg-slate-50/60 border-slate-100/80'}`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-3">
                      {m.completed ? <CheckCircle2 className="text-[#9333EA]" size={18} /> : <Circle className="text-slate-300" size={18} />}
                      <span className={`text-xs font-semibold ${m.completed ? 'text-[#1E293B]' : 'text-slate-500'}`}>{m.title}</span>
                    </div>
                    <span className="text-xs font-bold text-[#9333EA]">{m.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${m.completed ? 'bg-[#9333EA]' : 'bg-[#9333EA]/40'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INPUT INTERACTION AND CONSISTENCY LOG */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Add Study Log Form */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-5 flex items-center gap-2">
              <Plus className="text-[#9333EA]" size={16} /> Log Deep Work Session
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration (Minutes)</label>
                  <Input type="number" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})} className="h-10 bg-slate-50 border border-slate-200/60 rounded-xl text-[#1E293B] focus-visible:ring-[#9333EA] focus-visible:ring-offset-0 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topic</label>
                  <select value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="flex h-10 w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#9333EA]">
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="System Design">System Design</option>
                    <option value="Security">Security</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Study Notes</label>
                <Input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="e.g. Mastered React concurrent rendering" className="h-10 bg-slate-50 border border-slate-200/60 rounded-xl text-[#1E293B] focus-visible:ring-[#9333EA] focus-visible:ring-offset-0 text-sm" />
              </div>
              <Button type="submit" className="w-full h-11 bg-[#9333EA] hover:bg-[#7E22CE] text-white font-semibold rounded-xl transition-all text-sm tracking-wide mt-2 shadow-sm">
                RECORD WORK NODE
              </Button>
            </form>
          </div>

          {/* Consistency Activity Grid */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 flex flex-col justify-between shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-5 flex items-center gap-2">
                <Award size={16} className="text-[#9333EA]" /> Deep Work Consistency (Last 60 Days)
              </h3>
              <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto pr-1 scrollbar-none">
                {heatmapData.map((d, i) => {
                  let bg = "bg-slate-100";
                  if (d.intensity > 0.8) bg = "bg-purple-600";
                  else if (d.intensity > 0.5) bg = "bg-purple-400";
                  else if (d.intensity > 0.1) bg = "bg-purple-200";
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.003 }}
                      className={`w-5 h-5 rounded-sm ${bg} hover:ring-2 hover:ring-purple-300 transition-all cursor-crosshair shrink-0`}
                      title={`${d.date}: ${d.hours.toFixed(1)} hours`}
                    />
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-3 text-[11px] font-medium text-slate-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-slate-100" />
                  <div className="w-3 h-3 rounded-sm bg-purple-200" />
                  <div className="w-3 h-3 rounded-sm bg-purple-400" />
                  <div className="w-3 h-3 rounded-sm bg-purple-600" />
                </div>
                <span>More</span>
              </div>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 flex justify-between items-center">
              <span>Total Accrued Focus:</span>
              <span className="font-bold text-sm text-[#1E293B]">{totalHours} Hours</span>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}