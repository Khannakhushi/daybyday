import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Gym Progress Tracker
  workouts: defineTable({
    userId: v.string(),
    date: v.string(), // ISO date format YYYY-MM-DD
    completed: v.boolean(),
    notes: v.optional(v.string()),
    workoutType: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),

  // Job Application Tracker
  jobApplications: defineTable({
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
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  // Subscription Tracker
  subscriptions: defineTable({
    userId: v.string(),
    name: v.string(),
    amount: v.number(), // monthly cost in cents
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
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),
});
