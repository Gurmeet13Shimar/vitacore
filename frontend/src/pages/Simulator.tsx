import React, { useState } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Beaker, Zap, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";
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

  // Generate clean trajectory data scaled for premium rendering
  const generateData = () => {
    const data = [];
    let baseHealth = 70 + (params.exercise * 2) + ((params.sleep - 6) * 5) - (params.dining * 1);
    let baseFinance = 5000 + (params.savings * 100) - (params.dining * 200);
    let baseCareer = 60 + (params.study * 5) - (params.sleep < 6 ? 10 : 0);

    for (let i = 0; i < 6; i++) {
      data.push({
        month: `Month ${i + 1}`,
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
    const timer = setTimeout(() => setIsSimulating(false), 400);
    return () => clearTimeout(timer);
  };

  return (
    <AppLayout theme="default">
      {/* Soft Light Base Layout Wrapper Container */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#F3EFF9] to-[#F8F5FC] text-[#1E293B] p-6 md:p-10">
        <div className="max-w-[1500px] mx-auto space-y-8 flex flex-col h-full">
          
          {/* CONTROL TOPBAR HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#1E293B] flex items-center gap-3">
                <Beaker className="text-purple-600 w-8 h-8" /> AI Simulation Engine
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Adjust parameters to predict future state trajectories.</p>
            </div>
            
            {/* System Engine Engine Status Badges */}
            {isSimulating ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-sm"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                Recalculating Vectors
              </motion.div>
            ) : (
              <div className="px-4 py-2 rounded-full bg-white border border-slate-100 text-slate-400 font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Engine Ready
              </div>
            )}
          </div>

          {/* MAIN INTERACTIVE SPLIT WORKSPACE */}
          <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT COMPONENT COLUMN: CONTROLS PANEL */}
            <div className="w-full lg:w-[340px] bg-white border border-slate-100 p-6 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6 shrink-0">
              <h3 className="font-bold text-[#1E293B] uppercase tracking-widest text-xs border-b border-slate-50 pb-4">
                Control Variables
              </h3>
              
              <div className="space-y-6">
                {/* STUDY HOURS */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Study (hrs/day)</label>
                    <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{params.study}h</span>
                  </div>
                  <input 
                    type="range" min="0" max="8" step="1" 
                    value={params.study} 
                    onChange={(e) => handleSliderChange('study', Number(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                  />
                </div>

                {/* EXERCISE SCALING */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Exercise (days/wk)</label>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{params.exercise}d</span>
                  </div>
                  <input 
                    type="range" min="0" max="7" step="1" 
                    value={params.exercise} 
                    onChange={(e) => handleSliderChange('exercise', Number(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                  />
                </div>

                {/* SAVINGS LIQUIDITY */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Savings Rate (%)</label>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{params.savings}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="80" step="5" 
                    value={params.savings} 
                    onChange={(e) => handleSliderChange('savings', Number(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                  />
                </div>

                {/* SLEEP CYCLE */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sleep (hrs/night)</label>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{params.sleep}h</span>
                  </div>
                  <input 
                    type="range" min="4" max="10" step="0.5" 
                    value={params.sleep} 
                    onChange={(e) => handleSliderChange('sleep', Number(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                  />
                </div>

                {/* DINING DEFICIT */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Dining Out (meals/wk)</label>
                    <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">{params.dining}</span>
                  </div>
                  <input 
                    type="range" min="0" max="14" step="1" 
                    value={params.dining} 
                    onChange={(e) => handleSliderChange('dining', Number(e.target.value))} 
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COMPONENT COLUMN: CHARTS & VISUAL TRANSFORMATION */}
            <div className="flex-1 w-full space-y-6">
              
              {/* PRIMARY VISUAL AREA AREA CHART */}
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] h-[400px] flex flex-col relative">
                <h3 className="font-bold text-[#1E293B] text-base mb-6 flex items-center gap-2 shrink-0">
                  <TrendingUp size={18} className="text-purple-600" /> Projected Vectors (6 Months)
                </h3>
                
                <div className="flex-1 w-full min-h-0 relative">
                  {isSimulating && (
                    <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                      <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="simHealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="simCareer" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} axisLine={false} tick={{ fontSize: 11, fontWeight: 500 }} />
                      <YAxis yAxisId="left" stroke="#94A3B8" tickLine={false} axisLine={false} domain={[0, 100]} hide />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          borderColor: '#F1F5F9', 
                          borderRadius: '16px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
                          color: '#1E293B' 
                        }} 
                      />
                      <Area yAxisId="left" type="monotone" dataKey="health" stroke="#10B981" strokeWidth={3} fill="url(#simHealth)" name="Health Projection" dot={false} />
                      <Area yAxisId="left" type="monotone" dataKey="career" stroke="#8B5CF6" strokeWidth={3} fill="url(#simCareer)" name="Career Trajectory" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* OUTCOME PREDICTION TILES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Health Outcome */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.008)]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Health Trajectory</div>
                  <div className={`text-lg font-black ${chartData[5].health > chartData[0].health ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {chartData[5].health > chartData[0].health ? 'Optimizing State' : 'Degrading Curve'}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1.5">End score: <span className="font-bold text-slate-700">{Math.round(chartData[5].health)}</span>/100</p>
                </div>

                {/* Finance Outcome */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.008)]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Wealth Accumulation</div>
                  <div className="text-lg font-black text-blue-600">
                    ${Math.round(chartData[5].finance).toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1.5">Projected liquid balance asset</p>
                </div>

                {/* Career Outcome */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.008)]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Career Velocity</div>
                  <div className={`text-lg font-black ${chartData[5].career > 85 ? 'text-purple-600' : 'text-amber-600'}`}>
                    {chartData[5].career > 85 ? 'Promotion Vector' : 'Stabilized Output'}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1.5">End evaluation: <span className="font-bold text-slate-700">{Math.round(chartData[5].career)}</span>/100</p>
                </div>
              </div>

              {/* LOWER ROW SECTION: NEURAL SYSTEM ENGINE ANALYTICAL GENERATOR */}
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1E293B] text-base leading-none">Neural Engine Analysis</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">Generate dynamic computational scenarios contextually</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={fetchAiInsight}
                    disabled={isAiLoading}
                    className="self-start sm:self-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold tracking-wide shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isAiLoading ? "Processing Nodes..." : <>Execute Intelligence Synthesis <ArrowUpRight className="w-3.5 h-3.5" /></>}
                  </button>
                </div>
                
                {aiInsight && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-slate-600 text-sm leading-relaxed font-medium"
                  >
                    {aiInsight}
                  </motion.div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}