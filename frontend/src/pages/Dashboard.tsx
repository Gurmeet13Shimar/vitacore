import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, BookOpen, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', health: 60, finance: 40, career: 30 },
  { name: 'Tue', health: 65, finance: 50, career: 45 },
  { name: 'Wed', health: 70, finance: 55, career: 60 },
  { name: 'Thu', health: 75, finance: 60, career: 65 },
  { name: 'Fri', health: 80, finance: 70, career: 80 },
  { name: 'Sat', health: 85, finance: 75, career: 90 },
  { name: 'Sun', health: 90, finance: 80, career: 100 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center space-x-3 mb-10">
          <BrainCircuit className="text-blue-500 w-8 h-8" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PersonaTwin</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {['Overview', 'Health', 'Finance', 'Career', 'AI Simulation'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                activeTab === item
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-950 overflow-y-auto p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Alex</h2>
            <p className="text-slate-400">Here's your digital twin's status today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-slate-800 rounded-full px-4 py-2 border border-slate-700 flex items-center space-x-2">
              <span className="text-sm text-slate-300">Level 12</span>
              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-green-500"></div>
              </div>
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-500" />
          </div>
        </header>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-24 h-24" /></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-300">Health Score</h3>
              <Activity className="text-green-400 w-6 h-6" />
            </div>
            <p className="text-4xl font-bold text-white">85<span className="text-lg text-green-400 ml-2">↑ 5%</span></p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-24 h-24" /></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-300">Finance Score</h3>
              <TrendingUp className="text-blue-400 w-6 h-6" />
            </div>
            <p className="text-4xl font-bold text-white">72<span className="text-lg text-blue-400 ml-2">↑ 2%</span></p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-24 h-24" /></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-300">Career Score</h3>
              <BookOpen className="text-purple-400 w-6 h-6" />
            </div>
            <p className="text-4xl font-bold text-white">90<span className="text-lg text-purple-400 ml-2">↑ 10%</span></p>
          </motion.div>
        </div>

        {/* Charts & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-white">Weekly Progress</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                  <Line type="monotone" dataKey="health" stroke="#4ade80" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="finance" stroke="#60a5fa" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="career" stroke="#c084fc" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-6 relative">
            <div className="flex items-center space-x-3 mb-6">
              <BrainCircuit className="text-blue-400 w-6 h-6" />
              <h3 className="text-xl font-semibold text-white">AI Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
                <p className="text-sm text-blue-200">"Your reduced sleep quality correlates with lower study consistency today. Try getting 8 hours tonight."</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
                <p className="text-sm text-purple-200">"To become a frontend developer in 6 months, increase React practice by 5 hours weekly."</p>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors">
                Run 'What-if' Simulation
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}