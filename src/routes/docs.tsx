import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import {
  BookOpen,
  Code2,
  FolderGit2,
  Sparkles,
  Search,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Terminal,
  Zap,
  ArrowRight,
  ArrowLeft,
  Key,
  Database,
  FileText,
  Compass,
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
  toc: { id: string; label: string }[]
  content: React.ReactNode
}

export function DocsPage() {
  const [activeSectionId, setActiveSectionId] = React.useState('getting-started')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Keyboard shortcut to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      category: 'Overview',
      title: 'Introduction to Beelog',
      badge: 'Core',
      summary: 'Beelog is an AI-native publishing workspace that treats a technical blog like a production codebase.',
      toc: [
        { id: 'philosophy', label: 'Core Philosophy' },
        { id: 'git-first', label: 'Git-Friendly Workflow' },
        { id: 'three-pillars', label: 'Three Pillars' },
      ],
      content: (
        <div className="space-y-8 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground font-semibold">Beelog is not another CMS.</strong>{' '}
            It is an AI-powered publishing workspace designed for developers, engineering teams, and technical writers who maintain Markdown/MDX blogs. Instead of demanding database migrations or proprietary themes, Beelog sits above your existing workflow.
          </p>

          <div id="philosophy" className="border-l-2 border-amber-500 pl-4 py-1.5 space-y-1 bg-amber-500/[0.04] rounded-r-[8px]">
            <div className="flex items-center gap-2 text-foreground font-semibold text-[13px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              The Central Premise
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              A codebase has Git branches, review diffs, linters, automated tests, and CI/CD pipelines. A technical blog requires the same discipline: content intelligence, gap discovery, answer engine optimization (AEO), and automated freshness tracking.
            </p>
          </div>

          <div id="git-first" className="space-y-3 pt-2">
            <h3 className="text-lg font-sans font-bold text-foreground">
              Git-Friendly, Not Git-Hostile
            </h3>
            <p>
              Traditional publishing platforms force you to migrate your content into their locked database. Beelog respects your source of truth:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-[10px] bg-muted/40 border border-border/80 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                  01. Connect
                </div>
                <h4 className="text-sm font-semibold text-foreground">Your Markdown Repo</h4>
                <p className="text-[12px] text-muted-foreground">
                  Works with Astro, Next.js, Hugo, Docusaurus, or any Git repository.
                </p>
              </div>

              <div className="p-4 rounded-[10px] bg-muted/40 border border-border/80 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                  02. Review
                </div>
                <h4 className="text-sm font-semibold text-foreground">AI Review Diffs</h4>
                <p className="text-[12px] text-muted-foreground">
                  AI suggestions are rendered as Git diffs. Author retains final editorial control.
                </p>
              </div>

              <div className="p-4 rounded-[10px] bg-muted/40 border border-border/80 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                  03. Publish
                </div>
                <h4 className="text-sm font-semibold text-foreground">Convex & REST API</h4>
                <p className="text-[12px] text-muted-foreground">
                  Sync changes instantly or query articles dynamically via authenticated endpoints.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'quickstart',
      category: 'Overview',
      title: 'Quickstart Guide',
      badge: '5 Min',
      summary: 'Get Beelog running locally in minutes and connect to your Convex deployment.',
      toc: [
        { id: 'install', label: '1. Dependencies & Convex' },
        { id: 'dev-server', label: '2. Start Local App' },
        { id: 'seed', label: '3. Seed Articles' },
      ],
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            Follow this 3-step setup to launch the local editing workspace and reactive Convex backend.
          </p>

          <div className="space-y-5">
            <div id="install" className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-foreground font-semibold">1. Install dependencies & launch Convex</span>
                <button
                  type="button"
                  onClick={() => handleCopy('npm install\nnpx convex dev', 'code-qs-1')}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {copiedId === 'code-qs-1' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedId === 'code-qs-1' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3.5 rounded-[10px] bg-muted/50 border border-border font-mono text-xs text-foreground overflow-x-auto">
{`npm install
npx convex dev`}
              </pre>
            </div>

            <div id="dev-server" className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-foreground font-semibold">2. Start development server</span>
                <button
                  type="button"
                  onClick={() => handleCopy('npm run dev -- --port 3001', 'code-qs-2')}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {copiedId === 'code-qs-2' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedId === 'code-qs-2' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3.5 rounded-[10px] bg-muted/50 border border-border font-mono text-xs text-foreground overflow-x-auto">
{`npm run dev -- --port 3001`}
              </pre>
            </div>

            <div id="seed" className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-foreground font-semibold">3. Seed initial technical articles</span>
                <button
                  type="button"
                  onClick={() => handleCopy('npx convex run blogs:seed \'{"force":true}\'', 'code-qs-3')}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {copiedId === 'code-qs-3' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedId === 'code-qs-3' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3.5 rounded-[10px] bg-muted/50 border border-border font-mono text-xs text-foreground overflow-x-auto">
{`npx convex run blogs:seed '{"force":true}'`}
              </pre>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors shadow-xs"
            >
              Open Editor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-muted hover:bg-muted/80 text-foreground text-xs transition-colors"
            >
              Browse Articles
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'writing-workspace',
      category: 'Editor',
      title: 'Writing Workspace & Diffs',
      badge: 'Editor',
      summary: 'A minimalist, typography-first markdown editor with keyboard slash commands and AI diff reviews.',
      toc: [
        { id: 'slash-commands', label: 'Slash Commands' },
        { id: 'diff-rule', label: 'Human-in-the-Loop Diffs' },
      ],
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            The writing experience is distraction-free, optimized for long-form technical prose and code snippets.
          </p>

          <div id="slash-commands" className="space-y-3">
            <h3 className="text-lg font-sans font-bold text-foreground">
              Slash Commands
            </h3>
            <p>
              Type <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-foreground">/</code> on a blank line to insert blocks:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-[8px] bg-muted/30 border border-border space-y-1">
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">/code</span>
                <p className="text-muted-foreground text-[11px]">
                  Syntax-highlighted code block with language dropdown.
                </p>
              </div>
              <div className="p-3 rounded-[8px] bg-muted/30 border border-border space-y-1">
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">/callout</span>
                <p className="text-muted-foreground text-[11px]">
                  Highlight technical caveats, RFC notes, or warnings.
                </p>
              </div>
              <div className="p-3 rounded-[8px] bg-muted/30 border border-border space-y-1">
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">/aeo-verify</span>
                <p className="text-muted-foreground text-[11px]">
                  Audit answer extractability and definition placement.
                </p>
              </div>
              <div className="p-3 rounded-[8px] bg-muted/30 border border-border space-y-1">
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">/diff-review</span>
                <p className="text-muted-foreground text-[11px]">
                  Generate an AI revision formatted cleanly as accept/reject diffs.
                </p>
              </div>
            </div>
          </div>

          <div id="diff-rule" className="space-y-2 pt-2">
            <h3 className="text-lg font-sans font-bold text-foreground">
              The Diff Review Rule
            </h3>
            <p>
              Beelog strictly enforces: <strong className="text-foreground font-semibold">AI proposes. Author decides.</strong> No AI suggestion is ever applied silently. Every modification appears in the Review tab as a visual Git diff so you verify technical accuracy.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'aeo-intelligence',
      category: 'Intelligence',
      title: 'Answer Engine Optimization (AEO)',
      badge: 'AEO',
      summary: 'Ensure your articles are accurately cited, extracted, and summarized by LLM answer engines.',
      toc: [
        { id: 'why-aeo', label: 'Why AEO Matters' },
        { id: 'checklist', label: 'Audit Checklist' },
      ],
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p id="why-aeo">
            Modern engineers increasingly discover technical content via answer engines like Perplexity, ChatGPT Search, Claude Artifacts, and Google Gemini. AEO audits your writing for answer extractability.
          </p>

          <div id="checklist" className="space-y-3">
            <h3 className="text-lg font-sans font-bold text-foreground">
              What the AEO Engine Audits
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-3 rounded-[8px] bg-muted/30 border border-border text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-foreground block font-semibold">Early Definition Placement</strong>
                  <span className="text-muted-foreground">
                    Primary concepts must be defined in the opening 200 words rather than buried in implementation steps.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[8px] bg-muted/30 border border-border text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-foreground block font-semibold">Entity Disambiguation</strong>
                  <span className="text-muted-foreground">
                    Explicit naming of libraries, RFC specs, protocols, and exact version requirements.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[8px] bg-muted/30 border border-border text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-foreground block font-semibold">Intent-Oriented Headings</strong>
                  <span className="text-muted-foreground">
                    Headers phrased as direct developer questions (e.g. &quot;How do I configure session cookies?&quot;).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'content-graph',
      category: 'Intelligence',
      title: 'Knowledge Graph & Freshness',
      badge: 'Audits',
      summary: 'Map conceptual connections across your publication and automatically catch outdated technical claims.',
      toc: [
        { id: 'clustering', label: 'Topic Clusters' },
        { id: 'stale-detection', label: 'Stale Claims Agent' },
      ],
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p id="clustering">
            Beelog models your publication as a connected knowledge graph. When you draft a new article, it automatically recommends internal links and prevents near-duplicate content overlap.
          </p>

          <pre className="p-3.5 rounded-[10px] bg-muted/50 border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`AI Agents (Cluster)
├── Model Context Protocol (MCP) [Article: /blog/mcp-server-architecture]
│   └── Transport Handlers (Concept)
│       └── STDIO vs SSE (Link suggested to WebSocket guide)
└── Vector DB RAG Pipeline [Article: /blog/rag-embeddings-guide]
    └── Embeddings Chunking (Concept)`}
          </pre>

          <div id="stale-detection" className="space-y-2 pt-2">
            <h3 className="text-lg font-sans font-bold text-foreground">
              Automated Freshness Monitoring
            </h3>
            <p>
              The Content Health Agent periodically evaluates published posts for broken API endpoints, superseded npm/cargo packages, and changed specifications, creating actionable refresh notices.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'convex-backend',
      category: 'Architecture',
      title: 'Convex Database & Schema',
      badge: 'Database',
      summary: 'Reactive TypeScript database with real-time updates, auth sessions, and indexed article storage.',
      toc: [
        { id: 'schema-def', label: 'Schema Definition' },
        { id: 'indexing', label: 'Index Optimization' },
      ],
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p id="schema-def">
            Beelog persists content reactively using Convex. Every change is validated with 100% type-safety:
          </p>

          <pre className="p-3.5 rounded-[10px] bg-muted/50 border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`// convex/schema.ts
blogs: defineTable({
  title: v.string(),
  slug: v.string(),
  content: v.string(),
  excerpt: v.optional(v.string()),
  status: v.union(v.literal("draft"), v.literal("published")),
  topics: v.optional(v.array(v.string())),
  author: v.optional(v.string()),
  authorId: v.optional(v.id("users")),
  publishedAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
  readingTime: v.optional(v.string()),
})
  .index("by_slug", ["slug"])
  .index("by_status", ["status"])
  .index("by_status_and_publishedAt", ["status", "publishedAt"])`}
          </pre>
        </div>
      ),
    },
    {
      id: 'api-reference',
      category: 'Architecture',
      title: 'REST API & Integrations',
      badge: 'REST',
      summary: 'Query your published articles via authenticated HTTP endpoints on your custom website.',
      toc: [
        { id: 'api-endpoints', label: 'API Endpoints' },
        { id: 'auth-headers', label: 'Authentication' },
        { id: 'frameworks', label: 'Framework Examples' },
      ],
      content: (
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p id="api-endpoints">
            Integrate your Beelog articles into your personal Astro, Next.js, or Hugo site. Manage credentials in the{' '}
            <Link to="/integrations" className="text-amber-500 font-semibold underline hover:text-amber-600">
              Integrations Dashboard
            </Link>.
          </p>

          <div id="auth-headers" className="space-y-2">
            <span className="text-xs font-mono font-semibold text-foreground">
              GET /api/v1/blogs
            </span>
            <pre className="p-3.5 rounded-[10px] bg-muted/50 border border-border font-mono text-xs text-foreground overflow-x-auto">
{`curl -X GET 'https://quick-mole-268.convex.site/api/v1/blogs?status=published' \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>

          <div id="frameworks" className="space-y-2">
            <span className="text-xs font-mono font-semibold text-foreground">
              Astro / Next.js Fetch Snippet
            </span>
            <pre className="p-3.5 rounded-[10px] bg-muted/50 border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`const res = await fetch('https://quick-mole-268.convex.site/api/v1/blogs', {
  headers: {
    'Authorization': \`Bearer \${process.env.BEELOG_API_KEY}\`,
  },
  next: { revalidate: 60 } // Next.js ISR
});

const { data: articles } = await res.json();`}
            </pre>
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

      <div className="flex-1 max-w-6xl mx-auto px-6 w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
            {/* Minimal Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search docs... (/)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-[8px] bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 focus:bg-background transition-colors"
              />
            </div>

            {/* Navigation Category Groups */}
            <nav className="space-y-5">
              {categories.map((category) => {
                const categorySections = filteredSections.filter(
                  (s) => s.category === category
                )
                if (categorySections.length === 0) return null

                return (
                  <div key={category} className="space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80 px-2.5">
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
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs transition-colors flex items-center justify-between ${
                              isActive
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                            }`}
                          >
                            <span className="truncate">{section.title}</span>
                            {section.badge && (
                              <span
                                className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                                  isActive
                                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                                    : 'text-muted-foreground'
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
            </nav>

            {/* Quick Links */}
            <div className="pt-4 border-t border-border space-y-2 text-xs">
              <div className="text-[10px] font-mono uppercase text-muted-foreground/80 font-bold px-2.5">
                Quick Shortcuts
              </div>
              <ul className="space-y-1 text-muted-foreground text-[11px]">
                <li>
                  <Link to="/integrations" className="px-2.5 py-1 rounded-[6px] hover:text-foreground hover:bg-muted/40 flex items-center gap-1.5 transition-colors">
                    <Key className="w-3 h-3 text-amber-500" /> API Keys & Testing
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="px-2.5 py-1 rounded-[6px] hover:text-foreground hover:bg-muted/40 flex items-center gap-1.5 transition-colors">
                    <BookOpen className="w-3 h-3 text-amber-500" /> Published Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/blog/new" className="px-2.5 py-1 rounded-[6px] hover:text-foreground hover:bg-muted/40 flex items-center gap-1.5 transition-colors">
                    <FileText className="w-3 h-3 text-amber-500" /> Article Editor
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-10">
            <article className="space-y-6">
              {/* Clean Breadcrumb & Header */}
              <div className="space-y-2 pb-4 border-b border-border">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                  <span>Docs</span>
                  <span>/</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{activeSection.category}</span>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-sans font-bold text-foreground tracking-tight">
                    {activeSection.title}
                  </h1>
                  {activeSection.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/20">
                      {activeSection.badge}
                    </span>
                  )}
                </div>

                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {activeSection.summary}
                </p>

                {/* In-page Table of Contents anchor chips */}
                {activeSection.toc && activeSection.toc.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">On this page:</span>
                    {activeSection.toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Body */}
              <div className="pt-2">{activeSection.content}</div>

              {/* Prev / Next Continuous Reading Cards */}
              <div className="pt-8 border-t border-border flex items-center justify-between gap-4 text-xs">
                {(() => {
                  const currentIndex = sections.findIndex((s) => s.id === activeSection.id)
                  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null
                  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null

                  return (
                    <>
                      {prevSection ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionId(prevSection.id)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="p-3 rounded-[8px] border border-border hover:border-amber-500/50 bg-card hover:bg-muted/20 text-left transition-all space-y-0.5 group max-w-[200px]"
                        >
                          <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                            Previous
                          </div>
                          <div className="font-semibold text-foreground text-xs truncate">
                            {prevSection.title}
                          </div>
                        </button>
                      ) : (
                        <div />
                      )}

                      {nextSection && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionId(nextSection.id)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="p-3 rounded-[8px] border border-border hover:border-amber-500/50 bg-card hover:bg-muted/20 text-right transition-all space-y-0.5 group max-w-[200px] ml-auto"
                        >
                          <div className="flex items-center justify-end gap-1 text-[10px] font-mono uppercase text-muted-foreground">
                            Next
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div className="font-semibold text-foreground text-xs truncate">
                            {nextSection.title}
                          </div>
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
