import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobApplications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getByStatus = query({
  args: {
    userId: v.string(),
    status: v.union(
      v.literal("not_applied"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("offer"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobApplications")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", args.userId).eq("status", args.status)
      )
      .collect();
  },
});

export const getUpcoming = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    const jobs = await ctx.db
      .query("jobApplications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return jobs
      .filter((j) => j.dueDate && j.dueDate >= today && j.status === "not_applied")
      .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    companyName: v.string(),
    position: v.string(),
    status: v.union(
      v.literal("not_applied"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("offer"),
      v.literal("rejected")
    ),
    dueDate: v.optional(v.string()),
    appliedDate: v.optional(v.string()),
    jobPostingUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobApplications", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("jobApplications"),
    companyName: v.optional(v.string()),
    position: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("not_applied"),
        v.literal("applied"),
        v.literal("interviewing"),
        v.literal("offer"),
        v.literal("rejected")
      )
    ),
    dueDate: v.optional(v.string()),
    appliedDate: v.optional(v.string()),
    jobPostingUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
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
  args: { id: v.id("jobApplications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobApplications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      total: jobs.length,
      not_applied: jobs.filter((j) => j.status === "not_applied").length,
      applied: jobs.filter((j) => j.status === "applied").length,
      interviewing: jobs.filter((j) => j.status === "interviewing").length,
      offer: jobs.filter((j) => j.status === "offer").length,
      rejected: jobs.filter((j) => j.status === "rejected").length,
    };
  },
});
