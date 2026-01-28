"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    quote:
      "DayByDay helped me build a 90-day gym streak. Seeing my progress visually keeps me motivated to show up every single day.",
    name: "Sarah Chen",
    role: "Software Engineer",
    avatar: "S",
  },
  {
    quote:
      "I landed my dream job using the job tracker. Being able to see all my applications in one place made the process so much less stressful.",
    name: "Marcus Johnson",
    role: "Product Designer",
    avatar: "M",
  },
  {
    quote:
      "I had no idea I was spending $400/month on subscriptions. DayByDay helped me cut that in half within a month.",
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    avatar: "E",
  },
];

function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="none" stroke="white" strokeOpacity="0.05" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Decorative squares */}
      {[
        { x: 20, y: 25, size: 60 },
        { x: 25, y: 30, size: 80 },
        { x: 30, y: 20, size: 60 },
        { x: 35, y: 35, size: 80 },
        { x: 40, y: 25, size: 60 },
        { x: 45, y: 40, size: 80 },
        { x: 50, y: 30, size: 60 },
        { x: 55, y: 45, size: 80 },
        { x: 60, y: 35, size: 60 },
        { x: 65, y: 50, size: 80 },
      ].map((square, i) => (
        <div
          key={i}
          className="absolute border border-white/10 rounded"
          style={{
            left: `${square.x}%`,
            top: `${square.y}%`,
            width: square.size,
            height: square.size,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <GridPattern />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar */}
          <motion.div
            key={activeIndex}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-xl font-semibold text-white mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTestimonial.avatar}
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            key={`quote-${activeIndex}`}
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-white leading-snug max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            &ldquo;{activeTestimonial.quote}&rdquo;
          </motion.blockquote>

          {/* Attribution */}
          <motion.div
            key={`attr-${activeIndex}`}
            className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-left">
              <div className="font-semibold text-white tracking-wide uppercase text-sm">
                {activeTestimonial.name}
              </div>
              <div className="text-white/50 text-sm">
                {activeTestimonial.role}
              </div>
            </div>
          </motion.div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className={`font-mono ${
                    index === activeIndex ? "text-white" : "text-white/30"
                  }`}
                >
                  0{index + 1}
                </span>
                {index === activeIndex && (
                  <motion.div
                    className="h-0.5 bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    transition={{ duration: 6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
