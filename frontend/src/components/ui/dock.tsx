import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DockItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

interface DockIconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

interface DockProps {
  items: DockItem[];
  className?: string;
}

// ── DockIconButton ─────────────────────────────────────────────────────────────
export const DockIconButton = React.forwardRef<
  HTMLButtonElement,
  DockIconButtonProps
>(({ icon: Icon, label, onClick, className }, ref) => {
  return (
    <div className="relative group flex flex-col items-center">
      {/* Tooltip */}
      <span
        className={cn(
          "absolute -top-9 left-1/2 -translate-x-1/2",
          "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap",
          "bg-slate-800/90 text-white border border-white/10 backdrop-blur-sm",
          "opacity-0 group-hover:opacity-100 pointer-events-none",
          "transition-opacity duration-200",
          "shadow-lg"
        )}
      >
        {label}
        {/* Tooltip arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800/90" />
      </span>

      {/* Icon Button */}
      <motion.button
        ref={ref}
        onClick={onClick}
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "relative flex items-center justify-center",
          "w-11 h-11 rounded-xl",
          "bg-white/[0.07] hover:bg-white/[0.14]",
          "border border-white/[0.10] hover:border-white/[0.20]",
          "text-white/70 hover:text-white",
          "backdrop-blur-sm",
          "transition-colors duration-200",
          "shadow-inner",
          className
        )}
        title={label}
      >
        <Icon size={20} strokeWidth={1.8} />
      </motion.button>
    </div>
  );
});
DockIconButton.displayName = "DockIconButton";

// ── Dock ──────────────────────────────────────────────────────────────────────
export const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    return (
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex"
      >
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-2 px-4 py-3",
            "rounded-2xl",
            "bg-slate-900/90 backdrop-blur-lg",
            "border border-white/[0.10]",
            "shadow-lg hover:shadow-xl",
            "transition-shadow duration-300",
            className
          )}
        >
          {items.map((item, i) => (
            <DockIconButton
              key={i}
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
            />
          ))}
        </div>
      </motion.div>
    );
  }
);
Dock.displayName = "Dock";
