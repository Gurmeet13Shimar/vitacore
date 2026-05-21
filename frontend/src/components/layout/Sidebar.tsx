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
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col relative z-20"
    >
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border h-16">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg shrink-0 shadow-sm">
          VC
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-extrabold text-xl tracking-tight text-sidebar-foreground"
          >
            VitaCore
          </motion.span>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
        data-testid="button-toggle-sidebar"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav 
        className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2"
        onMouseLeave={() => setHoveredPath(null)}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredPath === item.path;
          const isAnyHovered = hoveredPath !== null;
          const shouldFade = isAnyHovered && !isHovered;

          return (
            <Link 
              key={item.path} 
              to={item.path}
              onMouseEnter={() => setHoveredPath(item.path)}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer transition-all duration-300 group ${
                  isActive
                    ? "bg-primary text-primary-foreground border border-primary-border shadow-sm font-semibold"
                    : "text-sidebar-foreground/80 hover:text-primary hover:bg-sidebar-accent"
                } ${shouldFade ? "opacity-35 blur-[0.2px] scale-[0.98]" : "opacity-100 scale-100"}`}
                data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon
                  size={20}
                  className={`shrink-0 transition-colors duration-300 ${
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-sidebar-foreground/60 group-hover:text-primary"
                  }`}
                />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-10 w-10 shrink-0 border border-primary/20 bg-white">
            <AvatarImage src={mockUser.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name || mockUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "Level 1"}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`mt-4 flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors w-full px-4 py-2 rounded-full hover:bg-red-500/10 ${collapsed ? "justify-center" : ""}`}
          data-testid="button-logout"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-semibold">Disconnect</span>}
        </button>
      </div>
    </motion.aside>
  );
}