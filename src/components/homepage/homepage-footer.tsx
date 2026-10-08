import * as React from 'react'

export function HomepageFooter() {
  return (
    <footer className="space-y-12 border-t border-border pt-12">
      {/* Columns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[12px]">
        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            SOLUTIONS
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#transactional" className="hover:text-foreground">
                Transactional Emails
              </a>
            </li>
            <li>
              <a href="#marketing" className="hover:text-foreground">
                Marketing Emails
              </a>
            </li>
            <li>
              <a href="#automation" className="hover:text-foreground">
                Email Automation
              </a>
            </li>
            <li>
              <a href="#agents" className="hover:text-foreground">
                Agents & LLMs
              </a>
            </li>
            <li>
              <a href="#deliverability" className="hover:text-foreground">
                Deliverability
              </a>
            </li>
            <li>
              <a href="#inbound" className="hover:text-foreground">
                Inbound Email API
              </a>
            </li>
            <li>
              <a href="#builder" className="hover:text-foreground">
                Email Builder
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            DOCS
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#getting-started" className="hover:text-foreground">
                Getting Started
              </a>
            </li>
            <li>
              <a href="#api" className="hover:text-foreground">
                API Reference
              </a>
            </li>
            <li>
              <a href="#agents" className="hover:text-foreground">
                Agents
              </a>
            </li>
            <li>
              <a href="#wiki" className="hover:text-foreground">
                Wiki
              </a>
            </li>
            <li>
              <a href="#changelog" className="hover:text-foreground">
                Changelog
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            RESOURCES
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#faq" className="hover:text-foreground">
                FAQ
              </a>
            </li>
            <li>
              <a href="#blog" className="hover:text-foreground">
                Blog
              </a>
            </li>
            <li>
              <a href="#glossary" className="hover:text-foreground">
                Glossary
              </a>
            </li>
            <li>
              <a href="#affiliate" className="hover:text-foreground">
                Be an Affiliate
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            COMPARE
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#sendgrid" className="hover:text-foreground">
                SendGrid
              </a>
            </li>
            <li>
              <a href="#loops" className="hover:text-foreground">
                Loops
              </a>
            </li>
            <li>
              <a href="#resend" className="hover:text-foreground">
                Resend
              </a>
            </li>
            <li>
              <a href="#postmark" className="hover:text-foreground">
                Postmark
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            LEGAL
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#fair-use" className="hover:text-foreground">
                Fair Use
              </a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-foreground">
                Privacy
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-foreground">
                Terms
              </a>
            </li>
            <li>
              <a href="#sub-processors" className="hover:text-foreground">
                Sub-Processors
              </a>
            </li>
            <li>
              <a href="#dpa" className="hover:text-foreground">
                Data Processing Addendum
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">AUTOSEND</span>
          <span>© 2026 • PEERLIST INC.</span>
        </div>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-card">
          <span className="h-2 w-2 rounded-full bg-[#5ea500] animate-pulse" />
          <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <a
            href="https://discord.com"
            aria-label="Discord"
            className="hover:text-foreground"
          >
            Discord
          </a>
          <a
            href="https://x.com"
            aria-label="X"
            className="hover:text-foreground"
          >
            X
          </a>
          <a
            href="https://github.com"
            aria-label="GitHub"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            aria-label="LinkedIn"
            className="hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
