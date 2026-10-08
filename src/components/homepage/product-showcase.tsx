import * as React from 'react'
import { Plus, Send, ArrowUpRight } from 'lucide-react'
import { Card } from '#/components/ui/card'

export function ProductShowcase() {
  const [heroPrompt, setHeroPrompt] = React.useState(
    'Create an in-depth technical analysis for our MCP TypeScript architecture and review stale claims.',
  )

  return (
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

          {/* Floating Prompt Input Box */}
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

        {/* 3-Column Split Footer with Hairline Borders */}
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
  )
}
