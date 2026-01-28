"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Dumbbell, Briefcase, CreditCard, TrendingUp, Calendar, PieChart } from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    label: "GYM TRACKING",
    title: "Build consistency with streak tracking",
    description:
      "Visual calendar to track daily workouts. Watch your streak grow and stay motivated with monthly progress stats.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Briefcase,
    label: "JOB APPLICATIONS",
    title: "Organize your job search",
    description:
      "Track applications from initial interest to offer. Monitor status, deadlines, and never miss a follow-up.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: CreditCard,
    label: "SUBSCRIPTIONS",
    title: "Control your spending",
    description:
      "See exactly where your money goes. Track monthly costs, yearly projections, and identify savings opportunities.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
];

const stats = [
  { icon: TrendingUp, value: "30%", label: "Better habit consistency" },
  { icon: Calendar, value: "2x", label: "Faster job search" },
  { icon: PieChart, value: "$240", label: "Average yearly savings" },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative group h-full"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeOut" } }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div
        className={`
          relative h-full p-8 rounded-2xl border border-white/10 bg-white/[0.02]
          hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300
          hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]
        `}
      >
        {/* Gradient background on hover */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${feature.iconColor}`}
          >
            <feature.icon className="w-6 h-6" />
          </div>

          {/* Label */}
          <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
            {feature.label}
          </span>

          {/* Title */}
          <h3 className="mt-3 text-xl font-semibold text-white">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="mt-3 text-white/50 leading-relaxed flex-grow">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <stat.icon className="w-5 h-5 text-primary" />
      </div>
      <div className="text-4xl font-bold text-white">{stat.value}</div>
      <div className="mt-1 text-sm text-white/50">{stat.label}</div>
    </motion.div>
  );
}

export function Features() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-32 bg-background">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0 / 3%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 3%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            Everything you need
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            One dashboard for
            <br />
            your entire life
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-xl mx-auto">
            Track progress, build habits, and stay organized. All your personal
            metrics in one beautiful interface.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-24 items-stretch">
          {features.map((feature, index) => (
            <FeatureCard key={feature.label} feature={feature} index={index} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
