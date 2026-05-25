import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  ShoppingBag, 
  Coffee, 
  Home as HomeIcon, 
  MonitorPlay, 
  Zap, 
  Plus,
  ArrowLeft 
} from "lucide-react";
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

  // Balanced palette using soft colors for the pie distributions
  const COLORS_MAP: { [key: string]: string } = {
    Food: "#F43F5E",
    Transport: "#0EA5E9",
    Entertainment: "#A855F7",
    Housing: "#F59E0B",
    Shopping: "#EC4899",
    Other: "#64748B"
  };

  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat],
    color: COLORS_MAP[cat] || "#10B981"
  }));

  // Fallback for empty PieChart
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: "No expenses", value: 1, color: "#CBD5E1" }
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
    <AppLayout theme="finance">
      {/* Background switched to a premium soft dark blue-grey tone gradient */}
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#EBF1F7] to-[#F3F7FA] text-[#1E293B] font-sans p-6 md:p-10 space-y-8">
        
        {/* HEADER BLOCK */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-2 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1E293B] mb-1 flex items-center gap-3">
              Finance Module <span className="text-[#0EA5E9]">💎</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-normal">Capital allocation and wealth trajectory.</p>
          </div>
          
          {/* Finance Score Container matching health architecture */}
          <div className="bg-white border border-slate-100 rounded-[24px] px-8 py-4 shadow-[0_4px_20px_rgba(14,165,233,0.04)] text-center min-w-[150px]">
            <div className="text-4xl font-bold text-[#0EA5E9] tracking-tight">{score || 72}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Financial Score</div>
          </div>
        </div>

        {/* TOP STATS CARDS */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100/80 rounded-[24px] p-6 relative overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.015)]"
          >
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <TrendingUp size={22} />
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Income</h3>
            <div className="text-3xl font-bold text-[#1E293B] tracking-tight">${income.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight size={14} /> Dynamically computed
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-slate-100/80 rounded-[24px] p-6 relative overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.015)]"
          >
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <CreditCard size={22} />
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expenses</h3>
            <div className="text-3xl font-bold text-[#1E293B] tracking-tight">${expenses.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-rose-600">
              <ArrowDownRight size={14} /> Real database ledger
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#0EA5E9]/20 rounded-[24px] p-6 relative overflow-hidden shadow-[0_6px_20px_rgba(14,165,233,0.02)]"
          >
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-[#0EA5E9]">
              <PiggyBank size={22} />
            </div>
            <h3 className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider mb-1">Net Savings</h3>
            <div className="text-3xl font-bold text-[#1E293B] tracking-tight">${savings.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#0EA5E9]">
              Savings Rate: {savingsRate}%
            </div>
          </motion.div>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Savings Trend using Sky Blue Gradients */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-6">Capital Accumulation</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displaySavingsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px', color: '#1E293B' }} />
                  <Area type="monotone" dataKey="amount" stroke="#0EA5E9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Distribution */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-6">Expense Distribution</h3>
            <div className="flex h-64">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={displayPieData} innerRadius={60} outerRadius={78} paddingAngle={4} dataKey="value" stroke="none">
                      {displayPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2.5 overflow-y-auto max-h-60 pr-1 scrollbar-none">
                {pieData.map(c => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-xs text-slate-500 font-medium">{c.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#1E293B]">${c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* INPUT INTERACTION AND LEDGER ENTRY LIST */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-5 flex items-center gap-2">
              <Plus className="text-[#0EA5E9]" size={16} /> Log Today's Ledger
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount ($)</label>
                  <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="h-10 bg-slate-50 border border-slate-200/60 rounded-xl text-[#1E293B] focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-0 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="flex h-10 w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]">
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex h-10 w-full rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]">
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Housing">Housing</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <Input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Grocery, Salary" className="h-10 bg-slate-50 border border-slate-200/60 rounded-xl text-[#1E293B] focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-0 text-sm" />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold rounded-xl transition-all text-sm tracking-wide mt-2 shadow-sm">
                RECORD TRANSACTION
              </Button>
            </form>
          </div>

          {/* LEDGER RECENT HISTORIC ENTRIES */}
          <div className="bg-white border border-slate-100/80 rounded-[24px] p-6 max-h-[310px] flex flex-col shadow-[0_6px_20px_rgba(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-[#1E293B] mb-4">Recent Ledger Entries</h3>
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 scrollbar-none">
              {safeLogs.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No entries yet. Add your first transaction today.</p>
              ) : (
                safeLogs.slice(0, 8).map((t: any) => {
                  const getIcon = () => {
                    if (t.category === 'Food') return <Coffee size={15} />;
                    if (t.type === 'Income') return <TrendingUp size={15} />;
                    if (t.category === 'Transport') return <Zap size={15} />;
                    if (t.category === 'Entertainment') return <MonitorPlay size={15} />;
                    if (t.category === 'Housing') return <HomeIcon size={15} />;
                    return <ShoppingBag size={15} />;
                  };
                  return (
                    <div key={t._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.type === 'Income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                          {getIcon()}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#1E293B]">{t.description || t.category}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{t.category} • {new Date(t.date || t.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className={`font-bold text-xs ${t.type === 'Income' ? 'text-emerald-500' : 'text-[#1E293B]'}`}>
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