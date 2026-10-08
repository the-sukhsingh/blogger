import * as React from 'react'
import {
  FileText,
  Sparkles,
  Layers,
  GitCommit,
  ArrowRight,
  Plus,
  Send,
  AlertCircle,
  GitBranch,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'

export function WritingWorkspaceSection() {
  return (
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

        {/* Right Mockup Campaigns / Articles List */}
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
  )
}
