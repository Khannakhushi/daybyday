"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { type ReactNode } from "react";

// Stagger container for children
export function AnimatedContainer({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { delayChildren: delay, staggerChildren: staggerDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual staggered item
export function AnimatedItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Page wrapper with fade transition
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Card with hover lift effect
export function AnimatedCard({
  children,
  className,
  enableHover = true,
  ...props
}: {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      className={className}
      whileHover={
        enableHover ? { y: -4, transition: { duration: 0.2 } } : undefined
      }
      whileTap={enableHover ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Fade text with optional delay
export function FadeText({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Animated list item for tables/lists
export function AnimatedListItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale in animation for modals/dialogs
export function ScaleIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}
