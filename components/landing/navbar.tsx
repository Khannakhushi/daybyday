"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Navbar() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 bg-background/80 backdrop-blur-md border-b border-white/5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - positioned to the left */}
        <div className="flex-shrink-0 -ml-1">
          <Logo />
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className={cn(
              "px-4 py-2 text-sm font-medium text-white/80 rounded-lg",
              "hover:text-white transition-colors"
            )}
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg",
              "bg-white text-black hover:bg-white/90 transition-colors"
            )}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
