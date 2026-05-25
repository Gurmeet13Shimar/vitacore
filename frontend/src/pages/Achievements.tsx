import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser, achievements } from "@/data/mockData";
import { Trophy, Star, Shield, Medal, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Achievements() {
  const nextLevelXp = 5000;
  const progress = (mockUser.xp / nextLevelXp) * 100;

  return (
    <AppLayout theme="default">
      {/* Light Mesh Layout Canvas Base */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#F3EFF9] to-[#F8F5FC] text-[#1E293B] p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* TITLE SECTION PAGE HEADER */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#1E293B] flex items-center gap-3">
                <Trophy className="text-amber-500 w-8 h-8" /> Gamification Center
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Rewards for consistent systemic optimization.
              </p>
            </div>
          </div>

          {/* HIGH CONTRAST PROFILE PROGRESS LEVEL BANNER */}
          <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden group">
            {/* Elegant Vector Shape Accent Backdrop */}
            <div className="absolute top-1/2 right-12 -translate-y-1/2 text-slate-50/60 pointer-events-none group-hover:scale-105 transition-transform duration-500 hidden md:block">
              <Shield size={140} strokeWidth={1} />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              {/* Level Metric Display */}
              <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex flex-col items-center justify-center font-black text-white shadow-[0_10px_30px_rgba(245,158,11,0.25)] shrink-0">
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-75 mb-0.5">LVL</span>
                <span className="text-3xl leading-none">{mockUser.level}</span>
              </div>
              
              {/* Progress Text & Engine Track */}
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">
                  Current Rank Structure
                </div>
                <h2 className="text-2xl font-black text-[#1E293B] mb-4">
                  {mockUser.levelName}
                </h2>
                
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    {mockUser.xp.toLocaleString()} XP
                  </span>
                  <span className="text-slate-400">
                    Next Tier: {nextLevelXp.toLocaleString()} XP
                  </span>
                </div>
                
                {/* Micro Bar Tracking Indicator */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* UNLOCKED BADGES ARCHITECTURE GRID */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
              <Medal className="text-purple-600 w-5 h-5" /> Unlocked Badges
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {achievements.map((ach, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  key={ach.id}
                  className={`bg-white border p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.006)] ${
                    ach.unlocked 
                      ? "border-slate-100 hover:border-purple-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(139,92,246,0.04)]" 
                      : "border-slate-100/60 opacity-40 grayscale"
                  }`}
                >
                  {/* Badge Token Icon Wrapper */}
                  <div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                      ach.unlocked 
                        ? "bg-purple-50 border-purple-100 text-purple-600 shadow-xs" 
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}
                  >
                    {ach.unlocked ? <Star size={20} className="fill-purple-100" /> : <Target size={20} />}
                  </div>
                  
                  <div>
                    <div className="font-extrabold text-xs text-[#1E293B] leading-snug">
                      {ach.name}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-2 leading-normal">
                      {ach.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}