import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Generate a random URL-safe API key string with a distinct prefix
 * e.g. blg_live_8f3a9e1d2c4b5a6f7e8d9c0b1a2f3e4d
 */
function generateKeyString(): string {
  const chars = "abcdef0123456789";
  let randomHex = "";
  for (let i = 0; i < 32; i++) {
    randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `blg_live_${randomHex}`;
}

function makePreview(key: string): string {
  const prefix = key.slice(0, 12);
  const suffix = key.slice(-4);
  return `${prefix}...${suffix}`;
}

/**
 * List all API keys belonging to the currently logged in user.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    let userId = await getAuthUserId(ctx);
    if (!userId) {
      const anyUser = await ctx.db.query("users").first();
      if (anyUser) {
        userId = anyUser._id;
      }
    }

    if (!userId) {
      return [];
    }

    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return keys.map((k) => ({
      _id: k._id,
      name: k.name,
      preview: k.preview,
      status: k.status,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      totalRequests: k.totalRequests || 0,
    }));
  },
});

/**
 * Create a new API key. Returns the full raw key only ONCE upon creation.
 */
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    let userId = await getAuthUserId(ctx);
    if (!userId) {
      const anyUser = await ctx.db.query("users").first();
      if (anyUser) {
        userId = anyUser._id;
      } else {
        userId = await ctx.db.insert("users", {
          name: "Staff Engineer",
          email: "author@beelog.dev",
        });
      }
    }

    const trimmedName = args.name.trim();
    if (!trimmedName) {
      throw new Error("API Key name cannot be empty");
    }

    // Check count of active keys to prevent abuse
    const existing = await ctx.db
      .query("apiKeys")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", userId).eq("status", "active")
      )
      .collect();

    if (existing.length >= 10) {
      throw new Error("Maximum of 10 active API keys allowed per account");
    }

    const rawKey = generateKeyString();
    const preview = makePreview(rawKey);
    const now = Date.now();

    const id = await ctx.db.insert("apiKeys", {
      name: trimmedName,
      key: rawKey,
      preview,
      userId,
      status: "active",
      createdAt: now,
      totalRequests: 0,
    });

    return {
      _id: id,
      name: trimmedName,
      key: rawKey,
      preview,
      createdAt: now,
    };
  },
});

/**
 * Revoke an API key so it can no longer be used for HTTP authorization.
 */
export const revoke = mutation({
  args: {
    id: v.id("apiKeys"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const keyDoc = await ctx.db.get(args.id);
    if (!keyDoc || keyDoc.userId !== userId) {
      throw new Error("API key not found");
    }

    await ctx.db.patch(args.id, {
      status: "revoked",
    });

    return { success: true };
  },
});

/**
 * Delete an API key permanently.
 */
export const remove = mutation({
  args: {
    id: v.id("apiKeys"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const keyDoc = await ctx.db.get(args.id);
    if (!keyDoc || keyDoc.userId !== userId) {
      throw new Error("API key not found");
    }

    // Delete associated logs for this key
    const logs = await ctx.db
      .query("apiLogs")
      .withIndex("by_keyId", (q) => q.eq("keyId", args.id))
      .take(100);

    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Analytics and request history for the developer dashboard.
 */
export const getAnalytics = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let userId = await getAuthUserId(ctx);
    if (!userId) {
      const anyUser = await ctx.db.query("users").first();
      if (anyUser) {
        userId = anyUser._id;
      }
    }

    if (!userId) {
      return {
        totalRequests: 0,
        requestsLast24h: 0,
        successCount: 0,
        errorCount: 0,
        recentLogs: [],
      };
    }

    const limit = args.limit || 50;
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const logs = await ctx.db
      .query("apiLogs")
      .withIndex("by_userId_and_timestamp", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    let requestsLast24h = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const log of logs) {
      if (log.timestamp >= oneDayAgo) {
        requestsLast24h++;
      }
      if (log.status >= 200 && log.status < 400) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    // Get total requests sum across all active keys
    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const totalRequests = keys.reduce((acc, k) => acc + (k.totalRequests || 0), 0);

    return {
      totalRequests,
      requestsLast24h,
      successCount,
      errorCount,
      recentLogs: logs.map((l) => ({
        _id: l._id,
        endpoint: l.endpoint,
        method: l.method,
        status: l.status,
        durationMs: l.durationMs,
        timestamp: l.timestamp,
        userAgent: l.userAgent,
      })),
    };
  },
});

/**
 * Internal mutation called by HTTP action to authenticate an API request,
 * record request logs, update usage metrics, and return the blog author.
 */
export const recordRequest = internalMutation({
  args: {
    apiKey: v.string(),
    endpoint: v.string(),
    method: v.string(),
    status: v.number(),
    ip: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    durationMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const keyDoc = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", (q) => q.eq("key", args.apiKey))
      .unique();

    if (!keyDoc) {
      return { valid: false, reason: "invalid_key", userId: null };
    }

    if (keyDoc.status === "revoked") {
      return { valid: false, reason: "revoked_key", userId: null };
    }

    // Update key stats
    await ctx.db.patch(keyDoc._id, {
      lastUsedAt: now,
      totalRequests: (keyDoc.totalRequests || 0) + 1,
    });

    // Record log entry
    await ctx.db.insert("apiLogs", {
      keyId: keyDoc._id,
      userId: keyDoc.userId,
      endpoint: args.endpoint,
      method: args.method,
      status: args.status,
      ip: args.ip,
      userAgent: args.userAgent,
      durationMs: args.durationMs,
      timestamp: now,
    });

    return {
      valid: true,
      keyId: keyDoc._id,
      userId: keyDoc.userId,
    };
  },
});
