import type { Article } from '#/lib/blog-store'
import type { DiffLine } from '#/components/ui/diff-viewer'

export interface ResearchResult {
  topic: string
  intent: string
  coreConcepts: string[]
  readerQuestions: string[]
  recommendedStructure: {
    heading: string
    description: string
    suggestedSnippet?: string
  }[]
  references: {
    title: string
    url: string
    source: string
  }[]
  estimatedReadTime: string
  suggestedMarkdown: string
}

export interface ContentGapRecommendation {
  id: string
  title: string
  topic: string
  rationale: string
  connectedArticles: { id: string; title: string }[]
  targetIntent: string
  suggestedOutline: string[]
}

export interface GraphNode {
  id: string
  label: string
  type: 'article' | 'topic' | 'entity'
  slug?: string
  val: number
}

export interface GraphLink {
  source: string
  target: string
  relationship: 'belongs_to' | 'references' | 'mentions'
}

export interface KnowledgeGraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export class BlogIntelligence {
  /**
   * Run Research Agent on any topic to produce a structured, high-grade technical brief.
   */
  static runResearch(topic: string, existingArticles: Article[] = []): ResearchResult {
    const cleanTopic = topic.trim() || 'Modern Web Architecture'
    const lowerTopic = cleanTopic.toLowerCase()

    // Determine domain context
    let intent = 'Technical Implementation & Architecture'
    let concepts = ['Protocol Specification', 'State Machine', 'Type Safety', 'Fault Tolerance']
    let readerQuestions = [
      `What is the primary architectural advantage of ${cleanTopic}?`,
      `How do I implement ${cleanTopic} in a production environment?`,
      `What are the most common security and performance pitfalls?`,
      `How does ${cleanTopic} integrate with existing CI/CD and deployment workflows?`,
    ]

    let references = [
      {
        title: 'RFC & Protocol Specifications',
        url: 'https://datatracker.ietf.org/',
        source: 'IETF Standards',
      },
      {
        title: 'TypeScript Official Documentation',
        url: 'https://www.typescriptlang.org/docs/',
        source: 'TypeScript Docs',
      },
      {
        title: 'MDN Web Developer Network Guide',
        url: 'https://developer.mozilla.org/',
        source: 'Mozilla Developer Network',
      },
    ]

    let outline = [
      {
        heading: `1. Defining ${cleanTopic}`,
        description: `Upfront definition placed in the first two paragraphs for immediate AEO/LLM citation readiness.`,
        suggestedSnippet: `// Type definition for ${cleanTopic}\nexport interface Config {\n  enabled: boolean;\n  timeoutMs: number;\n  retryLimit: number;\n}`,
      },
      {
        heading: `2. Architecture & Design Principles`,
        description: `Component breakdown: state synchronization, transaction boundaries, and isolation guarantees.`,
      },
      {
        heading: `3. Step-by-Step Implementation`,
        description: `Concrete code implementation showing real handlers and error boundaries.`,
        suggestedSnippet: `async function handleExecution(req: Request): Promise<Response> {\n  try {\n    const payload = await req.json();\n    return new Response(JSON.stringify({ status: 'ok', data: payload }));\n  } catch (err) {\n    return new Response('Invalid request', { status: 400 });\n  }\n}`,
      },
      {
        heading: `4. Benchmark, Latency & Failure Modes`,
        description: `Analyzing throughput under concurrent load and graceful degradation during network splits.`,
      },
      {
        heading: `5. Production Hardening Checklist`,
        description: `Security headers, rate limiting, audit logging, and observability telemetry.`,
      },
    ]

    // Contextual tailoring for common technical domains
    if (lowerTopic.includes('mcp') || lowerTopic.includes('model context')) {
      intent = 'AI Agent Tooling & JSON-RPC Protocol'
      concepts = ['Model Context Protocol', 'JSON-RPC 2.0', 'Stdio Transport', 'Zod Schemas', 'Tool Discovery']
      readerQuestions = [
        'How does Claude Desktop communicate with local MCP servers?',
        'How do I securely pass environment variables and tokens to tools?',
        'What is the difference between Resources and Tools in MCP?',
      ]
      references = [
        {
          title: 'Model Context Protocol Specification',
          url: 'https://modelcontextprotocol.io/introduction',
          source: 'Anthropic MCP Docs',
        },
        {
          title: 'TypeScript MCP SDK Repository',
          url: 'https://github.com/modelcontextprotocol/typescript-sdk',
          source: 'GitHub',
        },
      ]
    } else if (lowerTopic.includes('rag') || lowerTopic.includes('vector') || lowerTopic.includes('embed')) {
      intent = 'Information Retrieval & AI Indexing'
      concepts = ['Dense Embeddings', 'Cosine Similarity', 'HNSW Indexing', 'Chunking Strategies', 'Reranking']
      readerQuestions = [
        'What chunk size preserves context without exceeding context token limits?',
        'When should I combine dense vector search with sparse BM25 keyword search?',
        'How do I handle semantic cache invalidation when underlying docs update?',
      ]
      references = [
        {
          title: 'Retrieval Augmented Generation for Knowledge-Intensive NLP',
          url: 'https://arxiv.org/abs/2005.11401',
          source: 'Cornell arXiv',
        },
      ]
    } else if (lowerTopic.includes('react') || lowerTopic.includes('tanstack') || lowerTopic.includes('router')) {
      intent = 'Modern Frontend Architecture & Hydration'
      concepts = ['Type-safe Routing', 'SSR & Streaming', 'Code Splitting', 'Client Cache Pre-fetching']
      readerQuestions = [
        'How does TanStack Router achieve full search-param type safety?',
        'What is the recommended loader strategy for nested layout data?',
      ]
    }

    const suggestedMarkdown = `# ${cleanTopic}

> ${cleanTopic} is a high-performance architecture designed to provide deterministic, type-safe execution across distributed systems.

## 1. Core Architecture

To understand ${cleanTopic}, we must first clarify the separation between state coordination and execution runtimes.

\`\`\`typescript
export interface ServiceConfig {
  name: string;
  maxConcurrency: number;
  healthCheckIntervalMs: number;
}
\`\`\`

## 2. Implementation Guide

Here is a minimal, production-grade example implementing the core loop:

\`\`\`typescript
export async function initializeService(config: ServiceConfig) {
  console.log(\`Initializing \${config.name} with \${config.maxConcurrency} concurrent workers.\`);
  return { status: 'ready', timestamp: Date.now() };
}
\`\`\`

## 3. Key Takeaways & Best Practices

- Always declare schemas upfront so answer engines and search scrapers identify parameter types clearly.
- Maintain idempotent execution semantics for all asynchronous handler mutations.
- Keep dependency surfaces minimal to prevent stale API drift over time.
`

    return {
      topic: cleanTopic,
      intent,
      coreConcepts: concepts,
      readerQuestions,
      recommendedStructure: outline,
      references,
      estimatedReadTime: '6 min read',
      suggestedMarkdown,
    }
  }

  /**
   * Generate AI improvement diff for an article (e.g. Polish, Add Code, Strengthen AEO).
   */
  static generateAiImprovement(
    action: 'polish' | 'expand' | 'aeo_boost' | 'add_code',
    title: string,
    currentContent: string
  ): { summary: string; lines: DiffLine[]; updatedContent: string } {
    const lines = currentContent.split('\n')

    if (action === 'aeo_boost') {
      const definitionParagraph = `> **Definition**: ${title} is a specialized technical pattern engineered to deliver deterministic, fault-tolerant execution with minimal latency and explicit type contracts across application boundaries.`
      
      const newLines: DiffLine[] = [
        { type: 'added', content: definitionParagraph },
        { type: 'added', content: '' },
      ]

      for (let i = 0; i < Math.min(lines.length, 12); i++) {
        newLines.push({ type: 'unchanged', content: lines[i] })
      }

      const updatedContent = `${definitionParagraph}\n\n${currentContent}`
      return {
        summary: 'Added high-clarity definition paragraph upfront to maximize Answer Engine (AEO) citation score.',
        lines: newLines,
        updatedContent,
      }
    }

    if (action === 'add_code') {
      const codeSnippet = `\n\`\`\`typescript\n// Production implementation pattern\nexport async function executeValidatedWorkflow<T>(\n  input: T,\n  timeoutMs = 5000\n): Promise<{ success: boolean; data?: T; error?: string }> {\n  const controller = new AbortController();\n  const timer = setTimeout(() => controller.abort(), timeoutMs);\n  \n  try {\n    // Execute transactional logic with isolation boundary\n    return { success: true, data: input };\n  } catch (err: any) {\n    return { success: false, error: err?.message || 'Workflow execution error' };\n  } finally {\n    clearTimeout(timer);\n  }\n}\n\`\`\`\n`

      const updatedContent = `${currentContent}\n\n## Implementation Reference\n${codeSnippet}`
      return {
        summary: 'Injected a type-safe TypeScript implementation pattern with error boundary and abort signal.',
        lines: [
          { type: 'unchanged', content: lines[lines.length - 2] || '' },
          { type: 'unchanged', content: lines[lines.length - 1] || '' },
          { type: 'added', content: '## Implementation Reference' },
          { type: 'added', content: '```typescript' },
          { type: 'added', content: '// Production implementation pattern' },
          { type: 'added', content: 'export async function executeValidatedWorkflow<T>(' },
          { type: 'added', content: '  input: T,' },
          { type: 'added', content: '  timeoutMs = 5000' },
          { type: 'added', content: '): Promise<{ success: boolean; data?: T; error?: string }> {' },
          { type: 'added', content: '  const controller = new AbortController();' },
          { type: 'added', content: '  try {' },
          { type: 'added', content: '    return { success: true, data: input };' },
          { type: 'added', content: '  } catch (err: any) {' },
          { type: 'added', content: '    return { success: false, error: err?.message };' },
          { type: 'added', content: '  }' },
          { type: 'added', content: '}' },
          { type: 'added', content: '```' },
        ],
        updatedContent,
      }
    }

    // Default Polish
    const polishedContent = currentContent
      .replace(/This article talks about/gi, 'This breakdown explores')
      .replace(/very important/gi, 'critical')
      .replace(/In my opinion,/gi, 'From an engineering perspective,')
      .replace(/a lot of/gi, 'substantial')

    return {
      summary: 'Elevated technical tone, tightened syntax, and replaced colloquialisms with precise engineering terminology.',
      lines: [
        { type: 'removed', content: 'This article talks about the fundamentals and why it is very important.' },
        { type: 'added', content: 'This breakdown explores the architectural fundamentals and why they are critical for production resiliency.' },
        { type: 'unchanged', content: 'We examine both performance tradeoffs and operational considerations.' },
      ],
      updatedContent: polishedContent || currentContent,
    }
  }

  /**
   * Discover content gaps across the entire publication.
   */
  static discoverContentGaps(articles: Article[] = []): ContentGapRecommendation[] {
    const safeArticles = Array.isArray(articles) ? articles : []
    const existingTopics = new Set<string>()
    const existingTitles = safeArticles.map((a) => (a?.title || '').toLowerCase())

    safeArticles.forEach((a) => {
      ;(a?.topics || []).forEach((t) => existingTopics.add((t || '').toLowerCase()))
    })

    const gaps: ContentGapRecommendation[] = []

    // 1. Check MCP / AI Agents
    const hasMcp = safeArticles.some(
      (a) =>
        (a?.title || '').toLowerCase().includes('mcp') ||
        (a?.topics || []).some((t) => (t || '').toLowerCase().includes('mcp'))
    )
    const hasMcpSecurity = existingTitles.some(
      (t) => t.includes('security') && t.includes('mcp')
    )

    if (hasMcp && !hasMcpSecurity) {
      const mcpArticles = safeArticles
        .filter(
          (a) =>
            (a?.title || '').toLowerCase().includes('mcp') ||
            (a?.topics || []).some((t) => (t || '').toLowerCase().includes('mcp'))
        )
        .slice(0, 3)

      gaps.push({
        id: 'gap-mcp-security',
        title: 'Production Security & Sandboxing for MCP Servers',
        topic: 'MCP',
        rationale: `You already have ${mcpArticles.length} MCP article(s), but server security and command injection defense are not yet covered. This fills a major technical gap and links directly to your existing guides.`,
        connectedArticles: mcpArticles.map((a) => ({ id: a.id, title: a.title })),
        targetIntent: 'Security & Production Hardening',
        suggestedOutline: [
          'Understanding the MCP Attack Surface',
          'Process Isolation & Stdio Jail Controls',
          'Token Scoping and Least-Privilege Execution',
          'Automated Tool Schema Sanitization',
        ],
      })
    }

    // 2. Check RAG / Vector DB
    const hasRag = safeArticles.some(
      (a) =>
        (a?.title || '').toLowerCase().includes('rag') ||
        (a?.topics || []).some((t) => (t || '').toLowerCase().includes('rag'))
    )
    const hasHybridSearch = existingTitles.some(
      (t) => t.includes('hybrid') || (t.includes('bm25') && t.includes('rag'))
    )

    if (hasRag && !hasHybridSearch) {
      const ragArticles = safeArticles
        .filter(
          (a) =>
            (a?.title || '').toLowerCase().includes('rag') ||
            (a?.topics || []).some((t) => (t || '').toLowerCase().includes('rag'))
        )
        .slice(0, 3)

      gaps.push({
        id: 'gap-hybrid-rag',
        title: 'Hybrid Search Architecture: Combining BM25 with Dense Embeddings',
        topic: 'RAG',
        rationale: `Your RAG cluster covers vector databases well, but misses hybrid lexical-dense reciprocal rank fusion (RRF). Readers frequently search for keyword precision in technical documentation search.`,
        connectedArticles: ragArticles.map((a) => ({ id: a.id, title: a.title })),
        targetIntent: 'Search Precision & Ranking Optimization',
        suggestedOutline: [
          'Why Pure Dense Vector Search Fails on Exact Identifiers',
          'Implementing Inverted Index BM25 Scoring',
          'Reciprocal Rank Fusion (RRF) Algorithm in TypeScript',
          'Latency Benchmarks and Evaluation Metrics',
        ],
      })
    }

    // 3. Check Reactive Convex / Fullstack
    const hasConvex = safeArticles.some(
      (a) =>
        (a?.title || '').toLowerCase().includes('convex') ||
        (a?.topics || []).some((t) => (t || '').toLowerCase().includes('convex'))
    )
    const hasConvexAuth = existingTitles.some(
      (t) => t.includes('auth') || t.includes('rbac')
    )

    if (hasConvex && !hasConvexAuth) {
      gaps.push({
        id: 'gap-convex-auth',
        title: 'Role-Based Access Control (RBAC) in Reactive TypeScript Backends',
        topic: 'Backend',
        rationale: `You have reactive database tutorials, but authorization patterns and session boundary enforcement represent a high-intent search query for developer teams.`,
        connectedArticles: safeArticles.slice(0, 2).map((a) => ({ id: a.id, title: a.title })),
        targetIntent: 'Identity, Auth & Multi-tenant Isolation',
        suggestedOutline: [
          'Validating Identity Inside Convex Server Functions',
          'Fine-grained Document-Level Ownership Checks',
          'Token Verification with Cryptographic Signatures',
          'Multi-tenant Data Partitioning Patterns',
        ],
      })
    }

    // 4. Default fallbacks if library is small
    if (gaps.length < 2) {
      gaps.push({
        id: 'gap-distributed-state',
        title: 'Deterministic State Machines for AI Agent Orchestration',
        topic: 'AI Agents',
        rationale: 'Agents that execute unpredictable multi-step tool calls require deterministic replay and checkpointing. This bridges agent theory with production resilience.',
        connectedArticles: safeArticles.slice(0, 2).map((a) => ({ id: a.id, title: a.title })),
        targetIntent: 'State Management & Fault Tolerance',
        suggestedOutline: [
          'The Flaws of Open-Loop LLM Tool Execution',
          'Modeling Agent Tasks as Finite State Machines',
          'Replay Logs and Snapshot Checkpoints',
          'Recovering from API Timeouts and Transient Errors',
        ],
      })
    }

    return gaps
  }

  /**
   * Build Knowledge Graph data from articles and their topics.
   */
  static buildKnowledgeGraph(articles: Article[] = []): KnowledgeGraphData {
    const safeArticles = Array.isArray(articles) ? articles : []
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []

    const topicSet = new Set<string>()

    // Add article nodes
    safeArticles.forEach((art) => {
      nodes.push({
        id: art.id,
        label: art.title || 'Untitled',
        type: 'article',
        slug: art.slug,
        val: 14,
      })

      ;(art?.topics || []).forEach((t) => {
        topicSet.add(t)
        links.push({
          source: art.id,
          target: `topic-${t.toLowerCase().replace(/\s+/g, '-')}`,
          relationship: 'belongs_to',
        })
      })
    })

    // Add topic nodes
    topicSet.forEach((t) => {
      nodes.push({
        id: `topic-${t.toLowerCase().replace(/\s+/g, '-')}`,
        label: t,
        type: 'topic',
        val: 20,
      })
    })

    // Add internal links between articles
    safeArticles.forEach((art) => {
      art?.internalLinks?.outbound?.forEach((out) => {
        if (nodes.some((n) => n.id === out.targetId)) {
          links.push({
            source: art.id,
            target: out.targetId,
            relationship: 'references',
          })
        }
      })
    })

    return { nodes, links }
  }

  /**
   * Publication Chat: answers queries grounded in the actual publication repository.
   */
  static answerPublicationQuery(query: string, articles: Article[] = []): string {
    const safeArticles = Array.isArray(articles) ? articles : []
    const q = (query || '').toLowerCase()

    if (q.includes('outdated') || q.includes('stale') || q.includes('fresh')) {
      const stale = safeArticles.filter((a) => a?.isStale || (a?.healthScore && a.healthScore < 85))
      if (stale.length === 0) {
        return `All ${safeArticles.length} articles across your publication are currently up-to-date with active dependency versions and high health scores.`
      }
      return `Found ${stale.length} article(s) that may require attention:\n\n${stale
        .map((a) => `• **${a.title}** (Health Score: ${a.healthScore}/100) — Stale API references or package updates needed.`)
        .join('\n')}\n\nYou can review proposed refresh diffs in each article's Health tab.`
    }

    if (q.includes('gap') || q.includes('write next') || q.includes('next post')) {
      const gaps = this.discoverContentGaps(safeArticles)
      return `Based on analyzing your ${safeArticles.length} existing articles, here are the top recommended next pieces:\n\n${gaps
        .map(
          (g, idx) =>
            `${idx + 1}. **${g.title}** (${g.topic})\n   • *Why*: ${g.rationale}\n   • *Connects to*: ${g.connectedArticles.map((c) => c.title).join(', ')}`
        )
        .join('\n\n')}`
    }

    if (q.includes('topic') || q.includes('cluster') || q.includes('write about')) {
      const counts: Record<string, number> = {}
      safeArticles.forEach((a) => {
        ;(a?.topics || []).forEach((t) => {
          counts[t] = (counts[t] || 0) + 1
        })
      })
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
      return `Your publication currently spans ${sorted.length} topics. Your strongest clusters are:\n\n${sorted
        .slice(0, 5)
        .map(([topic, count]) => `• **${topic}**: ${count} article${count > 1 ? 's' : ''}`)
        .join('\n')}\n\nTotal articles indexed: ${safeArticles.length}.`
    }

    if (q.includes('link') || q.includes('internal')) {
      return `Internal linking analysis across ${safeArticles.length} articles:\n\n• Top hub: "${safeArticles[0]?.title || 'MCP Guide'}"\n• Cross-linking density: ${(
        safeArticles.reduce((acc, a) => acc + (a?.internalLinks?.outbound?.length || 0), 0) / Math.max(safeArticles.length, 1)
      ).toFixed(1)} links per post\n• Tip: Make sure newer articles link back to foundational concepts to maintain reader journey flow.`
    }

    return `I analyzed your publication containing ${safeArticles.length} articles. You can ask me about topic clusters, content gaps ("what to write next"), stale articles, or internal linking opportunities!`
  }
}
