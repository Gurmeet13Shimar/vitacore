import React from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface GlowingShadowProps {
  children: React.ReactNode;
  className?: string;
}

// ── GlowingShadow ─────────────────────────────────────────────────────────────
// A CSS-only orbiting glow card (no styled-jsx in Vite — uses <style> tag injection)
export function GlowingShadow({ children, className }: GlowingShadowProps) {
  return (
    <>
      {/* Global keyframes & component styles injected once */}
      <style>{`
        @property --hue {
          syntax: '<number>';
          inherits: true;
          initial-value: 0;
        }
        @property --rotate {
          syntax: '<angle>';
          inherits: false;
          initial-value: -70deg;
        }
        @property --bg-x {
          syntax: '<percentage>';
          inherits: false;
          initial-value: 0%;
        }
        @property --bg-y {
          syntax: '<percentage>';
          inherits: false;
          initial-value: 0%;
        }
        @property --glow-translate-y {
          syntax: '<length>';
          inherits: false;
          initial-value: 0px;
        }
        @property --bg-size {
          syntax: '<number>';
          inherits: false;
          initial-value: 3;
        }
        @property --glow-opacity {
          syntax: '<number>';
          inherits: false;
          initial-value: 0.7;
        }
        @property --glow-blur {
          syntax: '<length>';
          inherits: false;
          initial-value: 60px;
        }
        @property --glow-scale {
          syntax: '<number>';
          inherits: false;
          initial-value: 1;
        }
        @property --glow-radius {
          syntax: '<length>';
          inherits: false;
          initial-value: 999px;
        }
        @property --white-shadow {
          syntax: '<number>';
          inherits: false;
          initial-value: 0;
        }

        @keyframes hue-animation {
          0%   { --hue: 0; }
          100% { --hue: 360; }
        }
        @keyframes rotate-bg {
          0%   { --bg-x: 0%;   --bg-y: 0%;   }
          25%  { --bg-x: 100%; --bg-y: 0%;   }
          50%  { --bg-x: 100%; --bg-y: 100%; }
          75%  { --bg-x: 0%;   --bg-y: 100%; }
          100% { --bg-x: 0%;   --bg-y: 0%;   }
        }
        @keyframes rotate {
          0%   { --rotate: -70deg; }
          100% { --rotate: 290deg; }
        }
        @keyframes shadow-pulse {
          0%, 100% { --white-shadow: 0; }
          50%       { --white-shadow: 18; }
        }

        .glow-container {
          position: relative;
          width: clamp(260px, 35vw, 520px);
          aspect-ratio: 1.5 / 1;
          border-radius: 24px;
          isolation: isolate;
        }

        .glow {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          animation: rotate 4s linear infinite, hue-animation 8s linear infinite;
          overflow: hidden;
        }

        .glow::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: conic-gradient(
            from var(--rotate) at 50% 50%,
            hsl(calc(var(--hue) * 1deg) 100% 60%) 0deg,
            transparent 60deg,
            transparent 300deg,
            hsl(calc(var(--hue) * 1deg) 100% 60%) 360deg
          );
          filter: blur(var(--glow-blur));
          opacity: var(--glow-opacity);
          transform: scale(var(--glow-scale));
          border-radius: var(--glow-radius);
          transition:
            --glow-blur 0.6s ease,
            --glow-opacity 0.6s ease,
            --glow-scale 0.6s ease,
            --glow-radius 0.6s ease;
        }

        .glow-content {
          position: relative;
          width: 100%;
          height: 100%;
          background: #0d0d14;
          border-radius: 22px;
          overflow: hidden;
          z-index: 1;
          transition: mix-blend-mode 0.3s ease;
        }

        .glow-content::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            circle at calc(var(--bg-x)) calc(var(--bg-y)),
            hsl(calc(var(--hue) * 1deg) 80% 50% / 0.15),
            transparent
          );
          background-size: calc(100% * var(--bg-size)) calc(100% * var(--bg-size));
          animation: rotate-bg 8s linear infinite;
          transition: --bg-size 0.6s ease;
          pointer-events: none;
          z-index: 0;
        }

        .glow-container:hover .glow {
          animation-play-state: paused;
        }
        .glow-container:hover .glow {
          --glow-scale: 2.5;
          --glow-radius: 0;
          animation: hue-animation 8s linear infinite;
        }
        .glow-container:hover .glow-content {
          mix-blend-mode: normal;
          box-shadow: 0 0 calc(var(--white-shadow) * 1px) rgba(255,255,255,0.2);
          animation: shadow-pulse 2s ease infinite;
        }
        .glow-container:hover .glow-content::before {
          --bg-size: 15;
          animation-play-state: paused;
        }
      `}</style>

      <div className={cn("glow-container", className)}>
        <span className="glow" aria-hidden="true" />
        <div className="glow-content flex items-center justify-center">
          {children}
        </div>
      </div>
    </>
  );
}
