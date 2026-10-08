import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Plus, Menu, X, BookOpen, PenTool, Home } from 'lucide-react'
import { ThemeSwitcher } from '#/components/ui/theme-switcher'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export function Navbar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentPath])

  const isArticlesActive =
    currentPath === '/blogs' ||
    currentPath === '/blog' ||
    currentPath.startsWith('/blog/')
  const isEditorActive = currentPath === '/new' || currentPath.endsWith('/edit')
  const isHomeActive = currentPath === '/'

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fafaf9]/85 dark:bg-[#0c0a09]/85 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#292524] transition-colors">
      <div className="max-w-[1120px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#292524] dark:text-[#fafaf9] hover:opacity-85 transition-opacity group"
          >
            <div className="h-6 w-6 rounded-[6px] bg-[#615fff] flex items-center justify-center text-white text-xs font-mono font-bold shadow-xs transition-transform group-hover:scale-105">
              ✦
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">
                AutoSend
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] px-1.5 py-0.5 rounded-[4px] bg-white dark:bg-[#171514] border border-[#e7e5e4] dark:border-[#292524]">
                publishing
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-2 border-l border-[#e7e5e4] dark:border-[#292524]">
            <Link
              to="/"
              className={cn(
                'px-3 py-1 text-xs rounded-[6px] transition-all font-medium',
                isHomeActive
                  ? 'bg-white dark:bg-[#1a1716] text-[#292524] dark:text-[#fafaf9] shadow-xs border border-[#e7e5e4] dark:border-[#292524]'
                  : 'text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#e7e5e4]/40 dark:hover:bg-[#1f1c1a]',
              )}
            >
              Overview
            </Link>

            <Link
              to="/blogs"
              className={cn(
                'px-3 py-1 text-xs rounded-[6px] transition-all font-medium',
                isArticlesActive
                  ? 'bg-white dark:bg-[#1a1716] text-[#292524] dark:text-[#fafaf9] shadow-xs border border-[#e7e5e4] dark:border-[#292524]'
                  : 'text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#e7e5e4]/40 dark:hover:bg-[#1f1c1a]',
              )}
            >
              Articles
            </Link>

            <Link
              to="/new"
              className={cn(
                'px-3 py-1 text-xs rounded-[6px] transition-all font-medium',
                isEditorActive
                  ? 'bg-white dark:bg-[#1a1716] text-[#292524] dark:text-[#fafaf9] shadow-xs border border-[#e7e5e4] dark:border-[#292524]'
                  : 'text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#e7e5e4]/40 dark:hover:bg-[#1f1c1a]',
              )}
            >
              Editor
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <div className="h-4 w-[1px] bg-[#e7e5e4] dark:border-[#292524] hidden sm:block" />

          {/* Primary CTA */}
          <Link to="/new" className="hidden sm:inline-flex">
            <Button variant="default" size="sm">
              <Plus className="h-3.5 w-3.5" />
              <span>New Post</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-1.5 rounded-[6px] text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#e7e5e4]/40 dark:hover:bg-[#1f1c1a] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#0c0a09] px-6 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors',
              isHomeActive
                ? 'bg-white dark:bg-[#171514] text-[#292524] dark:text-[#fafaf9] border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-[#79716b] dark:text-[#a6a09b] hover:bg-white dark:hover:bg-[#171514]',
            )}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Overview</span>
          </Link>

          <Link
            to="/blogs"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors',
              isArticlesActive
                ? 'bg-white dark:bg-[#171514] text-[#292524] dark:text-[#fafaf9] border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-[#79716b] dark:text-[#a6a09b] hover:bg-white dark:hover:bg-[#171514]',
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Articles</span>
          </Link>

          <Link
            to="/new"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors',
              isEditorActive
                ? 'bg-white dark:bg-[#171514] text-[#292524] dark:text-[#fafaf9] border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-[#79716b] dark:text-[#a6a09b] hover:bg-white dark:hover:bg-[#171514]',
            )}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Editor</span>
          </Link>

          <div className="pt-2 border-t border-[#e7e5e4] dark:border-[#292524]">
            <Link to="/new" className="block w-full">
              <Button variant="default" size="sm" className="w-full justify-center">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>New Post</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
