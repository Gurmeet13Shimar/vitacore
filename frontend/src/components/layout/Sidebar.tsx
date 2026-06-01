import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { mockUser } from "@/data/mockData";
import {
  LayoutDashboard,
  Heart,
  DollarSign,
  Briefcase,
  Beaker,
  Trophy,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const navItems = [
  { path: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { path: "/health",       label: "Health",       icon: Heart },
  { path: "/finance",      label: "Finance",      icon: DollarSign },
  { path: "/career",       label: "Career",       icon: Briefcase },
  { path: "/simulator",    label: "Simulator",    icon: Beaker },
  { path: "/achievements", label: "Achievements", icon: Trophy },
  { path: "/settings",     label: "Settings",     icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { themeColors, theme } = useTheme();

  return (
    <header
      style={{
        height: 68,
        background: theme === "bright" ? "rgba(255, 255, 255, 0.9)" : "rgba(10, 8, 28, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${themeColors.cardBorder}`,
        boxShadow: theme === "bright" ? "0 4px 24px rgba(0, 0, 0, 0.08)" : "0 4px 24px rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* ── Brand ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "linear-gradient(135deg, #7c3aed, #e91e8c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 14,
            color: "#fff",
            letterSpacing: "-0.02em",
            boxShadow: "0 4px 14px rgba(124, 58, 237, 0.45)",
            flexShrink: 0,
          }}
        >
          VC
        </div>
        <span
          style={{
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-0.03em",
            background: "linear-gradient(90deg, #c4b5fd, #f0abfc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          className="hidden md:block"
        >
          VitaCore
        </span>
      </div>

      {/* ── Navigation Pills ── */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "0 24px",
          overflowX: "auto",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 14px",
                  borderRadius: 999,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13.5,
                  transition: "background 0.2s ease, color 0.2s ease",
                  background: isActive
                    ? theme === "bright"
                      ? `linear-gradient(135deg, rgba(107,92,231,0.85), rgba(212,30,119,0.6))`
                      : `linear-gradient(135deg, rgba(124,58,237,0.85), rgba(233,30,140,0.6))`
                    : "transparent",
                  color: isActive ? themeColors.textWhite : theme === "bright" ? "rgba(107,92,231,0.65)" : "rgba(196, 181, 253, 0.65)",
                  border: isActive
                    ? theme === "bright"
                      ? "1px solid rgba(107,92,231,0.3)"
                      : "1px solid rgba(196, 181, 253, 0.2)"
                    : "1px solid transparent",
                  boxShadow: isActive
                    ? theme === "bright"
                      ? "0 2px 12px rgba(107,92,231,0.2), inset 0 1px 0 rgba(0,0,0,0.08)"
                      : "0 2px 12px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.12)"
                    : "none",
                }}
                data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon
                  size={16}
                  style={{
                    color: isActive ? themeColors.textWhite : theme === "bright" ? "rgba(107,92,231,0.5)" : "rgba(196, 181, 253, 0.5)",
                    flexShrink: 0,
                  }}
                />
                <span className="hidden lg:block">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── Profile & Logout ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 20,
          borderLeft: `1px solid ${themeColors.cardBorder}`,
          flexShrink: 0,
        }}
      >
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: 10 }}
        >
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: themeColors.textWhite,
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || mockUser.name}
            </p>
            <p
              style={{
                fontSize: 11,
                color: themeColors.textMuted,
                display: "flex",
                alignItems: "center",
                gap: 4,
                justifyContent: "flex-end",
              }}
            >
              <Zap size={10} color={themeColors.gold} fill={themeColors.gold} />
              Level {mockUser.level}
            </p>
          </div>
          <Avatar
            style={{
              width: 36,
              height: 36,
              border: "2px solid rgba(139,92,246,0.4)",
              boxShadow: "0 0 0 2px rgba(139,92,246,0.15)",
              flexShrink: 0,
            }}
          >
            <AvatarImage src={mockUser.avatar} />
            <AvatarFallback
              style={{
                background: "linear-gradient(135deg, #7c3aed, #e91e8c)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "transparent",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "rgba(196,181,253,0.5)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          className="hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40"
          title="Disconnect"
          data-testid="button-logout"
        >
          <LogOut size={16} />
        </motion.button>
      </div>
    </header>
  );
}