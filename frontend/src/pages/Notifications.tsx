import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Heart,
  DollarSign,
  Briefcase,
  Info,
  Check,
  CheckCheck,
  Trash2,
  Inbox,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryFilter = "all" | "health" | "finance" | "career" | "system";
type ReadFilter = "all" | "unread" | "read";

export default function Notifications() {
  const {
    loading: contextLoading,
    markRead,
    markAllRead,
    deleteNotification,
    fetchNotifications,
    refetchUnreadCount
  } = useNotifications();
  
  const { themeColors, theme } = useTheme();

  // Page local states for filtering/pagination
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load notifications from API whenever filter/pagination changes
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const readParam = readFilter === "unread" ? false : readFilter === "read" ? true : undefined;
      const res = await fetchNotifications({
        category: category === "all" ? undefined : category,
        read: readParam,
        search: debouncedSearch.trim() || undefined,
        page,
        limit: 10
      });
      if (res) {
        setNotifications(res.notifications || []);
        setTotalPages(res.pages || 1);
        setTotalItems(res.total || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [category, readFilter, debouncedSearch, page]);

  const handleMarkRead = async (id: string) => {
    await markRead(id);
    // Locally update read status in UI list
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    // Locally update all in UI list
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    // Locally remove from list
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setTotalItems((prev) => Math.max(0, prev - 1));
  };

  const getCategoryIcon = (cat: string, priority: string) => {
    const color =
      priority === "critical"
        ? "#ef4444"
        : priority === "high"
        ? "#f97316"
        : "#a855f7";

    switch (cat) {
      case "health":
        return <Heart size={18} style={{ color }} />;
      case "finance":
        return <DollarSign size={18} style={{ color }} />;
      case "career":
        return <Briefcase size={18} style={{ color }} />;
      default:
        return <Info size={18} style={{ color }} />;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          text: "#ef4444",
          border: "rgba(239, 68, 68, 0.2)"
        };
      case "high":
        return {
          bg: "rgba(249, 115, 22, 0.1)",
          text: "#f97316",
          border: "rgba(249, 115, 22, 0.2)"
        };
      case "medium":
        return {
          bg: "rgba(234, 179, 8, 0.1)",
          text: "#eab308",
          border: "rgba(234, 179, 8, 0.2)"
        };
      default:
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          text: "#3b82f6",
          border: "rgba(59, 130, 246, 0.2)"
        };
    }
  };

  return (
    <AppLayout>
      <div
        style={{
          background: themeColors.background,
          minHeight: "100vh",
          color: themeColors.textWhite,
          padding: "32px 24px",
          fontFamily: "Inter, sans-serif"
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 64 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(90deg, #c4b5fd, #f0abfc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0
                }}
              >
                Notification Center
              </h1>
              <p style={{ color: themeColors.textMuted, fontSize: 14, marginTop: 4, marginBottom: 0 }}>
                Manage your real-time alerts, insights, and reminders.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadNotifications}
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${themeColors.cardBorder}`,
                  color: themeColors.textWhite,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMarkAllRead}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${themeColors.neonPurple}, ${themeColors.neonPink})`,
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 4px 14px rgba(124, 79, 240, 0.3)`
                }}
              >
                <CheckCheck size={14} />
                Mark All Read
              </motion.button>
            </div>
          </div>

          {/* Filters Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: `1px solid ${themeColors.cardBorder}`
            }}
          >
            {/* Category Tabs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["all", "health", "finance", "career", "system"] as CategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: category === cat ? 700 : 500,
                    textTransform: "capitalize",
                    cursor: "pointer",
                    border: "none",
                    background: category === cat
                      ? theme === "bright"
                        ? "rgba(107, 92, 231, 0.15)"
                        : "rgba(124, 79, 240, 0.2)"
                      : "transparent",
                    color: category === cat
                      ? theme === "bright"
                        ? themeColors.neonPurple
                        : "#fff"
                      : themeColors.textMuted,
                    transition: "all 0.2s ease"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Read/Unread Filters */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: `1px solid ${themeColors.cardBorder}`
                }}
              >
                {(["all", "unread", "read"] as ReadFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setReadFilter(filter);
                      setPage(1);
                    }}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: readFilter === filter ? 700 : 500,
                      textTransform: "capitalize",
                      cursor: "pointer",
                      border: "none",
                      background: readFilter === filter
                        ? theme === "bright"
                          ? "#fff"
                          : "rgba(255, 255, 255, 0.08)"
                        : "transparent",
                      color: readFilter === filter ? themeColors.textWhite : themeColors.textMuted,
                      transition: "all 0.2s ease"
                    }}
                  >
                    {filter === "all" ? "All Status" : filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div
            style={{
              position: "relative",
              marginBottom: 24
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: themeColors.textMuted
              }}
            />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                borderRadius: 12,
                background: theme === "bright" ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.02)",
                border: `1px solid ${themeColors.cardBorder}`,
                color: themeColors.textWhite,
                fontSize: 14,
                outline: "none",
                transition: "all 0.2s ease"
              }}
              className="focus:border-purple-500"
            />
          </div>

          {/* Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {loading ? (
              // Skeleton cards while loading
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: themeColors.cardBg,
                    border: `1px solid ${themeColors.cardBorder}`,
                    display: "flex",
                    gap: 16
                  }}
                >
                  <div
                    className="animate-pulse"
                    style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}
                  />
                  <div style={{ flex: 1 }} className="space-y-3 animate-pulse">
                    <div style={{ width: "30%", height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                    <div style={{ width: "70%", height: 16, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                    <div style={{ width: "95%", height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div
                style={{
                  padding: "64px 20px",
                  borderRadius: 16,
                  background: themeColors.cardBg,
                  border: `1px solid ${themeColors.cardBorder}`,
                  textAlign: "center"
                }}
              >
                <Inbox size={48} style={{ margin: "0 auto 16px auto", opacity: 0.3, color: themeColors.neonPurple }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>No notifications found</h3>
                <p style={{ color: themeColors.textMuted, fontSize: 13, marginTop: 6, marginBottom: 0 }}>
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {notifications.map((n) => {
                  const prio = getPriorityStyles(n.priority);
                  return (
                    <motion.div
                      key={n._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      style={{
                        padding: 20,
                        borderRadius: 16,
                        background: n.read
                          ? themeColors.cardBg
                          : theme === "bright"
                          ? "rgba(124, 79, 240, 0.04)"
                          : "rgba(124, 79, 240, 0.05)",
                        border: `1px solid ${
                          n.read
                            ? themeColors.cardBorder
                            : theme === "bright"
                            ? "rgba(124, 79, 240, 0.25)"
                            : "rgba(124, 79, 240, 0.35)"
                        }`,
                        display: "flex",
                        gap: 16,
                        transition: "all 0.2s ease"
                      }}
                    >
                      {/* Left: Category Icon */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: theme === "bright" ? "rgba(124, 79, 240, 0.06)" : "rgba(255,255,255,0.03)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {getCategoryIcon(n.category, n.priority)}
                      </div>

                      {/* Middle: Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            flexWrap: "wrap",
                            marginBottom: 4
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: themeColors.neonPurple
                            }}
                          >
                            {n.category}
                          </span>

                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              textTransform: "uppercase",
                              padding: "2px 8px",
                              borderRadius: 12,
                              background: prio.bg,
                              color: prio.text,
                              border: `1px solid ${prio.border}`
                            }}
                          >
                            {n.priority}
                          </span>

                          <span style={{ fontSize: 11, color: themeColors.textMuted, marginLeft: "auto" }}>
                            {new Date(n.createdAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short"
                            })}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize: 15.5,
                            fontWeight: n.read ? 700 : 800,
                            color: themeColors.textWhite,
                            margin: "4px 0 8px 0"
                          }}
                        >
                          {n.title}
                        </h3>

                        <p
                          style={{
                            fontSize: 13.5,
                            color: n.read ? themeColors.textMuted : themeColors.textWhite,
                            lineHeight: "1.5",
                            margin: 0
                          }}
                        >
                          {n.message}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          justifyContent: "center"
                        }}
                      >
                        {!n.read && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMarkRead(n._id)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: "rgba(16, 185, 129, 0.1)",
                              border: "none",
                              color: "#10b981",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(n._id)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                          title="Delete notification"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginTop: 32
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${themeColors.cardBorder}`,
                  color: page === 1 ? "rgba(255,255,255,0.2)" : themeColors.textWhite,
                  cursor: page === 1 ? "default" : "pointer"
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <span style={{ fontSize: 13.5, color: themeColors.textMuted }}>
                Page <strong style={{ color: themeColors.textWhite }}>{page}</strong> of{" "}
                <strong style={{ color: themeColors.textWhite }}>{totalPages}</strong>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${themeColors.cardBorder}`,
                  color: page === totalPages ? "rgba(255,255,255,0.2)" : themeColors.textWhite,
                  cursor: page === totalPages ? "default" : "pointer"
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
