import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { DollarSign, TrendingUp, PiggyBank, ArrowUpRight, ArrowDownRight, CreditCard, ShoppingBag, Coffee, Home as HomeIcon, MonitorPlay, Zap, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Finance() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    amount: 0,
    category: "Food",
    description: "",
    type: "Expense",
    date: ""
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/finance");
      if (Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error(error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/finance", formData);
      fetchLogs(); // Refresh
      setFormData({ amount: 0, category: "Food", description: "", type: "Expense", date: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  // Dynamically calculate metrics
  let income = 0;
  let expenses = 0;
  safeLogs.forEach((item) => {
    if (item.type === "Income") {
      income += item.amount;
    } else {
      expenses += item.amount;
    }
  });

  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const score = Math.max(50, Math.min(100, 75 + Math.round(savingsRate / 4)));

  // Group by category for PieChart
  const categoryMap: { [key: string]: number } = {};
  safeLogs.filter(l => l.type === "Expense").forEach(l => {
    categoryMap[l.category] = (categoryMap[l.category] || 0) + l.amount;
  });

  const COLORS_MAP: { [key: string]: string } = {
    Food: "#EF4444",
    Transport: "#3B82F6",
    Entertainment: "#A855F7",
    Housing: "#F59E0B",
    Shopping: "#EC4899",
    Other: "#6B7280"
  };

  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat],
    color: COLORS_MAP[cat] || "#10B981"
  }));

  // Fallback for empty PieChart
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: "No expenses", value: 1, color: "#1F2937" }
  ];

  // Savings Trend: dynamic chart using last 7 logs or simple accumulation
  const sortedLogs = [...safeLogs].reverse();
  let currentSavings = 0;
  const savingsTrend = sortedLogs.map((l, index) => {
    if (l.type === "Income") {
      currentSavings += l.amount;
    } else {
      currentSavings -= l.amount;
    }
    return {
      month: l.date ? new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Log ${index + 1}`,
      amount: currentSavings
    };
  });

  const displaySavingsTrend = savingsTrend.length > 0 ? savingsTrend : [
    { month: "Sync", amount: 0 }
  ];

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
            <div className="text-4xl font-black text-blue-400 tracking-tighter">{score}</div>
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
            <div className="text-4xl font-black text-white">${income.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-400">
              <ArrowUpRight size={14} /> Dynamically computed
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
            <div className="text-4xl font-black text-white">${expenses.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400">
              <ArrowDownRight size={14} /> Real database ledger
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
            <div className="text-4xl font-black text-white">${savings.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400">
              Savings Rate: {savingsRate}%
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Savings Trend */}
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Capital Accumulation</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displaySavingsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
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
                    <Pie data={displayPieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {displayPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3 overflow-y-auto max-h-60">
                {pieData.map(c => (
                  <div key={c.name} className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-sm text-gray-300">{c.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">${c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ledger & Add Transaction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Plus className="text-blue-400" size={20} /> Log Today's Ledger
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Amount ($)</label>
                  <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="flex h-10 w-full rounded-md border border-white/10 bg-[#1e293b] px-3 py-2 text-sm text-white select-custom focus:outline-none">
                    <option value="Expense" className="bg-[#1e293b] text-white">Expense</option>
                    <option value="Income" className="bg-[#1e293b] text-white">Income</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex h-10 w-full rounded-md border border-white/10 bg-[#1e293b] px-3 py-2 text-sm text-white select-custom focus:outline-none">
                    <option value="Food" className="bg-[#1e293b] text-white">Food</option>
                    <option value="Transport" className="bg-[#1e293b] text-white">Transport</option>
                    <option value="Entertainment" className="bg-[#1e293b] text-white">Entertainment</option>
                    <option value="Housing" className="bg-[#1e293b] text-white">Housing</option>
                    <option value="Shopping" className="bg-[#1e293b] text-white">Shopping</option>
                    <option value="Other" className="bg-[#1e293b] text-white">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase">Description</label>
                  <Input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Grocery, Salary" className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
                RECORD TRANSACTION
              </Button>
            </form>
          </div>

          <div className="glass-card p-6 border-white/10 flex flex-col overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Ledger Entries</h3>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2 max-h-[300px]">
              {safeLogs.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No entries yet. Add your first transaction today.</p>
              ) : (
                safeLogs.slice(0, 8).map((t: any) => {
                  const getIcon = () => {
                    if (t.category === 'Food') return <Coffee size={16} />;
                    if (t.type === 'Income') return <TrendingUp size={16} />;
                    if (t.category === 'Transport') return <Zap size={16} />;
                    if (t.category === 'Entertainment') return <MonitorPlay size={16} />;
                    if (t.category === 'Housing') return <HomeIcon size={16} />;
                    return <ShoppingBag size={16} />;
                  };
                  return (
                    <div key={t._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'Income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {getIcon()}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{t.description || t.category}</div>
                          <div className="text-xs text-muted-foreground">{t.category} • {new Date(t.date || t.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className={`font-bold text-sm ${t.type === 'Income' ? 'text-green-400' : 'text-white'}`}>
                        {t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}