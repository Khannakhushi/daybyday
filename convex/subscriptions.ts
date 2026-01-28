import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getActive = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    amount: v.number(),
    billingCycle: v.union(
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("weekly")
    ),
    category: v.string(),
    nextBillingDate: v.string(),
    isActive: v.boolean(),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subscriptions", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("subscriptions"),
    name: v.optional(v.string()),
    amount: v.optional(v.number()),
    billingCycle: v.optional(
      v.union(
        v.literal("monthly"),
        v.literal("yearly"),
        v.literal("weekly")
      )
    ),
    category: v.optional(v.string()),
    nextBillingDate: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

export const remove = mutation({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, args) => {
    const sub = await ctx.db.get(args.id);
    if (sub) {
      await ctx.db.patch(args.id, { isActive: !sub.isActive });
    }
  },
});

export const getAnalytics = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const subs = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .collect();

    // Calculate monthly total (normalize all cycles to monthly)
    const monthlyTotal = subs.reduce((total, sub) => {
      switch (sub.billingCycle) {
        case "monthly":
          return total + sub.amount;
        case "yearly":
          return total + sub.amount / 12;
        case "weekly":
          return total + sub.amount * 4.33;
        default:
          return total;
      }
    }, 0);

    // Calculate yearly total
    const yearlyTotal = subs.reduce((total, sub) => {
      switch (sub.billingCycle) {
        case "monthly":
          return total + sub.amount * 12;
        case "yearly":
          return total + sub.amount;
        case "weekly":
          return total + sub.amount * 52;
        default:
          return total;
      }
    }, 0);

    // Group by category
    const categoryTotals: Record<string, number> = {};
    subs.forEach((sub) => {
      const monthlyAmount =
        sub.billingCycle === "monthly"
          ? sub.amount
          : sub.billingCycle === "yearly"
            ? sub.amount / 12
            : sub.amount * 4.33;

      if (categoryTotals[sub.category]) {
        categoryTotals[sub.category] += monthlyAmount;
      } else {
        categoryTotals[sub.category] = monthlyAmount;
      }
    });

    const byCategory = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }));

    return {
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
      yearlyTotal: Math.round(yearlyTotal * 100) / 100,
      activeCount: subs.length,
      byCategory,
    };
  },
});
