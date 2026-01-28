"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Logo mark */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Inner gradient circle */}
        <motion.div
          className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-primary via-primary to-orange-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute w-5 h-5 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="absolute -top-1 -left-1 w-3 h-3 bg-white/40 rounded-full blur-sm"
            animate={{
              x: [0, 2, 0],
              y: [0, 2, 0],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Pulse on hover */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/50 opacity-0 group-hover:opacity-100"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </div>

      {/* Logo text */}
      <motion.span
        className="text-lg font-semibold text-white tracking-tight"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        DayByDay
      </motion.span>
    </Link>
  );
}
