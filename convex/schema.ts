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
    .index("by_status_and_publishedAt", ["status", "publishedAt"])
    .index("by_authorId", ["authorId"]),

  apiKeys: defineTable({
    name: v.string(),
    key: v.string(),
    preview: v.string(),
    userId: v.id("users"),
    status: v.union(v.literal("active"), v.literal("revoked")),
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
    totalRequests: v.optional(v.number()),
  })
    .index("by_key", ["key"])
    .index("by_userId", ["userId"])
    .index("by_userId_and_status", ["userId", "status"]),

  apiLogs: defineTable({
    keyId: v.id("apiKeys"),
    userId: v.id("users"),
    endpoint: v.string(),
    method: v.string(),
    status: v.number(),
    ip: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    durationMs: v.optional(v.number()),
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_keyId", ["keyId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_userId_and_timestamp", ["userId", "timestamp"]),
});
