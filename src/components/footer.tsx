import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Globe, Terminal, Share2, MessageSquare } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e7e5e4] dark:border-[#292524] bg-background mt-20 transition-colors">
      <div className="max-w-[1240px] mx-auto px-6 pt-16 pb-12">
        {/* Navigation Grid (matching scratch/image.png) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 text-xs">
          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#292524] dark:text-[#fafaf9] mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2.5 text-[#79716b] dark:text-[#a6a09b]">
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-foreground transition-colors"
                >
                  Publication Index
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  search={{ view: 'graph' } as any}
                  className="hover:text-foreground transition-colors"
                >
                  Content Knowledge Graph
                </Link>
              </li>
              <li>
                <Link
                  to="/new"
                  className="hover:text-foreground transition-colors"
                >
                  Custom Editor
                </Link>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  AEO Answer Engine Audit
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Freshness Sentinel
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#292524] dark:text-[#fafaf9] mb-4">
              Agents
            </h4>
            <ul className="space-y-2.5 text-[#79716b] dark:text-[#a6a09b]">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Publication Analyst
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Research Agent
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Writing Agent
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Content Refresh Agent
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  SEO & AEO Agent
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#292524] dark:text-[#fafaf9] mb-4">
              Git Workflow
            </h4>
            <ul className="space-y-2.5 text-[#79716b] dark:text-[#a6a09b]">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Markdown & MDX Sync
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Git Diff Reviews
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Branch Deployments
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  CI/CD Publishing
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#292524] dark:text-[#fafaf9] mb-4">
              Integrations
            </h4>
            <ul className="space-y-2.5 text-[#79716b] dark:text-[#a6a09b]">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Claude Desktop MCP
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Cursor & VS Code
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  GitHub Actions
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Next.js & Astro Blogs
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#292524] dark:text-[#fafaf9] mb-4">
              Philosophy
            </h4>
            <p className="text-[12px] leading-relaxed text-[#79716b] dark:text-[#a6a09b]">
              Treat your technical blog like a codebase. Preserving author voice
              and plain-text sovereignty with AI intelligence.
            </p>
          </div>
        </div>

        {/* Bottom Bar (scratch/image.png) */}
        <div className="pt-8 border-t border-[#e7e5e4] dark:border-[#292524] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-[#79716b] dark:text-[#a6a09b]">
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-foreground">
              <span className="text-[#f59e0b]">🐝</span> BEELOG
            </span>
            <span>·</span>
            <span>© 2026 TECHNICAL PUBLISHING SYSTEM</span>
          </div>

          <div className="flex items-center gap-2 text-[#79716b] dark:text-[#a6a09b] font-mono text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#5ea500] animate-pulse" />
            <span>ALL PUBLISHING SERVICES OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-4 text-[#79716b] dark:text-[#a6a09b]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
              title="Terminal"
            >
              <Terminal className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
              title="Community"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
              title="Network"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href="https://beelog.dev"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
