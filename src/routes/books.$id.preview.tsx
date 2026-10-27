import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Printer,
  List,
} from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/books/$id/preview')({
  component: BookReaderPreviewPage,
})

type ReaderTheme = 'light' | 'sepia' | 'dark'
type ReaderFont = 'serif' | 'sans' | 'mono'

function BookReaderPreviewPage() {
  const { id } = Route.useParams()
  const book = useQuery(api.books.get, { id: id as any })

  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0)
  const [readerTheme, setReaderTheme] = React.useState<ReaderTheme>('light')
  const [readerFont, setReaderFont] = React.useState<ReaderFont>('serif')
  const [fontSize, setFontSize] = React.useState<number>(18) // base in px
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  if (!book) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
        <p className="text-sm text-muted-foreground animate-pulse font-mono">
          Loading book reader preview...
        </p>
      </div>
    )
  }

  const chapters = book.chapters || []
  const currentChapter = chapters[currentChapterIndex] || null
  const isRtl = book.direction === 'rtl'

  // Render markdown content to reader elements
  const renderChapterContent = (markdown: string) => {
    const lines = markdown.split('\n')
    const elements: React.ReactNode[] = []
    let inCode = false
    let codeBuffer: string[] = []

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (!inCode) {
          inCode = true
          codeBuffer = []
        } else {
          inCode = false
          elements.push(
            <pre
              key={`code-${idx}`}
              className="my-6 p-4 rounded-lg bg-black/5 dark:bg-white/10 font-mono text-xs overflow-x-auto leading-relaxed"
              dir="ltr"
            >
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          )
        }
        return
      }

      if (inCode) {
        codeBuffer.push(line)
        return
      }

      // Title line (# ) is handled in header
      if (line.startsWith('# ')) return

      if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${idx}`}
            className="font-serif text-2xl font-medium mt-10 mb-4 tracking-tight leading-snug"
          >
            {line.replace('## ', '')}
          </h2>
        )
        return
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${idx}`}
            className="font-serif text-lg font-medium mt-6 mb-2 tracking-tight leading-snug"
          >
            {line.replace('### ', '')}
          </h3>
        )
        return
      }

      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${idx}`}
            className="my-6 pl-4 border-l-2 border-current italic opacity-85 leading-relaxed"
          >
            {line.replace('> ', '')}
          </blockquote>
        )
        return
      }

      if (line.trim() === '---') {
        elements.push(<hr key={`hr-${idx}`} className="my-8 opacity-20 border-current" />)
        return
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`li-${idx}`} className="ml-6 list-disc my-1.5 leading-relaxed">
            {line.substring(2)}
          </li>
        )
        return
      }

      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${idx}`} className="my-5 leading-[1.8]">
            {line}
          </p>
        )
      }
    })

    return elements
  }

  // Theme container classes
  const themeClasses = {
    light: 'bg-[#fafaf9] text-[#292524] border-[#e7e5e4]',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e8d7b8]',
    dark: 'bg-[#121110] text-[#eae7e4] border-[#292524]',
  }[readerTheme]

  const fontClass = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
  }[readerFont]

  return (
    <div className={cn('min-h-screen flex flex-col transition-colors duration-200', themeClasses)}>
      {/* Top Reader Controls Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md border-b bg-inherit/90 px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/books/$id"
            params={{ id: id as any }}
            className="p-1.5 rounded opacity-70 hover:opacity-100 transition-opacity"
            title="Back to Book"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-mono"
            title="Table of Contents"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Contents</span>
          </button>
        </div>

        {/* Center: Book & Chapter Title */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono opacity-80 truncate max-w-sm">
          <span className="truncate">{book.title}</span>
          <span>·</span>
          <span className="font-semibold">
            {currentChapter ? currentChapter.title : 'Overview'}
          </span>
        </div>

        {/* Right: Theme, Font & Size Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* Theme switcher: Light, Sepia, Dark */}
          <div className="flex items-center rounded border p-0.5">
            <button
              onClick={() => setReaderTheme('light')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-mono transition-colors',
                readerTheme === 'light' ? 'bg-white shadow-xs font-bold text-black' : 'opacity-60'
              )}
            >
              Light
            </button>
            <button
              onClick={() => setReaderTheme('sepia')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-mono transition-colors',
                readerTheme === 'sepia'
                  ? 'bg-[#edd9b1] shadow-xs font-bold text-[#433422]'
                  : 'opacity-60'
              )}
            >
              Sepia
            </button>
            <button
              onClick={() => setReaderTheme('dark')}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-mono transition-colors',
                readerTheme === 'dark' ? 'bg-[#292524] shadow-xs font-bold text-white' : 'opacity-60'
              )}
            >
              Dark
            </button>
          </div>

          {/* Font Selector */}
          <select
            value={readerFont}
            onChange={(e) => setReaderFont(e.target.value as any)}
            aria-label="Reader font"
            className="bg-transparent border rounded px-2 py-0.5 font-mono text-[11px] focus:outline-none"
          >
            <option value="serif">Serif (Lora)</option>
            <option value="sans">Sans (Geist)</option>
            <option value="mono">Mono (Geist Mono)</option>
          </select>

          {/* Font Size A- / A+ */}
          <div className="flex items-center gap-1 border rounded px-1.5 py-0.5 font-mono text-xs">
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className="px-1 hover:opacity-100 opacity-60 font-bold"
              title="Decrease text size"
            >
              A-
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              className="px-1 hover:opacity-100 opacity-60 font-bold"
              title="Increase text size"
            >
              A+
            </button>
          </div>

          <Link to="/books/$id/print" params={{ id: id as any }}>
            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5 gap-1 font-sans">
              <Printer className="h-3 w-3" />
              <span className="hidden sm:inline">Print PDF</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Reader Layout with optional Sidebar Drawer */}
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

            <nav className="space-y-1.5 text-xs font-mono">
              {chapters.map((ch: any, idx: number) => (
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

        {/* Reader Reading View */}
        <main
          className="flex-1 max-w-2xl mx-auto px-6 py-16 space-y-12"
          style={{ fontSize: `${fontSize}px` }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {currentChapter ? (
            <article className={cn('space-y-8', fontClass)}>
              <div className="space-y-2 border-b pb-6">
                <span className="font-mono text-xs uppercase tracking-widest opacity-60 block">
                  Chapter {currentChapter.order} · {book.language.toUpperCase()}
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight leading-[1.2]">
                  {currentChapter.title}
                </h1>
              </div>

              <div className="leading-relaxed">
                {renderChapterContent(currentChapter.content)}
              </div>
            </article>
          ) : (
            <div className="text-center py-20 space-y-4">
              <p className="font-serif text-xl">No chapters available to preview</p>
              <Link to="/books/$id" params={{ id: id as any }}>
                <Button size="sm" className="text-xs font-sans">
                  Add Chapters
                </Button>
              </Link>
            </div>
          )}

          {/* Reader Pagination between Chapters */}
          {chapters.length > 1 && (
            <div
              className="pt-12 border-t flex items-center justify-between gap-4 text-xs font-sans"
              dir="ltr"
            >
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
