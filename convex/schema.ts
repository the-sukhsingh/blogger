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
    claps: v.optional(v.number()),
    views: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_status_and_publishedAt", ["status", "publishedAt"])
    .index("by_authorId", ["authorId"]),

  comments: defineTable({
    blogId: v.id("blogs"),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    content: v.string(),
    createdAt: v.number(),
    likes: v.optional(v.number()),
  })
    .index("by_blogId", ["blogId"])
    .index("by_blogId_and_createdAt", ["blogId", "createdAt"]),

  reactions: defineTable({
    blogId: v.id("blogs"),
    reactionType: v.string(),
    count: v.number(),
  })
    .index("by_blogId", ["blogId"])
    .index("by_blogId_and_type", ["blogId", "reactionType"]),

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

  books: defineTable({
    title: v.string(),
    subtitle: v.optional(v.string()),
    slug: v.string(),
    description: v.optional(v.string()),
    author: v.string(),
    authorId: v.optional(v.id("users")),
    coverImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    language: v.string(),
    direction: v.union(v.literal("ltr"), v.literal("rtl")),
    genre: v.optional(v.string()),
    isbn: v.optional(v.string()),
    printSettings: v.object({
      trimSize: v.union(
        v.literal("6x9"),
        v.literal("5.5x8.5"),
        v.literal("7x10"),
        v.literal("a5"),
        v.literal("a4"),
        v.literal("letter")
      ),
      fontFamily: v.union(v.literal("serif"), v.literal("sans"), v.literal("mono")),
      fontSizePt: v.number(),
      lineSpacing: v.number(),
      gutterMarginIn: v.number(),
      outerMarginIn: v.number(),
      justifyText: v.boolean(),
      firstLineIndent: v.boolean(),
      includeToC: v.boolean(),
      showPageNumbers: v.boolean(),
      runningHeaders: v.boolean(),
    }),
    shareToken: v.string(),
    isPublicLinkEnabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_authorId", ["authorId"])
    .index("by_shareToken", ["shareToken"])
    .index("by_updatedAt", ["updatedAt"]),

  bookChapters: defineTable({
    bookId: v.id("books"),
    title: v.string(),
    slug: v.string(),
    order: v.number(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    excerpt: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_bookId", ["bookId"])
    .index("by_bookId_and_order", ["bookId", "order"])
    .index("by_bookId_and_status", ["bookId", "status"]),
});

