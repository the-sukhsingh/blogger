import * as React from 'react'
import { Zap, Cpu, Globe, ArrowRight } from 'lucide-react'
import { Badge } from '#/components/ui/badge'

export function AutomationPipelineSection() {
  return (
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

        {/* Right Mockup Workflow Diagram */}
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
  )
}
