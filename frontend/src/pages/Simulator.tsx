import React, { useState } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Zap, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Simulator() {

  const [params, setParams] = useState({
    study: 2,
    exercise: 3,
    savings: 30,
    sleep: 7,
    dining: 4,
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const [isAiLoading, setIsAiLoading] = useState(false);

  const [simulationResult, setSimulationResult] = useState<any>(null);

  // =========================
  // REAL AI BACKEND FUNCTION
  // =========================

  const fetchAiInsight = async () => {

    setIsAiLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/simulate",
        {
          sleep: params.sleep,
          exercise: params.exercise,
          water: 2,
          expenses: params.dining * 2000,
          income: 50000,
          codingHours: params.study
        }
      );

      setSimulationResult(response.data);

      setAiInsight(response.data.insight);

    } catch (error) {

      console.error("Backend Error:", error);

      setAiInsight(
        "Failed to connect with AI backend. Make sure FastAPI server is running."
      );

    } finally {

      setIsAiLoading(false);

    }
  };

  // =========================
  // CHART DATA
  // =========================

  const generateData = () => {

    const data = [];

    let baseHealth =
      70 +
      (params.exercise * 2) +
      ((params.sleep - 6) * 5) -
      (params.dining * 1);

    let baseFinance =
      5000 +
      (params.savings * 100) -
      (params.dining * 200);

    let baseCareer =
      60 +
      (params.study * 5) -
      (params.sleep < 6 ? 10 : 0);

    for (let i = 0; i < 6; i++) {

      data.push({
        month: `Month ${i + 1}`,
        health: Math.min(
          100,
          Math.max(0, baseHealth + (i * (params.exercise * 0.5)))
        ),
        finance: baseFinance + (i * params.savings * 50),
        career: Math.min(
          100,
          Math.max(0, baseCareer + (i * params.study))
        ),
      });

    }

    return data;
  };

  const chartData = generateData();

  const handleSliderChange = (
    key: keyof typeof params,
    value: number
  ) => {

    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));

    setIsSimulating(true);

    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <AppLayout>

      <div
        style={{
          minHeight: "100%",
          background: "#030712",
          padding: "36px 40px 60px",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >

        {/* Background Glow */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "5%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >

          {/* HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 36,
              justifyContent: "space-between",
            }}
          >

            <div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                AI Simulation Engine
              </h1>

              <p
                style={{
                  color: "rgba(233,221,255,0.75)",
                  marginTop: 6,
                  fontSize: 15,
                }}
              >
                Predict your future health, finance and career growth.
              </p>
            </div>

          </div>

          {/* MAIN GRID */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 20,
              alignItems: "start",
            }}
          >

            {/* LEFT CONTROL PANEL */}

            <motion.div
              whileHover={{
                y: -4,
              }}
              style={{
                background: "rgba(16,12,38,0.82)",
                border: "1px solid rgba(139,92,246,0.14)",
                borderRadius: 22,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >

              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#e2d9ff",
                  textTransform: "uppercase",
                }}
              >
                Control Variables
              </h3>

              {/* STUDY */}

              <div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#fff" }}>
                    Study Hours
                  </span>

                  <span style={{ color: "#e91e8c" }}>
                    {params.study}h/day
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="8"
                  value={params.study}
                  onChange={(e) =>
                    handleSliderChange(
                      "study",
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: "100%",
                    accentColor: "#e91e8c",
                  }}
                />

              </div>

              {/* EXERCISE */}

              <div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#fff" }}>
                    Exercise
                  </span>

                  <span style={{ color: "#8b5cf6" }}>
                    {params.exercise}d/week
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="7"
                  value={params.exercise}
                  onChange={(e) =>
                    handleSliderChange(
                      "exercise",
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: "100%",
                    accentColor: "#8b5cf6",
                  }}
                />

              </div>

              {/* SLEEP */}

              <div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#fff" }}>
                    Sleep
                  </span>

                  <span style={{ color: "#22c55e" }}>
                    {params.sleep}h/night
                  </span>
                </div>

                <input
                  type="range"
                  min="4"
                  max="10"
                  value={params.sleep}
                  onChange={(e) =>
                    handleSliderChange(
                      "sleep",
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: "100%",
                    accentColor: "#22c55e",
                  }}
                />

              </div>

              {/* BUTTON */}

              <button
                onClick={fetchAiInsight}
                disabled={isAiLoading}
                style={{
                  marginTop: 10,
                  padding: "14px",
                  borderRadius: 14,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#6b5ce7,#7c4ff0)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isAiLoading
                  ? "Running AI Simulation..."
                  : "Generate AI Insight"}
              </button>

            </motion.div>

            {/* RIGHT PANEL */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >

              {/* CHART */}

              <motion.div
                style={{
                  background: "rgba(16,12,38,0.82)",
                  borderRadius: 22,
                  padding: 28,
                }}
              >

                <h3
                  style={{
                    color: "#fff",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TrendingUp size={18} />
                  Projected Future Growth
                </h3>

                <div style={{ height: 300 }}>

                  <ResponsiveContainer width="100%" height="100%">

                    <AreaChart data={chartData}>

                      <defs>
                        <linearGradient
                          id="colorHealth"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />

                      <XAxis dataKey="month" stroke="#aaa" />

                      <YAxis stroke="#aaa" />

                      <RechartsTooltip />

                      <Area
                        type="monotone"
                        dataKey="health"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorHealth)"
                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </motion.div>

              {/* AI INSIGHT */}

              {aiInsight && (

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "rgba(16,12,38,0.82)",
                    borderRadius: 22,
                    padding: 24,
                    color: "#fff",
                  }}
                >

                  <h3
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Zap size={18} color="#f5c518" />
                    AI Insight
                  </h3>

                  <p
                    style={{
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {aiInsight}
                  </p>

                </motion.div>
              )}

              {/* RESULT CARDS */}

              {simulationResult && (

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: 20,
                  }}
                >

                  {/* CARD */}

                  <div
                    style={{
                      background: "rgba(139,92,246,0.08)",
                      padding: 24,
                      borderRadius: 18,
                      color: "#fff",
                    }}
                  >
                    <p>Health Score</p>

                    <h1>
                      {simulationResult.health_score}
                    </h1>
                  </div>

                  <div
                    style={{
                      background: "rgba(59,130,246,0.08)",
                      padding: 24,
                      borderRadius: 18,
                      color: "#fff",
                    }}
                  >
                    <p>Finance Score</p>

                    <h1>
                      {simulationResult.finance_score}
                    </h1>
                  </div>

                  <div
                    style={{
                      background: "rgba(233,30,140,0.08)",
                      padding: 24,
                      borderRadius: 18,
                      color: "#fff",
                    }}
                  >
                    <p>Career Score</p>

                    <h1>
                      {simulationResult.career_score}
                    </h1>
                  </div>

                  <div
                    style={{
                      background: "rgba(34,197,94,0.08)",
                      padding: 24,
                      borderRadius: 18,
                      color: "#fff",
                    }}
                  >
                    <p>Overall Score</p>

                    <h1>
                      {simulationResult.overall_score}
                    </h1>
                  </div>

                </motion.div>

              )}

            </div>

          </div>

        </div>

      </div>

    </AppLayout>
  );
}
