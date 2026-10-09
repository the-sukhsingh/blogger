import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Plus, Menu, X, BookOpen, PenTool, Home, RotateCcw, LogIn, LogOut, User as UserIcon, Key } from 'lucide-react'
import { useConvexAuth, useAuthActions } from '@convex-dev/auth/react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { ThemeSwitcher } from '#/components/ui/theme-switcher'
import { Button } from '#/components/ui/button'
import { BlogStore } from '#/lib/blog-store'
import { AuthModal } from '#/components/auth-modal'
import { cn } from '#/lib/utils'

export function Navbar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const resetRef = React.useRef<HTMLDivElement>(null)
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const user = useQuery(api.users.viewer)

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentPath])

  // Close reset popover on outside click / Escape
  React.useEffect(() => {
    if (!resetConfirmOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (resetRef.current && !resetRef.current.contains(e.target as Node)) {
        setResetConfirmOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setResetConfirmOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [resetConfirmOpen])

  // Close user menu on outside click / Escape
  React.useEffect(() => {
    if (!userMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [userMenuOpen])

  const seedBlogs = useMutation(api.blogs.seed)

  const handleResetSeed = async () => {
    try {
      await seedBlogs({ force: true })
    } catch (err) {
      console.error('Failed to reset seed blogs in Convex:', err)
    }
    BlogStore.resetToSeedData()
    setResetConfirmOpen(false)
  }

  const isArticlesActive =
    currentPath === '/blogs' ||
    currentPath === '/blog' ||
    currentPath.startsWith('/blog/')
  const isDocsActive = currentPath === '/docs' || currentPath.startsWith('/docs')
  const isIntegrationsActive =
    currentPath === '/integrations' || currentPath.startsWith('/integrations')
  const isEditorActive = currentPath === '/new' || currentPath.endsWith('/edit')
  const isHomeActive = currentPath === '/'

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#fafaf9]/85 dark:bg-[#0c0a09]/85 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#292524] transition-colors">
      <div className="max-w-[1120px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#292524] dark:text-[#fafaf9] hover:opacity-85 transition-opacity group"
          >
            <div className="h-6 w-6 rounded-[6px] bg-[#f59e0b] dark:bg-[#d97706] flex items-center justify-center text-white text-xs font-mono font-bold shadow-xs transition-transform group-hover:scale-105">
              🐝
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">
                Beelog
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
              to="/docs"
              className={cn(
                'px-3 py-1 text-xs rounded-[6px] transition-all font-medium',
                isDocsActive
                  ? 'bg-white dark:bg-[#1a1716] text-[#292524] dark:text-[#fafaf9] shadow-xs border border-[#e7e5e4] dark:border-[#292524]'
                  : 'text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#e7e5e4]/40 dark:hover:bg-[#1f1c1a]',
              )}
            >
              Docs
            </Link>

            <Link
              to="/integrations"
              className={cn(
                'px-3 py-1 text-xs rounded-[6px] transition-all font-medium',
                isIntegrationsActive
                  ? 'bg-white dark:bg-[#1a1716] text-[#292524] dark:text-[#fafaf9] shadow-xs border border-[#e7e5e4] dark:border-[#292524]'
                  : 'text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#e7e5e4]/40 dark:hover:bg-[#1f1c1a]',
              )}
            >
              Integrations
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
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          {/* Reset Seed — subtle ghost icon button with inline confirm */}
          <div ref={resetRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setResetConfirmOpen((prev) => !prev)}
              title="Reset to seed data"
              aria-label="Reset seed data"
              className="p-1.5 rounded-[6px] text-[#a6a09b] hover:text-[#79716b] dark:hover:text-[#79716b] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#1f1c1a] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {resetConfirmOpen && (
              <div
                className={cn(
                  'absolute right-0 top-full mt-2 z-50 w-56 rounded-[10px] p-3',
                  'bg-white dark:bg-[#171514]',
                  'border border-[#e7e5e4] dark:border-[#292524]',
                  'shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)]',
                  'animate-in fade-in zoom-in-95 duration-150',
                )}
                role="alertdialog"
                aria-label="Reset seed data confirmation"
              >
                {/* Arrow */}
                <div className="absolute -top-1 right-3 h-2 w-2 rotate-45 bg-white dark:bg-[#171514] border-t border-l border-[#e7e5e4] dark:border-[#292524]" />
                <div className="relative z-10 space-y-2.5">
                  <div>
                    <p className="text-xs font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Reset sample posts?
                    </p>
                    <p className="text-[11px] text-[#79716b] dark:text-[#a6a09b] mt-0.5 leading-snug">
                      Restores the 5 original seed articles.
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#e7e5e4] dark:border-[#292524]">
                    <button
                      type="button"
                      onClick={() => setResetConfirmOpen(false)}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-[6px] text-[#79716b] hover:text-[#292524] dark:text-[#a6a09b] dark:hover:text-[#fafaf9] hover:bg-[#fafaf9] dark:hover:bg-[#201d1b] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleResetSeed}
                      className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-[6px] bg-[#615fff] hover:bg-[#4f39f6] text-white transition-colors inline-flex items-center gap-1"
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-[#e7e5e4] dark:border-[#292524] hidden sm:block" />

          {/* Authentication State button / User Menu */}
          {authLoading ? (
            <div className="h-8 w-16 bg-[#e7e5e4]/50 dark:bg-[#292524]/50 rounded-[6px] animate-pulse hidden sm:block" />
          ) : isAuthenticated ? (
            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-label="User account menu"
                className="flex items-center gap-2 px-2.5 py-1 text-xs rounded-[6px] bg-white dark:bg-[#1a1716] border border-[#e7e5e4] dark:border-[#292524] text-[#292524] dark:text-[#fafaf9] shadow-xs hover:border-[#615fff]/50 transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-[#615fff]/15 dark:bg-[#615fff]/25 text-[#615fff] flex items-center justify-center font-mono font-bold text-[10px]">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate font-medium">
                  {user?.name || user?.email?.split('@')[0] || 'Author'}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-[10px] p-2.5 bg-white dark:bg-[#171514] border border-[#e7e5e4] dark:border-[#292524] shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-[#e7e5e4] dark:border-[#292524] mb-1">
                    <p className="text-xs font-semibold text-[#292524] dark:text-[#fafaf9] truncate">
                      {user?.name || 'Author'}
                    </p>
                    <p className="text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] truncate">
                      {user?.email || 'Logged in'}
                    </p>
                  </div>
                  <Link
                    to="/integrations"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#292524] dark:text-[#fafaf9] hover:bg-[#e7e5e4]/40 dark:hover:bg-[#1f1c1a] rounded-[6px] transition-colors"
                  >
                    <Key className="h-3.5 w-3.5 text-amber-500" />
                    <span>API Keys & Integration</span>
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setUserMenuOpen(false)
                      await signOut()
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-[6px] transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Button>
          )}

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
            to="/docs"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors',
              isDocsActive
                ? 'bg-white dark:bg-[#171514] text-[#292524] dark:text-[#fafaf9] border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-[#79716b] dark:text-[#a6a09b] hover:bg-white dark:hover:bg-[#171514]',
            )}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#f59e0b]" />
            <span>Docs</span>
          </Link>

          <Link
            to="/integrations"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium transition-colors',
              isIntegrationsActive
                ? 'bg-white dark:bg-[#171514] text-[#292524] dark:text-[#fafaf9] border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-[#79716b] dark:text-[#a6a09b] hover:bg-white dark:hover:bg-[#171514]',
            )}
          >
            <Key className="h-3.5 w-3.5 text-[#f59e0b]" />
            <span>Integrations</span>
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

          <div className="pt-2 border-t border-[#e7e5e4] dark:border-[#292524] space-y-2">
            {!isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setAuthModalOpen(true)
                }}
                className="w-full justify-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In / Register</span>
              </Button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false)
                  await signOut()
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-mono text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-red-200 dark:border-red-900/60"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out ({user?.email?.split('@')[0] || 'User'})</span>
              </button>
            )}
            <Link to="/new" className="block w-full">
              <Button variant="default" size="sm" className="w-full justify-center">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>New Post</span>
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-mono text-[#79716b] dark:text-[#a6a09b] hover:bg-white dark:hover:bg-[#171514] transition-colors border border-[#e7e5e4] dark:border-[#292524]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Seed</span>
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal for Login / Registration */}
    </header>

    <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
  </>
)
}
