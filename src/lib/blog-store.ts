import type { DiffLine } from '#/components/ui/diff-viewer'

export interface ArticleHealthMetrics {
  content: number
  seo: number
  aeo: number
  links: number
  freshness: number
  technical: number
}

export interface ProposedDiff {
  id: string
  title: string
  description: string
  lines: DiffLine[]
  status: 'pending' | 'accepted' | 'rejected'
}

export interface SeoAnalysis {
  title: string
  description: string
  primaryKeyword: string
  searchIntent: string
  headingCount: number
  readabilityScore: number
  insights: string[]
}

export interface AeoAnalysis {
  readinessScore: number
  primaryQuestion: string
  directAnswerSnippet: string
  definitionFound: boolean
  definitionPosition: 'early' | 'middle' | 'late' | 'missing'
  structuredEvidence: boolean
  recommendations: string[]
}

export interface InternalLinkItem {
  targetId: string
  targetTitle: string
  targetSlug: string
  phrase: string
}

export interface InternalLinkSuggestion {
  targetId: string
  targetTitle: string
  targetSlug: string
  phrase: string
  reason: string
}

export interface RevisionHistoryItem {
  id: string
  timestamp: string
  summary: string
  author: string
  gitCommit?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  updatedAt: string
  readingTime: string
  gitBranch: string
  commitHash: string
  status: 'published' | 'draft' | 'needs-review'
  topics: string[]
  entities: string[]
  healthScore: number
  healthMetrics: ArticleHealthMetrics
  isStale: boolean
  staleReason?: string
  proposedDiffs: ProposedDiff[]
  seo: SeoAnalysis
  aeo: AeoAnalysis
  internalLinks: {
    outbound: InternalLinkItem[]
    suggestions: InternalLinkSuggestion[]
  }
  revisionHistory: RevisionHistoryItem[]
}

const STORAGE_KEY = 'blog_changer_articles_v1'

export const SEED_ARTICLES: Article[] = [
  {
    id: 'mcp-server-typescript',
    slug: 'building-an-mcp-server-with-typescript',
    title:
      'Building an MCP Server with TypeScript: Architecture & Protocol Deep-Dive',
    excerpt:
      'A production-grade guide to implementing the Model Context Protocol (MCP) using TypeScript, structured JSON-RPC, and secure local tool execution.',
    publishedAt: '2 days ago',
    updatedAt: '2026-10-06 14:22',
    readingTime: '7 min read',
    gitBranch: 'main',
    commitHash: '7f91a2e',
    status: 'published',
    topics: ['MCP', 'TypeScript', 'AI Agents', 'JSON-RPC'],
    entities: [
      '@modelcontextprotocol/sdk',
      'StdioServerTransport',
      'Zod',
      'Claude Desktop',
    ],
    healthScore: 94,
    healthMetrics: {
      content: 95,
      seo: 92,
      aeo: 96,
      links: 90,
      freshness: 98,
      technical: 93,
    },
    isStale: false,
    proposedDiffs: [],
    seo: {
      title:
        'Building an MCP Server with TypeScript: Complete Protocol Architecture',
      description:
        'Step-by-step engineering guide to creating an MCP server with TypeScript, type-safe tool schemas, and local transport handlers.',
      primaryKeyword: 'mcp server typescript',
      searchIntent: 'How-to & Architecture Implementation',
      headingCount: 6,
      readabilityScore: 88,
      insights: [
        'Primary concept definition appears within the first 120 words.',
        'High code-to-text density provides concrete developer value.',
        'Heading structure mirrors standard developer debugging workflow.',
      ],
    },
    aeo: {
      readinessScore: 96,
      primaryQuestion: 'How do I build an MCP server in TypeScript?',
      directAnswerSnippet:
        'To build an MCP server in TypeScript, initialize Server from @modelcontextprotocol/sdk/server, register tools with Zod schemas, and bind to StdioServerTransport for local execution.',
      definitionFound: true,
      definitionPosition: 'early',
      structuredEvidence: true,
      recommendations: [
        'Definition is placed upfront for instant answer extraction.',
        'Structured tool definitions enable LLMs to cite parameter schemas accurately.',
      ],
    },
    internalLinks: {
      outbound: [
        {
          targetId: 'vector-databases-rag',
          targetTitle: 'Understanding Vector Databases and Embeddings in RAG',
          targetSlug: 'understanding-vector-databases-and-embeddings-in-rag',
          phrase: 'vector databases and RAG systems',
        },
      ],
      suggestions: [
        {
          targetId: 'production-security-rag',
          targetTitle: 'Production Security for RAG Applications',
          targetSlug: 'production-security-for-rag-applications',
          phrase: 'secure execution contexts',
          reason:
            'Connects tool invocation security to your dedicated RAG security architecture guide.',
        },
      ],
    },
    revisionHistory: [
      {
        id: 'rev-1',
        timestamp: '2026-10-06 14:22',
        summary:
          'Initial publication with @modelcontextprotocol/sdk v1.0.0 examples',
        author: 'Staff Engineer',
        gitCommit: '7f91a2e',
      },
    ],
    content: `# Building an MCP Server with TypeScript: Architecture & Protocol Deep-Dive

The **Model Context Protocol (MCP)** is an open protocol created by Anthropic that standardizes how AI applications securely connect to external tools, databases, and contextual data sources over JSON-RPC 2.0. Rather than writing custom API wrappers for every LLM client, an MCP server provides a standardized capability manifest.

In this guide, we walk through building a production-ready MCP server using TypeScript and Node.js that exposes local filesystem tools and computational helpers.

> **Design Note:** A strong technical article answers the core question within the opening paragraphs before diving into deep configuration details.

---

## Architecture Overview

At a high level, the protocol establishes a client-server relationship:

\`\`\`text
┌─────────────────┐       JSON-RPC 2.0 (stdio / SSE)       ┌──────────────────┐
│   Host Client   │ ──────────────────────────────────────▶ │    MCP Server    │
│ (Claude / IDE)  │ ◀────────────────────────────────────── │  (Node / TS)     │
└─────────────────┘                                         └──────────────────┘
         │                                                            │
         ▼                                                            ▼
   Context Window                                              Local Resources
\`\`\`

The server specifies capabilities during the \`initialize\` handshake:
- **Tools**: Executable functions callable by the model (e.g. running queries, transforming code).
- **Resources**: Read-only context URIs (e.g. \`file:///logs/today.log\`).
- **Prompts**: Parameterized prompt templates that users can trigger.

---

## 1. Setting Up the Project

Create a new directory and initialize the TypeScript project:

\`\`\`bash
mkdir mcp-ts-server && cd mcp-ts-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx
npx tsc --init
\`\`\`

Configure your \`tsconfig.json\` to target modern Node.js:

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
\`\`\`

---

## 2. Implementing the Server Core

Create \`src/index.ts\`. We instantiate the \`Server\` class and configure \`StdioServerTransport\`:

\`\`\`typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
  {
    name: "ts-article-tools",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tool Discovery Handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculate_health_score",
        description: "Evaluates article metrics including freshness and technical cohesion",
        inputSchema: {
          type: "object",
          properties: {
            wordCount: { type: "number" },
            codeBlockCount: { type: "number" },
          },
          required: ["wordCount"],
        },
      },
    ],
  };
});
\`\`\`

---

## 3. Tool Execution & Error Handling

Handling tool invocations requires validating arguments and returning structured text or image content payloads:

\`\`\`typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "calculate_health_score") {
    const wordCount = Number(args?.wordCount) || 0;
    const codeCount = Number(args?.codeBlockCount) || 0;
    const score = Math.min(100, Math.round((wordCount / 500) * 40 + codeCount * 15));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ score, rating: score > 80 ? "Optimal" : "Review Needed" }),
        },
      ],
    };
  }

  throw new Error(\`Unknown tool: \${name}\`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
\`\`\`

---

## Key Takeaways

1. **Stdio is ideal for local tools**: For desktop clients, stdio avoids port collision and authentication complexity.
2. **Deterministic Schemas**: Use strict Zod validation so the LLM receives immediate syntactic error feedback if parameters are missing.
3. **Contextual Linking**: If your server interacts with vector databases or external indices, refer to our companion post on vector databases and RAG systems for indexing patterns.
`,
  },
  {
    id: 'vector-databases-rag',
    slug: 'understanding-vector-databases-and-embeddings-in-rag',
    title: 'Understanding Vector Databases and Embeddings in RAG',
    excerpt:
      'An intuitive yet mathematically rigorous breakdown of vector similarity, embedding spaces, and retrieval augmented generation pitfalls.',
    publishedAt: '2 months ago',
    updatedAt: '2026-08-12 10:15',
    readingTime: '9 min read',
    gitBranch: 'main',
    commitHash: '4a1b8c0',
    status: 'needs-review',
    topics: ['Vector DB', 'Embeddings', 'RAG', 'AI Agents'],
    entities: ['ChromaDB', 'pgvector', 'HNSW', 'Cosine Similarity'],
    healthScore: 68,
    healthMetrics: {
      content: 85,
      seo: 72,
      aeo: 65,
      links: 82,
      freshness: 48,
      technical: 74,
    },
    isStale: true,
    staleReason:
      'ChromaDB client API updated from v0.3 to v0.5 with breaking async changes; pgvector syntax requires HNSW index updates.',
    proposedDiffs: [
      {
        id: 'diff-chroma-update',
        title: 'Update ChromaDB Client Instantiation & Async Queries',
        description:
          'ChromaDB 0.5+ migrated from sync collections to asynchronous promises and updated distance metric enum names.',
        status: 'pending',
        lines: [
          {
            type: 'unchanged',
            oldLineNumber: 42,
            newLineNumber: 42,
            content: '// Querying similar documents from the knowledge store',
          },
          {
            type: 'deletion',
            oldLineNumber: 43,
            content: 'const client = new ChromaClient();',
          },
          {
            type: 'deletion',
            oldLineNumber: 44,
            content:
              'const collection = client.getOrCreateCollection({ name: "articles" });',
          },
          {
            type: 'addition',
            newLineNumber: 43,
            content:
              'const client = new ChromaClient({ path: process.env.CHROMA_URL });',
          },
          {
            type: 'addition',
            newLineNumber: 44,
            content:
              'const collection = await client.getOrCreateCollection({ name: "articles", metadata: { "hnsw:space": "cosine" } });',
          },
          {
            type: 'unchanged',
            oldLineNumber: 45,
            newLineNumber: 45,
            content: 'const results = await collection.query({',
          },
          {
            type: 'deletion',
            oldLineNumber: 46,
            content: '  queryTexts: ["vector database indexing"],',
          },
          {
            type: 'addition',
            newLineNumber: 46,
            content: '  queryTexts: ["vector database indexing"],',
          },
          {
            type: 'addition',
            newLineNumber: 47,
            content: '  nResults: 5,',
          },
          {
            type: 'unchanged',
            oldLineNumber: 47,
            newLineNumber: 48,
            content: '});',
          },
        ],
      },
    ],
    seo: {
      title: 'Understanding Vector Databases and Embeddings in RAG',
      description:
        'A comprehensive exploration of high-dimensional embeddings, HNSW index mechanics, and vector database trade-offs in modern RAG systems.',
      primaryKeyword: 'vector databases embeddings rag',
      searchIntent: 'Conceptual & Practical Architecture',
      headingCount: 5,
      readabilityScore: 78,
      insights: [
        'Main definition appears in paragraph 3 instead of paragraph 1.',
        'High reader dwell time, but external library versions need refreshing.',
      ],
    },
    aeo: {
      readinessScore: 65,
      primaryQuestion: 'What is a vector database in RAG?',
      directAnswerSnippet:
        'A vector database is a specialized storage engine optimized for indexing and nearest-neighbor similarity searches across high-dimensional numerical vectors generated by embedding models.',
      definitionFound: true,
      definitionPosition: 'middle',
      structuredEvidence: true,
      recommendations: [
        'Move the vector database definition to the very first section for direct answer extraction.',
        'Update outdated ChromaDB code samples to prevent hallucinated deprecations by AI models.',
      ],
    },
    internalLinks: {
      outbound: [
        {
          targetId: 'production-security-rag',
          targetTitle: 'Production Security for RAG Applications',
          targetSlug: 'production-security-for-rag-applications',
          phrase: 'RAG security considerations',
        },
      ],
      suggestions: [
        {
          targetId: 'mcp-server-typescript',
          targetTitle: 'Building an MCP Server with TypeScript',
          targetSlug: 'building-an-mcp-server-with-typescript',
          phrase: 'external tools and context sources',
          reason: 'Link context sources to your practical MCP server guide.',
        },
      ],
    },
    revisionHistory: [
      {
        id: 'rev-0',
        timestamp: '2026-08-12 10:15',
        summary: 'Initial draft published',
        author: 'Principal Architect',
        gitCommit: '4a1b8c0',
      },
    ],
    content: `# Understanding Vector Databases and Embeddings in RAG

When building retrieval augmented generation (RAG) applications, standard keyword searches like BM25 fail when users query concepts using synonyms or natural questions.

To solve this, we map text into high-dimensional vector representations where semantic meaning is captured geometrically.

A **vector database** is a dedicated database engineered to store, index, and query multidimensional embeddings via approximate nearest neighbor (ANN) algorithms such as HNSW (Hierarchical Navigable Small World) or IVF (Inverted File Index).

---

## The Geometry of Embeddings

When an embedding model like \`text-embedding-3-small\` processes text, it returns an array of floating-point numbers:

$$v \\in \\mathbb{R}^{1536}$$

Two texts with similar meanings produce vectors pointing in nearly identical directions in this hyperspace. We calculate their similarity using **Cosine Similarity**:

$$\\text{similarity}(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$$

---

## Indexing Algorithms: Exact vs Approximate

- **Flat Index (KNN)**: Compares against every vector. Guaranteed exact precision, but computational complexity is $O(N)$ which collapses at scale.
- **HNSW**: Builds a multi-layer geometric graph where upper layers skip large distances and bottom layers refine nearest neighbors. Search complexity drops to $O(\\log N)$.

---

## Code Example: Querying Embeddings

Below is an example querying ChromaDB:

\`\`\`typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
const collection = client.getOrCreateCollection({ name: "articles" });

const results = await collection.query({
  queryTexts: ["vector database indexing"],
});
\`\`\`

> ⚠️ **Warning:** Note that modern RAG systems also require robust access controls and sanitization. Be sure to review our dedicated article on RAG security considerations.
`,
  },
  {
    id: 'production-security-rag',
    slug: 'production-security-for-rag-applications',
    title: 'Production Security for RAG Applications: Defense in Depth',
    excerpt:
      'Prevent prompt injection, indirect data exfiltration, and tenant leakage in enterprise RAG pipelines with verifiable safety guardrails.',
    publishedAt: '1 week ago',
    updatedAt: '2026-10-01 09:30',
    readingTime: '8 min read',
    gitBranch: 'main',
    commitHash: '9e2c4f1',
    status: 'published',
    topics: ['RAG', 'Security', 'LLMs', 'Prompt Injection'],
    entities: [
      'LlamaGuard',
      'OWASP Top 10 for LLM',
      'Vector ACL',
      'Dual LLM Architecture',
    ],
    healthScore: 92,
    healthMetrics: {
      content: 93,
      seo: 90,
      aeo: 94,
      links: 89,
      freshness: 95,
      technical: 91,
    },
    isStale: false,
    proposedDiffs: [],
    seo: {
      title: 'Production Security for RAG Applications: Defense in Depth',
      description:
        'Comprehensive security engineering for RAG architectures: preventing prompt injection, ACL filtering at the embedding layer, and indirect data poisoning.',
      primaryKeyword: 'production security rag applications',
      searchIntent: 'Security Architecture & Best Practices',
      headingCount: 7,
      readabilityScore: 89,
      insights: [
        'Actionable defense checklists with high citation value.',
        'Explicit mitigations for OWASP Top 10 LLM risks.',
      ],
    },
    aeo: {
      readinessScore: 94,
      primaryQuestion: 'How do you secure a production RAG application?',
      directAnswerSnippet:
        'Securing a production RAG application requires metadata-level access control lists (ACLs) before vector retrieval, prompt boundary defense (dual LLM architecture), and deterministic sanitization of retrieved context.',
      definitionFound: true,
      definitionPosition: 'early',
      structuredEvidence: true,
      recommendations: [
        'Explicit security tiers make direct extraction clean for search and answer engines.',
      ],
    },
    internalLinks: {
      outbound: [
        {
          targetId: 'vector-databases-rag',
          targetTitle: 'Understanding Vector Databases and Embeddings in RAG',
          targetSlug: 'understanding-vector-databases-and-embeddings-in-rag',
          phrase: 'vector storage engines',
        },
      ],
      suggestions: [
        {
          targetId: 'mcp-server-typescript',
          targetTitle: 'Building an MCP Server with TypeScript',
          targetSlug: 'building-an-mcp-server-with-typescript',
          phrase: 'protocol client execution',
          reason:
            'Tool execution safety applies directly to MCP server boundaries.',
        },
      ],
    },
    revisionHistory: [
      {
        id: 'rev-0',
        timestamp: '2026-10-01 09:30',
        summary: 'Published security audit checklist',
        author: 'Security Lead',
        gitCommit: '9e2c4f1',
      },
    ],
    content: `# Production Security for RAG Applications: Defense in Depth

Securing a Retrieval-Augmented Generation (RAG) system is fundamentally different from securing a standard REST API. In RAG, untrusted user inputs mingle with semi-trusted retrieved corporate documents inside an unpredictable probabilistic model.

The core vulnerability is **indirect prompt injection**: an attacker places adversarial text inside an internal document or public web page, causing the LLM to ignore developer instructions and exfiltrate secrets.

---

## 1. Access Control at the Vector Layer

The single most dangerous anti-pattern is retrieving documents globally and expecting the LLM to enforce access permissions.

\`\`\`text
❌ WRONG: Retrieve Top-10 Global Documents ──▶ Ask LLM "Is User authorized?"
✅ RIGHT: Filter Metadata ACL in Vector Query ──▶ Retrieve Only User Documents
\`\`\`

Always pass user permission claims into your vector storage engines as pre-filters:

\`\`\`typescript
const results = await vectorDb.query({
  queryVector,
  topK: 5,
  filter: {
    tenantId: user.tenantId,
    allowedRoles: { $in: user.roles },
  },
});
\`\`\`

---

## 2. Guardrails Against Indirect Prompt Injection

When rendering context into prompts, wrap retrieved text in unmistakable syntactic boundaries (such as XML tags) and instruct the system to treat bounded content exclusively as untrusted data.
`,
  },
  {
    id: 'clean-internal-link-structures',
    slug: 'designing-clean-internal-link-structures-for-technical-blogs',
    title: 'Designing Clean Internal Link Structures for Technical Blogs',
    excerpt:
      'How to build topic clusters, avoid orphan content, and treat internal links like software dependency graphs.',
    publishedAt: '3 weeks ago',
    updatedAt: '2026-09-18 11:00',
    readingTime: '5 min read',
    gitBranch: 'main',
    commitHash: '2b8e1a7',
    status: 'published',
    topics: ['Content Strategy', 'SEO', 'Information Architecture'],
    entities: ['PageRank', 'Topic Clusters', 'Spoke-and-Hub', 'Anchor Text'],
    healthScore: 90,
    healthMetrics: {
      content: 91,
      seo: 95,
      aeo: 86,
      links: 96,
      freshness: 90,
      technical: 84,
    },
    isStale: false,
    proposedDiffs: [],
    seo: {
      title: 'Designing Clean Internal Link Structures for Technical Blogs',
      description:
        'A developer guide to internal linking architecture: building hub-and-spoke clusters, calculating link equity, and eliminating orphan articles.',
      primaryKeyword: 'internal link structures technical blogs',
      searchIntent: 'Architectural & Strategic Publishing',
      headingCount: 5,
      readabilityScore: 92,
      insights: [
        'Provides clear hub-and-spoke structural diagram.',
        'Contains actionable rules for semantic anchor text.',
      ],
    },
    aeo: {
      readinessScore: 86,
      primaryQuestion: 'Why are internal links important for technical blogs?',
      directAnswerSnippet:
        'Internal links establish semantic relationships between related articles, distribute page equity across deep content, and help answer engines understand topic authority.',
      definitionFound: true,
      definitionPosition: 'early',
      structuredEvidence: true,
      recommendations: [
        'Include concrete examples of descriptive anchor text versus generic click-here links.',
      ],
    },
    internalLinks: {
      outbound: [
        {
          targetId: 'mcp-server-typescript',
          targetTitle: 'Building an MCP Server with TypeScript',
          targetSlug: 'building-an-mcp-server-with-typescript',
          phrase: 'concrete technical walkthroughs',
        },
      ],
      suggestions: [],
    },
    revisionHistory: [
      {
        id: 'rev-0',
        timestamp: '2026-09-18 11:00',
        summary: 'Initial architecture post',
        author: 'Content Architect',
        gitCommit: '2b8e1a7',
      },
    ],
    content: `# Designing Clean Internal Link Structures for Technical Blogs

When engineers write technical blogs, they often publish sequentially without thinking about how articles interconnect. Over time, high-value foundational posts become buried archives while newer posts lack context.

An internal link architecture should mirror a software package dependency graph:
- **Hub Articles (Core Pillars)** provide high-level conceptual frameworks.
- **Spoke Articles (Implementation Deep-Dives)** focus on specific APIs, bugs, or benchmarks and point back to the pillar.
`,
  },
  {
    id: 'git-backed-markdown-publishing',
    slug: 'migrating-from-traditional-cms-to-git-backed-markdown',
    title: 'Migrating from Traditional CMS to Git-backed Markdown',
    excerpt:
      'Why treating technical content like code with Git commits, pull requests, and automated linting unlocks superior publishing workflows.',
    publishedAt: '1 month ago',
    updatedAt: '2026-09-08 16:45',
    readingTime: '6 min read',
    gitBranch: 'main',
    commitHash: '8c3d9a1',
    status: 'published',
    topics: ['Git', 'Markdown', 'Publishing', 'DevRel'],
    entities: ['GitOps', 'MDX', 'GitHub Actions', 'Static Site Generators'],
    healthScore: 88,
    healthMetrics: {
      content: 90,
      seo: 87,
      aeo: 84,
      links: 86,
      freshness: 92,
      technical: 90,
    },
    isStale: false,
    proposedDiffs: [],
    seo: {
      title:
        'Migrating from Traditional CMS to Git-backed Markdown: A Developer Guide',
      description:
        'Why engineering teams are replacing monolithic CMS platforms with Git repositories, MDX files, and CI/CD publishing pipelines.',
      primaryKeyword: 'git backed markdown cms migration',
      searchIntent: 'Migration Guide & Workflow Design',
      headingCount: 6,
      readabilityScore: 90,
      insights: [
        'Clear comparison matrix between database CMS and Git-backed workflows.',
      ],
    },
    aeo: {
      readinessScore: 84,
      primaryQuestion: 'What are the benefits of a Git-backed markdown blog?',
      directAnswerSnippet:
        'A Git-backed markdown blog provides version-controlled revision history, peer-reviewed pull requests for technical accuracy, zero database maintenance overhead, and seamless integration with CI/CD deployment.',
      definitionFound: true,
      definitionPosition: 'early',
      structuredEvidence: true,
      recommendations: [
        'Position the definition at the very start of the summary section.',
      ],
    },
    internalLinks: {
      outbound: [
        {
          targetId: 'clean-internal-link-structures',
          targetTitle:
            'Designing Clean Internal Link Structures for Technical Blogs',
          targetSlug:
            'designing-clean-internal-link-structures-for-technical-blogs',
          phrase: 'maintaining internal links across static files',
        },
      ],
      suggestions: [],
    },
    revisionHistory: [
      {
        id: 'rev-0',
        timestamp: '2026-09-08 16:45',
        summary: 'Published migration retrospective',
        author: 'DevOps Engineer',
        gitCommit: '8c3d9a1',
      },
    ],
    content: `# Migrating from Traditional CMS to Git-backed Markdown

Traditional content management systems (CMSs) treat writing like administrative data entry in relational databases. For technical teams, this creates friction: code snippets get mangled by WYSIWYG editors, diffs are opaque, and updates cannot be reviewed in pull requests.

By shifting content to Git and Markdown/MDX:
1. **Full Version Control**: Every change is tracked with git blame and clean diffs.
2. **Branching & Previews**: Staging environments spawn automatically for pull requests.
3. **Zero Content Lock-in**: Your writing lives in open plain-text files you own forever.
`,
  },
]

export const BlogStore = {
  getArticles(): Article[] {
    if (typeof window === 'undefined') {
      return SEED_ARTICLES
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ARTICLES))
        return SEED_ARTICLES
      }
      const parsed = JSON.parse(data) as Article[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((a) => ({
          ...a,
          updatedAt:
            a.updatedAt ||
            a.revisionHistory[0]?.timestamp ||
            (typeof a.publishedAt === 'string' && a.publishedAt.includes('202')
              ? a.publishedAt
              : '2026-10-06 14:22'),
        }))
      }
      return SEED_ARTICLES
    } catch {
      return SEED_ARTICLES
    }
  },

  getArticleById(idOrSlug: string): Article | undefined {
    const articles = BlogStore.getArticles()
    return articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug)
  },

  saveArticle(articleData: Partial<Article> & { title: string }): Article {
    const articles = BlogStore.getArticles()
    const id =
      articleData.id ||
      articleData.slug ||
      articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `article-${Date.now()}`

    const existingIndex = articles.findIndex((a) => a.id === id)
    const existing = existingIndex >= 0 ? articles[existingIndex] : null

    const words = (articleData.content || existing?.content || '')
      .split(/\s+/)
      .filter(Boolean).length
    const readingTime = `${Math.max(1, Math.ceil(words / 200))} min read`

    // Recalculate health metrics dynamically
    const computedMetrics = BlogStore.computeHealth(
      articleData.title,
      articleData.content || existing?.content || '',
      articleData.topics || existing?.topics || [],
      articleData.isStale ?? existing?.isStale ?? false,
    )

    const updated: Article = {
      id,
      slug:
        articleData.slug ||
        existing?.slug ||
        articleData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      title: articleData.title,
      excerpt:
        articleData.excerpt ||
        existing?.excerpt ||
        (articleData.content
          ? articleData.content.slice(0, 150).replace(/[#*`_]/g, '') + '...'
          : 'A technical blog post analyzing software architecture and development.'),
      content: articleData.content || existing?.content || '',
      publishedAt:
        articleData.publishedAt || existing?.publishedAt || 'Just now',
      updatedAt:
        articleData.updatedAt ||
        new Date().toISOString().replace('T', ' ').substring(0, 16),
      readingTime: readingTime,
      gitBranch: articleData.gitBranch || existing?.gitBranch || 'main',
      commitHash:
        articleData.commitHash ||
        existing?.commitHash ||
        Math.random().toString(16).substring(2, 9),
      status: articleData.status || existing?.status || 'published',
      topics:
        articleData.topics && articleData.topics.length > 0
          ? articleData.topics
          : existing?.topics || ['Engineering'],
      entities: articleData.entities || existing?.entities || [],
      healthScore: computedMetrics.overall,
      healthMetrics: computedMetrics.metrics,
      isStale: articleData.isStale ?? existing?.isStale ?? false,
      staleReason: articleData.staleReason || existing?.staleReason,
      proposedDiffs: articleData.proposedDiffs || existing?.proposedDiffs || [],
      seo:
        articleData.seo ||
        existing?.seo ||
        BlogStore.computeSeo(articleData.title, articleData.content || ''),
      aeo:
        articleData.aeo ||
        existing?.aeo ||
        BlogStore.computeAeo(articleData.title, articleData.content || ''),
      internalLinks:
        articleData.internalLinks ||
        existing?.internalLinks ||
        BlogStore.computeInternalLinks(id, articleData.content || '', articles),
      revisionHistory: [
        {
          id: `rev-${Date.now()}`,
          timestamp: new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 16),
          summary: existing
            ? 'Updated article content & metadata'
            : 'Created new article',
          author: 'Author (Local)',
          gitCommit: Math.random().toString(16).substring(2, 9),
        },
        ...(existing?.revisionHistory || []),
      ],
    }

    let nextArticles: Article[]
    if (existingIndex >= 0) {
      nextArticles = [...articles]
      nextArticles[existingIndex] = updated
    } else {
      nextArticles = [updated, ...articles]
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextArticles))
      } catch (err) {
        console.error('Failed to save to localStorage:', err)
      }
    }

    return updated
  },

  deleteArticle(id: string): boolean {
    const articles = BlogStore.getArticles()
    const filtered = articles.filter((a) => a.id !== id && a.slug !== id)
    if (filtered.length === articles.length) return false

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    }
    return true
  },

  acceptDiff(articleId: string, diffId: string): Article | null {
    const articles = BlogStore.getArticles()
    const article = articles.find((a) => a.id === articleId)
    if (!article) return null

    const diff = article.proposedDiffs.find((d) => d.id === diffId)
    if (!diff) return null

    diff.status = 'accepted'
    article.updatedAt = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 16)
    // Stale issue resolved once diff accepted
    article.isStale = article.proposedDiffs.some((d) => d.status === 'pending')

    // Recalculate health
    const health = BlogStore.computeHealth(
      article.title,
      article.content,
      article.topics,
      article.isStale,
    )
    article.healthScore = health.overall
    article.healthMetrics = health.metrics

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    }
    return article
  },

  rejectDiff(articleId: string, diffId: string): Article | null {
    const articles = BlogStore.getArticles()
    const article = articles.find((a) => a.id === articleId)
    if (!article) return null

    const diff = article.proposedDiffs.find((d) => d.id === diffId)
    if (!diff) return null

    diff.status = 'rejected'
    article.updatedAt = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 16)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    }
    return article
  },

  resetToSeedData(): Article[] {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ARTICLES))
    }
    return SEED_ARTICLES
  },

  computeHealth(
    title: string,
    content: string,
    topics: string[],
    isStale: boolean,
  ): { overall: number; metrics: ArticleHealthMetrics } {
    const safeContent = typeof content === 'string' ? content : ''
    const safeTopics = Array.isArray(topics) ? topics : []
    const wordCount = safeContent.split(/\s+/).filter(Boolean).length
    const hasHeadings = (safeContent.match(/#{1,3}\s+/g) || []).length >= 3
    const hasCodeBlock = safeContent.includes('```')
    const hasTopics = safeTopics.length > 0

    const contentScore = Math.min(
      100,
      Math.max(
        50,
        Math.round(
          (wordCount / 500) * 40 +
            (hasHeadings ? 40 : 15) +
            (hasCodeBlock ? 20 : 0),
        ),
      ),
    )
    const seoScore = Math.min(
      100,
      Math.max(
        45,
        (title.length > 20 && title.length < 90 ? 40 : 20) +
          (hasHeadings ? 35 : 15) +
          (hasTopics ? 25 : 10),
      ),
    )
    const aeoScore = Math.min(
      100,
      Math.max(
        40,
        (content.toLowerCase().includes('is ') ||
        content.toLowerCase().includes('defined as')
          ? 45
          : 20) +
          (hasHeadings ? 35 : 20) +
          (wordCount > 300 ? 20 : 10),
      ),
    )
    const linksScore =
      content.includes('http') || content.includes('](') ? 90 : 70
    const freshnessScore = isStale ? 48 : 95
    const technicalScore = hasCodeBlock ? 92 : 75

    const overall = Math.round(
      contentScore * 0.2 +
        seoScore * 0.2 +
        aeoScore * 0.2 +
        linksScore * 0.15 +
        freshnessScore * 0.15 +
        technicalScore * 0.1,
    )

    return {
      overall,
      metrics: {
        content: contentScore,
        seo: seoScore,
        aeo: aeoScore,
        links: linksScore,
        freshness: freshnessScore,
        technical: technicalScore,
      },
    }
  },

  computeSeo(title: string, content: string): SeoAnalysis {
    const safeTitle = typeof title === 'string' ? title : ''
    const safeContent = typeof content === 'string' ? content : ''
    const headings = (safeContent.match(/#{1,3}\s+/g) || []).length
    const words = safeContent.split(/\s+/).filter(Boolean).length
    return {
      title: safeTitle,
      description:
        safeContent
          .slice(0, 140)
          .replace(/[#*`_]/g, '')
          .trim() + '...',
      primaryKeyword: safeTitle.toLowerCase().split(' ').slice(0, 3).join(' '),
      searchIntent: 'Technical architecture & implementation',
      headingCount: headings,
      readabilityScore: Math.min(
        95,
        Math.max(65, Math.round(85 - (words > 2000 ? 10 : 0))),
      ),
      insights: [
        headings >= 3
          ? 'Logical heading structure found (H2/H3 tiers).'
          : 'Add more subheadings to improve reader scanning.',
        safeTitle.length >= 25 && safeTitle.length <= 70
          ? 'Title length optimal for SERP display (between 25-70 chars).'
          : 'Consider refining title length for optimal SERP clipping.',
      ],
    }
  },

  computeAeo(title: string, content: string): AeoAnalysis {
    const safeTitle = typeof title === 'string' ? title : ''
    const safeContent = typeof content === 'string' ? content : ''
    const hasDef =
      safeContent.toLowerCase().includes(' is ') ||
      safeContent.toLowerCase().includes('are ') ||
      safeContent.toLowerCase().includes('defined as')

    const firstParagraph =
      safeContent.split('\n\n').find((p) => p.trim() && !p.startsWith('#')) || ''
    const isEarly =
      firstParagraph.toLowerCase().includes(' is ') ||
      firstParagraph.toLowerCase().includes('are ')

    return {
      readinessScore: isEarly ? 94 : hasDef ? 75 : 55,
      primaryQuestion: `What is ${safeTitle.split(':')[0].trim()}?`,
      directAnswerSnippet:
        firstParagraph
          .slice(0, 180)
          .replace(/[#*`_]/g, '')
          .trim() + '...',
      definitionFound: hasDef,
      definitionPosition: isEarly ? 'early' : hasDef ? 'middle' : 'missing',
      structuredEvidence: content.includes('```') || content.includes('|'),
      recommendations: isEarly
        ? [
            'Core definition appears upfront within the first paragraph for seamless AI extraction.',
            'Structured code blocks provide high citation confidence.',
          ]
        : [
            'Move the primary definition into the opening 150 words.',
            'Use question-oriented subheadings (e.g. "How does it work?") to assist answer engines.',
          ],
    }
  },

  computeInternalLinks(
    currentId: string,
    content: string,
    articles: Article[],
  ): { outbound: InternalLinkItem[]; suggestions: InternalLinkSuggestion[] } {
    const outbound: InternalLinkItem[] = []
    const suggestions: InternalLinkSuggestion[] = []

    for (const art of articles) {
      if (art.id === currentId) continue

      // Check if existing markdown link points to it
      if (content.includes(art.slug) || content.includes(art.id)) {
        outbound.push({
          targetId: art.id,
          targetTitle: art.title,
          targetSlug: art.slug,
          phrase: art.title,
        })
      } else {
        // Look for topic or keyword mentions
        const topics = Array.isArray(art.topics) ? art.topics : []
        for (const topic of topics) {
          if (content.toLowerCase().includes(topic.toLowerCase())) {
            suggestions.push({
              targetId: art.id,
              targetTitle: art.title,
              targetSlug: art.slug,
              phrase: topic,
              reason: `Your article mentions "${topic}", which is thoroughly explored in "${art.title}".`,
            })
            break
          }
        }
      }
    }

    return { outbound, suggestions }
  },
}

export function formatUpdateDate(dateInput?: string | number | Date | { date?: string; time?: string; full?: string } | null): {
  date: string
  time: string
  full: string
} {
  if (!dateInput) return { date: 'Recently', time: '', full: 'Recently' }

  // If already a formatted object from previous invocation
  if (typeof dateInput === 'object' && dateInput !== null && !(dateInput instanceof Date)) {
    if (typeof dateInput.date === 'string' && typeof dateInput.full === 'string') {
      return {
        date: dateInput.date,
        time: dateInput.time || '',
        full: dateInput.full,
      }
    }
  }

  let d: Date
  if (dateInput instanceof Date) {
    d = dateInput
  } else if (typeof dateInput === 'number') {
    d = new Date(dateInput)
  } else if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim()
    if (!trimmed) return { date: 'Recently', time: '', full: 'Recently' }

    if (/^\d{11,}$/.test(trimmed)) {
      d = new Date(Number(trimmed))
    } else {
      const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T')
      d = new Date(normalized)
    }
  } else {
    return { date: 'Recently', time: '', full: 'Recently' }
  }

  if (isNaN(d.getTime())) {
    const fallback = typeof dateInput === 'string' ? dateInput : 'Recently'
    return { date: fallback, time: '', full: fallback }
  }

  const dateFormatted = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  const timeFormatted = `${hours}:${mins}`

  return {
    date: dateFormatted,
    time: timeFormatted,
    full: `${dateFormatted} · ${timeFormatted}`,
  }
}

export function getArticleTimestamp(art: Article): number {
  if (art.updatedAt) {
    if (typeof art.updatedAt === 'number') return art.updatedAt
    if (typeof art.updatedAt === 'string') {
      const trimmed = art.updatedAt.trim()
      if (/^\d{11,}$/.test(trimmed)) {
        const num = Number(trimmed)
        if (!isNaN(num)) return num
      }
      const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T')
      const t = new Date(normalized).getTime()
      if (!isNaN(t)) return t
    } else if (typeof (art.updatedAt as any)?.full === 'string') {
      const t = new Date((art.updatedAt as any).full).getTime()
      if (!isNaN(t)) return t
    }
  }

  if (art.publishedAt) {
    if (typeof art.publishedAt === 'number') return art.publishedAt
    if (typeof art.publishedAt === 'string') {
      const trimmed = art.publishedAt.trim()
      if (/^\d{11,}$/.test(trimmed)) {
        const num = Number(trimmed)
        if (!isNaN(num)) return num
      }
      const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T')
      const t = new Date(normalized).getTime()
      if (!isNaN(t)) return t
    }
  }

  if (art.revisionHistory && art.revisionHistory.length > 0) {
    const rev = art.revisionHistory[0]
    if (rev && typeof rev.timestamp === 'string') {
      const normalized = rev.timestamp.includes('T') ? rev.timestamp : rev.timestamp.replace(' ', 'T')
      const t = new Date(normalized).getTime()
      if (!isNaN(t)) return t
    }
  }

  return 0
}
