import React from "react";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export function AppLayout({ 
  children, 
  theme = "default" 
}: { 
  children: React.ReactNode; 
  theme?: "default" | "health" | "career" | "finance";
}) {
  const location = useLocation();

  const themeClass = 
    theme === "health" 
      ? "theme-health" 
      : theme === "career" 
      ? "theme-career" 
      : "theme-default";

  return (
    <div className={`flex h-screen bg-background overflow-hidden selection:bg-primary/30 text-foreground ${themeClass}`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10 pointer-events-none" />
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
    </div>
  );
}