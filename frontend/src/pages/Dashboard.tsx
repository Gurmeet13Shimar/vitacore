import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, BookOpen, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground mb-2">Welcome Back, {user?.name || 'Explorer'}</h2>
            <p className="text-muted-foreground font-medium">Here's your digital twin's status today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/75 rounded-full px-4 py-2 border border-primary/10 flex items-center space-x-2 shadow-sm">
              <span className="text-sm text-foreground font-semibold">Level 1</span>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary"></div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center bg-white text-foreground font-bold shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div whileHover={{ scale: 1.02 }} className="glass-card border border-primary/10 bg-white/70 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Activity className="w-24 h-24 text-primary" /></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Health Score</h3>
              <Activity className="text-primary w-6 h-6" />
            </div>
            <p className="text-4xl font-extrabold text-foreground">85<span className="text-lg text-primary font-bold ml-2">↑ 5%</span></p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="glass-card border border-primary/10 bg-white/70 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-24 h-24 text-pink-500" /></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Finance Score</h3>
              <TrendingUp className="text-pink-500 w-6 h-6" />
            </div>
            <p className="text-4xl font-extrabold text-foreground">72<span className="text-lg text-pink-500 font-bold ml-2">↑ 2%</span></p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="glass-card border border-primary/10 bg-white/70 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><BookOpen className="w-24 h-24 text-indigo-500" /></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Career Score</h3>
              <BookOpen className="text-indigo-500 w-6 h-6" />
            </div>
            <p className="text-4xl font-extrabold text-foreground">90<span className="text-lg text-indigo-500 font-bold ml-2">↑ 10%</span></p>
          </motion.div>
        </div>

        {/* Charts & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card border border-primary/10 bg-white/70 shadow-sm p-6">
            <h3 className="text-lg font-bold mb-6 text-foreground">Weekly Progress</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                  <XAxis dataKey="name" stroke="#7c3aed" tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <YAxis stroke="#7c3aed" tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e9d5ff', borderRadius: '12px', color: '#1f2937', boxShadow: '0 4px 12px rgba(139,92,246,0.05)' }} />
                  <Line type="monotone" dataKey="health" stroke="#8b5cf6" strokeWidth={3.5} dot={false} />
                  <Line type="monotone" dataKey="finance" stroke="#ec4899" strokeWidth={3.5} dot={false} />
                  <Line type="monotone" dataKey="career" stroke="#eab308" strokeWidth={3.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card bg-gradient-to-br from-purple-50/60 to-pink-50/60 border border-primary/10 p-6 relative shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <BrainCircuit className="text-primary w-6 h-6" />
              <h3 className="text-lg font-bold text-foreground">AI Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white/80 border border-primary/10 p-4 rounded-2xl shadow-2xs">
                <p className="text-sm text-foreground/80 font-medium leading-relaxed">"Your reduced sleep quality correlates with lower study consistency today. Try getting 8 hours tonight."</p>
              </div>
              <div className="bg-white/80 border border-primary/10 p-4 rounded-2xl shadow-2xs">
                <p className="text-sm text-foreground/80 font-medium leading-relaxed">"To become a frontend developer in 6 months, increase React practice by 5 hours weekly."</p>
              </div>
              <button className="w-full mt-4 bg-primary hover:bg-primary/95 text-foreground font-bold py-3 rounded-full transition-all shadow-sm">
                Run 'What-if' Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}