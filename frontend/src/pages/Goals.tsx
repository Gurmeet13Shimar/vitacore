import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, DollarSign, Briefcase, Sparkles, Compass, 
  ArrowRight, ShieldCheck, ClipboardList, Clock, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Goals() {
  const { themeColors, theme } = useTheme();
  const navigate = useNavigate();

  // Mock scores for the digital twin
  const overviewScores = [
    { label: "Health Score", value: 92, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Financial Health", value: 85, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Career Progress", value: 78, icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  ];

  // Mock goal progress cards
  const goalCards = [
    { 
      title: "Workout Consistency", 
      category: "Health",
      desc: "Maintain 4 exercise sessions per week", 
      progress: 75, 
      color: "#f43f5e", 
      deadline: "2 days remaining" 
    },
    { 
      title: "Liquidity Reserve Target", 
      category: "Finance", 
      desc: "Save 30% of current monthly income assets", 
      progress: 60, 
      color: "#10b981", 
      deadline: "8 days remaining" 
    },
    { 
      title: "Algorithmic Focus Hours", 
      category: "Career", 
      desc: "Log 15 total study hours on career tracks", 
      progress: 90, 
      color: "#6366f1", 
      deadline: "Completed today" 
    },
  ];

  // Mock AI recommendation feed
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
      actionText: "Run Simulator",
      onClick: () => navigate("/simulator"),
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

  return (
    <AppLayout>
      <div className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans" style={{ background: themeColors.background }}>
        
        {/* Faint cover background icons */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url('/health_bg.png')" }}
        />

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

          {/* Scores Overview Row */}
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
                    className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-violet-500 opacity-60 rotate-45"
                    style={{ transform: `rotate(${(score.value / 100) * 360}deg)` }}
                  />
                </div>
              </motion.div>
            ))}
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
                          className="bg-violet-600/90 hover:bg-violet-600 text-white font-extrabold text-[10px] h-8 rounded-lg border-0 px-3 flex items-center gap-1"
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