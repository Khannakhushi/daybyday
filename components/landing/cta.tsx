"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Subtle top border glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(0.65 0.2 25 / 30%), transparent)"
        }}
      />

      <motion.div
        ref={ref}
        className="relative z-10 max-w-2xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
      >
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Ready to get started?
        </h2>

        {/* Description */}
        <p className="mt-4 text-base text-white/40 max-w-md mx-auto">
          Join thousands building better habits with DayByDay.
        </p>

        {/* CTA Button */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/sign-up"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg",
              "bg-primary text-white hover:bg-primary/90 transition-all"
            )}
          >
            Start tracking
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              "px-6 py-3 text-sm font-medium",
              "text-white/50 hover:text-white transition-colors"
            )}
          >
            Sign in
          </Link>
        </motion.div>

        {/* Simple trust text */}
        <p
          className="mt-8 text-xs text-white/40"
          style={{ textShadow: "0 0 20px oklch(0.65 0.2 25 / 60%)" }}
        >
          No credit card required · Free forever for personal use
        </p>
      </motion.div>
    </section>
  );
}
