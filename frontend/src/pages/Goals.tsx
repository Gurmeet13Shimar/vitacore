import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { goals } from "@/data/mockData";
import { Target, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Goals() {
  const [filter, setFilter] = useState("All");

  const filteredGoals = filter === "All" ? goals : goals.filter(g => g.category === filter);

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
              <Target className="text-primary" /> Active Directives
            </h1>
            <p className="text-muted-foreground">Track and manage your primary objectives.</p>
          </div>
          <Button className="bg-primary text-white hover:bg-primary/80 gap-2">
            <Plus size={16} /> Add Directive
          </Button>
        </div>

        <div className="flex gap-2">
          {["All", "Health", "Finance", "Career"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab 
                  ? "bg-white text-black" 
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={goal.id}
                  className="glass-card p-6 border-white/10 group hover:border-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full bg-${goal.color}-500/20 text-${goal.color}-400 text-xs font-bold uppercase tracking-wider`}>
                      {goal.category}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Due: {goal.deadline}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-6">{goal.name}</h3>

                  <div className="relative pt-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-2xl font-black text-white">{goal.current}</span>
                      <span className="text-sm font-medium text-muted-foreground self-end mb-1">/ {goal.target}</span>
                    </div>
                    
                    <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-${goal.color}-500 relative`}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', transform: 'skewX(-20deg)' }} />
                      </motion.div>
                    </div>
                    <div className="mt-2 text-right text-xs text-muted-foreground font-medium">
                      {progress.toFixed(0)}% Complete
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}