import React, { useState, useEffect, useMemo, FC } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import {
  TrendingUp,
  PiggyBank,
  CreditCard,
  ShoppingBag,
  Coffee,
  Home as HomeIcon,
  MonitorPlay,
  Zap,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Target,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Activity,
  Flame,
  Droplets,
  Moon
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  description?: string;
  valueClassName?: string;
}

const MetricCard: FC<MetricCardProps> = ({ title, value, unit = '', icon, description, valueClassName }) => (
  <motion.div
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className="flex-grow"
  >
    <Card className="glass-card border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-violet-300 tracking-wide uppercase">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-1">
        <div className={`text-2xl font-extrabold text-white tracking-tight ${valueClassName}`}>
          {value} <span className="text-xs font-semibold text-slate-400 ml-0.5">{unit}</span>
        </div>
        {description && <p className="text-[10px] text-slate-400 mt-1 font-medium">{description}</p>}
      </CardContent>
    </Card>
  </motion.div>
);

const chartConfig = {
  amount: {
    label: "Savings Balance",
    color: "#a78bfa",
  },
} satisfies ChartConfig;

export default function Finance() {
  const { themeColors, theme } = useTheme();
  const { user, updateUser } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Income State
  const [incomeInput, setIncomeInput] = useState("");
  const [isEditingIncome, setIsEditingIncome] = useState(false);

  // Goals State
  const [goals, setGoals] = useState<any[]>([]);
  const [isGoalsLoading, setIsGoalsLoading] = useState(true);
  const [contributions, setContributions] = useState<{ [key: string]: string }>({});
  const [goalForm, setGoalForm] = useState({
    title: "",
    targetValue: "",
    currentValue: "",
    deadline: ""
  });

  // Form State
  const [formData, setFormData] = useState({
    amount: 0,
    category: "Food",
    description: "",
    date: "",
    type: "Expense"
  });



  const fetchGoals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/goals");
      if (Array.isArray(res.data)) {
        setGoals(res.data.filter(g => g.domain === "Finance"));
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error(error);
      setGoals([]);
    } finally {
      setIsGoalsLoading(false);
    }
  };

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
    fetchGoals();
  }, []);

  useEffect(() => {
    if (user?.income !== undefined) {
      setIncomeInput(user.income.toString());
    }
  }, [user]);

  const handleSaveIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome = Number(incomeInput);
    if (isNaN(newIncome) || newIncome < 0) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile`,
        { income: newIncome }
      );
      const savedIncome = res.data.income ?? newIncome;
      updateUser({ income: savedIncome });
      setIsEditingIncome(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/goals", {
        title: goalForm.title,
        domain: "Finance",
        targetValue: Number(goalForm.targetValue),
        currentValue: Number(goalForm.currentValue) || 0,
        deadline: goalForm.deadline
      });
      fetchGoals();
      setGoalForm({ title: "", targetValue: "", currentValue: "", deadline: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddContribution = async (goalId: string) => {
    const contribution = contributions[goalId];
    if (!contribution || isNaN(Number(contribution)) || Number(contribution) <= 0) return;
    try {
      await axios.put(`http://localhost:5000/api/goals/${goalId}`, {
        contribution: Number(contribution)
      });
      fetchGoals();
      setContributions(prev => ({ ...prev, [goalId]: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/goals/${goalId}`);
      fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/finance", {
        amount: formData.amount,
        category: formData.category,
        description: formData.description,
        date: formData.date || undefined,
        type: formData.type
      });
      fetchLogs();
      setFormData({ amount: 0, category: formData.type === "Income" ? "Salary" : "Food", description: "", date: "", type: formData.type });
    } catch (error) {
      console.error(error);
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  // Dynamically calculate metrics
  const userIncome = user?.income || 0;
  let expenses = 0;
  safeLogs.forEach((item) => {
    if (item.type === "Expense") {
      expenses += item.amount;
    }
  });

  const savings = userIncome - expenses;
  const savingsRate = userIncome > 0 ? Math.round((savings / userIncome) * 100) : 0;
  const score = Math.max(50, Math.min(100, 75 + Math.round(savingsRate / 4)));

  useEffect(() => {
    localStorage.setItem("income", userIncome.toString());
    localStorage.setItem("expenses", expenses.toString());
    localStorage.setItem("savings", savings.toString());
    localStorage.setItem("savingsRate", savingsRate.toString());
  }, [userIncome, expenses, savings, savingsRate]);

  // Group by category for PieChart
  const categoryMap: { [key: string]: number } = {};
  safeLogs.filter(l => l.type === "Expense").forEach(l => {
    categoryMap[l.category] = (categoryMap[l.category] || 0) + l.amount;
  });

  const COLORS_MAP: { [key: string]: string } = {
    Food: "#c084fc",
    Transport: "#38bdf8",
    Entertainment: "#f472b6",
    Housing: "#facc15",
    Shopping: "#f87171",
    Other: "#a78bfa"
  };

  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat],
    color: COLORS_MAP[cat] || "#c084fc"
  }));

  const displayPieData = pieData.length > 0 ? pieData : [
    { name: "No expenses", value: 1, color: "rgba(255,255,255,0.06)" }
  ];

  const sortedLogs = [...safeLogs].reverse();
  let currentSavingsVal = savings || userIncome || 12073.80;
  const savingsTrend = sortedLogs
    .filter(l => l.type === "Expense" || l.type === "Income")
    .map((l, index) => {
      if (l.type === "Expense") {
        currentSavingsVal -= l.amount;
      } else {
        currentSavingsVal += l.amount;
      }
      return {
        month: l.date ? new Date(l.date).toLocaleDateString([], { month: "short", day: "numeric" }) : `Log ${index + 1}`,
        amount: currentSavingsVal
      };
    });

  const displaySavingsTrend = savingsTrend.length > 0 ? savingsTrend : [
    { month: "Sync", amount: currentSavingsVal }
  ];

  return (
    <AppLayout>
      <div className="min-h-full py-8 px-4 md:px-8 relative selection:bg-violet-500/30 font-sans flex flex-col" style={{ background: themeColors.background }}>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url('/finance_bg.png')" }}
        />

        <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start w-full flex-1">
            
            {/* ── LEFT PANEL: Log Ledger Entry ── */}
            <div className="xl:col-span-1 flex flex-col gap-6 xl:sticky xl:top-8 shrink-0">
              <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-md font-bold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-violet-400" /> Log Today's Ledger
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-1">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3.5">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ledger Type</label>
                        <select 
                          value={formData.type}
                          onChange={e => setFormData({ ...formData, type: e.target.value, category: e.target.value === 'Income' ? 'Salary' : 'Food' })}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm px-3 h-10 cursor-pointer outline-none"
                        >
                          <option value="Expense">💸 Expense</option>
                          <option value="Income">💰 Income</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Amount (₹)</label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="e.g. 500"
                            value={formData.amount === 0 ? "" : formData.amount} 
                            onChange={e => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10 no-spinner pr-10"
                            required 
                          />
                          <span className="absolute right-3 top-2.5 text-[9px] font-bold text-slate-500">INR</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm px-3 h-10 cursor-pointer outline-none"
                        >
                          {formData.type === "Income" ? (
                            <>
                              <option value="Salary">Salary</option>
                              <option value="Investment">Investment</option>
                              <option value="Other">Other</option>
                            </>
                          ) : (
                            <>
                              <option value="Food">Food</option>
                              <option value="Transport">Transport</option>
                              <option value="Entertainment">Entertainment</option>
                              <option value="Housing">Housing</option>
                              <option value="Shopping">Shopping</option>
                              <option value="Other">Other</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
                        <Input 
                          type="text" 
                          placeholder="e.g. Grocery bill"
                          value={formData.description} 
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date (Optional)</label>
                        <Input 
                          type="date" 
                          value={formData.date} 
                          onChange={e => setFormData({ ...formData, date: e.target.value })}
                          className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
                        />
                      </div>

                    </div>

                    <Button 
                      type="submit" 
                      className="w-full mt-2 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-xl border-0 shadow-lg shadow-violet-950/20"
                    >
                      RECORD TRANSACTION
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* ── RIGHT PANEL: Main Finance Hub ── */}
            <div className="xl:col-span-3 flex flex-col gap-6 md:gap-8 xl:pr-4 xl:pb-12">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    My Finance Hub
                  </h1>
                  <p className="text-slate-200 mt-1 font-semibold text-xs md:text-sm">
                    Capital allocation, wealth trajectory, and predictive simulation.
                  </p>
                </div>


              </div>

              {/* Glowing Metrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Monthly Income"
                  value={`₹${userIncome.toLocaleString()}`}
                  icon={<TrendingUp className="h-4.5 w-4.5 text-orange-500" />}
                  description="Regular income inflows"
                  valueClassName="text-orange-400"
                />
                <MetricCard
                  title="Current Savings"
                  value={`₹${savings.toLocaleString()}`}
                  icon={<PiggyBank className="h-4.5 w-4.5 text-indigo-500" />}
                  description="Accumulated liquid capital"
                  valueClassName="text-indigo-400"
                />
                <MetricCard
                  title="Monthly Expenses"
                  value={`₹${expenses.toLocaleString()}`}
                  icon={<CreditCard className="h-4.5 w-4.5 text-cyan-500" />}
                  description="Outflows this month"
                  valueClassName="text-cyan-400"
                />
                <MetricCard
                  title="Savings Rate"
                  value={`${savingsRate}`}
                  unit="%"
                  icon={<Activity className="h-4.5 w-4.5 text-emerald-500" />}
                  description="Income to savings ratio"
                  valueClassName="text-emerald-400"
                />
              </div>

              {/* Charts Container */}
              <div className="flex flex-col gap-6">
                
                {/* Row 1: Area Chart & Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Expense Distribution (Pie Chart) (Left 1/3) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between p-4">
                    <div>
                      <h3 className="text-white text-md font-bold">Expense Distribution</h3>
                      <p className="text-slate-400 text-xs mt-1">Breakdown of current monthly expenditure categories.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow py-4">
                      <div className="relative w-36 h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={displayPieData} innerRadius={52} outerRadius={68} paddingAngle={4} dataKey="value" stroke="none">
                              {displayPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-base font-black text-white leading-none">₹{expenses.toLocaleString()}</span>
                          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wide">Monthly Spent</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Capital Accumulation (Area Chart) (Right 2/3) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:col-span-2 p-4">
                    <div>
                      <h3 className="text-white text-md font-bold">Capital Accumulation</h3>
                      <p className="text-slate-400 text-xs mt-1">Savings projection trend across ledger entries.</p>
                    </div>
                    <div className="mt-4">
                      <ChartContainer config={chartConfig} className="h-44 w-full">
                        <AreaChart data={displaySavingsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                          <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.4)" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={9} tickLine={false} axisLine={false} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area type="monotone" dataKey="amount" stroke="var(--color-amount)" strokeWidth={3.5} fillOpacity={1} fill="url(#colorSavings)" name="amount" />
                        </AreaChart>
                      </ChartContainer>
                    </div>
                  </Card>

                </div>

                {/* Row 2: Recent Ledger (2/3) & Income Configuration (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Recent Ledger Entries (2/3) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:col-span-2 flex flex-col justify-between p-4">
                    <div>
                      <h3 className="text-white text-md font-bold">Recent Ledger Entries</h3>
                      <p className="text-slate-400 text-xs mt-1">List of recently tracked incomes and expenditures.</p>
                    </div>

                    <ScrollArea className="h-56 mt-4 pr-2">
                      <div className="flex flex-col gap-3">
                        {safeLogs.length === 0 ? (
                          <p className="text-slate-500 text-xs font-semibold italic mt-4 text-center">
                            No ledger entries found. Record your first transaction to populate details.
                          </p>
                        ) : (
                          safeLogs.slice(0, 15).map((t: any, i: number) => {
                            const getIcon = () => {
                              if (t.category === 'Food') return <Coffee size={15} />;
                              if (t.type === 'Income') return <TrendingUp size={15} />;
                              if (t.category === 'Transport') return <Zap size={15} />;
                              if (t.category === 'Entertainment') return <MonitorPlay size={15} />;
                              if (t.category === 'Housing') return <HomeIcon size={15} />;
                              return <ShoppingBag size={15} />;
                            };
                            const colorAccent = t.type === 'Income' ? "#22c55e" : "#ef4444";
                            const colorBg = t.type === 'Income' ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)";
                            return (
                              <div
                                key={t._id || i}
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: colorBg, color: colorAccent }}>
                                    {getIcon()}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-xs text-white capitalize">{t.description || t.category}</h5>
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                                      {t.category} • {new Date(t.date || t.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-extrabold text-sm" style={{ color: colorAccent }}>
                                  {t.type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </Card>

                  {/* Profile Income Config (1/3) */}
                  <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl flex flex-col p-4">
                    <div className="flex items-center gap-2 border-b border-slate-850 pb-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/30">
                        <TrendingUp className="h-4 w-4 text-violet-400" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-black tracking-tight">Income Setting</h4>
                        <p className="text-slate-500 text-[10px] font-medium">Update profile salary</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 flex-grow justify-center">
                      <div className="flex flex-col gap-1 items-center bg-slate-900/50 rounded-2xl border border-slate-850 p-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Static Income Settings</span>
                        
                        <div className="mt-3">
                          {isEditingIncome ? (
                            <form onSubmit={handleSaveIncome} className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={incomeInput}
                                onChange={e => setIncomeInput(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-xs h-9 w-24 px-2"
                                required
                              />
                              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-9 w-9 p-0 rounded-xl flex items-center justify-center border-0 cursor-pointer text-white">
                                <Check size={14} />
                              </Button>
                              <Button type="button" size="sm" onClick={() => { setIsEditingIncome(false); setIncomeInput(userIncome.toString()); }} className="bg-red-600 hover:bg-red-500 h-9 w-9 p-0 rounded-xl flex items-center justify-center border-0 cursor-pointer text-white">
                                <X size={14} />
                              </Button>
                            </form>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-white text-xl font-bold tracking-tight">₹{userIncome.toLocaleString()}</span>
                              <button
                                onClick={() => setIsEditingIncome(true)}
                                className="text-slate-450 hover:text-slate-200 cursor-pointer border-0 bg-transparent p-1 flex items-center"
                                title="Edit Monthly Income"
                              >
                                <Edit2 size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 leading-relaxed font-semibold bg-slate-900/20 border border-slate-850 p-3 rounded-xl mt-auto">
                        💡 Setting monthly income enables robust calculations for savings rates, budget alarms, and predictive models.
                      </div>
                    </div>
                  </Card>

                </div>

                {/* Row 3: Goal-Based Savings Tracker Card */}
                <Card className="glass-card border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl p-6">
                  <div className="mb-6 border-b border-slate-850 pb-4">
                    <h2 className="text-white text-md font-bold flex items-center gap-2">
                      <Target className="h-5 w-5 text-violet-400" /> Goal-Based Savings Tracker
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">Allocate and visualize your accumulated savings toward target financial goals.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Left Column: Goals list */}
                    <div className="flex flex-col gap-4">
                      {isGoalsLoading ? (
                        <p className="text-slate-500 text-xs font-bold py-6">Loading savings goals...</p>
                      ) : goals.length === 0 ? (
                        <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center flex flex-col justify-center items-center">
                          <Target size={32} className="text-slate-500 mb-2" />
                          <p className="text-slate-450 text-xs font-bold">No active finance goals. Create one on the right to start tracking!</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {goals.map((goal) => {
                            const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) || 0;
                            const remaining = Math.max(0, goal.targetValue - goal.currentValue);
                            const targetDateStr = goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No date";
                            return (
                              <div
                                key={goal._id}
                                className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-3"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="text-white text-xs font-bold capitalize">{goal.title}</h4>
                                  <button
                                    onClick={() => handleDeleteGoal(goal._id)}
                                    className="bg-transparent border-0 cursor-pointer text-red-500 hover:text-red-400 p-1 flex items-center"
                                    title="Delete Goal"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                  Target: ₹{goal.targetValue.toLocaleString()} • Deadline: {targetDateStr}
                                </div>

                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-350">
                                    <span>Saved: ₹{goal.currentValue.toLocaleString()}</span>
                                    <span>{progress}%</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${progress >= 100 ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-gradient-to-r from-violet-500 to-fuchsia-500"}`}
                                      style={{ width: `${progress}%`, transition: "width 0.4s ease" }}
                                    />
                                  </div>
                                </div>

                                {remaining > 0 ? (
                                  <div className="flex flex-col gap-2 border-t border-slate-850 pt-2.5 mt-1">
                                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
                                      ₹{remaining.toLocaleString()} remaining
                                    </span>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        placeholder="Add savings (₹)"
                                        value={contributions[goal._id] || ""}
                                        onChange={e => setContributions(prev => ({ ...prev, [goal._id]: e.target.value }))}
                                        className="bg-slate-950 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-xs h-9 flex-grow"
                                      />
                                      <Button
                                        onClick={() => handleAddContribution(goal._id)}
                                        className="bg-violet-650 hover:bg-violet-600 text-white text-xs font-black px-4 rounded-xl h-9 border-0 cursor-pointer"
                                      >
                                        ADD
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-emerald-400 font-black mt-1">🎉 Milestone Achieved!</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Create Goal */}
                    <div className="border-l border-slate-850 pl-0 lg:pl-8 flex flex-col gap-4">
                      <h4 className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-2">
                        <Plus className="h-4 w-4 text-violet-400" /> Create Savings Goal
                      </h4>
                      <form onSubmit={handleCreateGoal} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Goal Name</label>
                          <Input 
                            type="text" 
                            placeholder="e.g. Vacation Fund" 
                            value={goalForm.title}
                            onChange={e => setGoalForm({ ...goalForm, title: e.target.value })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target (₹)</label>
                            <Input 
                              type="number" 
                              placeholder="₹ Amount" 
                              value={goalForm.targetValue}
                              onChange={e => setGoalForm({ ...goalForm, targetValue: e.target.value })}
                              className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Initial (₹)</label>
                            <Input 
                              type="number" 
                              placeholder="₹ 0" 
                              value={goalForm.currentValue}
                              onChange={e => setGoalForm({ ...goalForm, currentValue: e.target.value })}
                              className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Date</label>
                          <Input 
                            type="date" 
                            value={goalForm.deadline}
                            onChange={e => setGoalForm({ ...goalForm, deadline: e.target.value })}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl focus:border-violet-500 text-white font-semibold text-sm h-10"
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full mt-2 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-black rounded-xl border-0 shadow-lg shadow-violet-950/20"
                        >
                          CREATE GOAL
                        </Button>
                      </form>
                    </div>

                  </div>
                </Card>



              </div>

            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}