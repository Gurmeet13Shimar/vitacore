import React from "react";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaSecondary?: string;
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
}

// ─── Floating Shape ───────────────────────────────────────────────────────────

interface ShapeProps {
  className?: string;
  delay?: number;
  duration?: number;
  rotate?: number;
  size?: number;
  style?: React.CSSProperties;
  variant?: "diamond" | "hexagon" | "circle" | "ring" | "triangle" | "square";
}

const Shape: React.FC<ShapeProps> = ({
  className = "",
  delay = 0,
  duration = 8,
  rotate = 0,
  size = 80,
  style,
  variant = "diamond",
}) => {
  const floatVariant = {
    initial: { opacity: 0, scale: 0.6, rotate },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: rotate + 360,
      y: [0, -18, 0, 12, 0],
      transition: {
        opacity: { duration: 1.2, delay, ease: "easeOut" },
        scale: { duration: 1.2, delay, ease: "easeOut" },
        rotate: {
          duration: duration * 3,
          delay,
          ease: "linear",
          repeat: Infinity,
        },
        y: {
          duration,
          delay,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    },
  };

  const shapeStyles: Record<string, React.CSSProperties> = {
    diamond: {
      width: size,
      height: size,
      transform: "rotate(45deg)",
      borderRadius: "12%",
    },
    hexagon: {
      width: size,
      height: size * 0.866,
      clipPath:
        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    },
    circle: {
      width: size,
      height: size,
      borderRadius: "50%",
    },
    ring: {
      width: size,
      height: size,
      borderRadius: "50%",
      border: `${size * 0.12}px solid currentColor`,
      background: "transparent",
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeft: `${size / 2}px solid transparent`,
      borderRight: `${size / 2}px solid transparent`,
      borderBottom: `${size * 0.866}px solid currentColor`,
      background: "transparent",
    },
    square: {
      width: size,
      height: size,
      borderRadius: "14%",
    },
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ ...style, ...shapeStyles[variant] }}
      variants={floatVariant}
      initial="initial"
      animate="animate"
    />
  );
};

// ─── Hero Geometric ───────────────────────────────────────────────────────────

export const HeroGeometric: React.FC<HeroGeometricProps> = ({
  badge = "Platform",
  title1 = "One Vision.",
  title2 = "Two Worlds.",
  subtitle = "A unified platform for the future.",
  ctaLabel = "Get Started",
  ctaSecondary = "Learn More",
  onCtaClick,
  onSecondaryClick,
}) => {
  return (
    <div className="relative min-h-screen bg-[#08060f] flex items-center justify-center overflow-hidden">
      {/* ── Radial glow background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(109,40,217,0.22) 0%, rgba(59,7,100,0.12) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 20% 70%, rgba(59,130,246,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(236,72,153,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Noise texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Floating Geometric Shapes ── */}

      {/* Left cluster */}
      <Shape
        variant="diamond"
        size={110}
        delay={0}
        duration={9}
        rotate={20}
        style={{ top: "12%", left: "6%", color: "rgba(109,40,217,0.55)" }}
        className="bg-current"
      />
      <Shape
        variant="ring"
        size={70}
        delay={0.4}
        duration={11}
        rotate={0}
        style={{ top: "30%", left: "3%", color: "rgba(139,92,246,0.4)" }}
      />
      <Shape
        variant="hexagon"
        size={55}
        delay={0.8}
        duration={7}
        rotate={10}
        style={{ top: "65%", left: "9%", color: "rgba(59,130,246,0.45)" }}
        className="bg-current"
      />
      <Shape
        variant="circle"
        size={30}
        delay={1.2}
        duration={6}
        rotate={0}
        style={{ top: "80%", left: "18%", color: "rgba(236,72,153,0.5)" }}
        className="bg-current"
      />
      <Shape
        variant="square"
        size={42}
        delay={1.6}
        duration={10}
        rotate={30}
        style={{ top: "48%", left: "13%", color: "rgba(109,40,217,0.3)" }}
        className="bg-current"
      />

      {/* Right cluster */}
      <Shape
        variant="diamond"
        size={95}
        delay={0.2}
        duration={10}
        rotate={-15}
        style={{ top: "8%", right: "7%", color: "rgba(236,72,153,0.5)" }}
        className="bg-current"
      />
      <Shape
        variant="hexagon"
        size={80}
        delay={0.6}
        duration={8}
        rotate={45}
        style={{ top: "38%", right: "4%", color: "rgba(109,40,217,0.45)" }}
        className="bg-current"
      />
      <Shape
        variant="ring"
        size={100}
        delay={1.0}
        duration={13}
        rotate={0}
        style={{ top: "62%", right: "8%", color: "rgba(59,130,246,0.35)" }}
      />
      <Shape
        variant="circle"
        size={36}
        delay={1.4}
        duration={7}
        rotate={0}
        style={{ top: "20%", right: "18%", color: "rgba(139,92,246,0.5)" }}
        className="bg-current"
      />
      <Shape
        variant="square"
        size={50}
        delay={1.8}
        duration={9}
        rotate={-20}
        style={{ top: "78%", right: "15%", color: "rgba(236,72,153,0.3)" }}
        className="bg-current"
      />

      {/* Top & bottom accent shapes */}
      <Shape
        variant="ring"
        size={160}
        delay={0.3}
        duration={15}
        rotate={0}
        style={{
          top: "-60px",
          left: "40%",
          color: "rgba(109,40,217,0.18)",
        }}
      />
      <Shape
        variant="hexagon"
        size={40}
        delay={2}
        duration={8}
        rotate={60}
        style={{ bottom: "10%", left: "35%", color: "rgba(59,130,246,0.4)" }}
        className="bg-current"
      />
      <Shape
        variant="diamond"
        size={28}
        delay={2.2}
        duration={7}
        rotate={0}
        style={{ bottom: "18%", right: "38%", color: "rgba(236,72,153,0.45)" }}
        className="bg-current"
      />

      {/* ── Subtle grid lines ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-widest uppercase"
            style={{
              background:
                "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(59,130,246,0.18))",
              border: "1px solid rgba(139,92,246,0.35)",
              color: "rgba(196,181,253,0.95)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 20px rgba(109,40,217,0.15)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#a78bfa" }}
            />
            {badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="mb-6"
        >
          <h1
            className="font-black leading-[1.08] tracking-tight"
            style={{
              fontSize: "clamp(3rem, 9vw, 7rem)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 40%, #a78bfa 70%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "block",
              }}
            >
              {title1}
            </span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f9a8d4 0%, #f472b6 35%, #a78bfa 65%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "block",
              }}
            >
              {title2}
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="mb-12 max-w-2xl"
          style={{
            fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
            color: "rgba(196,181,253,0.7)",
            lineHeight: "1.7",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCtaClick}
            className="relative overflow-hidden font-bold rounded-xl px-8 py-4 text-base"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #4f46e5 100%)",
              color: "#fff",
              border: "1px solid rgba(196,181,253,0.2)",
              fontFamily: "'Inter', sans-serif",
              boxShadow:
                "0 0 30px rgba(109,40,217,0.4), 0 4px 20px rgba(109,40,217,0.3)",
              cursor: "pointer",
            }}
          >
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            />
            <span className="relative z-10">{ctaLabel}</span>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSecondaryClick}
            className="font-semibold rounded-xl px-8 py-4 text-base"
            style={{
              background: "rgba(139,92,246,0.08)",
              color: "rgba(196,181,253,0.9)",
              border: "1px solid rgba(139,92,246,0.3)",
              backdropFilter: "blur(10px)",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 20px rgba(109,40,217,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.16)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.08)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
            }}
          >
            {ctaSecondary}
          </motion.button>
        </motion.div>

        {/* Bottom glow line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          className="mt-20 w-48 h-px mx-auto"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
          }}
        />
      </div>
    </div>
  );
};

export default HeroGeometric;
