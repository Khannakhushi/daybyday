"use client";

import { motion, useInView, useSpring, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";
import {
  Dumbbell,
  Briefcase,
  CreditCard,
  Flame,
  TrendingUp,
  Calendar,
  Check
} from "lucide-react";

// Animated counter component
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  delay = 0
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        const duration = 1500;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Easing function for smooth animation
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.floor(eased * value));
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay]);

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// Calendar data - which days are "completed"
const calendarData = [
  false, false, false, false, true, true, false,
  false, true, true, true, true, false, false,
  false, true, true, true, true, true, false,
  false, false, true, true, true, true, false,
];

// Mock dashboard preview
function DashboardPreview() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
      {/* Browser chrome */}
      <motion.div
        className="bg-[#1a1a1a] rounded-t-xl border border-white/10 border-b-0 px-4 py-3 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-1.5">
          <motion.div
            className="w-3 h-3 rounded-full bg-red-500/60"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring" }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-yellow-500/60"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.4, type: "spring" }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500/60"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring" }}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <motion.div
            className="bg-white/5 rounded-md px-4 py-1 text-xs text-white/40"
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "auto" } : {}}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            daybyday.app/dashboard
          </motion.div>
        </div>
      </motion.div>

      {/* Dashboard content */}
      <motion.div
        className="bg-[#0d0d0d] rounded-b-xl border border-white/10 border-t-0 p-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <motion.h2
            className="text-xl font-semibold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Welcome back, User!
          </motion.h2>
          <motion.p
            className="text-sm text-white/50 mt-1"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Here&apos;s your progress this week
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Gym Card */}
          <motion.div
            className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-colors cursor-pointer group"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/50">Gym Progress</span>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <Dumbbell className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
              </motion.div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                <AnimatedNumber value={47} delay={0.8} />
              </span>
              <span className="text-sm text-white/50">day streak</span>
            </div>
            <motion.div
              className="mt-3 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.2 }}
            >
              <Flame className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs text-white/40">Best: 52 days</span>
            </motion.div>
          </motion.div>

          {/* Jobs Card */}
          <motion.div
            className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.05] transition-colors cursor-pointer group"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/50">Job Applications</span>
              <Briefcase className="w-4 h-4 text-blue-400/60 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                <AnimatedNumber value={24} delay={0.9} />
              </span>
              <span className="text-sm text-white/50">total</span>
            </div>
            <motion.div
              className="mt-3 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.3 }}
            >
              <motion.span
                className="text-xs text-emerald-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.4 }}
              >
                3 interviewing
              </motion.span>
              <motion.span
                className="text-xs text-primary"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.5 }}
              >
                1 offer
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Subscriptions Card */}
          <motion.div
            className="bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-primary/30 hover:bg-white/[0.05] transition-colors cursor-pointer group"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/50">Subscriptions</span>
              <CreditCard className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                $<AnimatedNumber value={127} delay={1.0} />
              </span>
              <span className="text-sm text-white/50">/mo</span>
            </div>
            <motion.div
              className="mt-3 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.4 }}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400">-$23 vs last month</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Mini Calendar Preview */}
        <motion.div
          className="mt-4 bg-white/[0.02] rounded-xl p-4 border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.0 }}
          >
            <Calendar className="w-4 h-4 text-white/40" />
            <span className="text-xs text-white/50">January 2026</span>
          </motion.div>
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((isCompleted, i) => (
              <motion.div
                key={i}
                className={`
                  w-6 h-6 rounded text-[10px] flex items-center justify-center relative
                  ${i % 7 === 0 || i % 7 === 6
                    ? "text-white/20"
                    : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-white/30"
                  }
                `}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 1.1 + (i * 0.02),
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={isCompleted ? {
                  scale: 1.2,
                  backgroundColor: "rgba(16, 185, 129, 0.3)",
                  transition: { duration: 0.15 }
                } : {}}
              >
                {i + 1}
                {isCompleted && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 1.5 + (i * 0.02), type: "spring" }}
                  >
                    <Check className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Animated glow effect */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-emerald-500/20 blur-3xl -z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? {
          opacity: [0.2, 0.4, 0.2],
        } : {}}
        transition={{
          delay: 0.5,
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export function Preview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0 / 2%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 2%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-6"
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8 }}
      >
        {/* Label */}
        <div className="text-center mb-12">
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            Your Dashboard
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
            Everything at a glance
          </h2>
        </div>

        <DashboardPreview />
      </motion.div>
    </section>
  );
}
