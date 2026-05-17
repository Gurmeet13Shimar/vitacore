import React from "react";
import { motion } from "framer-motion";

interface ScoreCardProps {
  title: string;
  score: number;
  trend: "up" | "down" | "neutral";
  colorClass: string;
  icon: React.ReactNode;
}

export function ScoreCard({ title, score, trend, colorClass, icon }: ScoreCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-card p-6 relative overflow-hidden group ${colorClass}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
        {icon}
      </div>
      <h3 className="text-muted-foreground font-medium text-sm mb-4 uppercase tracking-wider">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-5xl font-black text-white tabular-nums tracking-tight">{score}</span>
        <span className="text-sm font-medium mb-1.5 text-muted-foreground">/100</span>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <div className={`px-2 py-1 rounded text-xs font-bold ${trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend === 'up' ? '+2.4%' : '-1.2%'}
        </div>
        <span className="text-xs text-muted-foreground">vs last week</span>
      </div>
      
      {/* Progress ring indicator at bottom */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mt-5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-current rounded-full"
        />
      </div>
    </motion.div>
  );
}