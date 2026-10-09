import * as React from 'react'
import { Card } from '#/components/ui/card'

export function TestimonialsSection() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 bg-card border border-border">
          <p className="text-[13px] text-foreground leading-relaxed italic font-serif">
            "Beelog treats our engineering blog like a production repository.
            The AEO analysis and diff proposals let our senior architects review
            technical posts in minutes."
          </p>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-foreground">
                PRATYUSH RUNGTA
              </div>
              <div className="text-[11px] text-muted-foreground">
                Staff Engineer, First Dollar
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-muted-foreground">
              FIRST DOLLAR
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 bg-card border border-border">
          <p className="text-[13px] text-foreground leading-relaxed italic font-serif">
            "Connecting our existing Astro Markdown repo to Beelog was seamless.
            The content graph caught three duplicate guides and automatically suggested
            internal links."
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
            "We chose Beelog for its AI review diffs and freshness checks. It warns us
            whenever an API version or library in our technical documentation becomes outdated."
          </p>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-foreground">
                C. C. FAN
              </div>
              <div className="text-[11px] text-muted-foreground">
                CTO Vivgrid
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-muted-foreground">
              vivgrid
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
