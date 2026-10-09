import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import { Card } from '#/components/ui/card'
import {
  BookOpen,
  Code2,
  FolderGit2,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Terminal,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  Compass,
  FileText,
} from 'lucide-react'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

interface DocSection {
  id: string
  title: string
  category: string
  badge?: string
  summary: string
  content: React.ReactNode
}

export function DocsPage() {
  const [activeSectionId, setActiveSectionId] = React.useState('getting-started')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      category: 'Overview',
      title: 'Introduction to Beelog',
      badge: 'Core',
      summary:
        'Beelog is an AI-powered publishing workspace that treats a technical blog like a codebase.',
      content: (
        <div className="space-y-6 text-[14px] leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground font-semibold">Beelog is not another CMS.</strong>{' '}
            It is a publishing workspace for software engineers, technical writers, and indie
            hackers who already have Markdown/MDX blogs backed by Git, but want a vastly superior
            way to create, audit, optimize, and maintain technical knowledge over time.
          </p>

          <div className="p-4 rounded-[12px] bg-card border border-border/80 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold text-[13px]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              The Core Philosophy
            </div>
            <p className="text-[13px] text-muted-foreground">
              A codebase has an editor, Git, diffs, linting, tests, and CI/CD. A technical blog
              deserves the same discipline: content intelligence, gap discovery, AEO verification,
              and automated freshness tracking.
            </p>
          </div>

          <h3 className="text-[18px] font-sans font-bold text-foreground pt-4">
            How Beelog Fits Your Existing Stack
          </h3>
          <p>
            Beelog is strictly <em>Git-friendly, not Git-hostile</em>. You never need to migrate your
            domain, export databases, or abandon your custom Astro, Next.js, or Hugo themes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Card className="p-4 bg-card border border-border space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
                01. CONNECT
              </div>
              <h4 className="text-[14px] font-bold text-foreground">Git Repository</h4>
              <p className="text-[12px] text-muted-foreground">
                Sync with your existing GitHub repository containing Markdown/MDX posts.
              </p>
            </Card>

            <Card className="p-4 bg-card border border-border space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
                02. WRITE & AUDIT
              </div>
              <h4 className="text-[14px] font-bold text-foreground">AI Intelligence</h4>
              <p className="text-[12px] text-muted-foreground">
                Write in a minimalist editor with diff-based AI reviews, AEO scoring, and style matching.
              </p>
            </Card>

            <Card className="p-4 bg-card border border-border space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
                03. PUBLISH & SYNC
              </div>
              <h4 className="text-[14px] font-bold text-foreground">Convex & Git Sync</h4>
              <p className="text-[12px] text-muted-foreground">
                Commit changes back as clean pull requests or publish instantly via Convex real-time persistence.
              </p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'quickstart',
      category: 'Overview',
      title: 'Quickstart Guide',
      badge: '5 Min',
      summary: 'Get up and running with Beelog locally or connect your Convex deployment.',
      content: (
        <div className="space-y-6 text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Follow these steps to initialize Beelog and start publishing technical articles with
            full database persistence.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>1. Clone and install dependencies</span>
                <button
                  type="button"
                  onClick={() => handleCopy('npm install\nnpx convex dev', 'code-quickstart-1')}
                  className="flex items-center gap-1 text-[11px] hover:text-foreground text-muted-foreground"
                >
                  {copiedCode === 'code-quickstart-1' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedCode === 'code-quickstart-1' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-[12px] text-foreground overflow-x-auto">
                {`npm install
npx convex dev`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>2. Launch the development server</span>
                <button
                  type="button"
                  onClick={() => handleCopy('npm run dev', 'code-quickstart-2')}
                  className="flex items-center gap-1 text-[11px] hover:text-foreground text-muted-foreground"
                >
                  {copiedCode === 'code-quickstart-2' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedCode === 'code-quickstart-2' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-[12px] text-foreground overflow-x-auto">
                {`npm run dev -- --port 3001`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>3. Seed sample engineering articles</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('npx convex run blogs:seed \'{"force":true}\'', 'code-quickstart-3')
                  }
                  className="flex items-center gap-1 text-[11px] hover:text-foreground text-muted-foreground"
                >
                  {copiedCode === 'code-quickstart-3' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedCode === 'code-quickstart-3' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-[12px] text-foreground overflow-x-auto">
                {`npx convex run blogs:seed '{"force":true}'`}
              </pre>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[13px] shadow-xs transition-colors"
            >
              Open Custom Editor <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-card border border-border hover:bg-muted text-foreground text-[13px] transition-colors"
            >
              View Sample Articles
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'writing-workspace',
      category: 'Editor',
      title: 'Custom Writing Workspace',
      badge: 'Interactive',
      summary:
        'A typography-focused, distraction-free environment built for long-form technical prose.',
      content: (
        <div className="space-y-6 text-[14px] leading-relaxed text-muted-foreground">
          <p>
            The Beelog editor is built for engineers. It combines the tactile simplicity of Markdown
            with intelligent inline tools that respect your writing flow.
          </p>

          <h3 className="text-[18px] font-sans font-bold text-foreground">
            Keyboard-Driven Slash Commands
          </h3>
          <p>
            Type <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[12px] text-foreground">/</code>{' '}
            at any blank line to invoke the command menu:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            <div className="p-3 rounded-[8px] bg-card border border-border space-y-1">
              <span className="font-mono text-amber-500 font-bold">/code</span>
              <p className="text-muted-foreground text-[12px]">
                Insert syntax-highlighted code block with language selector.
              </p>
            </div>
            <div className="p-3 rounded-[8px] bg-card border border-border space-y-1">
              <span className="font-mono text-amber-500 font-bold">/callout</span>
              <p className="text-muted-foreground text-[12px]">
                Highlight architectural caveats, warnings, or deep-dive notes.
              </p>
            </div>
            <div className="p-3 rounded-[8px] bg-card border border-border space-y-1">
              <span className="font-mono text-amber-500 font-bold">/aeo-verify</span>
              <p className="text-muted-foreground text-[12px]">
                Audit definition clarity and answer extractability for Perplexity & ChatGPT.
              </p>
            </div>
            <div className="p-3 rounded-[8px] bg-card border border-border space-y-1">
              <span className="font-mono text-amber-500 font-bold">/diff-review</span>
              <p className="text-muted-foreground text-[12px]">
                Generate an AI revision proposed cleanly as an accept/reject Git diff.
              </p>
            </div>
          </div>

          <h3 className="text-[18px] font-sans font-bold text-foreground pt-2">
            The Human-in-the-Loop Diff Rule
          </h3>
          <p>
            Beelog enforces a strict principle: <strong>AI proposes, Author decides.</strong> AI
            modifications are never automatically committed or silently applied. Instead, they appear
            in the Review tab as granular line-by-line diffs.
          </p>
        </div>
      ),
    },
    {
      id: 'aeo-intelligence',
      category: 'Intelligence',
      title: 'AEO — Answer Engine Optimization',
      badge: 'Unique',
      summary:
        'Ensure your technical posts are accurately cited and summarized by AI answer engines.',
      content: (
        <div className="space-y-6 text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Traditional SEO focuses on keyword stuffing and meta descriptions. In the era of LLM
            search (Perplexity, ChatGPT Search, Claude Artifacts, Google Gemini Overviews), your
            technical readers discover content through answer engines.
          </p>

          <h3 className="text-[18px] font-sans font-bold text-foreground">
            What the AEO Agent Evaluates
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-[10px] bg-card border border-border">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground text-[13px] block">
                  Early Definition Placement
                </strong>
                <p className="text-[12px] text-muted-foreground">
                  The primary concept definition must appear in the first 200 words rather than buried
                  in the middle of the article.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-[10px] bg-card border border-border">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground text-[13px] block">
                  Explicit Semantic Entity Mentions
                </strong>
                <p className="text-[12px] text-muted-foreground">
                  Proper noun disambiguation for libraries, RFC specs, protocols, and version numbers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-[10px] bg-card border border-border">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground text-[13px] block">
                  Question-Oriented Section Headers
                </strong>
                <p className="text-[12px] text-muted-foreground">
                  Headers structured as clear developer intents (e.g., &quot;How do I configure
                  session cookies?&quot; instead of &quot;Cookies&quot;).
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'content-graph',
      category: 'Intelligence',
      title: 'Content Knowledge Graph & Freshness',
      badge: 'Audits',
      summary:
        'Map conceptual relationships across your entire publication to find gaps and stale claims.',
      content: (
        <div className="space-y-6 text-[14px] leading-relaxed text-muted-foreground">
          <p>
            When writing a new technical guide, Beelog references everything you have already published
            to prevent cannibalization and identify natural cross-linking opportunities.
          </p>

          <div className="p-4 rounded-[12px] bg-card border border-border space-y-3 font-mono text-[12px]">
            <div className="text-amber-500 font-bold uppercase tracking-wider text-[11px]">
              KNOWLEDGE GRAPH RELATIONSHIPS
            </div>
            <div className="p-3 bg-background rounded-[8px] border border-border/70 text-foreground overflow-x-auto leading-relaxed">
              {`AI Agents (Cluster)
├── Model Context Protocol (MCP) [Author post: /blog/mcp-server-architecture]
│   └── Transport Handlers (Concept)
│       └── STDIO vs SSE (Diff suggested: link to WebSocket guide)
└── Vector DB RAG Pipeline [Author post: /blog/rag-embeddings-guide]
    └── Embeddings Chunking (Concept)`}
            </div>
          </div>

          <h3 className="text-[18px] font-sans font-bold text-foreground pt-2">
            Automated Stale Claims Detection
          </h3>
          <p>
            The Content Health Agent periodically checks all published articles for breaking API
            changes, superseded RFC specs, and deprecated npm/cargo packages, generating actionable
            refresh notices.
          </p>
        </div>
      ),
    },
    {
      id: 'convex-backend',
      category: 'Architecture',
      title: 'Convex Database & Schema',
      badge: 'Database',
      summary:
        'Full reactive backend powered by Convex with real-time sync, auth sessions, and indexing.',
      content: (
        <div className="space-y-6 text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Beelog is backed by a fully typed Convex schema with real-time subscriptions. Every
            keystroke and publish event is synchronized reactively.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>convex/schema.ts snippet</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `blogs: defineTable({\n  title: v.string(),\n  slug: v.string(),\n  content: v.string(),\n  status: v.union(v.literal('draft'), v.literal('published')),\n  healthScore: v.number(),\n  readingTime: v.string(),\n})\n  .index('by_slug', ['slug'])\n  .index('by_status', ['status'])`,
                    'code-convex-schema'
                  )
                }
                className="flex items-center gap-1 text-[11px] hover:text-foreground text-muted-foreground"
              >
                {copiedCode === 'code-convex-schema' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedCode === 'code-convex-schema' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-[12px] text-foreground overflow-x-auto leading-relaxed">
              {`blogs: defineTable({
  title: v.string(),
  slug: v.string(),
  topic: v.string(),
  content: v.string(),
  excerpt: v.string(),
  status: v.union(v.literal('draft'), v.literal('published')),
  readingTime: v.string(),
  healthScore: v.number(),
  publishedAt: v.optional(v.string()),
  updatedAt: v.string(),
  seo: v.object({
    title: v.string(),
    description: v.string(),
    keywords: v.array(v.string()),
  }),
})
  .index('by_slug', ['slug'])
  .index('by_status', ['status'])`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      id: 'api-reference',
      category: 'Architecture',
      title: 'REST API & Client SDK',
      badge: 'SDK',
      summary: 'Automate article synchronization from your local machine, CLI, or CI pipeline.',
      content: (
        <div className="space-y-6 text-[14px] leading-relaxed text-muted-foreground">
          <p>
            Integrate Beelog directly into your build scripts, Git pre-commit hooks, or deployment
            pipelines.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-muted-foreground block">
                Publish via cURL
              </span>
              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-[12px] text-foreground overflow-x-auto">
                {`curl -X POST https://api.beelog.dev/v1/publish \\
  -H "Authorization: Bearer $BEELOG_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "slug": "mcp-server-architecture",
    "status": "published",
    "runAeoAudit": true
  }'`}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-muted-foreground block">
                Node / TypeScript SDK
              </span>
              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-[12px] text-foreground overflow-x-auto">
                {`import { Beelog } from '@beelog/client'

const beelog = new Beelog({ apiKey: process.env.BEELOG_API_KEY })

const result = await beelog.articles.sync({
  directory: './content/posts',
  autoLinkExistingTopics: true,
})`}
              </pre>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSection =
    sections.find((s) => s.id === activeSectionId) || sections[0]

  const categories = Array.from(new Set(sections.map((s) => s.category)))

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-6 w-full py-8">
        {/* Top Header & Search Banner */}
        <div className="border-b border-border pb-8 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-amber-500">
                  DOCUMENTATION
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                  v1.0 (Live)
                </span>
              </div>
              <h1 className="text-3xl font-sans font-bold text-foreground">
                Beelog Developer Documentation
              </h1>
              <p className="text-[14px] text-muted-foreground max-w-2xl">
                Learn how Beelog understands, optimizes, and maintains technical engineering blogs
                like a high-grade codebase.
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-[10px] bg-card border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Documentation Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-4">
              {categories.map((category) => {
                const categorySections = filteredSections.filter(
                  (s) => s.category === category
                )
                if (categorySections.length === 0) return null

                return (
                  <div key={category} className="space-y-1.5">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground px-2">
                      {category}
                    </div>
                    <div className="space-y-0.5">
                      {categorySections.map((section) => {
                        const isActive = section.id === activeSection.id
                        return (
                          <button
                            key={section.id}
                            type="button"
                            onClick={() => {
                              setActiveSectionId(section.id)
                              window.scrollTo({ top: 120, behavior: 'smooth' })
                            }}
                            className={`w-full text-left px-3 py-2 rounded-[8px] text-[13px] transition-colors flex items-center justify-between ${
                              isActive
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            <span className="truncate">{section.title}</span>
                            {section.badge && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  isActive
                                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {section.badge}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Links Card */}
            <div className="p-4 rounded-[12px] bg-card border border-border space-y-2 text-[12px]">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-amber-500" />
                Useful Resources
              </div>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link to="/blogs" className="hover:text-foreground flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> Browse Published Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/blog/new" className="hover:text-foreground flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> Launch Article Editor
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> GitHub Integration
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Right Main Article Reader */}
          <main className="lg:col-span-9 space-y-8">
            <article className="p-6 md:p-8 rounded-[16px] bg-card border border-border space-y-6">
              {/* Breadcrumb & Section Header */}
              <div className="space-y-2 border-b border-border/80 pb-6">
                <div className="flex items-center gap-2 text-[12px] font-mono text-muted-foreground">
                  <span>Docs</span>
                  <span>/</span>
                  <span className="text-amber-500">{activeSection.category}</span>
                  <span>/</span>
                  <span className="text-foreground">{activeSection.title}</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <h2 className="text-2xl md:text-3xl font-sans font-bold text-foreground">
                    {activeSection.title}
                  </h2>
                  {activeSection.badge && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                      {activeSection.badge}
                    </span>
                  )}
                </div>

                <p className="text-[15px] text-muted-foreground">
                  {activeSection.summary}
                </p>
              </div>

              {/* Section Body */}
              <div className="pt-2">{activeSection.content}</div>

              {/* Navigation Footer */}
              <div className="pt-8 border-t border-border flex items-center justify-between text-[13px]">
                {(() => {
                  const currentIndex = sections.findIndex(
                    (s) => s.id === activeSection.id
                  )
                  const prevSection =
                    currentIndex > 0 ? sections[currentIndex - 1] : null
                  const nextSection =
                    currentIndex < sections.length - 1
                      ? sections[currentIndex + 1]
                      : null

                  return (
                    <>
                      {prevSection ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionId(prevSection.id)
                            window.scrollTo({ top: 120, behavior: 'smooth' })
                          }}
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          ← {prevSection.title}
                        </button>
                      ) : (
                        <span />
                      )}

                      {nextSection && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionId(nextSection.id)
                            window.scrollTo({ top: 120, behavior: 'smooth' })
                          }}
                          className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-500 font-medium transition-colors"
                        >
                          {nextSection.title} →
                        </button>
                      )}
                    </>
                  )
                })()}
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}
