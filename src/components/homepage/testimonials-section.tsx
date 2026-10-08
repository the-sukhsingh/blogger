import * as React from 'react'
import { Card } from '#/components/ui/card'

export function TestimonialsSection() {
  return (
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
  )
}
