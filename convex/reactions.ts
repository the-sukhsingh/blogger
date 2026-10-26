import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all reactions for a blog.
 */
export const get = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db
      .query("reactions")
      .withIndex("by_blogId", (q) => q.eq("blogId", args.blogId))
      .take(20);

    const counts: Record<string, number> = {
      clap: 0,
      sparkle: 0,
      insightful: 0,
      bookmark: 0,
    };

    for (const r of list) {
      counts[r.reactionType] = r.count;
    }

    return counts;
  },
});

/**
 * Add / increment a reaction for a blog post.
 */
export const add = mutation({
  args: {
    blogId: v.id("blogs"),
    reactionType: v.union(
      v.literal("clap"),
      v.literal("sparkle"),
      v.literal("insightful"),
      v.literal("bookmark")
    ),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const delta = Math.max(args.amount ?? 1, 1);

    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_blogId_and_type", (q) =>
        q.eq("blogId", args.blogId).eq("reactionType", args.reactionType)
      )
      .unique();

    let newCount = delta;
    if (existing) {
      newCount = existing.count + delta;
      await ctx.db.patch(existing._id, { count: newCount });
    } else {
      await ctx.db.insert("reactions", {
        blogId: args.blogId,
        reactionType: args.reactionType,
        count: delta,
      });
    }

    // If reactionType is "clap", also update blog doc's claps field for fast sorting
    if (args.reactionType === "clap") {
      const blog = await ctx.db.get(args.blogId);
      if (blog) {
        await ctx.db.patch(args.blogId, {
          claps: (blog.claps || 0) + delta,
        });
      }
    }

    return newCount;
  },
});
