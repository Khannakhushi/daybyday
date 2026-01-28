"use client";

import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative py-12 bg-background border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Logo />

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-white/50">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} DayByDay
          </div>
        </div>
      </div>
    </footer>
  );
}
