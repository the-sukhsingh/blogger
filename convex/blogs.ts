import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { INITIAL_BLOGS } from "./seedData";

function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * List blogs, optionally filtered by status ('draft' | 'published').
 * Results are ordered from newest to oldest and bounded.
 */
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);

    if (args.status) {
      const status = args.status;
      return await ctx.db
        .query("blogs")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("blogs")
      .order("desc")
      .take(limit);
  },
});

/**
 * Get a single blog by its Convex document ID.
 */
export const getById = query({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get a single blog by its unique slug.
 */
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

/**
 * Get a blog either by its Convex ID or by its slug.
 * Useful for universal route matching.
 */
export const getByIdOrSlug = query({
  args: {
    idOrSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("blogs", args.idOrSlug);
    if (normalizedId) {
      const doc = await ctx.db.get(normalizedId);
      if (doc) return doc;
    }

    return await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.idOrSlug))
      .unique();
  },
});

/**
 * Create a new blog post.
 * If user is authenticated, automatically links author & authorId.
 */
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    topics: v.optional(v.array(v.string())),
    author: v.optional(v.string()),
    readingTime: v.optional(v.string()),
    gitBranch: v.optional(v.string()),
    healthScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error(`Blog with slug "${args.slug}" already exists`);
    }

    const userId = await getAuthUserId(ctx);
    let authorName = args.author;

    if (userId) {
      const user = await ctx.db.get(userId);
      if (user && (!authorName || authorName === "Staff Engineer" || authorName === "Author")) {
        authorName = user.name || user.email || "Author";
      }
    }

    const now = Date.now();
    const readingTime =
      args.readingTime ?? calculateReadingTime(`${args.title} ${args.content}`);
    const publishedAt = args.status === "published" ? now : undefined;

    return await ctx.db.insert("blogs", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      coverImage: args.coverImage,
      status: args.status,
      topics: args.topics,
      author: authorName || "Author",
      authorId: userId ?? undefined,
      readingTime,
      gitBranch: args.gitBranch || "main",
      healthScore: args.healthScore,
      publishedAt,
      updatedAt: now,
    });
  },
});

/**
 * Update an existing blog post.
 */
export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    topics: v.optional(v.array(v.string())),
    author: v.optional(v.string()),
    readingTime: v.optional(v.string()),
    gitBranch: v.optional(v.string()),
    healthScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Blog not found");
    }

    if (args.slug && args.slug !== existing.slug) {
      const slugTaken = await ctx.db
        .query("blogs")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
        .unique();

      if (slugTaken && slugTaken._id !== args.id) {
        throw new Error(`Slug "${args.slug}" is already in use`);
      }
    }

    const now = Date.now();
    let publishedAt = existing.publishedAt;
    if (args.status === "published" && !existing.publishedAt) {
      publishedAt = now;
    }

    const nextTitle = args.title ?? existing.title;
    const nextContent = args.content ?? existing.content;
    const readingTime =
      args.readingTime ??
      (args.title !== undefined || args.content !== undefined
        ? calculateReadingTime(`${nextTitle} ${nextContent}`)
        : existing.readingTime);

    const updateFields: Record<string, unknown> = {
      updatedAt: now,
      publishedAt,
      readingTime,
    };

    if (args.title !== undefined) updateFields.title = args.title;
    if (args.slug !== undefined) updateFields.slug = args.slug;
    if (args.content !== undefined) updateFields.content = args.content;
    if (args.excerpt !== undefined) updateFields.excerpt = args.excerpt;
    if (args.coverImage !== undefined) updateFields.coverImage = args.coverImage;
    if (args.status !== undefined) updateFields.status = args.status;
    if (args.topics !== undefined) updateFields.topics = args.topics;
    if (args.author !== undefined) updateFields.author = args.author;
    if (args.gitBranch !== undefined) updateFields.gitBranch = args.gitBranch;
    if (args.healthScore !== undefined) updateFields.healthScore = args.healthScore;

    const userId = await getAuthUserId(ctx);
    if (userId && !existing.authorId) {
      updateFields.authorId = userId;
    }

    await ctx.db.patch(args.id, updateFields);
    return args.id;
  },
});

/**
 * Publish a draft blog post.
 */
export const publish = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Blog not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: existing.publishedAt ?? now,
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Revert a published blog back to draft.
 */
export const unpublish = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Blog not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: "draft",
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Delete a blog post.
 */
export const remove = mutation({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Blog not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

/**
 * Seed initial sample blogs if none exist, or force-reset seed data.
 */
export const seed = mutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("blogs").take(1);
    if (existing.length > 0 && !args.force) {
      return { seeded: false, count: 0 };
    }

    if (args.force) {
      const all = await ctx.db.query("blogs").take(100);
      for (const item of all) {
        await ctx.db.delete(item._id);
      }
    }

    const now = Date.now();
    let count = 0;

    for (const post of INITIAL_BLOGS) {
      await ctx.db.insert("blogs", {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        topics: post.topics,
        author: post.author,
        readingTime: post.readingTime,
        gitBranch: post.gitBranch,
        healthScore: post.healthScore,
        publishedAt: post.status === "published" ? now - (count * 86400000 * 3) : undefined,
        updatedAt: now - (count * 86400000 * 2),
      });
      count++;
    }

    return { seeded: true, count };
  },
});
