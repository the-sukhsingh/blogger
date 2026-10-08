import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Sparkles,
  GitBranch,
  Search,
  ArrowRight,
  RefreshCw,
  Layers,
  ChevronDown,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Switch } from '#/components/ui/switch'
import { Checkbox } from '#/components/ui/checkbox'
import { Card } from '#/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#/components/ui/tabs'
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
  component: AutoSendStylePage,
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

function AutoSendStylePage() {
  // State toggles for interactive components
  const [buttonLoading, setButtonLoading] = React.useState(false)
  const [checkboxChecked, setCheckboxChecked] = React.useState(true)
  const [switchChecked, setSwitchChecked] = React.useState(true)
  const [selectedSlashCommand, setSelectedSlashCommand] = React.useState<
    string | null
  >(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] text-[#292524] dark:text-[#fafaf9] font-sans transition-colors duration-150">
      {/* =================================================================
          Top Navigation Bar (design.md: Full-width on Warm Bone, no bottom border)
          ================================================================= */}
      <header className="w-full bg-[#fafaf9] dark:bg-[#0c0a09]">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left: Brand mark + 'AGENT' in Geist 14px 600 uppercase */}
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#292524] dark:bg-[#fafaf9] text-[#fafaf9] dark:text-[#0c0a09] font-mono text-xs font-bold">
                ♣
              </span>
              <span className="font-sans text-[14px] font-semibold uppercase tracking-[0.04em] text-[#292524] dark:text-[#fafaf9]">
                Agent
              </span>
            </a>

            {/* Git working tree status badge */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#e7e5e4] dark:border-[#292524] text-[12px] text-[#79716b] dark:text-[#a6a09b] font-mono">
              <GitBranch className="h-3.5 w-3.5" />
              <span>main</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-[#5ea500]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ea500]" />
                repo connected
              </span>
            </div>
          </div>

          {/* Center Links (Geist 14px 400 Charcoal) */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] text-[#292524] dark:text-[#fafaf9]">
            <a
              href="#features"
              className="hover:text-[#615fff] transition-colors"
            >
              Features
            </a>
            <div className="flex items-center gap-1 hover:text-[#615fff] cursor-pointer transition-colors">
              <span>Solutions</span>
              <ChevronDown className="h-3 w-3 text-[#79716b]" />
            </div>
            <a
              href="#primitives"
              className="hover:text-[#615fff] transition-colors"
            >
              Components
            </a>
            <div className="flex items-center gap-1 hover:text-[#615fff] cursor-pointer transition-colors">
              <span>Docs</span>
              <ChevronDown className="h-3 w-3 text-[#79716b]" />
            </div>
          </nav>

          {/* Right Actions: Ghost button + Electric Indigo CTA + Theme */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex text-[14px]"
            >
              Log In
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-[38px] px-4 text-[13px]"
            >
              Sign Up
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* =================================================================
          Hero Section (design.md: Centered single-column, Cooper serif headline with italic)
          ================================================================= */}
      <section className="pt-20 pb-20 px-6 max-w-[1200px] mx-auto text-center space-y-7">
        {/* Section Eyebrow Tag: Geist Mono 12px weight 600 uppercase 0.10em */}
        <div className="eyebrow-tag">
          AN AI-NATIVE PUBLISHING WORKSPACE FOR TECHNICAL WRITERS
        </div>

        {/* Cooper Serif Display Headline with exactly one italic word */}
        <h1 className="font-serif text-[48px] sm:text-[68px] lg:text-[76px] font-normal leading-[1.08] tracking-tight text-[#292524] dark:text-[#fafaf9] max-w-[960px] mx-auto">
          Treat a technical blog like a{' '}
          <em className="italic font-normal text-[#615fff] dark:text-[#7f7dff]">
            codebase
          </em>
          .
        </h1>

        {/* Subtext: Geist 18px 400 Bark Grey across two short lines */}
        <p className="text-[17px] sm:text-[18px] text-[#79716b] dark:text-[#a6a09b] max-w-[700px] mx-auto leading-[1.56]">
          A growing publication needs diffs, staleness detection, internal link
          maintenance, and answer-engine intelligence — directly connected to
          your Git workflow.
        </p>

        {/* CTA Pair: Ghost outline BOOK A DEMO + Filled Electric Indigo SIGN UP */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button variant="outline" size="default">
            Book A Demo
          </Button>
          <Button
            variant="default"
            size="default"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Connect Repository
          </Button>
        </div>
      </section>

      {/* =================================================================
          Product Showcase Card (design.md: 16px radius, soft drop shadow)
          ================================================================= */}
      <section className="max-w-[1200px] mx-auto px-6 mb-20">
        <Card variant="showcase" className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e5e4] dark:border-[#292524] pb-4">
            <div className="space-y-1">
              <div className="eyebrow-tag text-left">
                INTELLIGENT AI REVIEW LAYER
              </div>
              <h2 className="text-[20px] font-semibold text-[#292524] dark:text-[#fafaf9] tracking-tight">
                Review proposed modifications as visual diffs
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm" shape="pill">
                Branch: main
              </Badge>
              <Badge variant="lichen" size="sm" shape="pill">
                AI Proposes · Author Decides
              </Badge>
            </div>
          </div>

          {/* Interactive Live Diff Viewer */}
          <DiffViewer
            title="Writing Agent · Technical Precision & Freshness Upgrade"
            description="Upgraded MCP definition and replaced outdated 0.4.0 SDK installation command with current 1.0.0 guidelines."
            diffs={SAMPLE_DIFFS}
            onAccept={() =>
              alert('Diff accepted! Applied to repository draft.')
            }
            onReject={() => alert('Diff rejected.')}
          />
        </Card>
      </section>

      {/* =================================================================
          Stats Bar (design.md: Full-width white band, 1px borders, 4 columns)
          ================================================================= */}
      <section className="w-full bg-white dark:bg-[#171514] border-y border-[#e7e5e4] dark:border-[#292524] mb-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e7e5e4] dark:divide-[#292524]">
          {/* Col 1 */}
          <div className="py-6 px-6 text-center space-y-1">
            <div className="font-mono text-[24px] font-normal text-[#292524] dark:text-[#fafaf9] tabular-nums">
              42
            </div>
            <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-medium">
              Articles Indexed
            </div>
          </div>

          {/* Col 2 */}
          <div className="py-6 px-6 text-center space-y-1">
            <div className="font-mono text-[24px] font-normal text-[#292524] dark:text-[#fafaf9] tabular-nums">
              96.82%
            </div>
            <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-medium">
              AEO Readiness
            </div>
          </div>

          {/* Col 3 */}
          <div className="py-6 px-6 text-center space-y-1">
            <div className="font-mono text-[24px] font-normal text-[#292524] dark:text-[#fafaf9] tabular-nums">
              3
            </div>
            <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-medium">
              Stale APIs Flagged
            </div>
          </div>

          {/* Col 4 */}
          <div className="py-6 px-6 text-center space-y-1">
            <div className="font-mono text-[24px] font-normal text-[#292524] dark:text-[#fafaf9] tabular-nums">
              0.15s
            </div>
            <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-medium">
              Git Commit Latency
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          Feature Cards (design.md: 3-column grid with 24px gaps, 8px radius)
          ================================================================= */}
      <section
        id="features"
        className="max-w-[1200px] mx-auto px-6 mb-20 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="eyebrow-tag">DIFFERENTIATION BY INTELLIGENCE</div>
          <h2 className="font-serif text-[32px] sm:text-[40px] text-[#292524] dark:text-[#fafaf9]">
            Content intelligence across the entire publication
          </h2>
          <p className="text-[14px] text-[#79716b] dark:text-[#a6a09b] max-w-[600px] mx-auto">
            Traditional CMSs focus on rich text formatting. Agent understands
            the relationships between topics, claims, and search intent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card variant="feature" className="space-y-4">
            <div className="h-8 w-8 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] flex items-center justify-center text-[#615fff]">
              <Layers className="h-4 w-4" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[18px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                Publication Knowledge Graph
              </h3>
              <p className="text-[14px] text-[#79716b] dark:text-[#a6a09b] leading-[1.43]">
                Connects articles through shared entities and concepts,
                identifying unlinked opportunities and duplicate topic overlaps.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between">
              <a
                href="#primitives"
                className="font-mono text-[12px] font-semibold uppercase tracking-[0.04em] text-[#292524] dark:text-[#fafaf9] hover:opacity-60 transition-opacity"
              >
                Docs →
              </a>
              <Badge variant="secondary" size="sm">
                v1.2.0
              </Badge>
            </div>
          </Card>

          {/* Card 2 */}
          <Card variant="feature" className="space-y-4">
            <div className="h-8 w-8 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] flex items-center justify-center text-[#5ea500]">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[18px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                Content Refresh Agent
              </h3>
              <p className="text-[14px] text-[#79716b] dark:text-[#a6a09b] leading-[1.43]">
                Periodically flags outdated packages, deprecated framework
                methods, and broken external links, proposing fixes as
                reviewable diffs.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between">
              <a
                href="#primitives"
                className="font-mono text-[12px] font-semibold uppercase tracking-[0.04em] text-[#292524] dark:text-[#fafaf9] hover:opacity-60 transition-opacity"
              >
                Docs →
              </a>
              <Badge variant="lichen" size="sm">
                Active
              </Badge>
            </div>
          </Card>

          {/* Card 3 */}
          <Card variant="feature" className="space-y-4">
            <div className="h-8 w-8 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] flex items-center justify-center text-[#d97757]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[18px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                Answer Engine Optimization
              </h3>
              <p className="text-[14px] text-[#79716b] dark:text-[#a6a09b] leading-[1.43]">
                Audits definition positions and direct answers so modern answer
                engines (Perplexity, ChatGPT, Claude) accurately cite your
                posts.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between">
              <a
                href="#primitives"
                className="font-mono text-[12px] font-semibold uppercase tracking-[0.04em] text-[#292524] dark:text-[#fafaf9] hover:opacity-60 transition-opacity"
              >
                Docs →
              </a>
              <Badge variant="terracotta" size="sm">
                AEO 94%
              </Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* =================================================================
          Interactive Component Workbench & Micro Design Decisions
          ================================================================= */}
      <section
        id="primitives"
        className="max-w-[1200px] mx-auto px-6 mb-20 space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e5e4] dark:border-[#292524] pb-4">
          <div>
            <div className="eyebrow-tag">INTERACTIVE WORKBENCH</div>
            <h2 className="text-[28px] font-semibold text-[#292524] dark:text-[#fafaf9] tracking-tight">
              AutoSend Component Design System
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">
              Palette: Warm Bone + Stone Mist + Electric Indigo
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="components">
          <TabsList variant="underline" className="mb-6">
            <TabsTrigger value="components" variant="underline">
              Component Primitives
            </TabsTrigger>
            <TabsTrigger value="editorial" variant="underline">
              Publishing & Editorial Tools
            </TabsTrigger>
            <TabsTrigger value="tokens" variant="underline">
              Tokens Reference (design.md)
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Component Primitives */}
          <TabsContent value="components" className="space-y-8">
            {/* Buttons Row */}
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#e7e5e4] dark:border-[#292524] pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-[16px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                    Button Hierarchy
                  </h3>
                  <p className="text-[13px] text-[#79716b] dark:text-[#a6a09b]">
                    Primary action is Electric Indigo (#615fff); secondary
                    actions are Ghost Outline (#e7e5e4). 8px radius, uppercase
                    0.04em tracking.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#79716b]">Loading State:</span>
                  <Switch
                    checked={buttonLoading}
                    onCheckedChange={setButtonLoading}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default" isLoading={buttonLoading}>
                  Primary Action
                </Button>
                <Button variant="outline" isLoading={buttonLoading}>
                  Ghost Outline
                </Button>
                <Button variant="ghost" isLoading={buttonLoading}>
                  Ghost Text Only
                </Button>
                <Button variant="secondary" isLoading={buttonLoading}>
                  Secondary Flat
                </Button>
                <Button variant="destructive" isLoading={buttonLoading}>
                  Alarm Red
                </Button>
                <Button variant="success" isLoading={buttonLoading}>
                  Lichen Green
                </Button>
                <Button
                  variant="arrow"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Arrow Link →
                </Button>
              </div>
            </Card>

            {/* Inputs & Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-5">
                <div className="space-y-0.5">
                  <h3 className="text-[16px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                    Form Inputs (design.md)
                  </h3>
                  <p className="text-[13px] text-[#79716b] dark:text-[#a6a09b]">
                    12px radius, stone border #e7e5e4, focus shifts to #615fff
                    with 3px rgba(97,95,255,0.15) ring.
                  </p>
                </div>

                <div className="space-y-3">
                  <Input
                    leftIcon={<Search className="h-4 w-4" />}
                    placeholder="Search articles by concept or topic..."
                  />

                  <Input
                    placeholder="name@company.com"
                    defaultValue="sarah@engineering.dev"
                  />

                  <Textarea
                    placeholder="Write article outline, thesis statement, or raw code thoughts..."
                    rows={3}
                  />
                </div>
              </Card>

              {/* Toggles, Checkboxes & Badges */}
              <Card className="p-6 space-y-5">
                <div className="space-y-0.5">
                  <h3 className="text-[16px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                    Toggles & Status Badges
                  </h3>
                  <p className="text-[13px] text-[#79716b] dark:text-[#a6a09b]">
                    Accessible switches, 8px tags, 9999px pills, and section
                    eyebrow tracking.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-medium text-[#292524] dark:text-[#fafaf9]">
                        Git auto-commit on publish
                      </div>
                      <div className="text-[11px] text-[#79716b]">
                        Create clean commits in your local blog repo
                      </div>
                    </div>
                    <Switch
                      checked={switchChecked}
                      onCheckedChange={setSwitchChecked}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      checked={checkboxChecked}
                      onCheckedChange={setCheckboxChecked}
                    />
                    <span className="text-[13px] text-[#292524] dark:text-[#fafaf9]">
                      Run Content Refresh Agent before deploy
                    </span>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <Badge variant="default" shape="pill">
                      Published
                    </Badge>
                    <Badge variant="secondary" shape="tag">
                      TypeScript
                    </Badge>
                    <Badge variant="lichen" shape="tag">
                      Lichen Green
                    </Badge>
                    <Badge variant="terracotta" shape="tag">
                      Terracotta
                    </Badge>
                    <Badge variant="teal" shape="tag">
                      Tide Teal
                    </Badge>
                    <Badge variant="alarm" shape="tag">
                      Alarm Red
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Modal Dialog & Overlays */}
            <Card className="p-6 space-y-4">
              <div className="space-y-0.5">
                <h3 className="text-[16px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                  Dialogs & Editorial Overlays
                </h3>
                <p className="text-[13px] text-[#79716b] dark:text-[#a6a09b]">
                  Centered modals with 16px radius, stone border, and backdrop
                  blur.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default">Open AI Review Modal</Button>
                  </DialogTrigger>
                  <DialogContent onClose={() => setDialogOpen(false)}>
                    <DialogHeader>
                      <DialogTitle>AI Technical Review (AGENTS.md)</DialogTitle>
                      <DialogDescription>
                        Examined 42 articles across your technical blog's Git
                        repository.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <Callout type="ai" title="Concept Overlap Detected">
                        You already explain RAG pipelines in{' '}
                        <em>Understanding Vector Databases</em>. Focus this post
                        exclusively on production security.
                      </Callout>
                      <Callout
                        type="warning"
                        title="Outdated Documentation Link"
                      >
                        One external link to{' '}
                        <code>docs.modelcontextprotocol.io</code> redirects to
                        v1 spec.
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
                        Apply Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Publication Menu ▾</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="left">
                    <DropdownMenuLabel>Git & Publishing</DropdownMenuLabel>
                    <DropdownMenuItem>Commit Changes</DropdownMenuItem>
                    <DropdownMenuItem>Trigger Deploy</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive>
                      Unpublish Article
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip content="Tooltips open instantly on adjacent hover!">
                  <Button variant="outline">Hover For Tooltip</Button>
                </Tooltip>
              </div>
            </Card>

            {/* Editorial Callouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Callout type="ai" title="Content Refresh Agent Found 3 Changes">
                Referenced API endpoint updated from <code>/v1/models</code> to{' '}
                <code>/v2/models</code>. A unified diff is ready for review.
              </Callout>
              <Callout
                type="warning"
                title="Primary Definition Appears Too Late"
              >
                Moving your vector database definition to paragraph 1 increases
                AEO answerability score from 81% to 94%.
              </Callout>
            </div>
          </TabsContent>

          {/* Tab 2: Publishing & Editorial Tools */}
          <TabsContent value="editorial" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Slash Command Menu */}
              <div className="space-y-3">
                <div className="eyebrow-tag">SLASH COMMAND SYSTEM</div>
                <h3 className="text-[18px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                  Editor Commands (AGENTS.md § 9)
                </h3>
                <p className="text-[13px] text-[#79716b] dark:text-[#a6a09b]">
                  Minimal slash commands for blocks and subtle AI actions.
                </p>
                <div className="p-6 rounded-[16px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] flex flex-col items-center justify-center">
                  <SlashCommandMenu
                    onSelect={(cmd) => setSelectedSlashCommand(cmd.label)}
                  />
                  {selectedSlashCommand && (
                    <div className="mt-4 text-xs font-mono text-[#79716b]">
                      Command Triggered:{' '}
                      <strong className="text-[#615fff]">
                        {selectedSlashCommand}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Health Gauge */}
              <div className="space-y-3">
                <div className="eyebrow-tag">PUBLICATION HEALTH AGENT</div>
                <h3 className="text-[18px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                  Article Health Analysis (AGENTS.md § 19)
                </h3>
                <p className="text-[13px] text-[#79716b] dark:text-[#a6a09b]">
                  The numbers are secondary. The explanation is what matters.
                </p>
                <HealthGauge
                  overallScore={84}
                  statusText="Building an MCP Server in TypeScript"
                  metrics={[
                    {
                      name: 'Content',
                      score: 92,
                      note: 'Complete code examples',
                    },
                    { name: 'SEO', score: 87, note: 'Clear title and slug' },
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
                    'Referenced package @modelcontextprotocol/sdk has updated from 0.4.0 to 1.0.0.',
                    'The definition of "MCP Tool" appears after the code example instead of before.',
                    'One external documentation link has returned an HTTP 301 redirect.',
                  ]}
                />
              </div>
            </div>

            {/* Article Cards */}
            <div className="space-y-4">
              <div className="eyebrow-tag">PUBLICATION ARTICLES</div>
              <h3 className="text-[18px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                Articles in Workspace
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ArticleCard
                  id="post-1"
                  title="Building an MCP Server with TypeScript"
                  excerpt="A comprehensive guide to implementing the Model Context Protocol in TypeScript, connecting local tools to AI clients."
                  slug="building-mcp-server-typescript"
                  publishedAt="Oct 4, 2026"
                  readingTime="7 min read"
                  gitBranch="main"
                  healthScore={84}
                  topics={['MCP', 'TypeScript', 'Agents']}
                  pendingDiffsCount={2}
                  isStale={true}
                  staleReason="Model Context Protocol v1.0 SDK introduced schema breaking changes."
                  onEdit={() => alert('Opening in Editor...')}
                  onReviewDiffs={() => alert('Reviewing Diffs...')}
                />

                <ArticleCard
                  id="post-2"
                  title="Production Security for RAG Applications"
                  excerpt="Defending retrieval-augmented generation pipelines against indirect prompt injection and vector context poisoning."
                  slug="production-security-rag"
                  publishedAt="Oct 1, 2026"
                  readingTime="12 min read"
                  gitBranch="feature/rag-sec"
                  healthScore={94}
                  topics={['RAG', 'Vector DB', 'Security']}
                  pendingDiffsCount={0}
                  isStale={false}
                  onEdit={() => alert('Opening in Editor...')}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Tokens Reference */}
          <TabsContent value="tokens" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-1 border-b border-[#e7e5e4] dark:border-[#292524] pb-4">
                <div className="eyebrow-tag">AUTOSEND TOKEN AUDIT</div>
                <h3 className="text-[18px] font-semibold text-[#292524] dark:text-[#fafaf9]">
                  Design Tokens from design.md
                </h3>
                <p className="text-[13px] text-[#79716b] dark:text-[#a6a09b]">
                  Every color, typography role, spacing unit, and radius
                  strictly follows the AutoSend style reference.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                {/* Token 1 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border border-[#e7e5e4] bg-[#fafaf9]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Warm Bone
                    </span>
                  </div>
                  <div className="text-[#79716b]">#fafaf9</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Page canvas & secondary fills
                  </div>
                </div>

                {/* Token 2 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border border-[#e7e5e4] bg-[#ffffff]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Paper White
                    </span>
                  </div>
                  <div className="text-[#79716b]">#ffffff</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Card surfaces & elevated panels
                  </div>
                </div>

                {/* Token 3 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border border-[#e7e5e4] bg-[#e7e5e4]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Stone Mist
                    </span>
                  </div>
                  <div className="text-[#79716b]">#e7e5e4</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Hairline borders & dividers
                  </div>
                </div>

                {/* Token 4 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-[#615fff]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Electric Indigo
                    </span>
                  </div>
                  <div className="text-[#79716b]">#615fff</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Primary CTA fill & brand spark
                  </div>
                </div>

                {/* Token 5 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-[#292524]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Charcoal
                    </span>
                  </div>
                  <div className="text-[#79716b]">#292524</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Primary text & headings
                  </div>
                </div>

                {/* Token 6 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-[#79716b]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Bark Grey
                    </span>
                  </div>
                  <div className="text-[#79716b]">#79716b</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Muted text & secondary labels
                  </div>
                </div>

                {/* Token 7 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-[#d97757]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Terracotta
                    </span>
                  </div>
                  <div className="text-[#79716b]">#d97757</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Warm orange highlight accent
                  </div>
                </div>

                {/* Token 8 */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] p-3 space-y-2 bg-[#fafaf9] dark:bg-[#121110]">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-[#5ea500]" />
                    <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Lichen Green
                    </span>
                  </div>
                  <div className="text-[#79716b]">#5ea500</div>
                  <div className="text-[11px] font-sans text-[#79716b]">
                    Green outline accent for tags
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* =================================================================
          Social Proof Strip (design.md: 40px vertical padding, opacity 0.6)
          ================================================================= */}
      <section className="border-t border-[#e7e5e4] dark:border-[#292524] py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center space-y-4">
          <div className="eyebrow-tag">
            NATIVE INTEGRATION WITH EXISTING TECHNICAL BLOG STACKS
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-[#292524] dark:text-[#fafaf9] font-mono text-[14px] opacity-60">
            <span>Next.js</span>
            <span>·</span>
            <span>Astro</span>
            <span>·</span>
            <span>Hugo</span>
            <span>·</span>
            <span>VitePress</span>
            <span>·</span>
            <span>Docusaurus</span>
            <span>·</span>
            <span>GitHub Pages</span>
          </div>
        </div>
      </section>

      {/* =================================================================
          Footer
          ================================================================= */}
      <footer className="border-t border-[#e7e5e4] dark:border-[#292524] py-8 text-xs text-[#79716b] dark:text-[#a6a09b]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
              Agent
            </span>
            <span>— AI Publishing System for Technical Blogs</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>AutoSend Design Reference</span>
            <span>·</span>
            <span>Warm Stone Atelier</span>
            <span>·</span>
            <span>Git-friendly</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
