import * as React from 'react'

export function HomepageFooter() {
  return (
    <footer className="space-y-12 border-t border-border pt-12">
      {/* Columns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[12px]">
        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            PUBLISHING
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="/blogs" className="hover:text-foreground">
                All Articles
              </a>
            </li>
            <li>
              <a href="/blog/new" className="hover:text-foreground">
                Markdown Editor
              </a>
            </li>
            <li>
              <a href="#git-sync" className="hover:text-foreground">
                Git-Backed Sync
              </a>
            </li>
            <li>
              <a href="#diff-engine" className="hover:text-foreground">
                AI Diffs & Review
              </a>
            </li>
            <li>
              <a href="#aeo" className="hover:text-foreground">
                Answer Engine Optimization
              </a>
            </li>
            <li>
              <a href="#graph" className="hover:text-foreground">
                Content Knowledge Graph
              </a>
            </li>
            <li>
              <a href="#health" className="hover:text-foreground">
                Freshness & Stale Claims
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            DOCUMENTATION
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="/docs" className="hover:text-foreground">
                Getting Started
              </a>
            </li>
            <li>
              <a href="/docs#editor" className="hover:text-foreground">
                Writing Workspace
              </a>
            </li>
            <li>
              <a href="/docs#intelligence" className="hover:text-foreground">
                Content Intelligence
              </a>
            </li>
            <li>
              <a href="/docs#git" className="hover:text-foreground">
                Git Workflows
              </a>
            </li>
            <li>
              <a href="/docs#convex" className="hover:text-foreground">
                Convex Backend
              </a>
            </li>
            <li>
              <a href="/docs#api" className="hover:text-foreground">
                API & CLI Reference
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-bold uppercase tracking-[0.08em] text-foreground">
            FRAMEWORKS
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#astro" className="hover:text-foreground">
                Astro & Starlight
              </a>
            </li>
            <li>
              <a href="#nextjs" className="hover:text-foreground">
                Next.js App Router
              </a>
            </li>
            <li>
              <a href="#hugo" className="hover:text-foreground">
                Hugo & Zola
              </a>
            </li>
            <li>
              <a href="#docusaurus" className="hover:text-foreground">
                Docusaurus
              </a>
            </li>
            <li>
              <a href="#github-actions" className="hover:text-foreground">
                GitHub Actions CI
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
              <a href="/blogs" className="hover:text-foreground">
                Engineering Blog
              </a>
            </li>
            <li>
              <a href="/docs#aeo" className="hover:text-foreground">
                AEO Checklist
              </a>
            </li>
            <li>
              <a href="#style-guide" className="hover:text-foreground">
                Author Voice Models
              </a>
            </li>
            <li>
              <a href="#changelog" className="hover:text-foreground">
                Changelog
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
                GitHub Repository
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
              <a href="#privacy" className="hover:text-foreground">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" className="hover:text-foreground">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#security" className="hover:text-foreground">
                Security & Data Integrity
              </a>
            </li>
            <li>
              <a href="#fair-use" className="hover:text-foreground">
                Acceptable Use Policy
              </a>
            </li>
            <li>
              <a href="#license" className="hover:text-foreground">
                Open Source License
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">BEELOG</span>
          <span>© 2026 • AI-NATIVE PUBLISHING FOR TECHNICAL BLOGS</span>
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
