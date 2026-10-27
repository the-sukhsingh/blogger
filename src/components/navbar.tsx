import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useConvexAuth, useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { ThemeSwitcher } from '#/components/ui/theme-switcher'
import { Button } from '#/components/ui/button'
import { AuthModal } from '#/components/auth-modal'
import { cn } from '#/lib/utils'

export function Navbar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const user = useQuery(api.users.viewer)

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentPath])

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

  const isBooksActive = currentPath === '/books' || currentPath.startsWith('/books/')
  const isArticlesActive =
    currentPath === '/blogs' ||
    currentPath === '/blog' ||
    currentPath.startsWith('/blog/') ||
    currentPath === '/new'
  const isDocsActive = currentPath === '/docs' || currentPath.startsWith('/docs')

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Identity with calm typography */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 text-foreground hover:opacity-80 transition-opacity"
            >
              <span className="font-serif text-lg font-medium tracking-tight">
                Beelog
              </span>
            
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                to="/books"
                className={cn(
                  'transition-colors py-1',
                  isBooksActive
                    ? 'text-foreground font-medium border-b-2 border-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Books
              </Link>

              <Link
                to="/blogs"
                className={cn(
                  'transition-colors py-1',
                  isArticlesActive
                    ? 'text-foreground font-medium border-b-2 border-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Articles
              </Link>

              <Link
                to="/docs"
                className={cn(
                  'transition-colors py-1',
                  isDocsActive
                    ? 'text-foreground font-medium border-b-2 border-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Documentation
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            {/* Primary Action Button */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/books">
                  <Button variant="default" size="sm" className="text-xs px-3.5 h-8 font-sans">
                    New Book
                  </Button>
                </Link>
              </div>
            )}

            {/* User Account / Sign In */}
            {authLoading ? (
              <div className="h-8 w-16 bg-muted/40 rounded animate-pulse hidden sm:block" />
            ) : isAuthenticated ? (
              <div ref={userMenuRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-label="User account menu"
                  className="flex items-center gap-2 px-2.5 py-1 text-xs rounded border border-border bg-card text-foreground hover:border-foreground/40 transition-colors"
                >
                  <span className="h-5 w-5 rounded-full bg-foreground/10 text-foreground flex items-center justify-center font-mono font-medium text-[10px]">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[100px] truncate font-medium">
                    {user?.name || user?.email?.split('@')[0] || 'Author'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg p-2 bg-popover border border-border shadow-md"
                    role="menu"
                  >
                    <div className="px-2 py-1.5 border-b border-border mb-1">
                      <p className="text-xs font-medium text-foreground truncate">
                        {user?.name || 'Author'}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/books"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-2 py-1.5 text-xs text-foreground hover:bg-muted rounded transition-colors"
                      role="menuitem"
                    >
                      My Books
                    </Link>

                    <Link
                      to="/blogs"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-2 py-1.5 text-xs text-foreground hover:bg-muted rounded transition-colors"
                      role="menuitem"
                    >
                      My Articles
                    </Link>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setUserMenuOpen(false)
                          await signOut()
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:inline-flex text-xs h-8 px-3"
              >
                Sign in
              </Button>
            )}

            {/* Mobile menu hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
            <Link
              to="/books"
              className={cn(
                'block py-2 text-sm font-medium',
                isBooksActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              Books
            </Link>
            <Link
              to="/blogs"
              className={cn(
                'block py-2 text-sm font-medium',
                isArticlesActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              Articles
            </Link>
            <Link
              to="/docs"
              className={cn(
                'block py-2 text-sm font-medium',
                isDocsActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
              )}
            >
              Documentation
            </Link>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated && (
                <Link to="/books" className="w-full">
                  <Button variant="default" size="sm" className="w-full justify-center text-xs">
                    New Book
                  </Button>
                </Link>
              )}
              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setAuthModalOpen(true)
                  }}
                  className="w-full justify-center text-xs"
                >
                  Sign in
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setMobileMenuOpen(false)
                    await signOut()
                  }}
                  className="w-full justify-center text-xs text-destructive hover:text-destructive"
                >
                  Sign out
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  )
}
