import * as React from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export function StillWonderingSection() {
  return (
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
  )
}
