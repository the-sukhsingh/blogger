import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// Mount Convex Auth routes (/api/auth/*)
auth.addHttpRoutes(http);

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

function extractApiKey(request: Request): string | null {
  // 1. Check Authorization: Bearer <key>
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1].trim();
    }
    // Also accept raw token in authorization header if user omitted Bearer
    if (parts.length === 1 && parts[0].startsWith("blg_")) {
      return parts[0].trim();
    }
  }

  // 2. Check x-api-key header
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey) {
    return xApiKey.trim();
  }

  // 3. Check query param ?api_key=<key>
  const url = new URL(request.url);
  const paramKey = url.searchParams.get("api_key") || url.searchParams.get("key");
  if (paramKey) {
    return paramKey.trim();
  }

  return null;
}

// ---------------------------------------------------------------------------
// OPTIONS: CORS Preflight
// ---------------------------------------------------------------------------
const corsPreflight = httpAction(async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
});

http.route({
  path: "/api/v1/blogs",
  method: "OPTIONS",
  handler: corsPreflight,
});

http.route({
  path: "/api/v1/blogs/get",
  method: "OPTIONS",
  handler: corsPreflight,
});

http.route({
  path: "/api/v1/me",
  method: "OPTIONS",
  handler: corsPreflight,
});

// ---------------------------------------------------------------------------
// GET /api/v1/blogs: Fetch published or draft blogs for authenticated caller
// ---------------------------------------------------------------------------
http.route({
  path: "/api/v1/blogs",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const startTime = Date.now();
    const apiKey = extractApiKey(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    if (!apiKey) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message:
              "Missing API key. Provide your key via 'Authorization: Bearer <key>' or 'x-api-key' header.",
            docs: "https://beelog.dev/docs#api-reference",
          },
        },
        401
      );
    }

    // Authenticate and record request log
    const authResult = await ctx.runMutation(internal.apiKeys.recordRequest, {
      apiKey,
      endpoint: "/api/v1/blogs",
      method: "GET",
      status: 200,
      userAgent,
      durationMs: Date.now() - startTime,
    });

    if (!authResult.valid || !authResult.userId) {
      const isRevoked = authResult.reason === "revoked_key";
      return jsonResponse(
        {
          success: false,
          error: {
            code: isRevoked ? "KEY_REVOKED" : "INVALID_KEY",
            message: isRevoked
              ? "The provided API key has been revoked. Generate a new key in your dashboard."
              : "Invalid API key.",
          },
        },
        401
      );
    }

    // Parse query params
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status") || "published";
    const topic = url.searchParams.get("topic") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    const validStatus =
      statusParam === "all" || statusParam === "draft" || statusParam === "published"
        ? (statusParam as "all" | "draft" | "published")
        : "published";

    // Query user's articles
    const blogs = await ctx.runQuery(internal.blogs.getBlogsForApi, {
      userId: authResult.userId,
      status: validStatus,
      topic,
      limit: isNaN(limit) ? 50 : limit,
    });

    return jsonResponse({
      success: true,
      data: blogs.map((b) => ({
        id: b._id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt || "",
        content: b.content,
        status: b.status,
        topics: b.topics || [],
        author: b.author || "Staff",
        readingTime: b.readingTime || "5 min read",
        publishedAt: b.publishedAt,
        updatedAt: b.updatedAt,
        healthScore: b.healthScore,
      })),
      meta: {
        count: blogs.length,
        status: validStatus,
        topic: topic || null,
        timestamp: Date.now(),
      },
    });
  }),
});

// ---------------------------------------------------------------------------
// GET /api/v1/blogs/get: Fetch a single blog by slug or ID
// ---------------------------------------------------------------------------
http.route({
  path: "/api/v1/blogs/get",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const startTime = Date.now();
    const apiKey = extractApiKey(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    if (!apiKey) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing API key.",
          },
        },
        401
      );
    }

    const authResult = await ctx.runMutation(internal.apiKeys.recordRequest, {
      apiKey,
      endpoint: "/api/v1/blogs/get",
      method: "GET",
      status: 200,
      userAgent,
      durationMs: Date.now() - startTime,
    });

    if (!authResult.valid || !authResult.userId) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "INVALID_KEY",
            message: "Invalid or revoked API key.",
          },
        },
        401
      );
    }

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const id = url.searchParams.get("id");
    const idOrSlug = slug || id;

    if (!idOrSlug) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Missing query parameter: 'slug' or 'id' is required.",
          },
        },
        400
      );
    }

    const blog = await ctx.runQuery(internal.blogs.getBlogForApi, {
      userId: authResult.userId,
      idOrSlug,
    });

    if (!blog) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Blog with identifier '${idOrSlug}' was not found.`,
          },
        },
        404
      );
    }

    return jsonResponse({
      success: true,
      data: {
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || "",
        content: blog.content,
        status: blog.status,
        topics: blog.topics || [],
        author: blog.author || "Staff",
        readingTime: blog.readingTime || "5 min read",
        publishedAt: blog.publishedAt,
        updatedAt: blog.updatedAt,
        healthScore: blog.healthScore,
      },
    });
  }),
});

// ---------------------------------------------------------------------------
// GET /api/v1/me: Verify credentials and check active API key details
// ---------------------------------------------------------------------------
http.route({
  path: "/api/v1/me",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const startTime = Date.now();
    const apiKey = extractApiKey(request);

    if (!apiKey) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing API key.",
          },
        },
        401
      );
    }

    const authResult = await ctx.runMutation(internal.apiKeys.recordRequest, {
      apiKey,
      endpoint: "/api/v1/me",
      method: "GET",
      status: 200,
      durationMs: Date.now() - startTime,
    });

    if (!authResult.valid || !authResult.userId) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "INVALID_KEY",
            message: "Invalid or revoked API key.",
          },
        },
        401
      );
    }

    return jsonResponse({
      success: true,
      data: {
        status: "active",
        userId: authResult.userId,
        timestamp: Date.now(),
      },
    });
  }),
});

export default http;
