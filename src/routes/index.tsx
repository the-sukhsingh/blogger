import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Send,
  GitBranch,
  FileText,
  Sparkles,
  Layers,
  ChevronDown,
  AlertCircle,
  Code2,
  Cpu,
  RefreshCw,
  GitCommit,
  Globe,
  FolderGit2,
  Bot,
  Zap,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { Navbar } from '#/components/navbar'
import { DiffViewer } from '#/components/ui/diff-viewer'
import type { DiffLine } from '#/components/ui/diff-viewer'

export const Route = createFileRoute('/')({
  component: AutoSendLandingPage,
})

const SAMPLE_DIFFS: DiffLine[] = [
  {
    type: 'unchanged',
    oldLineNumber: 1,
    newLineNumber: 1,
    content: '## Understanding Model Context Protocol (MCP)',
  },
  {
    type: 'deletion',
    oldLineNumber: 2,
    content:
      'MCP is an emerging API for AI models that allows desktop tools to send prompts back and forth.',
  },
  {
    type: 'addition',
    newLineNumber: 2,
    content:
      'The Model Context Protocol (MCP) is an open standard that enables AI clients to securely access external tools, prompts, and resources through structured JSON-RPC interfaces.',
  },
  {
    type: 'unchanged',
    oldLineNumber: 3,
    newLineNumber: 3,
    content:
      'By decoupling client models from provider implementations, developers maintain complete control over local execution contexts.',
  },
  {
    type: 'deletion',
    oldLineNumber: 4,
    content:
      'To build a server, run npm install @modelcontextprotocol/sdk@0.4.0.',
  },
  {
    type: 'addition',
    newLineNumber: 4,
    content:
      'To build a server with current type definitions, install @modelcontextprotocol/sdk@1.0.0 and configure transport handlers.',
  },
]

function AutoSendLandingPage() {
  const [activeCodeTab, setActiveCodeTab] = React.useState<
    'diff' | 'curl' | 'typescript' | 'rust'
  >('diff')
  const [heroPrompt, setHeroPrompt] = React.useState(
    'Create an in-depth technical analysis for our MCP TypeScript architecture and review stale claims.',
  )

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Global Unified Navigation */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1 max-w-[1240px] mx-auto px-6 w-full space-y-24 pt-10 pb-28">
        {/* =================================================================
            2. HERO SECTION (Serif headline with single italic accent)
            ================================================================= */}
        <section className="text-center max-w-[860px] mx-auto space-y-6 pt-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-[12px] text-muted-foreground">
            <span className="bg-foreground text-background text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[3px] uppercase">
              NEW
            </span>
            <span>
              Git-native Publishing: Treat your technical blog like a codebase.
            </span>
          </div>

          {/* Display Serif Headline */}
          <h1 className="font-serif text-[46px] md:text-[62px] leading-[1.08] tracking-[-0.02em] text-foreground font-normal">
            Publishing for <em>teams</em> who ship with <em>agents</em>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] md:text-[17px] text-muted-foreground max-w-[620px] mx-auto leading-relaxed">
            Content intelligence, git-native diffs, and AEO optimization in one
            platform. Priced by publication, not page views.
          </p>

          {/* Hero CTAs */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link to="/blogs">
              <Button
                variant="ghost"
                size="default"
                className="h-8 px-3 text-xs font-semibold uppercase tracking-[0.06em] text-foreground"
              >
                EXPLORE ARTICLES
              </Button>
            </Link>
            <Link to="/new">
              <Button variant="default" size="default">
                OPEN WORKSPACE
              </Button>
            </Link>
          </div>
        </section>

        {/* =================================================================
            3. PRODUCT SHOWCASE CARD (The lone drop shadow per design.md)
            ================================================================= */}
        <section className="relative">
          <Card
            variant="showcase"
            className="overflow-hidden border border-border bg-card p-0"
          >
            {/* Visual Header Canvas / Art Banner */}
            <div className="relative w-full h-[320px] md:h-[400px] bg-[#1a2e26] dark:bg-[#0f1d17] overflow-hidden flex items-center justify-center">
              {/* Pixel Art / Ambient Landscape Background Simulation */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage: `
                    linear-gradient(to bottom, rgba(16,37,28,0.2), rgba(12,26,20,0.85)),
                    repeating-linear-gradient(45deg, rgba(34,80,58,0.15) 0, rgba(34,80,58,0.15) 2px, transparent 2px, transparent 8px)
                  `,
                }}
              />

              {/* Mountains & Forest Pixel Silhouettes */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0e2118] via-[#163326]/70 to-transparent flex items-end justify-center pointer-events-none">
                <div className="w-full h-24 opacity-30 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#4ade80]/40 via-transparent to-transparent" />
              </div>

              {/* Floating Prompt Input Box (scratch/image.png) */}
              <div className="relative z-10 w-full max-w-[620px] mx-4 p-4 rounded-[14px] bg-card/95 backdrop-blur-md border border-border shadow-lg">
                <div className="text-[13px] text-foreground font-normal leading-relaxed pb-3">
                  {heroPrompt}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() =>
                      setHeroPrompt(
                        'Analyze recent Git commits, update code blocks to TypeScript 5.5, and draft unified diff.',
                      )
                    }
                    className="h-6 w-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    title="Insert prompt suggestion"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="h-7 w-7 rounded-full bg-[#d97757] hover:bg-[#c36445] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
                    title="Run review agent"
                  >
                    <Send className="h-3 w-3 translate-x-[-0.5px] translate-y-[-0.5px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3-Column Split Footer with Hairline Borders (scratch/image.png) */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border bg-card">
              {/* Column 1 */}
              <div className="p-6 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-[13px] font-bold text-foreground font-mono uppercase tracking-[0.05em]">
                    Content Graph
                  </div>
                  <p className="text-[12px] text-muted-foreground pt-1 leading-relaxed">
                    Build mental models, cluster topics, and discover missing
                    concepts across existing articles.
                  </p>
                </div>
                <div className="pt-3">
                  <a
                    href="#docs"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-foreground hover:opacity-60 transition-opacity"
                  >
                    <span>DOCS</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Column 2 */}
              <div className="p-6 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-[13px] font-bold text-foreground font-mono uppercase tracking-[0.05em]">
                    MCP Server
                  </div>
                  <p className="text-[12px] text-muted-foreground pt-1 leading-relaxed">
                    Inspect articles, evaluate citations, and sync directly with
                    your local engineering tools.
                  </p>
                </div>
                <div className="pt-3">
                  <a
                    href="#docs"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-foreground hover:opacity-60 transition-opacity"
                  >
                    <span>DOCS</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Column 3 */}
              <div className="p-6 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-[13px] font-bold text-foreground font-mono uppercase tracking-[0.05em]">
                    skill.md
                  </div>
                  <p className="text-[12px] text-muted-foreground pt-1 leading-relaxed">
                    Give your agent full knowledge of publication rules, author
                    style, and technical linting.
                  </p>
                </div>
                <div className="pt-3">
                  <a
                    href="#docs"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-foreground hover:opacity-60 transition-opacity"
                  >
                    <span>DOCS</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* =================================================================
            4. 4-COLUMN STATS BAR & SOCIAL PROOF (scratch/image.png)
            ================================================================= */}
        <section className="space-y-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border py-8 text-center">
            <div className="p-4 space-y-1">
              <div className="text-[28px] md:text-[34px] font-normal font-sans tabular-nums text-foreground">
                3,844,720
              </div>
              <div className="text-[12px] text-muted-foreground">
                Words indexed across Git repos
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-[28px] md:text-[34px] font-normal font-sans tabular-nums text-foreground">
                98.21%
              </div>
              <div className="text-[12px] text-muted-foreground">
                AEO answer engine readiness
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-[28px] md:text-[34px] font-normal font-sans tabular-nums text-foreground">
                1.87s
              </div>
              <div className="text-[12px] text-muted-foreground">
                Average review and diff latency
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-[28px] md:text-[34px] font-normal font-sans tabular-nums text-foreground">
                0
              </div>
              <div className="text-[12px] text-muted-foreground">
                Unresolved stale API claims
              </div>
            </div>
          </div>

          {/* Social Proof Logos Bar */}
          <div className="space-y-6 text-center">
            <div className="text-[11px] font-mono uppercase tracking-[0.12em] font-semibold text-muted-foreground">
              TECHNICAL BLOGS POWERED BY BIG AND SMALL TEAMS ALIKE!
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
              <span className="font-serif text-[18px] tracking-tight font-bold text-foreground">
                Peerlist
              </span>
              <span className="font-sans text-[17px] font-bold tracking-tight text-foreground">
                * supermemory™
              </span>
              <span className="font-serif italic text-[19px] font-medium text-foreground">
                gistr
              </span>
              <span className="font-sans text-[17px] font-semibold text-foreground">
                guidejar
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================
            5. FEATURE SECTION #01 — TRANSACTIONAL PUBLISHING & CODE / DIFF
            ================================================================= */}
        <section className="space-y-8 pt-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#d97757]">
              #01 — TRANSACTIONAL PUBLISHING
            </div>
            <h2 className="text-[28px] md:text-[36px] font-sans font-medium text-foreground">
              OTPs, updates, and diffs your readers can rely on.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Features List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <FolderGit2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    GIT INTEGRATION / REST
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Connect existing Markdown/MDX blogs programmatically with a
                    clean, reliable REST API or local Git hooks.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <Code2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    DIFF REVIEWS
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Drop-in libraries for Node, Next, and Astro. Every AI
                    suggestion is rendered as a clean, reviewable Git diff.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <RefreshCw className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    FRESHNESS AGENT
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Scans for outdated documentation, changed APIs, and broken
                    links before your readers notice.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    WEBHOOKS & CI
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Get real-time event notifications for every draft, lint
                    pass, content health audit, or publish failure.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#transactional"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[#615fff] hover:underline"
                >
                  <span>ALL ABOUT TRANSACTIONAL PUBLISHING</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Right Mockup Code & Diff Card */}
            <div className="lg:col-span-7">
              <div className="rounded-[16px] border border-border bg-card overflow-hidden shadow-sm">
                {/* Code Tabs Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted">
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('diff')}
                      className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'diff' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Unified Diff
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('curl')}
                      className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'curl' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      cURL
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('typescript')}
                      className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'typescript' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      TypeScript
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('rust')}
                      className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'rust' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Rust
                    </button>
                  </div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">
                    api.autosend.dev
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeCodeTab === 'diff' ? (
                    <DiffViewer
                      title="posts/building-mcp-server-typescript.md"
                      diffs={SAMPLE_DIFFS}
                    />
                  ) : (
                    <pre className="text-xs font-mono p-4 rounded-[12px] bg-background border border-border text-foreground overflow-x-auto leading-relaxed">
                      {activeCodeTab === 'curl' &&
                        `curl --location 'https://api.autosend.dev/v1/publish' \\
--header 'Authorization: Bearer YOUR_API_KEY' \\
--header 'Content-Type: application/json' \\
--data-raw '{
  "slug": "mcp-server-architecture",
  "branch": "main",
  "review": {
    "freshness": true,
    "aeo_optimize": true
  }
}'`}
                      {activeCodeTab === 'typescript' &&
                        `import { AutoSend } from '@autosend/client'

const client = new AutoSend({ apiKey: process.env.AUTOSEND_KEY })

await client.articles.sync({
  path: './content/blog',
  onProposedDiff: async (diff) => {
    console.log('AI proposed review diff:', diff.summary)
  }
})`}
                      {activeCodeTab === 'rust' &&
                        `use autosend_sdk::AutoSend;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = AutoSend::new("API_KEY");
    let review = client.review_post("mcp-typescript.md").await?;
    println!("Status: {:?}", review.health);
    Ok(())
}`}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            6. FEATURE SECTION #02 — THE CUSTOM WRITING EXPERIENCE
            ================================================================= */}
        <section className="space-y-8 pt-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#22b8cd]">
              #02 — CUSTOM WRITING WORKSPACE
            </div>
            <h2 className="text-[28px] md:text-[36px] font-sans font-medium text-foreground">
              Technical articles that reach, educate, and convert.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Features List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    CAMPAIGNS & DRAFTS
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Create, personalize, and publish technical guides. From
                    quick API notes to 20-page architecture deep-dives.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    SLASH COMMANDS
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Type <code>/</code> for instant headings, code blocks,
                    diffs, citations, and contextual AI suggestions without
                    leaving the keyboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    CONTENT GRAPH LINKING
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Segment and connect articles dynamically based on concepts,
                    search intent, and reader knowledge levels.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <GitCommit className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    MARKDOWN BUILDER
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Write in Markdown/MDX without bugging your design team.
                    Visual editing for speed, source control for ownership.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#articles"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[#615fff] hover:underline"
                >
                  <span>ALL ABOUT THE EDITOR</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Right Mockup Campaigns / Articles List (scratch/image.png) */}
            <div className="lg:col-span-7">
              <div className="rounded-[16px] border border-border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground">
                      Articles & Campaigns
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Connected to git repository:{' '}
                      <code>github.com/org/blog</code>
                    </p>
                  </div>
                  <Button variant="default" size="sm">
                    <Plus className="h-3 w-3" />
                    <span>NEW ARTICLE</span>
                  </Button>
                </div>

                {/* Article item 1 (published) */}
                <div className="p-3.5 rounded-[12px] border border-border bg-muted space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 font-mono text-[#5ea500] font-semibold">
                      <Send className="h-3 w-3" />
                      <span>PUBLISHED • 24 Mar, 2026 • 10:24 AM</span>
                    </div>
                    <Badge variant="lichen" shape="tag">
                      Health 96%
                    </Badge>
                  </div>
                  <div className="font-semibold text-[13px] text-foreground">
                    Product Release Mar 26: MCP Standard Architecture
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    Subject: What we shipped this month + an exciting surprise!
                  </div>
                </div>

                {/* Article item 2 (stale) */}
                <div className="p-3.5 rounded-[12px] border border-border bg-card space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 font-mono text-[#d97757] font-semibold">
                      <AlertCircle className="h-3 w-3" />
                      <span>NEEDS REVIEW • 20 Mar, 2026 • 10:40 AM</span>
                    </div>
                    <Badge variant="terracotta" shape="tag">
                      Stale API
                    </Badge>
                  </div>
                  <div className="font-semibold text-[13px] text-foreground">
                    Weekly Deep-Dive: Understanding Vector Databases
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    Subject: Jobs are changing and here's what you can do.
                  </div>
                </div>

                {/* Article item 3 (draft) */}
                <div className="p-3.5 rounded-[12px] border border-border bg-card space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 font-mono text-muted-foreground">
                      <GitBranch className="h-3 w-3" />
                      <span>DRAFT • 18 Mar, 2026 • 09:12 AM</span>
                    </div>
                    <Badge variant="outline" shape="tag">
                      Draft
                    </Badge>
                  </div>
                  <div className="font-semibold text-[13px] text-foreground">
                    Production Security for RAG Applications
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    Defending retrieval pipelines against indirect prompt
                    injection.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            7. FEATURE SECTION #03 — AUTOMATION & HEALTH PIPELINE
            ================================================================= */}
        <section className="space-y-8 pt-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#5ea500]">
              #03 — CONTENT HEALTH & AUTOMATION
            </div>
            <h2 className="text-[28px] md:text-[36px] font-sans font-medium text-foreground">
              Automate all articles from draft to continuous freshness.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Features List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    CONTENT AUTOMATION
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Create maintenance triggers, onboarding sequences, and
                    refresh campaigns that run quietly in the background.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <Cpu className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    SMART TRIGGERS
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Trigger automated reviews based on git commits, upstream
                    package releases, or broken documentation URLs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                    ANALYTICS & AEO INSIGHTS
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    See search queries, LLM citations, and link clicks. Spot
                    what's working and apply learnings to your next article.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#automation"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[#615fff] hover:underline"
                >
                  <span>ALL ABOUT CONTENT AUTOMATION</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Right Mockup Workflow Diagram (scratch/image.png) */}
            <div className="lg:col-span-7">
              <div className="rounded-[16px] border border-border bg-card p-6 shadow-sm space-y-4">
                {/* Node 1: Trigger */}
                <div className="p-3.5 rounded-[12px] border border-border bg-muted space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    TRIGGER
                  </div>
                  <div className="text-[13px] font-medium text-foreground flex items-center gap-2">
                    <span>Upstream package updated:</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-[4px] bg-card border border-border">
                      @modelcontextprotocol/sdk@1.0.0
                    </span>
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="w-[1px] h-6 bg-border mx-auto" />

                {/* Node 2: Wait & Condition */}
                <div className="p-3.5 rounded-[12px] border border-border bg-muted flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      WAIT FOR
                    </div>
                    <div className="text-[13px] font-medium text-foreground">
                      Review approval or author verification
                    </div>
                  </div>
                  <Badge variant="outline" shape="tag">
                    8 hrs
                  </Badge>
                </div>

                {/* Connecting Line */}
                <div className="w-[1px] h-6 bg-border mx-auto" />

                {/* Node 3: Action */}
                <div className="p-3.5 rounded-[12px] border border-[#615fff]/30 bg-[#615fff]/5 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#615fff]">
                    DIFF STAGED & PUBLISHED
                  </div>
                  <div className="text-[13px] font-medium text-foreground">
                    3 code snippets updated to v1.0.0 API definitions.
                  </div>
                </div>

                {/* Workflow End */}
                <div className="text-center pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.10em] text-muted-foreground">
                    AUTOMATION ENDS ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            8. MULTI PROJECT SUPPORT (scratch/image.png)
            ================================================================= */}
        <section className="rounded-[16px] border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Left Description */}
            <div className="p-8 md:p-12 space-y-4 flex flex-col justify-center">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#d97757]">
                MULTI PROJECT SUPPORT
              </div>
              <h2 className="text-[28px] md:text-[34px] font-sans font-medium text-foreground">
                Multiple Blogs, One Workspace.
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Create isolated projects for every product, client, or
                publication environment you manage—each with its own Git
                repository, custom domains, and author voice models.
              </p>
            </div>

            {/* Right Project Switcher Card (scratch/image.png) */}
            <div className="p-8 md:p-12 bg-muted flex items-center justify-center">
              <div className="w-full max-w-[340px] rounded-[12px] border border-border bg-card p-3 space-y-2 shadow-xs">
                <div className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-muted border border-border">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#615fff]" />
                    <span className="text-xs font-semibold text-foreground">
                      ConnectSphere
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>

                <div className="px-3 py-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>csphere.com</span>
                  <span className="text-[10px] font-mono uppercase">
                    ACTIVE
                  </span>
                </div>

                <div className="border-t border-border pt-2 px-1 space-y-1">
                  <div className="px-2 py-1.5 rounded-[6px] hover:bg-muted flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d97757]" />
                    <span>Frostline (frostline.io)</span>
                  </div>
                  <div className="px-2 py-1.5 rounded-[6px] hover:bg-muted flex items-center gap-2 text-xs font-semibold text-[#615fff] cursor-pointer">
                    <Plus className="h-3 w-3" />
                    <span>NEW PROJECT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            9. AGENTIC INTEGRATIONS (8-card grid per scratch/image.png)
            ================================================================= */}
        <section className="space-y-8">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#615fff]">
              AGENTIC INTEGRATIONS
            </div>
            <h2 className="text-[28px] md:text-[34px] font-sans font-medium text-foreground">
              Works with your favorite agent.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'CHATGPT', color: 'text-emerald-600' },
              { name: 'CODEX', color: 'text-indigo-600' },
              { name: 'CLAUDE', color: 'text-amber-600' },
              { name: 'ANTIGRAVITY', color: 'text-blue-600' },
              { name: 'CURSOR', color: 'text-cyan-600' },
              { name: 'LOVABLE', color: 'text-pink-600' },
              { name: 'COPILOT', color: 'text-violet-600' },
              { name: 'OTHERS', color: 'text-stone-500' },
            ].map((agent) => (
              <a
                key={agent.name}
                href="#agent"
                className="p-4 rounded-[12px] border border-border bg-card hover:border-foreground transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className={`h-4 w-4 ${agent.color}`} />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.05em] text-foreground">
                    {agent.name}
                  </span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* =================================================================
            10. TESTIMONIALS (scratch/image.png)
            ================================================================= */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 bg-card border border-border">
              <p className="text-[13px] text-foreground leading-relaxed italic font-serif">
                "AutoSend has transformed First Dollar. Our team is responsive
                and adding 190k users on our $50 plan was huge saving."
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-bold text-foreground">
                    PRATYUSH RUNGTA
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    First Dollar
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-muted-foreground">
                  PEERLIST
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 bg-card border border-border">
              <p className="text-[13px] text-foreground leading-relaxed italic font-serif">
                "Switching to AutoSend was smooth. The migration was quick, the
                team responsive, and the product matches big players in
                features."
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-bold text-foreground">
                    ARUN ANTHONY
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Founder, Gistr
                  </div>
                </div>
                <div className="font-serif italic text-xs font-bold text-muted-foreground">
                  gistr
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 bg-card border border-border">
              <p className="text-[13px] text-foreground leading-relaxed italic font-serif">
                "We chose AutoSend for its first-class email handling for LLMs
                and AI agents. It fits how agents think and allows LLMs to send
                reliable emails."
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-bold text-foreground">
                    C. C. FAN
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    CEO Vivgrid
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-muted-foreground">
                  vivgrid
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* =================================================================
            11. STILL WONDERING? (scratch/image.png)
            ================================================================= */}
        <section className="rounded-[16px] border border-border bg-card p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <h2 className="text-[26px] md:text-[32px] font-sans font-medium text-foreground">
                Still wondering?
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                See what your favorite LLM has to say about us, then make an
                informed decision.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-3">
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-[10px] border border-border bg-muted hover:border-foreground transition-colors flex items-center justify-between group"
              >
                <span className="text-xs font-mono font-semibold uppercase text-foreground">
                  ASK CHATGPT
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-[10px] border border-border bg-muted hover:border-foreground transition-colors flex items-center justify-between group"
              >
                <span className="text-xs font-mono font-semibold uppercase text-foreground">
                  ASK GEMINI
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              <a
                href="https://claude.ai"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-[10px] border border-border bg-muted hover:border-foreground transition-colors flex items-center justify-between group"
              >
                <span className="text-xs font-mono font-semibold uppercase text-foreground">
                  ASK CLAUDE
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              <a
                href="https://perplexity.ai"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-[10px] border border-border bg-muted hover:border-foreground transition-colors flex items-center justify-between group"
              >
                <span className="text-xs font-mono font-semibold uppercase text-foreground">
                  ASK PERPLEXITY
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              <div className="col-span-2 pt-1 text-center">
                <a
                  href="#contact"
                  className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground hover:text-[#615fff] transition-colors inline-flex items-center gap-1"
                >
                  <span>TALK TO A HUMAN</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            12. FOOTER NAVIGATION (scratch/image.png)
            ================================================================= */}
        <footer className="space-y-12 border-t border-border pt-12">
          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[12px]">
            <div className="space-y-3">
              <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
                SOLUTIONS
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#transactional" className="hover:text-foreground">
                    Transactional Emails
                  </a>
                </li>
                <li>
                  <a href="#marketing" className="hover:text-foreground">
                    Marketing Emails
                  </a>
                </li>
                <li>
                  <a href="#automation" className="hover:text-foreground">
                    Email Automation
                  </a>
                </li>
                <li>
                  <a href="#agents" className="hover:text-foreground">
                    Agents & LLMs
                  </a>
                </li>
                <li>
                  <a href="#deliverability" className="hover:text-foreground">
                    Deliverability
                  </a>
                </li>
                <li>
                  <a href="#inbound" className="hover:text-foreground">
                    Inbound Email API
                  </a>
                </li>
                <li>
                  <a href="#builder" className="hover:text-foreground">
                    Email Builder
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
                DOCS
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#getting-started" className="hover:text-foreground">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#api" className="hover:text-foreground">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#agents" className="hover:text-foreground">
                    Agents
                  </a>
                </li>
                <li>
                  <a href="#wiki" className="hover:text-foreground">
                    Wiki
                  </a>
                </li>
                <li>
                  <a href="#changelog" className="hover:text-foreground">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
                RESOURCES
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#faq" className="hover:text-foreground">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#glossary" className="hover:text-foreground">
                    Glossary
                  </a>
                </li>
                <li>
                  <a href="#affiliate" className="hover:text-foreground">
                    Be an Affiliate
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
                COMPARE
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#sendgrid" className="hover:text-foreground">
                    SendGrid
                  </a>
                </li>
                <li>
                  <a href="#loops" className="hover:text-foreground">
                    Loops
                  </a>
                </li>
                <li>
                  <a href="#resend" className="hover:text-foreground">
                    Resend
                  </a>
                </li>
                <li>
                  <a href="#postmark" className="hover:text-foreground">
                    Postmark
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
                LEGAL
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#fair-use" className="hover:text-foreground">
                    Fair Use
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-foreground">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#sub-processors" className="hover:text-foreground">
                    Sub-Processors
                  </a>
                </li>
                <li>
                  <a href="#dpa" className="hover:text-foreground">
                    Data Processing Addendum
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar (scratch/image.png) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">AUTOSEND</span>
              <span>© 2026 • PEERLIST INC.</span>
            </div>

            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-card">
              <span className="h-2 w-2 rounded-full bg-[#5ea500] animate-pulse" />
              <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <a
                href="https://discord.com"
                aria-label="Discord"
                className="hover:text-foreground"
              >
                Discord
              </a>
              <a
                href="https://x.com"
                aria-label="X"
                className="hover:text-foreground"
              >
                X
              </a>
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="hover:text-foreground"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
