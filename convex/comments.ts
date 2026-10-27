import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireOwner, requireAuth } from "./authz";

/**
 * List comments for an article, ordered from oldest to newest or newest to oldest.
 */
export const list = query({
  args: {
    blogId: v.id("blogs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);
    return await ctx.db
      .query("comments")
      .withIndex("by_blogId", (q) => q.eq("blogId", args.blogId))
      .order("desc")
      .take(limit);
  },
});

/**
 * Add a comment to an article.
 */
export const add = mutation({
  args: {
    blogId: v.id("blogs"),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmedContent = args.content.trim();
    if (!trimmedContent) {
      throw new Error("Comment content cannot be empty");
    }

    const trimmedAuthor = args.authorName.trim() || "Anonymous Reader";
    const now = Date.now();

    return await ctx.db.insert("comments", {
      blogId: args.blogId,
      authorName: trimmedAuthor,
      authorAvatar: args.authorAvatar,
      content: trimmedContent,
      createdAt: now,
      likes: 0,
    });
  },
});

/**
 * Upvote / like a comment.
 */
export const like = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const nextLikes = (comment.likes || 0) + 1;
    await ctx.db.patch(args.commentId, { likes: nextLikes });
    return nextLikes;
  },
});

/**
 * Delete a comment. Requires blog author ownership.
 */
export const remove = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const blog = await ctx.db.get(comment.blogId);
    if (blog) {
      await requireOwner(ctx, blog);
    } else {
      await requireAuth(ctx);
    }

    await ctx.db.delete(args.commentId);
    return args.commentId;
  },
});
