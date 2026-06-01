import React from "react";
import { Sidebar } from "./Sidebar";
import { AIAssistantWidget } from "../shared/AIAssistantWidget";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { themeColors, theme } = useTheme();

  let themeClass = "";
  if (location.pathname === "/health") themeClass = "theme-health";
  else if (location.pathname === "/finance") themeClass = "theme-finance";
  else if (location.pathname === "/career") themeClass = "theme-career";
  else if (location.pathname === "/simulator") themeClass = "theme-simulator";
  else if (location.pathname === "/goals") themeClass = "theme-goals";

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden selection:bg-violet-500/30 text-foreground ${themeClass}`}
      style={{ background: themeColors.background }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <AIAssistantWidget />
    </div>
  );
}