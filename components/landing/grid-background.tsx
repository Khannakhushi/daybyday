"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

// Animated node with glow effect
function GlowNode({
  x,
  y,
  delay = 0,
  size = "sm",
}: {
  x: number;
  y: number;
  delay?: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} rounded-full bg-primary`}
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [0.8, 1.2, 0.8],
        boxShadow: [
          "0 0 10px 2px oklch(0.65 0.2 25 / 40%)",
          "0 0 25px 8px oklch(0.65 0.2 25 / 60%)",
          "0 0 10px 2px oklch(0.65 0.2 25 / 40%)",
        ],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Static grid node (intersection point)
function GridNode({ x, y, visible = true }: { x: number; y: number; visible?: boolean }) {
  if (!visible) return null;
  return (
    <div
      className="absolute w-1.5 h-1.5 border border-white/20 bg-transparent"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    />
  );
}

// Animated connecting line
function ConnectingLine({
  x1,
  y1,
  x2,
  y2,
  delay = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
}) {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <motion.div
      className="absolute h-px origin-left"
      style={{
        left: `${x1}%`,
        top: `${y1}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
        background: "linear-gradient(90deg, oklch(0.65 0.2 25 / 60%), oklch(0.65 0.2 25 / 20%))",
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    />
  );
}

// Cross marker at grid intersection
function CrossMarker({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute text-white/30 text-xs font-light"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      +
    </div>
  );
}

export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0 / 4%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 4%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Grid nodes at intersections */}
      <GridNode x={15} y={20} />
      <GridNode x={25} y={20} />
      <GridNode x={35} y={30} />
      <GridNode x={75} y={15} />
      <GridNode x={85} y={25} />
      <GridNode x={80} y={35} />
      <GridNode x={90} y={45} />
      <GridNode x={85} y={55} />
      <GridNode x={75} y={45} />
      <GridNode x={70} y={55} />
      <GridNode x={80} y={65} />
      <GridNode x={90} y={75} />

      {/* Cross markers */}
      <CrossMarker x={10} y={30} />
      <CrossMarker x={20} y={40} />
      <CrossMarker x={88} y={18} />
      <CrossMarker x={72} y={28} />

      {/* Animated container for lines and nodes - drifts left slowly */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Connecting lines forming a graph pattern on the right side */}
        <ConnectingLine x1={75} y1={15} x2={85} y2={25} delay={0.5} />
        <ConnectingLine x1={85} y1={25} x2={80} y2={35} delay={0.7} />
        <ConnectingLine x1={80} y1={35} x2={90} y2={45} delay={0.9} />
        <ConnectingLine x1={90} y1={45} x2={85} y2={55} delay={1.1} />
        <ConnectingLine x1={85} y1={55} x2={75} y2={45} delay={1.3} />
        <ConnectingLine x1={75} y1={45} x2={70} y2={55} delay={1.5} />
        <ConnectingLine x1={70} y1={55} x2={80} y2={65} delay={1.7} />
        {/* Line extending from bottom node */}
        <ConnectingLine x1={80} y1={65} x2={95} y2={65} delay={1.9} />

        {/* Glowing animated nodes */}
        <GlowNode x={85} y={25} delay={0} size="md" />
        <GlowNode x={90} y={45} delay={0.5} size="lg" />
        <GlowNode x={70} y={55} delay={1} size="md" />
        <GlowNode x={80} y={65} delay={1.5} size="md" />
      </motion.div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 80% 40%, oklch(0.65 0.2 25 / 8%) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, oklch(0.65 0.2 25 / 5%) 0%, transparent 40%)
          `,
        }}
      />
    </div>
  );
}
