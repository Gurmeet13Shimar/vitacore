import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import { mockUser, achievements } from "@/data/mockData";
import { Trophy, Star, Shield, Flame, Medal, Target, PiggyBank, Moon, Sun, Code, Wind, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Achievements() {
  const { themeColors, theme } = useTheme();
  const nextLevelXp = 5000;
  const progress = (mockUser.xp / nextLevelXp) * 100;

  // Map icon strings to Lucide elements safely
  const getBadgeIcon = (iconName: string, color: string) => {
    const props = { size: 24, color };
    switch (iconName) {
      case "Flame": return <Flame {...props} />;
      case "PiggyBank": return <PiggyBank {...props} />;
      case "Moon": return <Moon {...props} />;
      case "Sun": return <Sun {...props} />;
      case "Code": return <Code {...props} />;
      case "Wind": return <Wind {...props} />;
      case "TrendingUp": return <Trophy {...props} />;
      case "Droplets": return <Medal {...props} />;
      case "Medal": return <Medal {...props} />;
      case "Star": return <Star {...props} />;
      case "Award": return <Award {...props} />;
      case "Brain": return <Award {...props} />;
      default: return <Target {...props} />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans" style={{ background: themeColors.background }}>
        
        {/* Ambient glow orbs */}
        <div className="absolute top-[-10%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none z-0" />
        <div className="absolute bottom-[-5%] left-[5%] w-[30vw] h-[30vw] rounded-full bg-radial-gradient from-violet-500/5 to-transparent pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6 md:gap-8">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-violet-500/10 pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Gamification Center
              </h1>
              <p className="text-slate-400 mt-1.5 font-medium text-sm md:text-base">
                Systemic rewards and status vectors for consistent system optimization.
              </p>
            </div>
            
            <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center shadow-lg shadow-violet-950/20">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
          </div>

          {/* Level Banner (3D Tilt Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="w-full relative overflow-hidden"
          >
            <Card className="glass-card neon-border border-0 bg-slate-900/60 backdrop-blur-xl p-8 relative overflow-hidden">
              
              {/* Shield watermark */}
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 text-amber-400 pointer-events-none">
                <Shield size={140} strokeWidth={1.5} />
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Level avatar */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-600 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-amber-500/20">
                  {mockUser.level}
                </div>
                
                <div className="flex-1 w-full">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Current System Rank</span>
                  <h2 className="text-white text-2xl font-black mt-1">{mockUser.levelName}</h2>
                  
                  <div className="flex justify-between items-center mt-6 mb-2 text-xs font-bold text-slate-400">
                    <span>{mockUser.xp.toLocaleString()} XP</span>
                    <span>Next level: {nextLevelXp.toLocaleString()} XP</span>
                  </div>
                  
                  {/* Progress Meter */}
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Badges Section */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
              <Medal className="h-5 w-5 text-amber-400" />
              Unlocked Badges & Milestones
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {achievements.map((ach, i) => {
                const colorAccent = ach.unlocked ? "#a78bfa" : "#64748b";
                const colorBg = ach.unlocked ? "rgba(139, 92, 246, 0.1)" : "rgba(255, 255, 255, 0.02)";
                
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{
                      y: ach.unlocked ? -6 : -2,
                      scale: ach.unlocked ? 1.03 : 1.01,
                    }}
                    key={ach.id}
                    className={`glass-card border-0 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3.5 transition-all duration-300 relative overflow-hidden ${
                      ach.unlocked 
                        ? "bg-slate-900/60 neon-border border-violet-500/10" 
                        : "bg-slate-950/40 border border-slate-900/30 opacity-40 grayscale"
                    }`}
                  >
                    {/* Badge Icon */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md"
                      style={{
                        background: colorBg,
                        border: ach.unlocked ? "1px solid rgba(167, 139, 250, 0.2)" : "1px solid rgba(255,255,255,0.03)",
                        boxShadow: ach.unlocked ? "0 4px 10px rgba(167, 139, 250, 0.1)" : "none"
                      }}
                    >
                      {getBadgeIcon(ach.icon, colorAccent)}
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full">
                      <div className="font-extrabold text-xs text-slate-200 leading-snug line-clamp-1">
                        {ach.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold leading-normal line-clamp-2 min-h-[30px]">
                        {ach.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}