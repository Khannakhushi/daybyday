import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getWorkouts = query({
  args: { userId: v.string(), month: v.number(), year: v.number() },
  handler: async (ctx, args) => {
    const startDate = `${args.year}-${String(args.month).padStart(2, "0")}-01`;
    const endMonth = args.month === 12 ? 1 : args.month + 1;
    const endYear = args.month === 12 ? args.year + 1 : args.year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return workouts.filter(
      (w) => w.date >= startDate && w.date < endDate
    );
  },
});

export const toggleWorkout = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    completed: v.boolean(),
    workoutType: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: args.completed,
        workoutType: args.workoutType,
        notes: args.notes,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("workouts", {
        userId: args.userId,
        date: args.date,
        completed: args.completed,
        workoutType: args.workoutType,
        notes: args.notes,
      });
    }
  },
});

export const getStreak = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const completedDates = workouts
      .filter((w) => w.completed)
      .map((w) => w.date)
      .sort()
      .reverse();

    if (completedDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < completedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split("T")[0];

      if (completedDates.includes(checkDateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },
});

export const getMonthlyStats = query({
  args: { userId: v.string(), month: v.number(), year: v.number() },
  handler: async (ctx, args) => {
    const startDate = `${args.year}-${String(args.month).padStart(2, "0")}-01`;
    const endMonth = args.month === 12 ? 1 : args.month + 1;
    const endYear = args.month === 12 ? args.year + 1 : args.year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const monthWorkouts = workouts.filter(
      (w) => w.date >= startDate && w.date < endDate
    );

    const completed = monthWorkouts.filter((w) => w.completed).length;
    const daysInMonth = new Date(args.year, args.month, 0).getDate();

    return {
      completed,
      total: daysInMonth,
      percentage: Math.round((completed / daysInMonth) * 100),
    };
  },
});
