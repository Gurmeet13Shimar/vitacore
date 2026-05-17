import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { financeStats } from "@/data/mockData";
import { DollarSign, TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight, CreditCard, ShoppingBag, Coffee, Home as HomeIcon, MonitorPlay, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

export default function Finance() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
              <DollarSign className="text-blue-500" /> Finance Module
            </h1>
            <p className="text-muted-foreground">Capital allocation and wealth trajectory.</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-blue-400 tracking-tighter">{financeStats.score}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Financial Score</div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={64} className="text-green-500" />
            </div>
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Monthly Income</h3>
            <div className="text-4xl font-black text-white">${financeStats.income.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-400">
              <ArrowUpRight size={14} /> +4.2% vs last month
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard size={64} className="text-red-500" />
            </div>
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Expenses</h3>
            <div className="text-4xl font-black text-white">${financeStats.expenses.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400">
              <ArrowDownRight size={14} /> -1.5% vs last month
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 border-white/10 relative overflow-hidden group border-blue-500/30"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PiggyBank size={64} className="text-blue-500" />
            </div>
            <h3 className="text-sm text-blue-400 uppercase tracking-wider mb-2">Net Savings</h3>
            <div className="text-4xl font-black text-white">${financeStats.savings.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400">
              Savings Rate: {financeStats.savingsRate}%
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Savings Trend */}
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Capital Accumulation</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeStats.savingsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation */}
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Expense Distribution</h3>
            <div className="flex h-64">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financeStats.categories}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {financeStats.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3">
                {financeStats.categories.map(c => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-sm text-gray-300">{c.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">${c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Ledger</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-3">
              {financeStats.transactions.map(t => {
                const getIcon = () => {
                  if (t.category === 'Food') return <Coffee size={16} />;
                  if (t.category === 'Income') return <TrendingUp size={16} />;
                  if (t.category === 'Transport') return <Zap size={16} />;
                  if (t.category === 'Entertainment') return <MonitorPlay size={16} />;
                  if (t.category === 'Housing') return <HomeIcon size={16} />;
                  return <ShoppingBag size={16} />;
                };
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                        {getIcon()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.category} • {t.date}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${t.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">AI Financial Insights</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <PiggyBank size={16} /> Auto-Save Opportunity
                </h4>
                <p className="text-sm text-gray-300">Your checking account has $4,200 excess above your monthly buffer. Consider moving $3,000 to Vanguard Index to maintain optimal capital deployment.</p>
                <button className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  Execute Transfer <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}