import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { goals } from "@/data/mockData";
import { Target, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Safe dictionary mapping for Tailwind compiler to preserve dynamic brand tokens
const categoryStyles: Record<string, { badge: string; text: string; fill: string }> = {
  Health: {
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100/60",
    text: "text-emerald-600",
    fill: "bg-emerald-500"
  },
  Finance: {
    badge: "bg-blue-50 text-blue-600 border-blue-100/60",
    text: "text-blue-600",
    fill: "bg-blue-500"
  },
  Career: {
    badge: "bg-purple-50 text-purple-600 border-purple-100/60",
    text: "text-purple-600",
    fill: "bg-purple-500"
  },
  Default: {
    badge: "bg-slate-50 text-slate-600 border-slate-100",
    text: "text-slate-600",
    fill: "bg-slate-500"
  }
};

export default function Goals() {
  const [filter, setFilter] = useState("All");

  const filteredGoals = filter === "All" ? goals : goals.filter(g => g.category === filter);

  return (
    <AppLayout theme="default">
      {/* Premium Gradient Content Container Canvas */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#F3EFF9] to-[#F8F5FC] text-[#1E293B] p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* HEADER DASHBOARD ZONE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#1E293B] flex items-center gap-3">
                <Target className="text-purple-600 w-8 h-8" /> Active Directives
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Track and manage your primary lifecycle objectives.</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl gap-2 h-11 px-5 shadow-sm transition-all self-start sm:self-auto">
              <Plus size={16} /> Add Directive
            </Button>
          </div>

          {/* FILTER NAVIGATION BUTTONS */}
          <div className="flex gap-2.5 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.008)] w-max">
            {["All", "Health", "Finance", "Career"].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  filter === tab 
                    ? "bg-[#1E293B] text-white shadow-xs" 
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* GOALS GRID STREAM */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                // Safeguard against missing or case-mismatched data strings
                const style = categoryStyles[goal.category] || categoryStyles.Default;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    key={goal.id}
                    className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.012)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.025)] hover:border-purple-100/80 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* HEADER CARD DATA */}
                      <div className="flex justify-between items-center mb-5">
                        <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${style.badge}`}>
                          {goal.category}
                        </div>
                        <div className="text-[11px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                          Due: {goal.deadline}
                        </div>
                      </div>

                      {/* GOAL NAME TEXT */}
                      <h3 className="text-lg font-extrabold text-[#1E293B] line-clamp-2 mb-6">
                        {goal.name}
                      </h3>
                    </div>

                    {/* METRICS & TRACKING PROGRESS GRAPHICS */}
                    <div className="relative pt-2">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-2xl font-black text-[#1E293B] tracking-tight">
                          {goal.current.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          / {goal.target.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* METRIC TRACK INNER BAR */}
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full relative overflow-hidden ${style.fill}`}
                        >
                          {/* Animated Clean Light Shimmer Overlay */}
                          <div 
                            className="absolute inset-0 w-full h-full animate-[shimmer_2.5s_infinite]" 
                            style={{ 
                              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', 
                              transform: 'skewX(-20deg)' 
                            }} 
                          />
                        </motion.div>
                      </div>

                      <div className="mt-2.5 flex justify-between items-center text-[11px] font-bold text-slate-400">
                        <span className={`font-black ${style.text}`}>
                          {progress >= 100 ? "Directive Complete" : "In Progress"}
                        </span>
                        <span>
                          {progress.toFixed(0)}% Complete
                        </span>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}