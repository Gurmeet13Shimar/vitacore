import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { mockUser } from "@/data/mockData";
import {
  LayoutDashboard,
  Heart,
  DollarSign,
  Briefcase,
  Bot,
  Beaker,
  Target,
  Trophy,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/health", label: "Health", icon: Heart },
  { path: "/finance", label: "Finance", icon: DollarSign },
  { path: "/career", label: "Career", icon: Briefcase },
  { path: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { path: "/simulator", label: "Simulator", icon: Beaker },
  { path: "/goals", label: "Goals", icon: Target },
  { path: "/achievements", label: "Achievements", icon: Trophy },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-[#11141E] border-r border-white/5 flex flex-col relative z-20"
    >
      {/* BRANDING HEADER ZONE */}
      <div className="p-4 flex items-center gap-3 border-b border-white/5 h-16">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-[0_4px_15px_rgba(139,92,246,0.25)]">
          VC
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-xl tracking-tight text-white"
          >
            VitaCore
          </motion.span>
        )}
      </div>

      {/* SIDEBAR COLLAPSE TOGGLE BUTTON */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-[#1A1F2C] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors shadow-lg cursor-pointer"
        data-testid="button-toggle-sidebar"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* CORE LINK NAVIGATION LIST */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon
                  size={20}
                  className={`shrink-0 ${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-white"}`}
                />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM FOOTER USER META BLOCK */}
      <div className="p-4 border-t border-white/5 bg-[#0D1018]">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-10 w-10 shrink-0 border border-white/10 shadow-sm">
            <AvatarImage src={mockUser.avatar} className="object-cover" />
            <AvatarFallback className="bg-purple-950 text-purple-400 font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate capitalize">
                {user?.name || mockUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user?.email || "john@gmail.com"}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`mt-4 flex items-center gap-3 text-gray-400 hover:text-rose-400 transition-colors w-full px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-sm font-medium cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
          data-testid="button-logout"
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Disconnect</span>}
        </button>
      </div>
    </motion.aside>
  );
}