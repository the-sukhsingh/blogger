import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
} from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '#/components/ui/button'
import { formatWordCount } from '#/lib/book-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/share/$shareToken')({
  component: PublicSharedBookPage,
})

type ReaderTheme = 'light' | 'sepia' | 'dark'

function PublicSharedBookPage() {
  const { shareToken } = Route.useParams()
  const book = useQuery(api.books.getByShareToken, { token: shareToken })

  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0)
  const [theme, setTheme] = React.useState<ReaderTheme>('light')
  const [fontSize, setFontSize] = React.useState<number>(18)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  if (book === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
        <p className="text-sm text-muted-foreground animate-pulse font-mono">
          Loading shared manuscript...
        </p>
      </div>
    )
  }

  if (book === null) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-serif text-2xl font-medium">Shared link unavailable</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This private link has expired or the author has turned off public access.
          </p>
          <Link to="/">
            <Button variant="outline" size="sm" className="text-xs">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const chapters = book.chapters || []
  const currentChapter = chapters[currentChapterIndex] || null
  const isRtl = book.direction === 'rtl'

  const themeClasses = {
    light: 'bg-[#fafaf9] text-[#292524] border-[#e7e5e4]',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e8d7b8]',
    dark: 'bg-[#121110] text-[#eae7e4] border-[#292524]',
  }[theme]

  return (
    <div className={cn('min-h-screen flex flex-col transition-colors duration-200', themeClasses)}>
      {/* Top Reader Navigation Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md border-b bg-inherit/95 px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-mono"
            title="Table of Contents"
          >
            <List className="h-4 w-4" />
            <span>Contents ({chapters.length})</span>
          </button>
        </div>

        {/* Center: Title & Chapter */}
        <div className="flex items-center gap-2 text-xs font-mono opacity-80 truncate max-w-sm">
          <span className="font-semibold truncate">{book.title}</span>
          {currentChapter && (
            <>
              <span>·</span>
              <span className="truncate">{currentChapter.title}</span>
            </>
          )}
        </div>

        {/* Right: Theme & Size Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* Theme switcher */}
          <div className="flex items-center rounded border p-0.5">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-mono transition-colors',
                theme === 'light' ? 'bg-white shadow-xs font-bold text-black' : 'opacity-60'
              )}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-mono transition-colors',
                theme === 'sepia'
                  ? 'bg-[#edd9b1] shadow-xs font-bold text-[#433422]'
                  : 'opacity-60'
              )}
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-mono transition-colors',
                theme === 'dark' ? 'bg-[#292524] shadow-xs font-bold text-white' : 'opacity-60'
              )}
            >
              Dark
            </button>
          </div>

          {/* Size controls */}
          <div className="flex items-center gap-1 border rounded px-1.5 py-0.5 font-mono text-xs">
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className="px-1 hover:opacity-100 opacity-60 font-bold"
              title="Smaller"
            >
              A-
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              className="px-1 hover:opacity-100 opacity-60 font-bold"
              title="Larger"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* Main Shared Reading View */}
      <div className="flex-1 flex max-w-5xl mx-auto w-full relative">
        {/* Table of Contents Drawer */}
        {sidebarOpen && (
          <aside className="w-72 border-r bg-inherit p-6 space-y-4 shrink-0 overflow-y-auto max-h-[calc(100vh-3.5rem)] sticky top-14">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">
                Table of Contents
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1 text-xs font-mono">
              {chapters.map((ch, idx) => (
                <button
                  key={ch._id}
                  onClick={() => {
                    setCurrentChapterIndex(idx)
                    setSidebarOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={cn(
                    'w-full text-left p-2 rounded transition-colors block truncate',
                    currentChapterIndex === idx
                      ? 'bg-current/10 font-bold'
                      : 'opacity-70 hover:opacity-100 hover:bg-current/5'
                  )}
                >
                  <span className="opacity-60 mr-1.5">#{ch.order}</span>
                  {ch.title}
                </button>
              ))}
            </nav>
          </aside>
        )}

        <main
          className="flex-1 max-w-2xl mx-auto px-6 py-16 space-y-12"
          style={{ fontSize: `${fontSize}px` }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {currentChapter ? (
            <article className="space-y-8 font-serif">
              <div className="space-y-2 border-b pb-6">
                <div className="flex items-center justify-between text-xs font-mono opacity-60 uppercase tracking-widest">
                  <span>
                    Chapter {currentChapter.order} · {book.language.toUpperCase()}
                  </span>
                  <span>By {book.author}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.2]">
                  {currentChapter.title}
                </h1>
              </div>

              <div className="leading-relaxed space-y-5">
                {currentChapter.content
                  .split('\n')
                  .filter((l) => !l.startsWith('# '))
                  .map((line, idx) => {
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-2xl font-medium mt-8 mb-3 tracking-tight">
                          {line.replace('## ', '')}
                        </h2>
                      )
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-lg font-medium mt-6 mb-2 tracking-tight">
                          {line.replace('### ', '')}
                        </h3>
                      )
                    }
                    if (line.startsWith('> ')) {
                      return (
                        <blockquote key={idx} className="my-6 pl-4 border-l-2 border-current italic opacity-85">
                          {line.replace('> ', '')}
                        </blockquote>
                      )
                    }
                    if (line.startsWith('```')) {
                      return null
                    }
                    if (line.trim().length > 0) {
                      return <p key={idx}>{line}</p>
                    }
                    return null
                  })}
              </div>
            </article>
          ) : (
            <div className="text-center py-20">
              <p className="font-serif text-xl">No content available</p>
            </div>
          )}

          {/* Chapter Navigation */}
          {chapters.length > 1 && (
            <div className="pt-12 border-t flex items-center justify-between gap-4 text-xs font-sans" dir="ltr">
              <button
                type="button"
                onClick={() => {
                  setCurrentChapterIndex((prev) => Math.max(0, prev - 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                disabled={currentChapterIndex === 0}
                className="inline-flex items-center gap-1.5 opacity-70 hover:opacity-100 disabled:opacity-20 disabled:pointer-events-none transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Chapter</span>
              </button>

              <span className="font-mono text-xs opacity-60">
                {currentChapterIndex + 1} of {chapters.length}
              </span>

              <button
                type="button"
                onClick={() => {
                  setCurrentChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                disabled={currentChapterIndex >= chapters.length - 1}
                className="inline-flex items-center gap-1.5 opacity-70 hover:opacity-100 disabled:opacity-20 disabled:pointer-events-none transition-opacity"
              >
                <span>Next Chapter</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
