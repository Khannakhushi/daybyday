"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { GridBackground } from "./grid-background";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <GridBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Link
            href="#features"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-white/5 border border-white/10 text-sm text-white/80",
              "hover:bg-white/10 transition-colors group"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-medium tracking-wide uppercase text-xs">
              Track your life, one day at a time
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Your personal
          <br />
          <span className="text-white">life dashboard</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Unify your gym progress, job applications, and subscriptions.
          <br className="hidden sm:block" />
          Track what matters. Build better habits. Achieve your goals.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {/* Glowing button wrapper */}
          <div className="relative group">
            {/* Animated glow ring - outer blur */}
            <motion.div
              className="absolute -inset-[3px] rounded-xl bg-gradient-to-r from-primary via-orange-400 to-primary blur-md"
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Inner glow border */}
            <motion.div
              className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-primary via-orange-400 to-primary"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Link
              href="/sign-up"
              className={cn(
                "relative px-8 py-3.5 text-base font-medium rounded-xl",
                "bg-background text-white hover:bg-background/80 transition-all",
                "block border border-transparent"
              )}
            >
              Start tracking
            </Link>
          </div>
          <Link
            href="/sign-in"
            className={cn(
              "px-8 py-3.5 text-base font-medium rounded-lg",
              "bg-white/5 text-white border border-white/10",
              "hover:bg-white/10 transition-colors"
            )}
          >
            Sign in
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
