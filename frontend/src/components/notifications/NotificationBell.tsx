import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Bell,
  Heart,
  DollarSign,
  Briefcase,
  Info,
  Check,
  Trash2,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    deleteNotification
  } = useNotifications();
  const { themeColors, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string, priority: string) => {
    const color =
      priority === "critical"
        ? "#ef4444"
        : priority === "high"
        ? "#f97316"
        : "#a855f7";

    switch (category) {
      case "health":
        return <Heart size={15} style={{ color }} />;
      case "finance":
        return <DollarSign size={15} style={{ color }} />;
      case "career":
        return <Briefcase size={15} style={{ color }} />;
      default:
        return <Info size={15} style={{ color }} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "health":
        return "Health";
      case "finance":
        return "Finance";
      case "career":
        return "Career";
      default:
        return "System";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Preview only the 5 most recent notifications
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* ── Bell Icon Button ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: theme === "bright" ? "rgba(124, 79, 240, 0.08)" : "rgba(255, 255, 255, 0.04)",
          border: `1px solid ${themeColors.cardBorder}`,
          color: themeColors.textWhite,
          cursor: "pointer",
          transition: "all 0.2s ease",
          outline: "none",
        }}
        className="focus:outline-none"
        data-testid="notification-bell"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: "linear-gradient(135deg, #ef4444, #ec4899)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* ── Dropdown Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: 340,
              borderRadius: 16,
              background: theme === "bright" ? "rgba(255, 255, 255, 0.98)" : "rgba(10, 8, 28, 0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${themeColors.cardBorder}`,
              boxShadow: theme === "bright"
                ? "0 10px 30px rgba(124, 79, 240, 0.15)"
                : "0 10px 40px rgba(0, 0, 0, 0.6)",
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: `1px solid ${themeColors.cardBorder}`,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 800, color: themeColors.textWhite, margin: 0 }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: themeColors.neonPurple,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                  className="hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 320, overflowY: "auto" }} className="no-scrollbar">
              {recentNotifications.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    color: themeColors.textMuted,
                    textAlign: "center",
                  }}
                >
                  <Inbox size={28} style={{ marginBottom: 12, opacity: 0.5, color: themeColors.neonPurple }} />
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>All caught up!</p>
                  <p style={{ fontSize: 11, opacity: 0.7, margin: "4px 0 0 0" }}>No new notifications.</p>
                </div>
              ) : (
                recentNotifications.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 16px",
                      borderBottom: `1px solid ${themeColors.cardBorder}`,
                      background: n.read
                        ? "transparent"
                        : theme === "bright"
                        ? "rgba(124, 79, 240, 0.03)"
                        : "rgba(255, 255, 255, 0.02)",
                      transition: "background 0.2s ease",
                      position: "relative",
                    }}
                    className="group"
                  >
                    {/* Category Icon */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: theme === "bright" ? "rgba(124, 79, 240, 0.06)" : "rgba(255, 255, 255, 0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {getCategoryIcon(n.category, n.priority)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: themeColors.textMuted,
                          }}
                        >
                          {getCategoryLabel(n.category)}
                        </span>
                        <span style={{ fontSize: 10, color: themeColors.textMuted }}>
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12.5,
                          fontWeight: n.read ? 600 : 700,
                          color: themeColors.textWhite,
                          margin: "2px 0 4px 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {n.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11.5,
                          color: themeColors.textMuted,
                          margin: 0,
                          lineHeight: "1.4",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {n.message}
                      </p>
                    </div>

                    {/* Quick Actions overlay on hover */}
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        position: "absolute",
                        right: 12,
                        bottom: 12,
                        background: theme === "bright" ? "#fff" : "#0e0d21",
                        borderRadius: 6,
                        padding: "2px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                      }}
                      className="group-hover:opacity-100"
                    >
                      {!n.read && (
                        <button
                          onClick={() => markRead(n._id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 22,
                            height: 22,
                            borderRadius: 4,
                            background: "transparent",
                            border: "none",
                            color: "#10b981",
                            cursor: "pointer",
                          }}
                          className="hover:bg-emerald-500/10"
                          title="Mark read"
                        >
                          <Check size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                        className="hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 16px",
                fontSize: 12.5,
                fontWeight: 700,
                color: themeColors.neonPurple,
                textDecoration: "none",
                background: theme === "bright" ? "rgba(124, 79, 240, 0.02)" : "rgba(255, 255, 255, 0.01)",
                borderTop: `1px solid ${themeColors.cardBorder}`,
                transition: "background 0.2s ease",
              }}
              className="hover:bg-purple-500/5"
            >
              View All Notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
