import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  TrendingUp,
  BookOpen,
  BrainCircuit,
  MessageCircle,
  ArrowUpRight,
  Zap,
  Target,
  Plus,
  Trash2,
  Sparkles,
  LayoutDashboard,
  Heart,
  DollarSign,
  Briefcase,
  Beaker,
  Trophy,
  Settings,
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
import { goals as initialGoals } from '@/data/mockData';
import { Dock } from '@/components/ui/dock';

// ── Chart Data ────────────────────────────────────────────────────────────────
const weeklyData = [
  { day: 'Mon', health: 60, finance: 40, career: 30 },
  { day: 'Tue', health: 65, finance: 50, career: 45 },
  { day: 'Wed', health: 70, finance: 55, career: 60 },
  { day: 'Thu', health: 75, finance: 60, career: 65 },
  { day: 'Fri', health: 80, finance: 70, career: 80 },
  { day: 'Sat', health: 85, finance: 75, career: 90 },
  { day: 'Sun', health: 90, finance: 80, career: 100 },
];

// ── Count Up Number Animation ────────────────────────────────────────────────
function CountUpNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
    return rounded.on("change", (latest) => setDisplayValue(latest));
  }, [value]);

  return <>{displayValue}</>;
}

// ── Custom Tooltip (The only allowed dark background box exception) ──────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0D0D20',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        color: '#ffffff',
      }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color, fontWeight: 700, margin: '2px 0' }}>
            {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Clean Score Card (Line-separated, no card background) ────────────────────
interface ScoreCardProps {
  label: string;
  score: number;
  change: string;
  color: string;
  Icon: React.ElementType;
  isLast: boolean;
}

function ScoreCard({ label, score, change, Icon, isLast }: ScoreCardProps) {
  return (
    <div
      style={{
        padding: "28px 32px",
        borderRight: isLast ? "none" : "1px solid rgba(255, 255, 255, 0.07)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background icon - faded to near invisible */}
      <div
        style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.04,
          fontSize: 80,
          color: "#ffffff",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={80} strokeWidth={1.5} />
      </div>

      <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.3)", marginBottom: 16 }}>
        {label}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <span style={{ fontSize: "4.5rem", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
          <CountUpNumber value={score} />
        </span>
        <span style={{
          fontSize: 12,
          padding: "4px 10px",
          borderRadius: 9999,
          fontWeight: 500,
          background: "rgba(16, 185, 129, 0.15)",
          color: "#34d399",
        }}>
          +{change}
        </span>
      </div>
    </div>
  );
}

// ── Goal Item Row (Line-separated row layout with hover state) ──────────────────
interface GoalRowProps {
  goal: any;
  progress: number;
  colorAccent: string;
  colorBg: string;
  handleDeleteGoal: (id: number) => void;
  index: number;
}

function GoalRow({ goal, progress, colorAccent, colorBg, handleDeleteGoal, index }: GoalRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, delay: 0.08 * index }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        padding: '24px 32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        background: isHovered ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr 100px 110px', alignItems: 'center', gap: 32 }}>
        {/* Column 1 - Category badge + title */}
        <div>
          <div style={{
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 9999,
            fontWeight: 600,
            display: 'inline-block',
            marginBottom: 8,
            background: colorBg,
            color: colorAccent,
          }}>
            {goal.category}
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {goal.name}
          </h4>
        </div>

        {/* Column 2 - Progress bar */}
        <div>
          <div style={{ width: '100%', height: 3, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 9999, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 * index }}
              style={{
                height: '100%',
                borderRadius: 9999,
                background: colorAccent,
              }}
            />
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.3)', marginTop: 8, textTransform: 'uppercase' }}>
            {progress.toFixed(0)}% complete
          </div>
        </div>

        {/* Column 3 - Current value */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{goal.current}</div>
          <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.25)', marginTop: 4 }}>/ {goal.target}</div>
        </div>

        {/* Column 4 - Due date + delete */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.3)' }}>Due {goal.deadline}</div>
          <button
            onClick={() => handleDeleteGoal(goal.id)}
            className="text-white/15 hover:text-white/40 transition-colors cursor-pointer"
            style={{ border: 'none', background: 'none', padding: 0 }}
            title="Delete Directive"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [goalsList, setGoalsList] = useState(initialGoals);
  const [goalFilter, setGoalFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(10);
  const [newGoalCategory, setNewGoalCategory] = useState('Health');
  const [newGoalDeadline, setNewGoalDeadline] = useState('Dec 31');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;
    const colorMap: Record<string, string> = { Health: 'purple', Finance: 'blue', Career: 'pink' };
    setGoalsList([...goalsList, {
      id: Date.now(), name: newGoalName, target: newGoalTarget,
      current: 0, deadline: newGoalDeadline, category: newGoalCategory,
      color: colorMap[newGoalCategory] || 'purple',
    }]);
    setNewGoalName(''); setNewGoalTarget(10); setNewGoalDeadline('Dec 31'); setShowAddForm(false);
  };

  const handleDeleteGoal = (id: number) => setGoalsList(goalsList.filter(g => g.id !== id));
  const filteredGoals = goalFilter === 'All' ? goalsList : goalsList.filter(g => g.category === goalFilter);

  // Dock items (quick nav)
  const dockItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: Heart, label: 'Health', onClick: () => navigate('/health') },
    { icon: DollarSign, label: 'Finance', onClick: () => navigate('/finance') },
    { icon: Briefcase, label: 'Career', onClick: () => navigate('/career') },
    { icon: Beaker, label: 'Simulator', onClick: () => navigate('/simulator') },
    { icon: Trophy, label: 'Achievements', onClick: () => navigate('/achievements') },
    { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
  ];

  return (
    <AppLayout>
      <div style={{ background: '#07071A', minHeight: '100%', position: 'relative', color: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', borderLeft: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          
          {/* Page Header: Welcome + Level Progress */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '28px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            {/* Welcome & Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#67e8f9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Twin Online · Optimizing
                </span>
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f0f4ff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Welcome Back,&nbsp;
                <span style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {user?.name || 'Explorer'}
                </span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4, fontSize: 13, fontWeight: 500, margin: 0 }}>
                Here's your digital twin's live optimization status.
              </p>
            </div>

            {/* Level Progress Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f5c518, #e91e8c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 16, color: '#fff',
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Zap size={12} color="#f5c518" fill="#f5c518" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#f5c518', letterSpacing: '0.08em' }}>LEVEL 12</span>
                </div>
                <div style={{ width: 110, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #f5c518, #e91e8c)', borderRadius: 99 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* View 1: Main Dashboard Grid (65fr 35fr) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '65fr 35fr',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            {/* Stat Tiles Row spanning across both columns */}
            <div style={{
              gridColumn: '1 / -1',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <ScoreCard label="Health Score" score={85} change="5%" color="#8b5cf6" Icon={Activity} isLast={false} />
              <ScoreCard label="Finance Score" score={72} change="2%" color="#e91e8c" Icon={TrendingUp} isLast={false} />
              <ScoreCard label="Career Score" score={90} change="10%" color="#f5c518" Icon={BookOpen} isLast={true} />
            </div>

            {/* Left: Weekly Progress Chart (65%) */}
            <div style={{
              padding: '28px 32px',
              borderRight: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', margin: 0 }}>Weekly Progress</h3>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                  {[{ color: '#8b5cf6', label: 'Health' }, { color: '#e91e8c', label: 'Finance' }, { color: '#f5c518', label: 'Career' }]
                    .map(({ color, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 12, height: 3, borderRadius: 99, background: color }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} domain={[0, 110]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="health" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="finance" stroke="#e91e8c" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#e91e8c', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="career" stroke="#f5c518" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#f5c518', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: AI Insights (35%) */}
            <div style={{
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', margin: 0 }}>AI Insights</h3>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: '#a78bfa', background: 'rgba(139,92,246,0.15)', padding: '2px 6px', borderRadius: 999 }}>LIVE</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { text: '"Your reduced sleep quality correlates with lower study consistency today. Try getting 8 hours tonight."', accent: '#8b5cf6' },
                    { text: '"To become a frontend developer in 6 months, increase React practice by 5 hours weekly."', accent: '#e91e8c' },
                  ].map((insight, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      style={{
                        borderLeft: `2px solid ${insight.accent}`,
                        paddingLeft: 14,
                      }}
                    >
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontStyle: 'italic', margin: 0, fontWeight: 400 }}>
                        {insight.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gradient pill CTA button aligned to bottom */}
              <motion.button
                whileHover={{ opacity: 0.9, y: -1 }}
                whileTap={{ y: 0 }}
                onClick={() => navigate('/simulator')}
                style={{
                  marginTop: 24,
                  width: '100%',
                  background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Zap size={14} fill="#f5c518" color="#f5c518" />
                Run 'What-if' Simulation
              </motion.button>
            </div>
          </div>

          {/* View 2: Active Directives & Goals */}
          <div>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '28px 32px 24px 32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', margin: 0 }}>Active Directives & Goals</h3>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.3)', margin: '4px 0 0', fontWeight: 500 }}>Track and manage your primary target metrics.</p>
              </div>
              <motion.button
                whileHover={{ opacity: 0.8 }}
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: 9999,
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Plus size={14} strokeWidth={2.5} />
                {showAddForm ? 'Close Form' : 'Add Directive'}
              </motion.button>
            </div>

            {/* Add Form Container */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <form onSubmit={handleAddGoal} style={{ padding: '28px 32px', background: 'rgba(255, 255, 255, 0.01)' }}>
                    <h4 style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Create New Objective Vector
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 20 }}>
                      {[
                        { label: 'Directive Name', type: 'text', placeholder: 'e.g. Run 10K, Save $5000', value: newGoalName, onChange: (e: any) => setNewGoalName(e.target.value) },
                        { label: 'Target Value', type: 'number', placeholder: '10', value: newGoalTarget, onChange: (e: any) => setNewGoalTarget(Number(e.target.value)) },
                        { label: 'Target Date', type: 'text', placeholder: 'e.g. Dec 31', value: newGoalDeadline, onChange: (e: any) => setNewGoalDeadline(e.target.value) },
                      ].map(({ label, type, placeholder, value, onChange }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                          <input type={type} placeholder={placeholder} value={value} onChange={onChange} required min={type === 'number' ? 1 : undefined}
                            style={{
                              padding: '10px 14px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              background: 'transparent',
                              color: '#ffffff',
                              fontSize: 13,
                              fontWeight: 500,
                              outline: 'none',
                            }}
                          />
                        </div>
                      ))}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                        <select value={newGoalCategory} onChange={(e) => setNewGoalCategory(e.target.value)}
                          style={{
                            padding: '10px 14px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: '#07071A',
                            color: '#ffffff',
                            fontSize: 13,
                            fontWeight: 500,
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Health">Health</option>
                          <option value="Finance">Finance</option>
                          <option value="Career">Career</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <motion.button
                        whileHover={{ opacity: 0.9 }}
                        type="submit"
                        style={{
                          background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 9999,
                          padding: '10px 24px',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Deploy Directive
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Tabs strip */}
            <div style={{
              display: 'flex',
              gap: 24,
              padding: '20px 32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            }}>
              {['All', 'Health', 'Finance', 'Career'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setGoalFilter(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    background: goalFilter === tab ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                    color: goalFilter === tab ? '#c4b5fd' : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Goal rows list */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence mode="popLayout">
                {filteredGoals.map((goal, index) => {
                  const progress = Math.min(100, (goal.current / goal.target) * 100);
                  const colorAccent = goal.category === 'Health' ? '#8b5cf6' : goal.category === 'Finance' ? '#e91e8c' : '#f5c518';
                  const colorBg = goal.category === 'Health' ? 'rgba(139,92,246,0.12)' : goal.category === 'Finance' ? 'rgba(233,30,140,0.12)' : 'rgba(245,197,24,0.12)';
                  
                  return (
                    <GoalRow
                      key={goal.id}
                      goal={goal}
                      progress={progress}
                      colorAccent={colorAccent}
                      colorBg={colorBg}
                      handleDeleteGoal={handleDeleteGoal}
                      index={index}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Floating Dock */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '48px 0 64px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}>
            <Dock items={dockItems} />
          </div>

        </div>

        {/* Floating Chat Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 260 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(79,70,229,0.35)',
            zIndex: 50,
          }}
        >
          <MessageCircle size={22} color="#fff" strokeWidth={2} />
        </motion.button>
      </div>
    </AppLayout>
  );
}