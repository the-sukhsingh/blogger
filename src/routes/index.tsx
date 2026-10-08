import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Sparkles,
  GitBranch,
  Search,
  CheckCircle2,
  ArrowRight,
  Code2,
  Sliders,
  Send,
  Plus,
  RefreshCw,
  GitCommit,
} from 'lucide-react'

import { useTheme } from '#/components/theme-provider'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Switch } from '#/components/ui/switch'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '#/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#/components/ui/tabs'
import { Separator } from '#/components/ui/separator'
import { Tooltip } from '#/components/ui/tooltip'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '#/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '#/components/ui/dropdown-menu'
import { Callout } from '#/components/ui/callout'
import { ThemeSwitcher } from '#/components/ui/theme-switcher'
import { DiffViewer } from '#/components/ui/diff-viewer'
import type { DiffLine } from '#/components/ui/diff-viewer'
import { SlashCommandMenu } from '#/components/ui/slash-command'
import { HealthGauge } from '#/components/ui/health-gauge'
import { ArticleCard } from '#/components/ui/article-card'

export const Route = createFileRoute('/')({
  component: ComponentDesignSystemPage,
})

const SAMPLE_DIFFS: DiffLine[] = [
  {
    type: 'unchanged',
    oldLineNumber: 1,
    newLineNumber: 1,
    content: '## Understanding React Server Components',
  },
  {
    type: 'deletion',
    oldLineNumber: 2,
    content:
      'React Server Components allow you to run backend code directly in your component.',
  },
  {
    type: 'addition',
    newLineNumber: 2,
    content:
      'React Server Components (RSC) let components render exclusively on the server without shipping JavaScript to the client.',
  },
  {
    type: 'unchanged',
    oldLineNumber: 3,
    newLineNumber: 3,
    content:
      'This fundamentally reduces client-side bundle size and optimizes data fetching.',
  },
  {
    type: 'deletion',
    oldLineNumber: 4,
    content: 'Many developers find them confusing because of hydration quirks.',
  },
  {
    type: 'addition',
    newLineNumber: 4,
    content:
      'Because they never hydrate on the client, they cannot use state hooks like useState or browser effects.',
  },
]

function ComponentDesignSystemPage() {
  const { theme, resolvedMode } = useTheme()

  // Interactive state toggles for testing
  const [buttonLoading, setButtonLoading] = React.useState(false)
  const [checkboxChecked, setCheckboxChecked] = React.useState(true)
  const [switchChecked, setSwitchChecked] = React.useState(true)
  const [selectedSlashCommand, setSelectedSlashCommand] = React.useState<
    string | null
  >(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-150">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold tracking-tight text-base">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-mono">
                A
              </span>
              <span>Agent</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3.5 w-3.5" /> master
              </span>
              <span>·</span>
              <span className="text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                sync clean
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              size="sm"
              className="hidden md:inline-flex font-mono text-[11px]"
            >
              AGENTS.md Design System
            </Badge>

            {/* Theme & Mode Switcher */}
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero / Header Philosophy banner */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" size="sm" className="font-mono">
              v1.0.0 Component Kit
            </Badge>
            <Badge variant="outline" size="sm">
              Current: <strong className="ml-1 capitalize">{theme}</strong> (
              {resolvedMode})
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Treat a technical blog like a codebase.
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
            Minimal, distraction-free, typography-focused components crafted for
            the AI technical publishing system. Built with accessible
            primitives, 8-state precision, custom physics, and swappable
            Tailwind design tokens.
          </p>
        </section>

        {/* Section Tabs */}
        <Tabs defaultValue="primitives">
          <TabsList variant="pill" className="w-full sm:w-auto">
            <TabsTrigger value="primitives">UI Primitives</TabsTrigger>
            <TabsTrigger value="domain">Publishing & AI Components</TabsTrigger>
            <TabsTrigger value="states">8-State Matrix & Polish</TabsTrigger>
            <TabsTrigger value="themes">Design Themes</TabsTrigger>
          </TabsList>

          {/* =================================================================
              Tab 1: UI Primitives (Buttons, Cards, Inputs, Badges, Overlays)
              ================================================================= */}
          <TabsContent value="primitives" className="space-y-8 mt-6">
            {/* Buttons Showcase */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Buttons</CardTitle>
                    <CardDescription>
                      Emil Kowalski press physics (scale 0.96 over 150ms
                      ease-out on :active), disabled immunity, and loading
                      states.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Toggle Loading:
                    </span>
                    <Switch
                      checked={buttonLoading}
                      onCheckedChange={setButtonLoading}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variant row */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Variants
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button variant="default" isLoading={buttonLoading}>
                      Primary Button
                    </Button>
                    <Button variant="secondary" isLoading={buttonLoading}>
                      Secondary
                    </Button>
                    <Button variant="outline" isLoading={buttonLoading}>
                      Outline
                    </Button>
                    <Button variant="subtle" isLoading={buttonLoading}>
                      Subtle
                    </Button>
                    <Button variant="ghost" isLoading={buttonLoading}>
                      Ghost
                    </Button>
                    <Button variant="destructive" isLoading={buttonLoading}>
                      Destructive
                    </Button>
                    <Button variant="success" isLoading={buttonLoading}>
                      Success
                    </Button>
                    <Button variant="link">Link Style</Button>
                  </div>
                </div>

                {/* Sizes row */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sizes & Icons
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                      size="lg"
                      leftIcon={<Sparkles className="h-4 w-4" />}
                    >
                      Large Action
                    </Button>
                    <Button
                      size="default"
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Default (36px)
                    </Button>
                    <Button
                      size="sm"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Small (32px)
                    </Button>
                    <Button size="xs">Extra Small (28px)</Button>
                    <Tooltip content="Icon button tooltip (instant subsequent hover)">
                      <Button variant="outline" size="icon">
                        <Code2 className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Button variant="outline" size="icon-sm">
                      <Sliders className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      disabled
                      leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                    >
                      Disabled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Form Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Text Inputs & Textareas</CardTitle>
                  <CardDescription>
                    Safeguarded at 16px on mobile to eliminate iOS Safari
                    viewport zoom, 14px on desktop.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Standard Input
                    </label>
                    <Input placeholder="e.g. Building an MCP Server with TypeScript" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      With Prefix Icon & Search
                    </label>
                    <Input
                      leftIcon={<Search className="h-4 w-4" />}
                      placeholder="Search publication concepts..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Validation Error State
                    </label>
                    <Input error defaultValue="invalid-slug-format@@@" />
                    <p className="text-[11px] text-destructive">
                      Slug must contain only alphanumeric characters and
                      hyphens.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Technical Textarea
                    </label>
                    <Textarea
                      placeholder="Rough thoughts, code snippets, or article outline..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Toggles, Checkboxes & Badges */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Toggles & Checkboxes</CardTitle>
                    <CardDescription>
                      Accessible controls with keyboard space/enter triggers and
                      smooth 150ms transitions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Git Auto-Commit on Publish
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Create commit when publishing changes
                        </div>
                      </div>
                      <Switch
                        checked={switchChecked}
                        onCheckedChange={setSwitchChecked}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          AEO Answerability Verification
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Analyze definition placement and structure
                        </div>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="check1"
                        checked={checkboxChecked}
                        onCheckedChange={setCheckboxChecked}
                      />
                      <label
                        htmlFor="check1"
                        className="text-xs font-medium text-foreground cursor-pointer select-none"
                      >
                        Check for broken external links before git push
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id="check2" defaultChecked={false} />
                      <label
                        htmlFor="check2"
                        className="text-xs font-medium text-foreground cursor-pointer select-none"
                      >
                        Strict publication linting (block on missing
                        definitions)
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Badges & Status Indicators</CardTitle>
                    <CardDescription>
                      Tabular numbers, subtle borders, dot indicators for
                      publication lifecycle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default">Published</Badge>
                      <Badge variant="secondary" dot dotColor="warning">
                        Draft in Review
                      </Badge>
                      <Badge variant="outline">Git: staged</Badge>
                      <Badge variant="success" dot dotColor="success">
                        AEO Score 94%
                      </Badge>
                      <Badge variant="warning" dot dotColor="warning">
                        Freshness 63%
                      </Badge>
                      <Badge variant="destructive" dot dotColor="destructive">
                        Broken Link
                      </Badge>
                      <Badge variant="accent">AI Refresh Suggested</Badge>
                      <Badge variant="muted">Archived</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Overlays, Dialog & Tooltips */}
            <Card>
              <CardHeader>
                <CardTitle>Dialogs, Dropdowns & Tooltips</CardTitle>
                <CardDescription>
                  Origin-aware popovers, centered modals, and fast-response
                  tooltips.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                {/* Modal Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      leftIcon={<Sparkles className="h-4 w-4" />}
                    >
                      Open AI Review Dialog
                    </Button>
                  </DialogTrigger>
                  <DialogContent onClose={() => setDialogOpen(false)}>
                    <DialogHeader>
                      <DialogTitle>AI Technical Review (AGENTS.md)</DialogTitle>
                      <DialogDescription>
                        Autonomous inspection completed across 14 related
                        articles in your publication knowledge graph.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2 text-xs">
                      <Callout type="ai" title="Duplicate Concept Detected">
                        You already explain MCP architecture in{' '}
                        <em>Understanding Modern AI Agents</em>. We recommend
                        focusing this article purely on TypeScript
                        implementation.
                      </Callout>
                      <Callout type="warning" title="Stale Package Version">
                        The SDK example references{' '}
                        <code>@modelcontextprotocol/sdk@0.4.0</code>. Current
                        version is <code>1.0.0</code>.
                      </Callout>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Dismiss</Button>
                      </DialogClose>
                      <Button
                        variant="default"
                        onClick={() => setDialogOpen(false)}
                      >
                        Apply Recommendations
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Publication Actions ▾</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="left">
                    <DropdownMenuLabel>Git & Publishing</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <GitCommit className="h-3.5 w-3.5 mr-2" /> Commit Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Send className="h-3.5 w-3.5 mr-2" /> Publish to Blog
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Intelligence</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Sparkles className="h-3.5 w-3.5 mr-2" /> Scan Content
                      Gaps
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="h-3.5 w-3.5 mr-2" /> Run Health
                      Agent
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive>
                      Unpublish Article
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Tooltips */}
                <Tooltip content="Direct link to Git commit history">
                  <Button variant="secondary" size="sm">
                    Hover for Tooltip
                  </Button>
                </Tooltip>

                <Tooltip content="Instant tooltip on subsequent hover!">
                  <Button variant="secondary" size="sm">
                    Adjacent Tooltip
                  </Button>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Editorial Callouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Callout
                type="ai"
                title="Content Refresh Agent Proposes 3 Updates"
              >
                Referenced API endpoint has changed from <code>/v1/models</code>{' '}
                to <code>/v2/models</code>. A unified diff is ready for your
                review.
              </Callout>
              <Callout type="warning" title="Primary Definition Buried">
                Your article answers the main question well, but the primary
                definition appears in paragraph 6. Moving it to the introduction
                improves both reader retention and Answer Engine Optimization.
              </Callout>
              <Callout type="tip" title="Internal Link Opportunity">
                You mention <strong>vector embeddings</strong> 7 times. Would
                you like to link to your foundational guide{' '}
                <em>Understanding Vector Databases</em>?
              </Callout>
              <Callout type="success" title="Publication Graph Synced">
                All 42 articles parsed. Cross-reference index updated with 128
                entity relationships.
              </Callout>
            </div>
          </TabsContent>

          {/* =================================================================
              Tab 2: Domain Components (Diff Viewer, Slash Command, Health Gauge, Article Card)
              ================================================================= */}
          <TabsContent value="domain" className="space-y-8 mt-6">
            {/* AGENTS.md § 11: Diff Viewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    AI Modification Review (Diff Viewer)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    "AI Should Use Diffs. Every meaningful AI modification
                    should be reviewable. AI proposes. Author decides."
                    (AGENTS.md § 11)
                  </p>
                </div>
              </div>
              <DiffViewer
                title="Writing Agent · Improved Clarity & Technical Accuracy"
                description="Refined explanation of React Server Components to clarify execution model and client bundle impact."
                diffs={SAMPLE_DIFFS}
                onAccept={() => alert('Diff accepted! Applied to draft.')}
                onReject={() => alert('Diff rejected.')}
              />
            </div>

            {/* Editor Components: Slash Command & Health Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Slash Command Palette */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Slash Command Menu (AGENTS.md § 9)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Minimal keyboard-first command system for technical blocks
                    and non-intrusive AI actions.
                  </p>
                </div>
                <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col items-center justify-center">
                  <SlashCommandMenu
                    onSelect={(cmd) => setSelectedSlashCommand(cmd.label)}
                  />
                  {selectedSlashCommand && (
                    <div className="mt-4 text-xs font-mono text-muted-foreground">
                      Triggered:{' '}
                      <strong className="text-foreground">
                        {selectedSlashCommand}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Health Gauge */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Article Health Intelligence (AGENTS.md § 19)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    "Numbers are secondary. The important part is the
                    explanation." Continuous health analysis.
                  </p>
                </div>
                <HealthGauge
                  overallScore={84}
                  statusText="Building an MCP Server in TypeScript"
                  metrics={[
                    {
                      name: 'Content',
                      score: 92,
                      note: 'Complete code examples',
                    },
                    { name: 'SEO', score: 87, note: 'Clear title & slug' },
                    {
                      name: 'AEO',
                      score: 81,
                      note: 'Direct answers structured',
                    },
                    {
                      name: 'Links',
                      score: 95,
                      note: '5 internal connections',
                    },
                    {
                      name: 'Freshness',
                      score: 63,
                      note: 'SDK version outdated',
                    },
                    {
                      name: 'Technical',
                      score: 89,
                      note: 'Valid TypeScript types',
                    },
                  ]}
                  warnings={[
                    'Referenced package @modelcontextprotocol/sdk has updated from 0.4 to 1.0.',
                    'The main definition of "MCP Tool" appears after code block instead of before.',
                    'One external link to GitHub repository is returning HTTP 301 redirect.',
                  ]}
                />
              </div>
            </div>

            {/* Publication Article Cards */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Article Cards (Publication Workspace)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Connects to Git repository, detects stale claims, shows
                  pending AI diffs, and health scores.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ArticleCard
                  id="art-1"
                  title="Building an MCP Server with TypeScript"
                  excerpt="A comprehensive guide to implementing the Model Context Protocol in TypeScript, connecting local tools to desktop AI clients."
                  slug="building-mcp-server-typescript"
                  publishedAt="Oct 4, 2026"
                  readingTime="7 min read"
                  gitBranch="main"
                  healthScore={84}
                  topics={['MCP', 'TypeScript', 'Agents', 'AI']}
                  pendingDiffsCount={2}
                  isStale={true}
                  staleReason="Model Context Protocol v1.0 SDK introduced schema breaking changes."
                  onEdit={() => alert('Opening in Custom Editor...')}
                  onReviewDiffs={() => alert('Opening Diff Reviewer...')}
                />

                <ArticleCard
                  id="art-2"
                  title="Production Security for RAG Applications"
                  excerpt="Defending retrieval-augmented generation pipelines against indirect prompt injection, vector exfiltration, and context poisoning."
                  slug="production-security-rag"
                  publishedAt="Oct 1, 2026"
                  readingTime="12 min read"
                  gitBranch="feature/rag-sec"
                  healthScore={94}
                  topics={['RAG', 'Vector DB', 'Security', 'LLM']}
                  pendingDiffsCount={0}
                  isStale={false}
                  onEdit={() => alert('Opening in Custom Editor...')}
                />
              </div>
            </div>
          </TabsContent>

          {/* =================================================================
              Tab 3: 8-State Matrix (Hallmark / Emil Kowalski / Better-UI)
              ================================================================= */}
          <TabsContent value="states" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>8-State Verification Matrix</CardTitle>
                <CardDescription>
                  Hallmark Component-Scope requirement: every interactive
                  element must provide dedicated styling for all 8 states:
                  Default · Hover · Focus-Visible · Active · Disabled · Loading
                  · Error · Success.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Default */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      1. Default
                    </span>
                    <div>
                      <Button variant="default" className="w-full">
                        Submit Post
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Standard resting state
                    </p>
                  </div>

                  {/* 2. Hover */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      2. Hover
                    </span>
                    <div>
                      <Button
                        variant="default"
                        className="w-full bg-primary/90"
                      >
                        Submit Post
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Pointer hovering with 90% opacity
                    </p>
                  </div>

                  {/* 3. Focus-Visible */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      3. Focus-Visible
                    </span>
                    <div>
                      <Button
                        variant="default"
                        className="w-full ring-2 ring-ring ring-offset-2"
                      >
                        Submit Post
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Keyboard navigation ring
                    </p>
                  </div>

                  {/* 4. Active (Pressed) */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      4. Active (Pressed)
                    </span>
                    <div>
                      <Button variant="default" className="w-full scale-[0.96]">
                        Submit Post
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Emil physics: scale(0.96)
                    </p>
                  </div>

                  {/* 5. Disabled */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      5. Disabled
                    </span>
                    <div>
                      <Button variant="default" disabled className="w-full">
                        Submit Post
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Pointer-events none, 50% opacity
                    </p>
                  </div>

                  {/* 6. Loading */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      6. Loading
                    </span>
                    <div>
                      <Button variant="default" isLoading className="w-full">
                        Publishing...
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Spinner with aria-busy
                    </p>
                  </div>

                  {/* 7. Error */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      7. Error
                    </span>
                    <div>
                      <Button variant="destructive" className="w-full">
                        Sync Failed
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Destructive alert variant
                    </p>
                  </div>

                  {/* 8. Success */}
                  <div className="space-y-2 rounded-lg border border-border p-4 bg-background">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                      8. Success
                    </span>
                    <div>
                      <Button
                        variant="success"
                        leftIcon={<CheckCircle2 className="h-4 w-4" />}
                        className="w-full"
                      >
                        Committed ✓
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Completed feedback state
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Engineering Polish Rules Table (Emil Kowalski Review Format) */}
            <Card>
              <CardHeader>
                <CardTitle>Design Engineering Principles Applied</CardTitle>
                <CardDescription>
                  Formatted per Emil Kowalski review specifications (| Before |
                  After | Why |).
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-mono uppercase text-[11px]">
                      <th className="py-2 pr-4 font-semibold">Before</th>
                      <th className="py-2 pr-4 font-semibold">After</th>
                      <th className="py-2 font-semibold">Why</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr>
                      <td className="py-2.5 pr-4 text-destructive">
                        transition: all 300ms
                      </td>
                      <td className="py-2.5 pr-4 text-success">
                        transition: transform 150ms ease-out
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">
                        Avoid transition: all; name exact properties to prevent
                        performance hit and smeared state changes.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 text-destructive">
                        No active press feedback
                      </td>
                      <td className="py-2.5 pr-4 text-success">
                        enabled:active:scale-[0.96]
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">
                        Buttons must feel responsive to press; disabled buttons
                        must never scale.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 text-destructive">
                        transform: scale(0)
                      </td>
                      <td className="py-2.5 pr-4 text-success">
                        transform: scale(0.95); opacity: 0
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">
                        Nothing in the real world pops into view from scale(0);
                        start from 0.95 with opacity.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 text-destructive">
                        Hardcoded 14px on mobile
                      </td>
                      <td className="py-2.5 pr-4 text-success">
                        text-base sm:text-sm (16px mobile)
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">
                        Prevents iOS Safari auto-zooming the viewport when
                        focusing inputs.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 text-destructive">
                        Delayed adjacent tooltips
                      </td>
                      <td className="py-2.5 pr-4 text-success">
                        Instant subsequent tooltips
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">
                        Once first tooltip opens, hovering adjacent tooltips
                        opens them instantly with 0ms delay.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 text-destructive">
                        Color smear on theme switch
                      </td>
                      <td className="py-2.5 pr-4 text-success">
                        .theme-transition-disabled
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">
                        Suppress transitions on theme toggle, force style flush,
                        restore next frame.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================================================================
              Tab 4: Swappable Design Themes
              ================================================================= */}
          <TabsContent value="themes" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>5 Pre-configured Design Themes</CardTitle>
                <CardDescription>
                  Tailwind CSS v4 variable-driven themes. Switch effortlessly
                  between palettes and light/dark modes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Theme 1: Zinc */}
                  <div
                    onClick={() => {}}
                    className="space-y-2 rounded-xl border border-border p-4 bg-card cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        1. Zinc (Default)
                      </span>
                      <span className="h-3 w-3 rounded-full bg-zinc-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clean minimalist editorial aesthetic. High contrast,
                      neutral gray tone inspired by Raycast and iA Writer.
                    </p>
                    <div className="flex gap-1.5 pt-2">
                      <span className="h-5 w-5 rounded-md border border-border bg-zinc-100 dark:bg-zinc-900" />
                      <span className="h-5 w-5 rounded-md border border-border bg-zinc-900 dark:bg-zinc-100" />
                      <span className="h-5 w-5 rounded-md border border-border bg-zinc-500" />
                    </div>
                  </div>

                  {/* Theme 2: Warm Paper */}
                  <div
                    onClick={() => {}}
                    className="space-y-2 rounded-xl border border-border p-4 bg-card cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        2. Warm Paper
                      </span>
                      <span className="h-3 w-3 rounded-full bg-amber-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tactile, warm parchment tone. Ideal for bookish technical
                      essayists and reflective documentation.
                    </p>
                    <div className="flex gap-1.5 pt-2">
                      <span className="h-5 w-5 rounded-md border border-border bg-[#faf7f2] dark:bg-[#1f1d1a]" />
                      <span className="h-5 w-5 rounded-md border border-border bg-amber-800 dark:bg-amber-400" />
                      <span className="h-5 w-5 rounded-md border border-border bg-amber-600" />
                    </div>
                  </div>

                  {/* Theme 3: Terminal Mono */}
                  <div
                    onClick={() => {}}
                    className="space-y-2 rounded-xl border border-border p-4 bg-card cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        3. Terminal Mono
                      </span>
                      <span className="h-3 w-3 rounded-full bg-emerald-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      "Treat a blog like a codebase." Razor hairlines, pure
                      contrast, and subtle phosphor green accents.
                    </p>
                    <div className="flex gap-1.5 pt-2">
                      <span className="h-5 w-5 rounded-md border border-border bg-black dark:bg-zinc-950" />
                      <span className="h-5 w-5 rounded-md border border-border bg-emerald-500" />
                      <span className="h-5 w-5 rounded-md border border-border bg-zinc-800" />
                    </div>
                  </div>

                  {/* Theme 4: Cobalt */}
                  <div
                    onClick={() => {}}
                    className="space-y-2 rounded-xl border border-border p-4 bg-card cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        4. Cobalt Engineering
                      </span>
                      <span className="h-3 w-3 rounded-full bg-blue-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Precision engineering aesthetic. Subtle slate blue hue for
                      technical documentation and developer tools.
                    </p>
                    <div className="flex gap-1.5 pt-2">
                      <span className="h-5 w-5 rounded-md border border-border bg-blue-50 dark:bg-blue-950" />
                      <span className="h-5 w-5 rounded-md border border-border bg-blue-600 dark:bg-blue-400" />
                      <span className="h-5 w-5 rounded-md border border-border bg-slate-500" />
                    </div>
                  </div>

                  {/* Theme 5: Forest Sage */}
                  <div
                    onClick={() => {}}
                    className="space-y-2 rounded-xl border border-border p-4 bg-card cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        5. Forest Sage
                      </span>
                      <span className="h-3 w-3 rounded-full bg-emerald-700" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Calm, focused writing tone with soothing botanical
                      accents. Minimizes cognitive distraction during long-form
                      composition.
                    </p>
                    <div className="flex gap-1.5 pt-2">
                      <span className="h-5 w-5 rounded-md border border-border bg-[#f4f7f4] dark:bg-[#161f17]" />
                      <span className="h-5 w-5 rounded-md border border-border bg-emerald-700 dark:bg-emerald-400" />
                      <span className="h-5 w-5 rounded-md border border-border bg-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-foreground">
                      Switch Active Theme Preset Now:
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Use the theme switcher in the top right or trigger
                      directly
                    </div>
                  </div>
                  <ThemeSwitcher />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-background py-8 mt-16 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Agent</span>
            <span>— AI Publishing System for Technical Blogs</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Git-friendly</span>
            <span>·</span>
            <span>WCAG 2.2 AA</span>
            <span>·</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
