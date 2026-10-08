import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export function HeroSection() {
  return (
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
  )
}
