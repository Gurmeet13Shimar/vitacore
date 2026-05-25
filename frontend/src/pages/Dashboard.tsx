import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  BookOpen,
  BrainCircuit,
  Bell,
  ArrowUpRight,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';

const data = [
  { name: 'Mon', health: 48, finance: 25, career: 10 },
  { name: 'Tue', health: 63, finance: 37, career: 21 },
  { name: 'Wed', health: 62, finance: 45, career: 33 },
  { name: 'Thu', health: 77, finance: 49, career: 37 },
  { name: 'Fri', health: 78, finance: 62, career: 50 },
  { name: 'Sat', health: 91, finance: 61, career: 77 },
  { name: 'Sun', health: 92, finance: 76, career: 104 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout theme="default">
      {/* Light aesthetic wrapper container using the signature soft ambient gradient */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#F3EFF9] to-[#F8F5FC] text-[#1E293B] font-sans p-6 md:p-10">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* HEADER BLOCK */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1E293B] mb-2">
                Good evening, {user?.name || 'Alex'} 🌙
              </h2>
              <p className="text-slate-500 font-normal text-sm md:text-base">
                Here's your digital twin's summary for today.
              </p>
            </div>

            <div className="flex items-center gap-4 self-stretch sm:self-auto justify-end">
              {/* Level Progress Panel */}
              <div className="bg-white border border-slate-100 rounded-[24px] px-6 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#1E293B] font-bold text-xs uppercase tracking-wider">
                    Level 1
                  </span>
                  <span className="text-purple-600 text-xs font-semibold">
                    • Explorer
                  </span>
                </div>
                <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                </div>
              </div>

              {/* Action Circle Buttons */}
              <button className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.015)] flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Bell className="w-5 h-5 text-slate-400" />
              </button>

              <div className="relative cursor-pointer group">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md transition-transform group-hover:scale-105">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
            </div>
          </header>

          {/* TRI-SCORE GRID PANELS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Health Score Panel */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-14 h-14 rounded-[20px] bg-emerald-50 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                  ↑ 5%
                </span>
              </div>
              
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
              <h3 className="text-5xl font-black text-[#1E293B] tracking-tight mb-2">85</h3>
              <p className="text-slate-500 text-sm font-medium">Great job! Keep it up.</p>
            </motion.div>

            {/* Finance Score Panel */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-14 h-14 rounded-[20px] bg-blue-50 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                  ↑ 2%
                </span>
              </div>
              
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Finance Score</p>
              <h3 className="text-5xl font-black text-[#1E293B] tracking-tight mb-2">72</h3>
              <p className="text-slate-500 text-sm font-medium">Good financial habits!</p>
            </motion.div>

            {/* Career Score Panel */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-14 h-14 rounded-[20px] bg-purple-50 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                  ↑ 10%
                </span>
              </div>
              
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Career Score</p>
              <h3 className="text-5xl font-black text-[#1E293B] tracking-tight mb-2">90</h3>
              <p className="text-slate-500 text-sm font-medium">Amazing progress!</p>
            </motion.div>
          </div>

          {/* LOWER ANALYTICS & INSIGHTS SEGMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Analytical Chart Panel */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1E293B]">Weekly Progress</h3>
                  <p className="text-xs text-slate-400 font-medium">Across all metric nodes</p>
                </div>
                <div className="px-4 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600">
                  This Week
                </div>
              </div>

              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="6 6" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94A3B8" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fontWeight: 500 }}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #F1F5F9',
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                        color: '#1E293B'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="health"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="finance"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="career"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Sidebar */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <BrainCircuit className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-base font-bold text-[#1E293B]">AI Insights</h3>
                  </div>
                  <span className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-0.5 cursor-pointer">
                    View all <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="bg-slate-50/60 border border-slate-100/70 p-4 rounded-2xl">
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                      Your reduced sleep quality correlates with lower study consistency today. Try getting 8 hours tonight.
                    </p>
                  </div>

                  <div className="bg-slate-50/60 border border-slate-100/70 p-4 rounded-2xl">
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                      To become a frontend developer in 6 months, increase React practice by 5 hours weekly.
                    </p>
                  </div>

                  <div className="bg-slate-50/60 border border-slate-100/70 p-4 rounded-2xl">
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                      Your expenses are 12% higher this week. Consider reviewing subscription costs.
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-2xl shadow-sm transition-all text-sm mt-6">
                Run 'What-if' Simulation
              </button>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}