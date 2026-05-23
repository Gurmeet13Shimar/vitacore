import React from "react";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

// ── Animated Floating Pill ────────────────────────────────────────────────────
function ElegantShape({
  className,
  delay = 0,
  width = 300,
  height = 80,
  rotate = 0,
  gradient = "from-indigo-500/[0.15]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      style={{ width, height }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            `bg-gradient-to-r ${gradient} to-transparent`,
            "backdrop-blur-[2px]",
            "border border-white/[0.15]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Fade Up Animation Variants ────────────────────────────────────────────────
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + custom * 0.15,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

// ── HeroGeometric ─────────────────────────────────────────────────────────────
export function HeroGeometric({
  badge = "VitaCore Digital Twin",
  title1 = "Optimize Your",
  title2 = "Digital Life System",
  subtitle = "Align your Health, Finance, and Career vectors for exponential personal growth.",
  className,
  children,
}: HeroGeometricProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]",
        className
      )}
    >
      {/* ── Vignette Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none z-10" />

      {/* ── Floating Elegant Shapes ── */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={-15}
          gradient="from-indigo-500/[0.15]"
          className="-top-[5%] left-[-5%]"
        />
        <ElegantShape
          delay={0.4}
          width={500}
          height={120}
          rotate={15}
          gradient="from-rose-500/[0.15]"
          className="top-[15%] right-[-3%]"
        />
        <ElegantShape
          delay={0.5}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="top-[40%] left-[8%]"
        />
        <ElegantShape
          delay={0.6}
          width={400}
          height={100}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="bottom-[25%] right-[5%]"
        />
        <ElegantShape
          delay={0.7}
          width={250}
          height={70}
          rotate={-12}
          gradient="from-cyan-500/[0.15]"
          className="bottom-[8%] left-[20%]"
        />
      </div>

      {/* ── Content Block ── */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-sm mb-8"
        >
          <Circle size={8} className="text-rose-400 fill-rose-400" />
          <span className="text-white/70 text-sm font-medium tracking-wide">
            {badge}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
        >
          <span className="block bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            {title1}
          </span>
          <span className="block bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
            {title2}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-white/50 text-lg max-w-2xl leading-relaxed mb-10"
        >
          {subtitle}
        </motion.p>

        {/* Optional children (e.g. CTA buttons) */}
        {children}
      </div>
    </div>
  );
}
