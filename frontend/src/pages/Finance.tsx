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
    Food: "#f87171",
    Transport: "#60a5fa",
    Entertainment: "#c084fc",
    Housing: "#facc15",
    Shopping: "#f472b6",
    Other: "#a78bfa"
  };

  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat],
    color: COLORS_MAP[cat] || "#c084fc"
  }));

  const displayPieData = pieData.length > 0 ? pieData : [
    { name: "No expenses", value: 1, color: "#e9d5ff" }
  ];

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
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-1 flex items-center gap-3">
              <DollarSign className="text-primary" /> Finance Module
            </h1>
            <p className="text-muted-foreground font-medium">Capital allocation and wealth trajectory.</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-primary tracking-tighter">{score}</div>
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Financial Score</div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border border-primary/10 bg-white/70 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={64} className="text-primary" />
            </div>
            <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Monthly Income</h3>
            <div className="text-4xl font-black text-foreground">${income.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
              <ArrowUpRight size={14} /> Dynamically computed
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border border-primary/10 bg-white/70 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard size={64} className="text-pink-500" />
            </div>
            <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Expenses</h3>
            <div className="text-4xl font-black text-foreground">${expenses.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-pink-500">
              <ArrowDownRight size={14} /> Real database ledger
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 border border-primary/15 bg-white/80 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <PiggyBank size={64} className="text-indigo-500" />
            </div>
            <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Net Savings</h3>
            <div className="text-4xl font-black text-primary">${savings.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-500">
              Savings Rate: {savingsRate}%
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Savings Trend */}
          <div className="glass-card p-6 border border-primary/10 bg-white/70 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-6">Capital Accumulation</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displaySavingsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3e8ff" />
                  <XAxis dataKey="month" stroke="#7c3aed" tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <YAxis stroke="#7c3aed" tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e9d5ff', borderRadius: '12px', color: '#1f2937', boxShadow: '0 4px 12px rgba(139,92,246,0.05)' }} />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation */}
          <div className="glass-card p-6 border border-primary/10 bg-white/70 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-6">Expense Distribution</h3>
            <div className="flex h-64">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={displayPieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {displayPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e9d5ff', borderRadius: '12px', color: '#1f2937', boxShadow: '0 4px 12px rgba(139,92,246,0.05)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3 overflow-y-auto max-h-60 pr-2">
                {pieData.map(c => (
                  <div key={c.name} className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                    </div>
                    <span className="text-sm font-extrabold text-foreground">${c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ledger & Add Transaction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 border border-primary/10 bg-white/70 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
              <Plus className="text-primary" size={20} /> Log Today's Ledger
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Amount ($)</label>
                  <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="h-10 text-foreground border-input bg-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-xs">
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-xs">
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Housing">Housing</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Description</label>
                  <Input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Grocery, Salary" className="h-10 text-foreground border-input bg-white" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/95 text-foreground font-bold transition-all rounded-full shadow-sm">
                RECORD TRANSACTION
              </Button>
            </form>
          </div>

          <div className="glass-card p-6 border border-primary/10 flex flex-col overflow-hidden bg-white/70 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-6">Recent Ledger Entries</h3>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2 max-h-[300px]">
              {safeLogs.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No entries yet. Add your first transaction today.</p>
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
                    <div key={t._id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {getIcon()}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{t.description || t.category}</div>
                          <div className="text-xs text-muted-foreground font-medium">{t.category} • {new Date(t.date || t.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className={`font-extrabold text-sm ${t.type === 'Income' ? 'text-green-600' : 'text-foreground'}`}>
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