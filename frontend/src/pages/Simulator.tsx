import React, { useState } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Beaker, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function Simulator() {
  const [params, setParams] = useState({
    study: 2,
    exercise: 3,
    savings: 30,
    sleep: 7,
    dining: 4,
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchAiInsight = async () => {
    setIsAiLoading(true);
    try {
      const scenario = `If I study ${params.study} hours a day, exercise ${params.exercise} days a week, save ${params.savings}% of my income, sleep ${params.sleep} hours a night, and dine out ${params.dining} times a week.`;
      const response = await axios.post("http://localhost:5000/api/ai/simulate", { scenario });
      setAiInsight(response.data.analysis);
    } catch (error) {
      console.error("Error fetching AI insight:", error);
      setAiInsight("Failed to fetch AI insights. Please check if your backend is running.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Generate mock trajectory data based on params
  const generateData = () => {
    const data = [];
    let baseHealth = 70 + (params.exercise * 2) + ((params.sleep - 6) * 5) - (params.dining * 1);
    let baseFinance = 5000 + (params.savings * 100) - (params.dining * 200);
    let baseCareer = 60 + (params.study * 5) - (params.sleep < 6 ? 10 : 0);

    for(let i=0; i<6; i++) {
      data.push({
        month: `Month ${i+1}`,
        health: Math.min(100, Math.max(0, baseHealth + (i * (params.exercise * 0.5)))),
        finance: baseFinance + (i * params.savings * 50),
        career: Math.min(100, Math.max(0, baseCareer + (i * params.study))),
      });
    }
    return data;
  };

  const chartData = generateData();

  const handleSliderChange = (key: keyof typeof params, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col">
        
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1 flex items-center gap-3">
              <Beaker className="text-primary" /> AI Simulation Engine
            </h1>
            <p className="text-muted-foreground">Adjust parameters to predict future state trajectories.</p>
          </div>
          {isSimulating ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-full bg-primary/20 border border-primary/50 text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              Processing
            </motion.div>
          ) : (
            <div className="px-4 py-2 rounded-full bg-white/40 border border-primary/20 text-muted-foreground font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Ready
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Controls */}
          <div className="w-full lg:w-80 glass-card border-primary/20 p-6 flex flex-col gap-6 overflow-y-auto">
            <h3 className="font-bold text-foreground uppercase tracking-widest text-sm border-b border-primary/20 pb-4">Control Variables</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground">Study (hrs/day)</label>
                  <span className="text-sm font-bold text-pink-400">{params.study}h</span>
                </div>
                <input type="range" min="0" max="8" step="1" value={params.study} onChange={(e) => handleSliderChange('study', Number(e.target.value))} className="w-full accent-pink-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground">Exercise (days/wk)</label>
                  <span className="text-sm font-bold text-purple-400">{params.exercise}d</span>
                </div>
                <input type="range" min="0" max="7" step="1" value={params.exercise} onChange={(e) => handleSliderChange('exercise', Number(e.target.value))} className="w-full accent-purple-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground">Savings Rate (%)</label>
                  <span className="text-sm font-bold text-blue-400">{params.savings}%</span>
                </div>
                <input type="range" min="0" max="80" step="5" value={params.savings} onChange={(e) => handleSliderChange('savings', Number(e.target.value))} className="w-full accent-blue-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground">Sleep (hrs/night)</label>
                  <span className="text-sm font-bold text-green-400">{params.sleep}h</span>
                </div>
                <input type="range" min="4" max="10" step="0.5" value={params.sleep} onChange={(e) => handleSliderChange('sleep', Number(e.target.value))} className="w-full accent-green-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground">Dining Out (meals/wk)</label>
                  <span className="text-sm font-bold text-red-400">{params.dining}</span>
                </div>
                <input type="range" min="0" max="14" step="1" value={params.dining} onChange={(e) => handleSliderChange('dining', Number(e.target.value))} className="w-full accent-red-500" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="flex-1 flex flex-col gap-6 min-h-[600px]">
            <div className="flex-1 glass-card border-primary/20 p-6 flex flex-col">
              <h3 className="font-bold text-foreground uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" /> Projected Vectors (6 Months)
              </h3>
              <div className="flex-1 w-full min-h-0 relative">
                {isSimulating && (
                  <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="simHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="simCareer" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#666" tickLine={false} axisLine={false} domain={[0, 100]} hide />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" tickLine={false} axisLine={false} hide />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                    <Area yAxisId="left" type="monotone" dataKey="health" stroke="#A855F7" strokeWidth={3} fill="url(#simHealth)" name="Health Score" />
                    <Area yAxisId="left" type="monotone" dataKey="career" stroke="#EC4899" strokeWidth={3} fill="url(#simCareer)" name="Career Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              <div className="glass-card p-4 border-purple-500/30 bg-purple-500/5">
                <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Health Trajectory</div>
                <div className="text-xl font-bold text-foreground">
                  {chartData[5].health > chartData[0].health ? 'Optimizing' : 'Degrading'}
                </div>
                <p className="text-xs text-muted-foreground mt-2">End score: {Math.round(chartData[5].health)}/100</p>
              </div>
              <div className="glass-card p-4 border-blue-500/30 bg-blue-500/5">
                <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Wealth Creation</div>
                <div className="text-xl font-bold text-foreground">
                  ${Math.round(chartData[5].finance).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Predicted net liquid capital</p>
              </div>
              <div className="glass-card p-4 border-pink-500/30 bg-pink-500/5">
                <div className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-2">Career Velocity</div>
                <div className="text-xl font-bold text-foreground">
                  {chartData[5].career > 90 ? 'Promotion Ready' : 'Skill Deficit'}
                </div>
                <p className="text-xs text-muted-foreground mt-2">End score: {Math.round(chartData[5].career)}/100</p>
              </div>
            </div>

            {/* AI Insight Section */}
            <div className="glass-card border-primary/20 p-6 flex flex-col gap-4 mt-6 shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-foreground uppercase tracking-widest text-sm flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" /> Neural Engine Analysis
                </h3>
                <button 
                  onClick={fetchAiInsight}
                  disabled={isAiLoading}
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-bold tracking-wider transition-colors disabled:opacity-50"
                >
                  {isAiLoading ? "Analyzing..." : "Generate AI Insight"}
                </button>
              </div>
              
              {aiInsight && (
                <div className="p-4 rounded-xl bg-white/40 border border-primary/20 text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {aiInsight}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}