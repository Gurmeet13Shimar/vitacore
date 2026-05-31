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
  CheckCircle,
  Activity,
  Flame,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  Send,
  Heart,
  BookOpen,
  DollarSign,
  AlertCircle,
  Loader2
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

  // SMS Notification State
  const [phoneNumber, setPhoneNumber] = useState("7015530602");
  const [smsLoading, setSmsLoading] = useState<string | null>(null); // tracks which button is loading
  const [customMessage, setCustomMessage] = useState("");

  // Status Alerts/Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "error">("success");

  // Show a toast
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

  // --- SMS Notification Helpers ---
  const getToken = () => localStorage.getItem("token") || "";

  const sendNotification = async (endpoint: string, body: object, buttonKey: string) => {
    setSmsLoading(buttonKey);
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`✅ ${data.message}`, "success");
      } else {
        triggerToast(`❌ ${data.error || "Failed to send"}`, "error");
      }
    } catch {
      triggerToast("❌ Network error. Is the backend running?", "error");
    } finally {
      setSmsLoading(null);
    }
  };

  const handleTestSMS = () =>
    sendNotification("test", { phoneNumber }, "test");

  const handleHealthAlert = () =>
    sendNotification("health-reminder", { phoneNumber, sleepHours: 5, waterGlasses: 3, caloriesConsumed: 3100 }, "health");

  const handleStreakReminder = () =>
    sendNotification("streak-reminder", { phoneNumber, platform: "LeetCode", streakDays: 12 }, "streak");

  const handleFinanceAlert = () =>
    sendNotification("finance-alert", { phoneNumber, totalExpenses: 12500, budget: 10000 }, "finance");

  const handleCustomSMS = () => {
    if (!customMessage.trim()) { triggerToast("Please enter a message first.", "error"); return; }
    sendNotification("send-sms", { phoneNumber, message: customMessage }, "custom");
  };

  // Fetch phone number on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        if (data.phoneNumber) {
          setPhoneNumber(data.phoneNumber);
        }
      } catch (err) {
        console.error("Failed to load profile phone number:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          phoneNumber
        }),
      });
      const data = await res.json();
      if (data.phoneNumber) {
        triggerToast("Profile details saved successfully.", "success");
      } else {
        triggerToast("Failed to save profile.", "error");
      }
    } catch (err) {
      triggerToast("Error saving profile details.", "error");
    }
  };

  const handleExport = () => {
    triggerToast("Preparing your data file...", "info");
    setTimeout(() => {
      triggerToast("Data downloaded successfully! (vitacore-export.json)", "success");
      // Trigger mock file download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        user: mockUser,
        timestamp: new Date().toISOString(),
        instanceStatus: "Active",
        baselines: { health: 85, finance: 72, career: 92 },
        digestEnabled: dailyDigest,
        remindersEnabled: aiAlerts,
        achievementsUnlocked: 6
      }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `vitacore_data_${mockUser.name.toLowerCase()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, 1500);
  };

  const handleDeleteAccount = () => {
    triggerToast("Account deletion requires password confirmation.", "error");
  };

  return (
    <AppLayout>
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
        {/* Noise Overlay */}
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

        {/* Ambient Glows */}
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
          
          {/* Header */}
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
                Account Settings
              </h1>
              <p style={{ color: "rgba(233,221,255,0.75)", marginTop: 6, fontSize: 15, fontWeight: 500 }}>
                Manage your daily reminders, details, and personal account.
              </p>
            </div>

            {/* Sync status */}
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
              Sync Status: Online
            </motion.div>
          </motion.div>

          {/* Main Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="md:grid-cols-3">
            
            {/* Left Column: Profile Card */}
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
                  
                  {/* Avatar */}
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

                  {/* Profile Info */}
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

                  <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(107,92,231,0.08)", marginBottom: 20 }} />

                  {/* Stats */}
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>My Level:</span>
                      <span style={{ fontSize: 14, color: "#e2d9ff", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                        <ShieldCheck size={16} color="#f5c518" /> Level {mockUser.level}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>Daily Streak:</span>
                      <span style={{ fontSize: 14, color: "#e2d9ff", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                        <Flame size={16} color="#e91e8c" /> {mockUser.streak} Days
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", fontWeight: 600 }}>My Focus:</span>
                      <span style={{ fontSize: 13, color: "#6b5ce7", fontWeight: 700 }}>
                        {mockUser.targetRole}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 12, width: "100%", marginTop: 28 }}>
                    <Button
                      onClick={handleSaveProfile}
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

            {/* Right Column: Preferences & Security */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="md:col-span-2">
              
              {/* Reminders & Notifications */}
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
                    <Bell size={20} color="#6b5ce7" /> Reminders & Notifications
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    
                    {/* Toggle 1: Daily Digest */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Label style={{ fontSize: 15, fontWeight: 700, color: "#e2d9ff", cursor: "pointer" }} htmlFor="daily-digest">
                          Daily Morning Summary
                        </Label>
                        <p style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", margin: 0, fontWeight: 500 }}>
                          Get a clean morning email with your recent health, career, and wealth stats.
                        </p>
                      </div>
                      <Switch
                        id="daily-digest"
                        checked={dailyDigest}
                        onCheckedChange={() => handleToggle("Daily Morning Summary", setDailyDigest, dailyDigest)}
                      />
                    </div>

                    {/* Toggle 2: AI Alerts */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Label style={{ fontSize: 15, fontWeight: 700, color: "#e2d9ff", cursor: "pointer" }} htmlFor="ai-alerts">
                          Smart Goal Reminders
                        </Label>
                        <p style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", margin: 0, fontWeight: 500 }}>
                          Get a quick reminder when you fall behind on your targets.
                        </p>
                      </div>
                      <Switch
                        id="ai-alerts"
                        checked={aiAlerts}
                        onCheckedChange={() => handleToggle("Smart Goal Reminders", setAiAlerts, aiAlerts)}
                      />
                    </div>

                    {/* Toggle 3: Achievement Pings */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Label style={{ fontSize: 15, fontWeight: 700, color: "#e2d9ff", cursor: "pointer" }} htmlFor="achievement-pings">
                          Achievement Notifications
                        </Label>
                        <p style={{ fontSize: 13, color: "rgba(196,181,253,0.5)", margin: 0, fontWeight: 500 }}>
                          Show celebratory popups immediately when you hit goals.
                        </p>
                      </div>
                      <Switch
                        id="achievement-pings"
                        checked={achievementPings}
                        onCheckedChange={() => handleToggle("Achievement Notifications", setAchievementPings, achievementPings)}
                      />
                    </div>

                    {/* Toggle 4: Telemetry Sync */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 16, background: "rgba(107,92,231,0.01)", border: "1px solid rgba(107,92,231,0.04)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Label style={{ fontSize: 15, fontWeight: 700, color: "#1e1040", cursor: "pointer" }} htmlFor="telemetry-sync">
                            Auto-save & Background Sync
                          </Label>
                          <Sparkles size={14} color="#f5c518" />
                        </div>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>
                          Keep your logs synchronized in the background automatically.
                        </p>
                      </div>
                      <Switch
                        id="telemetry-sync"
                        checked={telemetrySync}
                        onCheckedChange={() => handleToggle("Background Sync", setTelemetrySync, telemetrySync)}
                      />
                    </div>

                  </div>

                  {/* ── SMS / Phone Alerts Section ── */}
                  <div style={{ marginTop: 28, borderTop: "1.5px solid rgba(107,92,231,0.1)", paddingTop: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                      <div style={{ background: "linear-gradient(135deg, #6b5ce7, #e91e8c)", borderRadius: 10, padding: 8, display: "flex" }}>
                        <Smartphone size={18} color="#fff" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: "#1e1040", margin: 0 }}>SMS Phone Alerts</h4>
                        <p style={{ fontSize: 12, color: "#64748b", margin: 0, fontWeight: 500 }}>Send real-time SMS alerts via Twilio to your phone</p>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: "#1e1040", display: "block", marginBottom: 6 }}>Phone Number (Indian numbers auto-prefixed with +91)</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#6b5ce7", background: "rgba(107,92,231,0.08)", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(107,92,231,0.15)" }}>+91</span>
                        <input
                          id="sms-phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 9876543210"
                          style={{
                            flex: 1, padding: "10px 14px", borderRadius: 10,
                            border: "1.5px solid rgba(107,92,231,0.2)",
                            background: "rgba(107,92,231,0.03)",
                            fontSize: 14, fontWeight: 600, color: "#1e1040", outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    {/* Quick-Fire Alert Buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
                      {[
                        { key: "test",    label: "Test Connection",   icon: <Send size={14} />,       handler: handleTestSMS,       color: "#6b5ce7", bg: "rgba(107,92,231,0.09)" },
                        { key: "health",  label: "Health Alert",      icon: <Heart size={14} />,      handler: handleHealthAlert,   color: "#e91e8c", bg: "rgba(233,30,140,0.09)" },
                        { key: "streak",  label: "Streak Reminder",   icon: <BookOpen size={14} />,   handler: handleStreakReminder, color: "#f59e0b", bg: "rgba(245,158,11,0.09)" },
                        { key: "finance", label: "Finance Alert",     icon: <DollarSign size={14} />, handler: handleFinanceAlert,  color: "#22c55e", bg: "rgba(34,197,94,0.09)" },
                      ].map(({ key, label, icon, handler, color, bg }) => (
                        <button
                          key={key}
                          id={`sms-btn-${key}`}
                          onClick={handler}
                          disabled={smsLoading !== null}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                            padding: "11px 14px", borderRadius: 12,
                            background: smsLoading === key ? color : bg,
                            border: `1.5px solid ${color}40`,
                            color: smsLoading === key ? "#fff" : color,
                            fontSize: 13, fontWeight: 700, cursor: smsLoading !== null ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease", opacity: smsLoading !== null && smsLoading !== key ? 0.5 : 1,
                          }}
                        >
                          {smsLoading === key ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : icon}
                          {smsLoading === key ? "Sending…" : label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Message */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        id="sms-custom-message"
                        type="text"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCustomSMS()}
                        placeholder="Type a custom SMS message and hit Send…"
                        style={{
                          flex: 1, padding: "10px 14px", borderRadius: 10,
                          border: "1.5px solid rgba(107,92,231,0.2)",
                          background: "rgba(107,92,231,0.03)",
                          fontSize: 13, fontWeight: 600, color: "#1e1040", outline: "none",
                        }}
                      />
                      <button
                        id="sms-send-custom"
                        onClick={handleCustomSMS}
                        disabled={smsLoading !== null}
                        style={{
                          padding: "10px 18px", borderRadius: 10,
                          background: "linear-gradient(135deg, #6b5ce7, #e91e8c)",
                          border: "none", color: "#fff",
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 6,
                          opacity: smsLoading !== null ? 0.6 : 1,
                        }}
                      >
                        {smsLoading === "custom" ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />}
                        Send
                      </button>
                    </div>

                    {/* Info note */}
                    <div style={{ marginTop: 12, display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(107,92,231,0.04)", border: "1px solid rgba(107,92,231,0.1)" }}>
                      <AlertCircle size={14} color="#6b5ce7" style={{ marginTop: 2, flexShrink: 0 }} />
                      <p style={{ fontSize: 12, color: "#64748b", margin: 0, fontWeight: 500 }}>
                        SMS alerts are sent via <strong>Twilio</strong>. Make sure your backend is running and Twilio credentials are set in <code>.env</code>.
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>

              {/* Data & Privacy */}
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
                    <Lock size={20} color="#6b5ce7" /> My Data & Privacy
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    
                    {/* Export */}
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
                          Export My Data
                        </h4>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>
                          Download your complete profile data and logged history as a JSON file.
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

                    {/* Delete Account */}
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
                          Delete My Account
                        </h4>
                        <p style={{ fontSize: 13, color: "rgba(239, 68, 68, 0.8)", margin: 0, fontWeight: 500 }}>
                          Permanently erase your logged numbers, history, and account settings.
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
                        <Trash2 size={16} /> Delete Account
                      </Button>
                    </div>

                  </div>
                </div>
              </motion.div>

            </div>

          </div>

        </div>

        {/* Dynamic Floating Toast */}
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