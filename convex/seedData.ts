export interface SeedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "published" | "draft";
  topics: string[];
  author: string;
  readingTime: string;
  gitBranch: string;
  healthScore: number;
}

export const INITIAL_BLOGS: SeedBlog[] = [
  {
    title: "Building an MCP Server with TypeScript: Architecture & Protocol Deep-Dive",
    slug: "building-an-mcp-server-with-typescript",
    excerpt: "A production-grade guide to implementing the Model Context Protocol (MCP) using TypeScript, structured JSON-RPC, and secure local tool execution.",
    content: `# Building an MCP Server with TypeScript: Architecture & Protocol Deep-Dive

The **Model Context Protocol (MCP)** is an open protocol that standardizes how AI applications securely connect to external tools, databases, and contextual data sources over JSON-RPC 2.0. Rather than writing custom API wrappers for every LLM client, an MCP server provides a standardized capability manifest.

In this guide, we walk through building a production-ready MCP server using TypeScript and Node.js that exposes local filesystem tools and computational helpers.

## 1. Architecture Overview

At a high level, the protocol establishes a client-server relationship:

\`\`\`text
┌─────────────────┐       JSON-RPC 2.0 (stdio / SSE)       ┌──────────────────┐
│   Host Client   │ ──────────────────────────────────────▶ │    MCP Server    │
│ (Claude / IDE)  │ ◀────────────────────────────────────── │  (Node / TS)     │
└─────────────────┘                                         └──────────────────┘
\`\`\`

The server specifies capabilities during the \`initialize\` handshake:
- **Tools**: Executable functions callable by the model.
- **Resources**: Read-only context URIs.
- **Prompts**: Parameterized prompt templates.

## 2. Setting Up the Project

\`\`\`bash
mkdir mcp-ts-server && cd mcp-ts-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx
\`\`\`

## 3. Implementing the Server Core

\`\`\`typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "ts-article-tools",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
});
\`\`\`
`,
    status: "published",
    topics: ["MCP", "TypeScript", "AI Agents", "JSON-RPC"],
    author: "Staff Engineer",
    readingTime: "7 min read",
    gitBranch: "main",
    healthScore: 94,
  },
  {
    title: "Understanding Vector Databases and Embeddings in RAG",
    slug: "understanding-vector-databases-and-embeddings-in-rag",
    excerpt: "An intuitive yet mathematically rigorous breakdown of vector similarity, embedding spaces, and retrieval augmented generation pitfalls.",
    content: `# Understanding Vector Databases and Embeddings in RAG

When building retrieval augmented generation (RAG) applications, standard keyword searches like BM25 fail when users query concepts using synonyms or natural questions.

A **vector database** is a dedicated database engineered to store, index, and query multidimensional embeddings via approximate nearest neighbor (ANN) algorithms such as HNSW (Hierarchical Navigable Small World) or IVF (Inverted File Index).

## The Geometry of Embeddings

When an embedding model like text-embedding-3-small processes text, it returns an array of floating-point numbers in a high-dimensional vector space.

Two texts with similar meanings produce vectors pointing in nearly identical directions in this hyperspace, measured by Cosine Similarity.

## Code Example: Querying Embeddings

\`\`\`typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
const collection = client.getOrCreateCollection({ name: "articles" });

const results = await collection.query({
  queryTexts: ["vector database indexing"],
  nResults: 5,
});
\`\`\`
`,
    status: "published",
    topics: ["Vector DB", "Embeddings", "RAG", "AI Agents"],
    author: "Principal Architect",
    readingTime: "9 min read",
    gitBranch: "main",
    healthScore: 88,
  },
  {
    title: "Production Security for RAG Applications: Defense in Depth",
    slug: "production-security-for-rag-applications",
    excerpt: "Prevent prompt injection, indirect data exfiltration, and tenant leakage in enterprise RAG pipelines with verifiable safety guardrails.",
    content: `# Production Security for RAG Applications: Defense in Depth

Securing a Retrieval-Augmented Generation (RAG) system is fundamentally different from securing a standard REST API. In RAG, untrusted user inputs mingle with semi-trusted retrieved corporate documents inside an unpredictable probabilistic model.

The core vulnerability is **indirect prompt injection**: an attacker places adversarial text inside an internal document or public web page, causing the LLM to ignore developer instructions and exfiltrate secrets.

## 1. Access Control at the Vector Layer

The single most dangerous anti-pattern is retrieving documents globally and expecting the LLM to enforce access permissions.

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
`,
    status: "published",
    topics: ["RAG", "Security", "LLMs", "Prompt Injection"],
    author: "Security Lead",
    readingTime: "8 min read",
    gitBranch: "main",
    healthScore: 92,
  },
  {
    title: "Designing Clean Internal Link Structures for Technical Blogs",
    slug: "designing-clean-internal-link-structures-for-technical-blogs",
    excerpt: "How to build topic clusters, avoid orphan content, and treat internal links like software dependency graphs.",
    content: `# Designing Clean Internal Link Structures for Technical Blogs

When engineers write technical blogs, they often publish sequentially without thinking about how articles interconnect. Over time, high-value foundational posts become buried archives while newer posts lack context.

An internal link architecture should mirror a software package dependency graph:
- **Hub Articles (Core Pillars)** provide high-level conceptual frameworks.
- **Spoke Articles (Implementation Deep-Dives)** focus on specific APIs, bugs, or benchmarks and point back to the pillar.
`,
    status: "published",
    topics: ["Content Strategy", "SEO", "Information Architecture"],
    author: "Content Architect",
    readingTime: "5 min read",
    gitBranch: "main",
    healthScore: 90,
  },
  {
    title: "Migrating from Traditional CMS to Git-backed Markdown",
    slug: "migrating-from-traditional-cms-to-git-backed-markdown",
    excerpt: "Why treating technical content like code with Git commits, pull requests, and automated linting unlocks superior publishing workflows.",
    content: `# Migrating from Traditional CMS to Git-backed Markdown

Treating technical content like code with Git commits, pull requests, and automated linting unlocks superior publishing workflows.

A Git-backed markdown blog provides version-controlled revision history, peer-reviewed pull requests for technical accuracy, zero database maintenance overhead, and seamless integration with CI/CD deployment.
`,
    status: "draft",
    topics: ["Git", "Markdown", "Publishing", "DevRel"],
    author: "DevOps Engineer",
    readingTime: "6 min read",
    gitBranch: "main",
    healthScore: 85,
  },
];
