import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser, achievements } from "@/data/mockData";
import { Trophy, Star, Shield, Flame, Medal, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Achievements() {
  const nextLevelXp = 5000;
  const progress = (mockUser.xp / nextLevelXp) * 100;

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1 flex items-center gap-3">
              <Trophy className="text-yellow-500" /> Gamification Center
            </h1>
            <p className="text-muted-foreground">Rewards for consistent systemic optimization.</p>
          </div>
        </div>

        {/* Level Banner */}
        <div className="glass-card border-yellow-500/30 p-8 relative overflow-hidden group">
          <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={120} className="text-yellow-500" />
          </div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-3xl font-black text-foreground shadow-[0_0_30px_rgba(234,179,8,0.4)]">
              {mockUser.level}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-1">Current Rank</div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{mockUser.levelName}</h2>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{mockUser.xp.toLocaleString()} XP</span>
                <span className="text-sm text-muted-foreground">Next: {nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Medal className="text-primary" /> Unlocked Badges
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.map((ach, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={ach.id}
                className={`glass-card p-6 flex flex-col items-center justify-center text-center gap-3 border ${
                  ach.unlocked ? 'border-primary/30 hover:border-primary/60 hover:-translate-y-1 transition-all' : 'border-border opacity-50 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ach.unlocked ? 'bg-primary/20 text-primary glow-purple' : 'bg-muted text-muted-foreground'}`}>
                  {ach.unlocked ? <Star size={24} /> : <Target size={24} />}
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground leading-tight">{ach.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{ach.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}