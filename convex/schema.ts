import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    topics: v.optional(v.array(v.string())),
    author: v.optional(v.string()),
    authorId: v.optional(v.id("users")),
    publishedAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    readingTime: v.optional(v.string()),
    gitBranch: v.optional(v.string()),
    healthScore: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_status_and_publishedAt", ["status", "publishedAt"]),
});
