import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getViewerId, requireAuth, requireOwner } from "./authz";

function generateShareToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export const DEFAULT_PRINT_SETTINGS = {
  trimSize: "6x9" as const,
  fontFamily: "serif" as const,
  fontSizePt: 11,
  lineSpacing: 1.4,
  gutterMarginIn: 0.75,
  outerMarginIn: 0.5,
  justifyText: true,
  firstLineIndent: true,
  includeToC: true,
  showPageNumbers: true,
  runningHeaders: true,
};

/**
 * List all books.
 * - Anonymous callers can ONLY view published books.
 * - Authenticated callers can view published books and their own drafts.
 */
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const userId = await getViewerId(ctx);
    let books;

    // Anonymous visitors can only see published books
    if (!userId) {
      books = await ctx.db
        .query("books")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .order("desc")
        .collect();
    } else if (args.status === "draft") {
      const drafts = await ctx.db
        .query("books")
        .withIndex("by_status", (q) => q.eq("status", "draft"))
        .order("desc")
        .collect();
      books = drafts.filter((b) => !b.authorId || b.authorId === userId);
    } else if (args.status === "published") {
      books = await ctx.db
        .query("books")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .order("desc")
        .collect();
    } else {
      const all = await ctx.db.query("books").order("desc").collect();
      books = all.filter((b) => b.status === "published" || !b.authorId || b.authorId === userId);
    }

    // Attach chapter count and total word count for scannability
    const booksWithStats = await Promise.all(
      books.map(async (book) => {
        const chapters = await ctx.db
          .query("bookChapters")
          .withIndex("by_bookId", (q) => q.eq("bookId", book._id))
          .collect();

        const totalWords = chapters.reduce((acc, ch) => {
          return acc + (ch.content ? ch.content.split(/\s+/).filter(Boolean).length : 0);
        }, 0);

        return {
          ...book,
          chapterCount: chapters.length,
          totalWords,
        };
      })
    );

    return booksWithStats;
  },
});

/**
 * Get a single book with all its chapters ordered by sequence.
 * Drafts are protected and only readable by author.
 */
export const get = query({
  args: {
    id: v.id("books"),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.id);
    if (!book) return null;

    const userId = await getViewerId(ctx);
    const isAuthor = userId && (!book.authorId || book.authorId === userId);

    if (book.status === "draft" && !isAuthor) {
      return null;
    }

    let chapters = await ctx.db
      .query("bookChapters")
      .withIndex("by_bookId_and_order", (q) => q.eq("bookId", args.id))
      .order("asc")
      .collect();

    // Anonymous readers only see published chapters
    if (!isAuthor) {
      chapters = chapters.filter((ch) => ch.status === "published");
    }

    const totalWords = chapters.reduce((acc, ch) => {
      return acc + (ch.content ? ch.content.split(/\s+/).filter(Boolean).length : 0);
    }, 0);

    return {
      ...book,
      chapters,
      totalWords,
    };
  },
});

/**
 * Get book by its slug.
 * Drafts are protected and only readable by author.
 */
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db
      .query("books")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!book) return null;

    const userId = await getViewerId(ctx);
    const isAuthor = userId && (!book.authorId || book.authorId === userId);

    if (book.status === "draft" && !isAuthor) {
      return null;
    }

    let chapters = await ctx.db
      .query("bookChapters")
      .withIndex("by_bookId_and_order", (q) => q.eq("bookId", book._id))
      .order("asc")
      .collect();

    if (!isAuthor) {
      chapters = chapters.filter((ch) => ch.status === "published");
    }

    return {
      ...book,
      chapters,
    };
  },
});

/**
 * Get book by public share token (allows previewing or reviewing drafts without auth).
 */
export const getByShareToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db
      .query("books")
      .withIndex("by_shareToken", (q) => q.eq("shareToken", args.token))
      .first();

    if (!book) return null;
    if (!book.isPublicLinkEnabled) return null;

    const chapters = await ctx.db
      .query("bookChapters")
      .withIndex("by_bookId_and_order", (q) => q.eq("bookId", book._id))
      .order("asc")
      .collect();

    return {
      ...book,
      chapters,
    };
  },
});

/**
 * Create a new book.
 */
export const create = mutation({
  args: {
    title: v.string(),
    subtitle: v.optional(v.string()),
    slug: v.string(),
    description: v.optional(v.string()),
    author: v.string(),
    coverImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    language: v.string(),
    direction: v.union(v.literal("ltr"), v.literal("rtl")),
    genre: v.optional(v.string()),
    isbn: v.optional(v.string()),
    printSettings: v.optional(
      v.object({
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
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const now = Date.now();
    const shareToken = generateShareToken();

    // Ensure unique slug
    let finalSlug = args.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await ctx.db
      .query("books")
      .withIndex("by_slug", (q) => q.eq("slug", finalSlug))
      .first();

    if (existing) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const bookId = await ctx.db.insert("books", {
      title: args.title,
      subtitle: args.subtitle,
      slug: finalSlug,
      description: args.description,
      author: args.author,
      authorId: userId,
      coverImage: args.coverImage,
      status: args.status,
      language: args.language || "en",
      direction: args.direction || "ltr",
      genre: args.genre,
      isbn: args.isbn,
      printSettings: args.printSettings || DEFAULT_PRINT_SETTINGS,
      shareToken,
      isPublicLinkEnabled: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create Chapter 1 as starter
    await ctx.db.insert("bookChapters", {
      bookId,
      title: "Chapter 1: Foundations",
      slug: "chapter-1-foundations",
      order: 1,
      content: `# Chapter 1: Foundations\n\nBegin writing your chapter here...\n`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    return bookId;
  },
});

/**
 * Update book metadata. Requires ownership.
 */
export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    description: v.optional(v.string()),
    author: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    language: v.optional(v.string()),
    direction: v.optional(v.union(v.literal("ltr"), v.literal("rtl"))),
    genre: v.optional(v.string()),
    isbn: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Book not found");
    }

    const { userId } = await requireOwner(ctx, existing);
    const { id, ...updates } = args;

    const patchData: Record<string, any> = {
      ...updates,
      updatedAt: Date.now(),
    };

    if (!existing.authorId) {
      patchData.authorId = userId;
    }

    await ctx.db.patch(id, patchData);
    return id;
  },
});

/**
 * Update print PDF layout settings. Requires ownership.
 */
export const updatePrintSettings = mutation({
  args: {
    id: v.id("books"),
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Book not found");
    }

    await requireOwner(ctx, existing);

    await ctx.db.patch(args.id, {
      printSettings: args.printSettings,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

/**
 * Toggle public share link and optionally regenerate token. Requires ownership.
 */
export const toggleShareLink = mutation({
  args: {
    id: v.id("books"),
    enabled: v.boolean(),
    regenerateToken: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Book not found");
    }

    await requireOwner(ctx, existing);

    const patch: { isPublicLinkEnabled: boolean; shareToken?: string; updatedAt: number } = {
      isPublicLinkEnabled: args.enabled,
      updatedAt: Date.now(),
    };
    if (args.regenerateToken) {
      patch.shareToken = generateShareToken();
    }
    await ctx.db.patch(args.id, patch);
    return args.id;
  },
});

/**
 * Delete a book and all associated chapters. Requires ownership.
 */
export const remove = mutation({
  args: {
    id: v.id("books"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Book not found");
    }

    await requireOwner(ctx, existing);

    const chapters = await ctx.db
      .query("bookChapters")
      .withIndex("by_bookId", (q) => q.eq("bookId", args.id))
      .collect();

    for (const ch of chapters) {
      await ctx.db.delete(ch._id);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

/**
 * Chapter queries and mutations.
 */
export const listChapters = query({
  args: {
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) return [];

    const userId = await getViewerId(ctx);
    const isAuthor = userId && (!book.authorId || book.authorId === userId);

    if (book.status === "draft" && !isAuthor) {
      return [];
    }

    let chapters = await ctx.db
      .query("bookChapters")
      .withIndex("by_bookId_and_order", (q) => q.eq("bookId", args.bookId))
      .order("asc")
      .collect();

    if (!isAuthor) {
      chapters = chapters.filter((ch) => ch.status === "published");
    }

    return chapters;
  },
});

export const getChapter = query({
  args: {
    id: v.id("bookChapters"),
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.id);
    if (!chapter) return null;

    const book = await ctx.db.get(chapter.bookId);
    if (!book) return null;

    const userId = await getViewerId(ctx);
    const isAuthor = userId && (!book.authorId || book.authorId === userId);

    // If either book or chapter is draft, require author
    if ((chapter.status === "draft" || book.status === "draft") && !isAuthor) {
      return null;
    }

    return {
      ...chapter,
      book,
    };
  },
});

export const createChapter = mutation({
  args: {
    bookId: v.id("books"),
    title: v.string(),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    await requireOwner(ctx, book);

    const existingChapters = await ctx.db
      .query("bookChapters")
      .withIndex("by_bookId_and_order", (q) => q.eq("bookId", args.bookId))
      .order("desc")
      .first();

    const nextOrder = existingChapters ? existingChapters.order + 1 : 1;
    const now = Date.now();
    const slug = args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const chapterId = await ctx.db.insert("bookChapters", {
      bookId: args.bookId,
      title: args.title,
      slug: slug || `chapter-${nextOrder}`,
      order: nextOrder,
      content: args.content || `# ${args.title}\n\n`,
      status: args.status || "draft",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(args.bookId, { updatedAt: now });

    return chapterId;
  },
});

export const updateChapter = mutation({
  args: {
    id: v.id("bookChapters"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    excerpt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.id);
    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const book = await ctx.db.get(chapter.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    await requireOwner(ctx, book);

    const { id, ...updates } = args;
    const now = Date.now();

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });

    await ctx.db.patch(chapter.bookId, { updatedAt: now });

    return id;
  },
});

export const deleteChapter = mutation({
  args: {
    id: v.id("bookChapters"),
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db.get(args.id);
    if (!chapter) return;

    const book = await ctx.db.get(chapter.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    await requireOwner(ctx, book);

    await ctx.db.delete(args.id);
    await ctx.db.patch(chapter.bookId, { updatedAt: Date.now() });
    return args.id;
  },
});

export const reorderChapters = mutation({
  args: {
    chapterOrders: v.array(
      v.object({
        id: v.id("bookChapters"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (args.chapterOrders.length === 0) return;

    const firstChapter = await ctx.db.get(args.chapterOrders[0].id);
    if (firstChapter) {
      const book = await ctx.db.get(firstChapter.bookId);
      if (book) {
        await requireOwner(ctx, book);
      }
    }

    for (const item of args.chapterOrders) {
      await ctx.db.patch(item.id, {
        order: item.order,
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Seed initial sample books if empty.
 */
export const seed = mutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("books").first();
    if (existing && !args.force) return;

    const now = Date.now();

    // Book 1: English - Systems Engineering
    const book1Id = await ctx.db.insert("books", {
      title: "The Architecture of Deterministic Systems",
      subtitle: "A Handbook for Distributed Reliability & Plain-Text Workflows",
      slug: "architecture-deterministic-systems",
      description: "A comprehensive treatise on designing distributed systems with strict state convergence, event replication, and verifiable reliability.",
      author: "Elena Rostova",
      status: "published",
      language: "en",
      direction: "ltr",
      genre: "Computer Science",
      isbn: "978-0-201-63361-0",
      printSettings: DEFAULT_PRINT_SETTINGS,
      shareToken: "det-sys-sample-token-2026",
      isPublicLinkEnabled: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("bookChapters", {
      bookId: book1Id,
      title: "1. The Axiom of Determinism",
      slug: "axiom-of-determinism",
      order: 1,
      content: `# Chapter 1: The Axiom of Determinism\n\nIn computational systems, non-determinism is the root cause of systemic entropy. When two identical operations yield divergent results based purely on subtle temporal deviations, the system ceases to be predictable.\n\n> Determinism is not merely a mathematical virtue; it is the prerequisite for reproducible state transitions and reliable distributed execution.\n\n## Formalizing State Transitions\n\nConsider a state machine defined as $S_{t+1} = f(S_t, I_t)$. If function $f$ possesses hidden variables—such as unsynchronized system clocks or unseeded random generators—state convergence across replicas becomes impossible.\n\n\`\`\`typescript\ninterface StateMachine<S, I> {\n  transition(current: S, input: I): S;\n  verify(initial: S, inputs: I[], target: S): boolean;\n}\n\`\`\`\n\nIn the next section, we explore boundary isolation and causal ordering.\n`,
      status: "published",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("bookChapters", {
      bookId: book1Id,
      title: "2. Causal Consistency and State Replicas",
      slug: "causal-consistency",
      order: 2,
      content: `# Chapter 2: Causal Consistency and State Replicas\n\nDistributed replication does not require total wall-clock synchronization. Instead, establishing happens-before relationships via Lamport timestamps guarantees causal order.\n\n## Lamport Timestamps\n\nEach node increments its local logical counter before broadcasting any mutation:\n\n1. Node increments local clock $C_i = C_i + 1$\n2. Message sent with $(m, C_i)$\n3. Receiver updates $C_j = \\max(C_j, C_i) + 1$\n\nThis simple invariant prevents causal anomalies without requiring coordinated physical clocks.\n`,
      status: "published",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("bookChapters", {
      bookId: book1Id,
      title: "3. Print Typography & Proofing",
      slug: "print-typography",
      order: 3,
      content: `# Chapter 3: Print Typography & Proofing\n\nPreparing a book for physical press requires meticulous attention to page geometry. Unlike responsive digital displays where text reflows continuously, the printed page is an unyielding physical artifact.\n\n## The Geometry of Facing Pages\n\nIn standard 6" x 9" trade paperbacks, the inner margin (gutter) must accommodate the thickness of the spine binding. As page counts increase past 200 pages, the binding swallows between 0.625" and 0.875" of paper width.\n\n- **Verso (Left Page):** Wider right margin for spine binding.\n- **Recto (Right Page):** Wider left margin for spine binding.\n`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    // Book 2: Spanish (Multilingual example)
    const book2Id = await ctx.db.insert("books", {
      title: "El Pensamiento Editorial",
      subtitle: "Principios de escritura técnica y publicación artesanal",
      slug: "el-pensamiento-editorial",
      description: "Una guía profunda sobre el arte de escribir ensayos y libros técnicos con precisión lingüística, claridad conceptual y sobriedad tipográfica.",
      author: "Mateo Silva",
      status: "draft",
      language: "es",
      direction: "ltr",
      genre: "Ensayo & Escritura",
      printSettings: {
        ...DEFAULT_PRINT_SETTINGS,
        trimSize: "5.5x8.5",
        fontFamily: "serif",
      },
      shareToken: "pensamiento-editorial-token",
      isPublicLinkEnabled: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("bookChapters", {
      bookId: book2Id,
      title: "Capítulo 1: La Claridad como Virtud",
      slug: "la-claridad-como-virtud",
      order: 1,
      content: `# Capítulo 1: La Claridad como Virtud\n\nEscribir no consiste en acumular palabras, sino en despejar el camino para el pensamiento ajeno. En el ámbito técnico, la complejidad innecesaria suele ser el síntoma de una comprensión incompleta.\n\n> La sencillez no es el punto de partida, sino la meta alcanzada tras un esfuerzo riguroso de poda y discernimiento.\n\n## El Respeto al Lector\n\nCada párrafo debe justificar su presencia en la página. Cuando retiramos el artificio y los adornos superfluos, lo que queda es la estructura pura del razonamiento.\n`,
      status: "published",
      createdAt: now,
      updatedAt: now,
    });

    return { book1Id, book2Id };
  },
});
