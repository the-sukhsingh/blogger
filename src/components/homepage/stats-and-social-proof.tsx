import * as React from 'react'

export function StatsAndSocialProof() {
  return (
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
  )
}
