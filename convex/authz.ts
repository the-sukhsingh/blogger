import type { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

/**
 * Return the current authenticated user's ID, or null if anonymous.
 */
export async function getViewerId(
  ctx: QueryCtx | MutationCtx
): Promise<Id<"users"> | null> {
  return await getAuthUserId(ctx);
}

/**
 * Require the caller to be authenticated.
 * Throws an Unauthorized error if anonymous.
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized: Please sign in to perform this action.");
  }
  return userId;
}

/**
 * Enforce that the current caller owns the given document.
 * Checks authorId or userId on the document.
 * If the document is unowned (e.g. initial demo/seed data), allows any
 * authenticated user to manage it, but blocks unauthenticated callers.
 */
export async function requireOwner<
  T extends { _id: any; authorId?: Id<"users">; userId?: Id<"users"> }
>(
  ctx: QueryCtx | MutationCtx,
  doc: T | null,
  errorMessage = "Forbidden: You do not have permission to modify this resource."
): Promise<{ doc: T; userId: Id<"users"> }> {
  if (!doc) {
    throw new Error("Resource not found");
  }

  const currentUserId = await requireAuth(ctx);
  const ownerId = doc.authorId ?? doc.userId;

  if (ownerId && ownerId !== currentUserId) {
    throw new Error(errorMessage);
  }

  return { doc, userId: currentUserId };
}
