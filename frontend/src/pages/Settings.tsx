import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockUser } from "@/data/mockData";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Download, 
  Trash2, 
  Sparkles,
  Camera,
  Edit2,
  CheckCircle,
  Eye,
  Activity,
  Flame,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
  // Switch States
  const [dailyDigest, setDailyDigest] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [achievementPings, setAchievementPings] = useState(true);
  const [telemetrySync, setTelemetrySync] = useState(true);

  // Status Alerts/Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "error">("success");

  // Show a premium auto-dismissing toast
  const triggerToast = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggle = (settingName: string, stateSetter: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => {
    stateSetter(!currentState);
    triggerToast(`${settingName} ${!currentState ? "Enabled" : "Disabled"} successfully!`, "success");
  };

  const handleExport = () => {
    triggerToast("Generating telemetry report...", "info");
    setTimeout(() => {
      triggerToast("Telemetry data downloaded successfully! (vitacore-export.json)", "success");
      // Trigger mock file download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        user: mockUser,
        timestamp: new Date().toISOString(),
        instanceStatus: "Active",
        vectorBaselines: { health: 85, finance: 72, career: 92 },
        telemetryFrequency: "Realtime",
        digestEnabled: dailyDigest,
        aiInterventionEnabled: aiAlerts,
        achievementsUnlocked: 6
      }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `vitacore_telemetry_${mockUser.name.toLowerCase()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, 1500);
  };

  const handleDeleteAccount = () => {
    triggerToast("Self-destruct sequence aborted. User authorization required.", "error");
  };

  return (
    <AppLayout>
      {/* ── Page Wrapper with Deep Purple Background ── */}
      <div
        style={{
          minHeight: "100%",
          background: "linear-gradient(145deg, #6b5ce7 0%, #7c4ff0 40%, #6248d4 100%)",
          padding: "36px 40px 60px",
          fontFamily: "Inter, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Elegant Subtle Noise Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            opacity: 0.02,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Shimmering Ambient Orbs */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "5%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233,30,140,0.12) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: "35vw",
            height: "35vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          
          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 36,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.02em",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 14,
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SettingsIcon size={24} color="#ffffff" className="animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                System Preferences
              </h1>
              <p style={{ color: "rgba(233,221,255,0.75)", marginTop: 6, fontSize: 15, fontWeight: 500 }}>
                Configure and calibrate your digital twin's telemetry baselines.
              </p>
            </div>

            {/* Twin Connection Status */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 999,
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  boxShadow: "0 0 10px #22c55e",
                }}
              />
              Twin Sync: Online
            </motion.div>
          </motion.div>

          {/* ── Main Layout Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="md:grid-cols-3">
            
            {/* ── Column 1: Profile & Core Metrics ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  rotateX: 3,
                  rotateY: -3,
                  boxShadow: "0 25px 50px rgba(107,92,231,0.2)",
                  borderColor: "rgba(107,92,231,0.15)",
                }}
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  border: "1.5px solid rgba(107,92,231,0.08)",
                  padding: "32px 28px",
                  boxShadow: "0 8px 32px rgba(107,92,231,0.06)",
                  cursor: "default",
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background Sparkle Symbol */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    opacity: 0.04,
                    color: "#6b5ce7",
                    transform: "translateZ(10px) rotate(15deg)",
                  }}
                >
                  <Activity size={180} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "translateZ(30px)" }}>
                  
                  {/* Premium Avatar Container */}
                  <div style={{ position: "relative", marginBottom: 20 }}>
                    <div
                      style={{
                        padding: 4,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6b5ce7 0%, #e91e8c 50%, #f5c518 100%)",
                        boxShadow: "0 10px 24px rgba(107,92,231,0.25)",
                      }}
                    >
                      <img
                        src={mockUser.avatar}
                        alt={mockUser.name}
                        style={{
                          width: 96,
                          height: 96,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #ffffff",
                        }}
                      />
                    </div>
                    {/* Camera Badge Hover Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => triggerToast("Avatar uploads coming in the next release!", "info")}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 4,
                        background: "#6b5ce7",
                        border: "2px solid #ffffff",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Camera size={14} color="#ffffff" />
                    </motion.button>
                  </div>

                  {/* Profile info */}
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#e2d9ff",
                      marginBottom: 4,
                      textAlign: "center",
                    }}
                  >
                    {mockUser.name}
                  </h3>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#e91e8c",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      background: "rgba(233,30,140,0.06)",
                      padding: "4px 12px",
                      borderRadius: 999,
                      marginBottom: 24,
                    }}
                  >
                    {mockUser.role}
                  </span>

                  {/* Divider */}
                  <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(107,92,231,0.08)", marginBottom: 20 }} />

                  {/* Level & Streak Stats */}
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>Instance Level:</span>
                      <span style={{ fontSize: 14, color: "#e2d9ff", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                        <ShieldCheck size={16} color="#f5c518" /> Level {mockUser.level}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>Optimizing Streak:</span>
                      <span style={{ fontSize: 14, color: "#e2d9ff", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                        <Flame size={16} color="#e91e8c" /> {mockUser.streak} Days
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>Focus Track:</span>
                      <span style={{ fontSize: 13, color: "#6b5ce7", fontWeight: 700 }}>
                        {mockUser.targetRole}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 12, width: "100%", marginTop: 28 }}>
                    <Button
                      onClick={() => triggerToast("Profile updates saved to cloud twin.", "success")}
                      variant="outline"
                      style={{
                        flex: 1,
                        borderRadius: 14,
                        border: "1.5px solid rgba(107,92,231,0.15)",
                        background: "rgba(107,92,231,0.02)",
                        color: "#e2d9ff",
                        fontWeight: 700,
                        fontSize: 13,
                        transition: "all 0.2s ease",
                      }}
                      className="hover:bg-primary/5 hover:border-primary"
                    >
                      Save Profile
                    </Button>
                    <Button
                      onClick={() => triggerToast("Password reset link dispatched.", "info")}
                      variant="outline"
                      style={{
                        flex: 1,
                        borderRadius: 14,
                        border: "1.5px solid rgba(107,92,231,0.15)",
                        background: "rgba(107,92,231,0.02)",
                        color: "#e2d9ff",
                        fontWeight: 700,
                        fontSize: 13,
                        transition: "all 0.2s ease",
                      }}
                      className="hover:bg-primary/5 hover:border-primary"
                    >
                      Reset Credentials
                    </Button>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* ── Columns 2 & 3: Preferences & Security ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="md:col-span-2">
              
              {/* Telemetry & Notifications Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  rotateX: 1,
                  rotateY: -1,
                  boxShadow: "0 20px 40px rgba(107,92,231,0.15)",
                  borderColor: "rgba(107,92,231,0.15)",
                }}
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  border: "1.5px solid rgba(107,92,231,0.08)",
                  padding: 32,
                  boxShadow: "0 8px 32px rgba(107,92,231,0.06)",
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div style={{ transform: "translateZ(20px)" }}>
                  
                  {/* Section Title */}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#e2d9ff",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderBottom: "1.5px solid rgba(107,92,231,0.08)",
                      paddingBottom: 16,
                      marginBottom: 24,
                    }}
                  >
                    <Bell size={20} color="#6b5ce7" /> Telemetry & Alert Configurations
                  </h3>

                  {/* Preference Switches Grid */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    
                    {/* Toggle 1: Daily Digest */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Label style={{ fontSize: 15, fontWeight: 700, color: "#e2d9ff", cursor: "pointer" }} htmlFor="daily-digest">
                          Daily Digest Dispatch
                        </Label>
                        <p style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", margin: 0, fontWeight: 500 }}>
                          Receive a curated morning brief summarizing your baseline optimizations.
                        </p>
                      </div>
                      <Switch
                        id="daily-digest"
                        checked={dailyDigest}
                        onCheckedChange={() => handleToggle("Daily Digest Briefing", setDailyDigest, dailyDigest)}
                      />
                    </div>

                    {/* Toggle 2: AI Alerts */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Label style={{ fontSize: 15, fontWeight: 700, color: "#e2d9ff", cursor: "pointer" }} htmlFor="ai-alerts">
                          AI Intervention Warnings
                        </Label>
                        <p style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", margin: 0, fontWeight: 500 }}>
                          Real-time alerts when trajectory forecasts project metric drops below threshold.
                        </p>
                      </div>
                      <Switch
                        id="ai-alerts"
                        checked={aiAlerts}
                        onCheckedChange={() => handleToggle("AI Intervention Alerts", setAiAlerts, aiAlerts)}
                      />
                    </div>

                    {/* Toggle 3: Achievement Pings */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Label style={{ fontSize: 15, fontWeight: 700, color: "#e2d9ff", cursor: "pointer" }} htmlFor="achievement-pings">
                          Instant Achievement Pings
                        </Label>
                        <p style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", margin: 0, fontWeight: 500 }}>
                          Unlocks triggers instant visual fireworks and sonic micro-celebrations.
                        </p>
                      </div>
                      <Switch
                        id="achievement-pings"
                        checked={achievementPings}
                        onCheckedChange={() => handleToggle("Gamification Pings", setAchievementPings, achievementPings)}
                      />
                    </div>

                    {/* Toggle 4: Telemetry Sync */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Label style={{ fontSize: 15, fontWeight: 700, color: "#1e1040", cursor: "pointer" }} htmlFor="telemetry-sync">
                            Realtime Vector Telemetry Sync
                          </Label>
                          <Sparkles size={14} color="#f5c518" />
                        </div>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>
                          Constantly optimize algorithms on the fly via local Node telemetry streams.
                        </p>
                      </div>
                      <Switch
                        id="telemetry-sync"
                        checked={telemetrySync}
                        onCheckedChange={() => handleToggle("Realtime Telemetry Streaming", setTelemetrySync, telemetrySync)}
                      />
                    </div>

                  </div>
                </div>
              </motion.div>

              {/* Data & Privacy Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  rotateX: 1,
                  rotateY: -1,
                  boxShadow: "0 20px 40px rgba(107,92,231,0.15)",
                  borderColor: "rgba(107,92,231,0.15)",
                }}
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  border: "1.5px solid rgba(107,92,231,0.08)",
                  padding: 32,
                  boxShadow: "0 8px 32px rgba(107,92,231,0.06)",
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div style={{ transform: "translateZ(20px)" }}>
                  
                  {/* Section Title */}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#1e1040",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderBottom: "1.5px solid rgba(107,92,231,0.08)",
                      paddingBottom: 16,
                      marginBottom: 24,
                    }}
                  >
                    <Lock size={20} color="#6b5ce7" /> Data Assets & Security
                  </h3>

                  {/* Actions Area */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    
                    {/* Export Telemetry */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 20,
                        borderRadius: 18,
                        background: "rgba(107, 92, 231, 0.02)",
                        border: "1.5px solid rgba(107, 92, 231, 0.06)",
                        flexWrap: "wrap",
                        gap: 16,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 800, color: "#1e1040", margin: "0 0 4px" }}>
                          Export Telemetry Ledger
                        </h4>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>
                          Download complete profile indices, career progression data, and biometric tracks.
                        </p>
                      </div>
                      <Button
                        onClick={handleExport}
                        style={{
                          borderRadius: 12,
                          background: "#6b5ce7",
                          color: "#ffffff",
                          fontWeight: 700,
                          padding: "10px 20px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        className="hover:bg-primary-hover shadow-md hover:shadow-lg"
                      >
                        <Download size={16} /> Export JSON
                      </Button>
                    </div>

                    {/* Terminate Instance */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 20,
                        borderRadius: 18,
                        background: "rgba(239, 68, 68, 0.02)",
                        border: "1.5px solid rgba(239, 68, 68, 0.12)",
                        flexWrap: "wrap",
                        gap: 16,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 800, color: "#ef4444", margin: "0 0 4px" }}>
                          Purge Digital Twin Instance
                        </h4>
                        <p style={{ fontSize: 13, color: "rgba(239, 68, 68, 0.8)", margin: 0, fontWeight: 500 }}>
                          Permanently delete all synced metrics, database logs, and optimization routines.
                        </p>
                      </div>
                      <Button
                        onClick={handleDeleteAccount}
                        variant="destructive"
                        style={{
                          borderRadius: 12,
                          background: "rgba(239, 68, 68, 0.12)",
                          color: "#ef4444",
                          fontWeight: 700,
                          padding: "10px 20px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          border: "1.5px solid rgba(239, 68, 68, 0.3)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        className="hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={16} /> Terminate Instance
                      </Button>
                    </div>

                  </div>
                </div>
              </motion.div>

            </div>

          </div>

        </div>

        {/* ── Dynamic Floating Notification Toast ── */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{
                position: "fixed",
                bottom: 32,
                left: "50%",
                background: toastType === "success" 
                  ? "linear-gradient(135deg, #1e1b4b 0%, #1e1040 100%)" 
                  : toastType === "error" 
                    ? "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)"
                    : "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
                border: toastType === "success" 
                  ? "1.5px solid rgba(34, 197, 94, 0.4)" 
                  : toastType === "error" 
                    ? "1.5px solid rgba(239, 68, 68, 0.4)"
                    : "1.5px solid rgba(59, 130, 246, 0.4)",
                padding: "14px 28px",
                borderRadius: 999,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.35), 0 0 20px rgba(107, 92, 231, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                zIndex: 9999,
                whiteSpace: "nowrap",
                backdropFilter: "blur(8px)",
              }}
            >
              {toastType === "success" ? (
                <CheckCircle size={18} color="#22c55e" className="animate-bounce" />
              ) : toastType === "error" ? (
                <Trash2 size={18} color="#ef4444" className="animate-pulse" />
              ) : (
                <RefreshCw size={18} color="#3b82f6" className="animate-spin" />
              )}
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
}