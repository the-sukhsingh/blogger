import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Sparkles,
  PenTool,
  BookOpen,
  Network,
  ChevronDown,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react'
import { ThemeSwitcher } from '#/components/ui/theme-switcher'
import { Button } from '#/components/ui/button'
import { BlogStore } from '#/lib/blog-store'

export function Navbar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const handleResetData = () => {
    if (window.confirm('Reset articles and health intelligence to seed demo data?')) {
      BlogStore.resetToSeedData()
      window.location.reload()
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md transition-colors border-b border-border/40">
      <div className="max-w-[1240px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[14px] font-bold tracking-[0.08em] uppercase text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="h-6 w-6 rounded-[6px] bg-[#615fff] flex items-center justify-center text-white text-xs font-mono font-bold shadow-sm">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">AUTOSEND</span>
            <span className="text-[9px] font-mono tracking-widest text-[#79716b] dark:text-[#a6a09b] lowercase">
              publishing.intelligence
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#79716b] dark:text-[#a6a09b]">
          <Link
            to="/blogs"
            className={`transition-colors hover:text-foreground flex items-center gap-1.5 ${
              currentPath === '/blogs' ? 'text-foreground font-bold' : ''
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Articles</span>
          </Link>

          <Link
            to="/new"
            className={`transition-colors hover:text-foreground flex items-center gap-1.5 ${
              currentPath === '/new' ? 'text-foreground font-bold' : ''
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Editor</span>
          </Link>

          <Link
            to="/blogs"
            search={{ view: 'graph' } as any}
            className="transition-colors hover:text-foreground flex items-center gap-1.5"
          >
            <Network className="h-3.5 w-3.5" />
            <span>Content Graph</span>
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <span>Git Sync</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetData}
            title="Reset seed data"
            className="text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] flex items-center gap-1 px-2 py-1 rounded transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden lg:inline">Reset Seed</span>
          </button>

          <ThemeSwitcher />

          <Link to="/new">
            <Button
              variant="default"
              size="default"
              className="h-8 px-3.5 text-xs font-semibold uppercase tracking-[0.04em] shadow-none hover:bg-[#4f39f6]"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Write Article
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
