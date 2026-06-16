import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import axios from "axios";
import { motion } from "framer-motion";

export function FinancialTwinCard() {
  const [overview, setOverview] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [simulation, setSimulation] = useState<any>(null);
  const [optimizations, setOptimizations] = useState<any>(null);
  const [goalForecast, setGoalForecast] = useState<any>(null);

  const [simParams, setSimParams] = useState({
    foodReductionPercent: 0,
    shoppingReductionPercent: 0,
    transportReductionPercent: 0,
    incomeIncreaseAmount: 0
  });

  const [goalParams, setGoalParams] = useState({
    title: "",
    targetAmount: 0
  });

  const API_URL = "http://localhost:5000/api/finance/twin";

  useEffect(() => {
    fetchOverview();
    fetchForecast();
    fetchOptimizations();
  }, []);

  useEffect(() => {
    runSimulation();
  }, [simParams]);

  const fetchOverview = async () => {
    try {
      const res = await axios.get(`${API_URL}/overview`, { withCredentials: true });
      setOverview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchForecast = async () => {
    try {
      const res = await axios.post(`${API_URL}/forecast`, {}, { withCredentials: true });
      setForecast(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOptimizations = async () => {
    try {
      const res = await axios.post(`${API_URL}/optimize`, {}, { withCredentials: true });
      setOptimizations(res.data.optimizations);
    } catch (err) {
      console.error(err);
    }
  };

  const runSimulation = async () => {
    try {
      const res = await axios.post(`${API_URL}/simulate`, simParams, { withCredentials: true });
      setSimulation(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/goal`, {
        ...goalParams,
        optimizedDailySavingsAddition: simulation ? (simulation.additionalSavings / 90) : 0
      }, { withCredentials: true });
      setGoalForecast(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Generate data for graph
  const generateGraphData = () => {
    const data = [];
    let currentSavings = overview?.currentSavings || 25000;
    
    // Simplistic interpolation for visual purposes based on 90-day targets
    const base90 = simulation?.baseline90DaySavings || (forecast?.forecast90Days || currentSavings);
    const opt90 = simulation?.optimized90DaySavings || base90;
    
    const baseDailyIncrease = (base90 - currentSavings) / 90;
    const optDailyIncrease = (opt90 - currentSavings) / 90;

    for (let i = 0; i <= 90; i += 10) {
      data.push({
        day: `Day ${i}`,
        Baseline: currentSavings + (baseDailyIncrease * i),
        Optimized: currentSavings + (optDailyIncrease * i)
      });
    }
    return data;
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.5)", borderColor: "rgba(139,92,246,0.25)" }}
      style={{
        background: "rgba(16,12,38,0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(139,92,246,0.14)",
        borderRadius: 22,
        padding: 28,
        boxShadow: "0 4px 24px rgba(0,0,0,0.40)",
        transition: "all 0.3s ease",
        color: "#fff",
        marginTop: 32
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: "#e2d9ff" }}>Financial Twin Simulator</h2>
        <p style={{ color: "rgba(196,181,253,0.7)", marginTop: 4, fontSize: 14 }}>Simulate and optimize your financial future.</p>
      </div>

      {/* Overview & Forecast Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[{label: "Current Savings", val: overview?.currentSavings}, {label: "Savings Rate", val: overview?.savingsRate + "%"}, {label: "30 Day Forecast", val: forecast?.forecast30Days}, {label: "90 Day Forecast", val: forecast?.forecast90Days}].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 12, color: "rgba(196,181,253,0.6)", textTransform: "uppercase", fontWeight: "bold" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginTop: 4 }}>
              {typeof s.val === 'number' ? `₹${s.val.toLocaleString()}` : (s.val || "0")}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Row 1: Controls & Graph */}
        <div style={{ display: "grid", gap: 32 }} className="grid-cols-1 lg:grid-cols-2">
          {/* Left: Simulation Controls */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", marginBottom: 16 }}>Simulation Controls</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "foodReductionPercent", label: "Reduce Food Spending (%)", max: 50 },
                { key: "shoppingReductionPercent", label: "Reduce Shopping (%)", max: 50 },
                { key: "transportReductionPercent", label: "Reduce Transport (%)", max: 50 },
                { key: "incomeIncreaseAmount", label: "Increase Monthly Income (₹)", max: 20000 }
              ].map(control => (
                <div key={control.key} style={{ background: "rgba(255,255,255,0.02)", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, fontWeight: 600, color: "rgba(196,181,253,0.8)" }}>
                    <span>{control.label}</span>
                    <span style={{ color: "#fff" }}>{(simParams as any)[control.key]}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max={control.max} 
                    value={(simParams as any)[control.key]} 
                    onChange={e => setSimParams({...simParams, [control.key]: Number(e.target.value)})} 
                    style={{ width: "100%", accentColor: "#e91e8c" }}
                  />
                </div>
              ))}
            </div>

            {simulation && simulation.additionalSavings > 0 && (
              <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(233,30,140,0.1)", borderRadius: 12, border: "1px solid rgba(233,30,140,0.3)" }}>
                <div style={{ fontSize: 13, color: "#f472b6", fontWeight: "bold" }}>Simulation Impact</div>
                <div style={{ fontSize: 18, color: "#fff", fontWeight: 800, marginTop: 4 }}>
                  +₹{simulation.additionalSavings.toLocaleString()} in additional savings over 90 days
                </div>
              </div>
            )}
          </div>

          {/* Right: Future Projection */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", marginBottom: 16 }}>Future Projection</h3>
            <div style={{ height: "100%", minHeight: 260, background: "rgba(0,0,0,0.2)", borderRadius: 16, padding: 16 }}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={generateGraphData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(196,181,253,0.5)" style={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(196,181,253,0.5)" style={{ fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "rgba(10,8,28,0.95)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", color: "#fff" }} />
                  <Area type="monotone" dataKey="Baseline" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                  <Area type="monotone" dataKey="Optimized" stroke="#e91e8c" fill="#e91e8c" fillOpacity={0.4} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 2: Optimizations & Goals */}
        <div style={{ display: "grid", gap: 32 }} className="grid-cols-1 lg:grid-cols-2">
          {/* Left: AI Optimization Opportunities */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", marginBottom: 16 }}>AI Optimization Opportunities</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {optimizations?.map((opt: any) => (
                <div key={opt.rank} style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", padding: 16, borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#e91e8c", textTransform: "uppercase" }}>Rank #{opt.rank}</div>
                  <div style={{ fontSize: 14, fontWeight: "bold", margin: "4px 0", color: "#e2d9ff" }}>{opt.action}</div>
                  <div style={{ fontSize: 13, color: "#4ade80", fontWeight: 700 }}>+₹{opt.additionalSavings.toLocaleString()} over 90 days</div>
                </div>
              ))}
              {!optimizations && (
                <div style={{ color: "rgba(196,181,253,0.5)", fontSize: 13 }}>Loading optimizations...</div>
              )}
            </div>
          </div>

          {/* Right: Goal Forecasting Engine */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e2d9ff", marginBottom: 16 }}>Goal Forecasting Engine</h3>
            <form onSubmit={handleGoalSubmit} style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
              <input 
                placeholder="Goal Title (e.g. Buy Laptop)" 
                value={goalParams.title}
                onChange={e => setGoalParams({...goalParams, title: e.target.value})}
                style={{ width: "100%", padding: "12px 16px", marginBottom: 12, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: 8, fontSize: 14, fontWeight: 600, outline: "none" }} 
                required
              />
              <input 
                placeholder="Target Amount (₹)" 
                type="number"
                value={goalParams.targetAmount || ""}
                onChange={e => setGoalParams({...goalParams, targetAmount: Number(e.target.value)})}
                style={{ width: "100%", padding: "12px 16px", marginBottom: 16, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: 8, fontSize: 14, fontWeight: 600, outline: "none" }} 
                required
              />
              <button type="submit" style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #8b5cf6, #e91e8c)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 800, fontSize: 14 }}>
                FORECAST COMPLETION
              </button>
            </form>

            {goalForecast && (
              <div style={{ marginTop: 20, padding: 16, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12 }}>
                <div style={{ fontSize: 13, color: "rgba(196,181,253,0.8)", marginBottom: 8 }}>Estimated Time to Goal</div>
                <div style={{ fontSize: 16, color: "#e2d9ff", fontWeight: 600 }}>Baseline: <b>{goalForecast.estimatedCompletionDays} Days</b></div>
                <div style={{ fontSize: 16, color: "#4ade80", fontWeight: 800, marginTop: 4 }}>Optimized: <b>{goalForecast.optimizedCompletionDays} Days</b></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
