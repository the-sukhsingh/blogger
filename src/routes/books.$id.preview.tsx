import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Printer,
  Columns2,
  Maximize2,
  Minimize2,
  AlignLeft,
  List,
  X,
  Compass,
} from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '#/components/ui/button'
import { formatWordCount } from '#/lib/book-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/books/$id/preview')({
  component: BookReaderPreviewPage,
})

type ReaderLayout = 'spread' | 'scroll'
type PaperPalette = 'cream' | 'white' | 'sepia' | 'obsidian'
type Typeface = 'serif' | 'sans' | 'mono'

export function BookReaderPreviewPage() {
  const { id } = Route.useParams()
  const book = useQuery(api.books.get, { id: id as any })

  // Reader state
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0)
  const [spreadPageIndex, setSpreadPageIndex] = React.useState(0) // Page index within current chapter
  const [layoutMode, setLayoutMode] = React.useState<ReaderLayout>('spread')
  const [palette, setPalette] = React.useState<PaperPalette>('cream')
  const [typeface, setTypeface] = React.useState<Typeface>('serif')
  const [fontSize, setFontSize] = React.useState<number>(17)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [tocDrawerOpen, setTocDrawerOpen] = React.useState(false)
  const [showControls, setShowControls] = React.useState(true)

  const controlsTimeoutRef = React.useRef<any>(null)

  // Auto-hide controls after inactivity in fullscreen
  const handleMouseMove = React.useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isFullscreen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3500)
    }
  }, [isFullscreen])

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
      }
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        handlePrev()
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen()
      } else if (e.key.toLowerCase() === 't') {
        setTocDrawerOpen((prev) => !prev)
      } else if (e.key.toLowerCase() === 'm') {
        setLayoutMode((m) => (m === 'spread' ? 'scroll' : 'spread'))
      } else if (e.key === 'Escape') {
        setTocDrawerOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentChapterIndex, spreadPageIndex, layoutMode, book])

  if (!book) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-mono text-xs">
        <p className="animate-pulse">Loading manuscript reader...</p>
      </div>
    )
  }

  const chapters = book.chapters || []
  const currentChapter = chapters[currentChapterIndex] || null
  const isRtl = book.direction === 'rtl'

  // Chunk chapter paragraphs into pages for the 2-page spread simulator
  const chapterParagraphs = React.useMemo(() => {
    if (!currentChapter?.content) return []
    return currentChapter.content
      .split('\n\n')
      .map((p: string) => p.trim())
      .filter(Boolean)
  }, [currentChapter?.content])

  // Divide paragraphs across virtual pages (typically 3 paragraphs per virtual page)
  const PARAGRAPHS_PER_PAGE = 3
  const totalPagesInChapter = Math.max(1, Math.ceil(chapterParagraphs.length / PARAGRAPHS_PER_PAGE))

  // Total pages across entire book estimate
  const estimatedTotalPages = Math.max(
    1,
    chapters.reduce((acc: number, ch: any) => {
      const pCount = (ch.content || '').split('\n\n').filter(Boolean).length
      return acc + Math.max(1, Math.ceil(pCount / PARAGRAPHS_PER_PAGE))
    }, 0)
  )

  const handleNext = () => {
    if (layoutMode === 'spread') {
      if (spreadPageIndex + 2 < totalPagesInChapter) {
        setSpreadPageIndex((p) => p + 2)
      } else if (currentChapterIndex < chapters.length - 1) {
        setCurrentChapterIndex((c) => c + 1)
        setSpreadPageIndex(0)
      }
    } else {
      if (currentChapterIndex < chapters.length - 1) {
        setCurrentChapterIndex((c) => c + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handlePrev = () => {
    if (layoutMode === 'spread') {
      if (spreadPageIndex >= 2) {
        setSpreadPageIndex((p) => p - 2)
      } else if (currentChapterIndex > 0) {
        const prevChapter = chapters[currentChapterIndex - 1]
        const prevPCount = (prevChapter?.content || '').split('\n\n').filter(Boolean).length
        const prevTotalPages = Math.max(1, Math.ceil(prevPCount / PARAGRAPHS_PER_PAGE))
        const lastSpreadStart = prevTotalPages % 2 === 0 ? prevTotalPages - 2 : prevTotalPages - 1
        setCurrentChapterIndex((c) => c - 1)
        setSpreadPageIndex(Math.max(0, lastSpreadStart))
      }
    } else {
      if (currentChapterIndex > 0) {
        setCurrentChapterIndex((c) => c - 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Calculate overall reading progress percentage
  const overallProgress = React.useMemo(() => {
    if (chapters.length === 0) return 0
    let passedPages = 0
    for (let i = 0; i < currentChapterIndex; i++) {
      const pCount = (chapters[i].content || '').split('\n\n').filter(Boolean).length
      passedPages += Math.max(1, Math.ceil(pCount / PARAGRAPHS_PER_PAGE))
    }
    passedPages += layoutMode === 'spread' ? spreadPageIndex : 0
    return Math.min(100, Math.round((passedPages / estimatedTotalPages) * 100))
  }, [currentChapterIndex, spreadPageIndex, chapters, layoutMode, estimatedTotalPages])

  // Palette styling definitions
  const paletteTheme = {
    cream: {
      bg: 'bg-[#f7f4ee] text-[#2c2520]',
      surface: 'bg-[#fcfaf6] text-[#2c2520] border-[#ede7dc]',
      gutter: 'from-black/5 via-black/10 to-transparent',
      subtle: 'text-[#6b6158]',
      border: 'border-[#ede7dc]',
      accent: 'bg-[#ede6d8]',
    },
    white: {
      bg: 'bg-[#fafafa] text-neutral-900',
      surface: 'bg-white text-neutral-900 border-neutral-200',
      gutter: 'from-black/5 via-black/8 to-transparent',
      subtle: 'text-neutral-500',
      border: 'border-neutral-200',
      accent: 'bg-neutral-100',
    },
    sepia: {
      bg: 'bg-[#eedec5] text-[#3d3224]',
      surface: 'bg-[#f6ebd7] text-[#3d3224] border-[#dfceb4]',
      gutter: 'from-amber-950/10 via-amber-950/15 to-transparent',
      subtle: 'text-[#7d6951]',
      border: 'border-[#dfceb4]',
      accent: 'bg-[#e4d3b8]',
    },
    obsidian: {
      bg: 'bg-[#0f0e0d] text-[#e6e2dd]',
      surface: 'bg-[#181614] text-[#e6e2dd] border-[#292623]',
      gutter: 'from-black/40 via-black/60 to-transparent',
      subtle: 'text-[#8c857d]',
      border: 'border-[#292623]',
      accent: 'bg-[#262320]',
    },
  }[palette]

  const fontClass =
    typeface === 'serif'
      ? 'font-serif'
      : typeface === 'mono'
        ? 'font-mono'
        : 'font-sans'

  // Render a block of paragraphs with drop caps on first paragraph
  const renderParagraphs = (paras: string[], isFirstPageOfChapter = false) => {
    return paras.map((p, idx) => {
      if (p.startsWith('# ')) return null

      if (p.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="font-serif text-xl sm:text-2xl font-normal tracking-tight mt-6 mb-3 border-b border-current/10 pb-1"
          >
            {p.replace('## ', '')}
          </h2>
        )
      }

      if (p.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-base font-medium tracking-tight mt-4 mb-2">
            {p.replace('### ', '')}
          </h3>
        )
      }

      if (p.startsWith('>')) {
        return (
          <blockquote
            key={idx}
            className="my-4 pl-4 border-l-2 border-current/30 italic text-sm opacity-80"
          >
            {p.replace(/^>\s*/, '')}
          </blockquote>
        )
      }

      if (p.startsWith('```')) {
        const code = p.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '')
        return (
          <pre
            key={idx}
            className="p-3 my-4 rounded bg-black/5 dark:bg-white/5 border border-current/10 font-mono text-xs overflow-x-auto leading-relaxed"
            dir="ltr"
          >
            <code>{code}</code>
          </pre>
        )
      }

      // First paragraph of chapter gets an elegant drop cap
      const isOpeningParagraph = isFirstPageOfChapter && idx === 0
      return (
        <p
          key={idx}
          className={cn(
            'leading-[1.7] my-3.5 text-justify hyphens-auto',
            isOpeningParagraph ? 'first-letter:font-serif first-letter:text-4xl first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:font-semibold' : ''
          )}
        >
          {p}
        </p>
      )
    })
  }

  // Slices for Left (Verso) and Right (Recto) pages in spread mode
  const leftPageParagraphs = chapterParagraphs.slice(
    spreadPageIndex * PARAGRAPHS_PER_PAGE,
    (spreadPageIndex + 1) * PARAGRAPHS_PER_PAGE
  )
  const rightPageParagraphs = chapterParagraphs.slice(
    (spreadPageIndex + 1) * PARAGRAPHS_PER_PAGE,
    (spreadPageIndex + 2) * PARAGRAPHS_PER_PAGE
  )

  const leftPageNumber = spreadPageIndex + 1
  const rightPageNumber = spreadPageIndex + 2

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'min-h-screen flex flex-col font-sans transition-colors duration-300 relative select-none',
        paletteTheme.bg
      )}
    >
      {/* Top Floating Chrome Bar */}
      <header
        className={cn(
          'sticky top-0 z-40 px-6 py-3 border-b flex items-center justify-between backdrop-blur-md transition-all duration-300',
          paletteTheme.border,
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        {/* Left: Back & Table of Contents Trigger */}
        <div className="flex items-center gap-3">
          <Link
            to="/books/$id"
            params={{ id: id as any }}
            className={cn('inline-flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-100', paletteTheme.subtle)}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Book Details</span>
          </Link>

          <span className={cn('text-xs opacity-40', paletteTheme.subtle)}>|</span>

          <button
            type="button"
            onClick={() => setTocDrawerOpen(true)}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded transition-colors',
              paletteTheme.subtle,
              'hover:opacity-100'
            )}
            title="Table of Contents (T)"
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Contents</span>
          </button>
        </div>

        {/* Center: Book & Chapter Title */}
        <div className="text-center max-w-md mx-auto truncate px-4">
          <span className="font-serif text-sm font-medium tracking-tight block truncate">
            {book.title}
          </span>
          {currentChapter && (
            <span className={cn('font-mono text-[11px] block truncate', paletteTheme.subtle)}>
              Chapter {currentChapter.order}: {currentChapter.title}
            </span>
          )}
        </div>

        {/* Right: Layout Switcher, Palettes, Typography & Fullscreen */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Mode toggle: Spread vs Scroll */}
          <div className={cn('flex items-center p-0.5 rounded border', paletteTheme.border)}>
            <button
              onClick={() => setLayoutMode('spread')}
              className={cn(
                'p-1.5 rounded transition-colors',
                layoutMode === 'spread' ? paletteTheme.accent : 'opacity-60'
              )}
              title="Two-Page Spread View (M)"
            >
              <Columns2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('scroll')}
              className={cn(
                'p-1.5 rounded transition-colors',
                layoutMode === 'scroll' ? paletteTheme.accent : 'opacity-60'
              )}
              title="Focus Continuous Scroll (M)"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Palette selector */}
          <div className={cn('hidden sm:flex items-center p-0.5 rounded border', paletteTheme.border)}>
            {(['cream', 'white', 'sepia', 'obsidian'] as PaperPalette[]).map((p) => (
              <button
                key={p}
                onClick={() => setPalette(p)}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] capitalize transition-colors',
                  palette === p ? paletteTheme.accent : 'opacity-50'
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Font Typeface */}
          <select
            value={typeface}
            onChange={(e) => setTypeface(e.target.value as any)}
            aria-label="Reading typeface"
            className={cn(
              'bg-transparent border rounded px-1.5 py-1 text-[11px] focus:outline-none hidden md:inline-block',
              paletteTheme.border
            )}
          >
            <option value="serif">Serif (Lora)</option>
            <option value="sans">Sans (Inter)</option>
            <option value="mono">Mono</option>
          </select>

          {/* Font Scale A- / A+ */}
          <div className={cn('hidden lg:flex items-center gap-1 border rounded px-1.5 py-0.5', paletteTheme.border)}>
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 1))}
              className="px-1 hover:opacity-100 opacity-60 font-semibold"
              title="Decrease size"
            >
              A-
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={() => setFontSize((s) => Math.min(24, s + 1))}
              className="px-1 hover:opacity-100 opacity-60 font-semibold"
              title="Increase size"
            >
              A+
            </button>
          </div>

          {/* Print PDF direct jump */}
          <Link to="/books/$id/print" params={{ id: id as any }}>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
              <Printer className="h-3 w-3" />
            </Button>
          </Link>

          {/* Fullscreen button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={cn('p-1.5 rounded hover:opacity-100 transition-opacity', paletteTheme.subtle)}
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Reading Surface */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        {/* ============================================================== */}
        {/* MODE A: TWO-PAGE SPREAD (VIRTUAL BOOK SIMULATOR)                */}
        {/* ============================================================== */}
        {layoutMode === 'spread' && currentChapter && (
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center relative">
            {/* Left Page Turn Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentChapterIndex === 0 && spreadPageIndex === 0}
              className={cn(
                'absolute -left-2 sm:-left-6 lg:-left-10 z-20 p-2 sm:p-3 rounded-full border shadow-md transition-all',
                paletteTheme.surface,
                currentChapterIndex === 0 && spreadPageIndex === 0
                  ? 'opacity-20 pointer-events-none'
                  : 'hover:scale-105 active:scale-95'
              )}
              title="Previous Page / Chapter (←)"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* The Open Book Volume */}
            <div
              className={cn(
                'w-full max-w-5xl rounded-sm shadow-2xl flex flex-col md:flex-row border overflow-hidden relative',
                paletteTheme.surface
              )}
              style={{
                minHeight: '620px',
                fontSize: `${fontSize}px`,
              }}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Center Spine Shadow Gutter */}
              <div
                className={cn(
                  'hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-10 bg-gradient-to-r',
                  paletteTheme.gutter
                )}
              />

              {/* LEFT PAGE (Verso) */}
              <article
                className={cn(
                  'flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r',
                  paletteTheme.border,
                  fontClass
                )}
              >
                <div>
                  {/* Verso Running Header */}
                  <div
                    className={cn(
                      'flex items-center justify-between text-[11px] font-mono pb-3 border-b mb-6',
                      paletteTheme.subtle,
                      paletteTheme.border
                    )}
                    dir="ltr"
                  >
                    <span className="italic truncate max-w-[200px]">{book.title}</span>
                    <span className="opacity-60 uppercase tracking-widest text-[10px]">Verso</span>
                  </div>

                  {/* If this is the chapter opening, render chapter title header */}
                  {spreadPageIndex === 0 && (
                    <div className="space-y-2 mb-6 text-center pt-2">
                      <span className={cn('font-mono text-xs uppercase tracking-widest block', paletteTheme.subtle)}>
                        Chapter {currentChapter.order}
                      </span>
                      <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight">
                        {currentChapter.title}
                      </h1>
                    </div>
                  )}

                  {/* Left Page Body Content */}
                  <div className="space-y-2">
                    {leftPageParagraphs.length > 0 ? (
                      renderParagraphs(leftPageParagraphs, spreadPageIndex === 0)
                    ) : (
                      <p className={cn('italic text-xs font-mono text-center pt-20', paletteTheme.subtle)}>
                        [Blank Page]
                      </p>
                    )}
                  </div>
                </div>

                {/* Verso Page Number */}
                <div
                  className={cn('text-center font-mono text-xs pt-6', paletteTheme.subtle)}
                  dir="ltr"
                >
                  {leftPageNumber}
                </div>
              </article>

              {/* RIGHT PAGE (Recto) */}
              <article
                className={cn(
                  'flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-between',
                  fontClass
                )}
              >
                <div>
                  {/* Recto Running Header */}
                  <div
                    className={cn(
                      'flex items-center justify-between text-[11px] font-mono pb-3 border-b mb-6',
                      paletteTheme.subtle,
                      paletteTheme.border
                    )}
                    dir="ltr"
                  >
                    <span className="opacity-60 uppercase tracking-widest text-[10px]">Recto</span>
                    <span className="italic truncate max-w-[200px]">{currentChapter.title}</span>
                  </div>

                  {/* Right Page Body Content */}
                  <div className="space-y-2">
                    {rightPageParagraphs.length > 0 ? (
                      renderParagraphs(rightPageParagraphs, false)
                    ) : (
                      <p className={cn('italic text-xs font-mono text-center pt-20', paletteTheme.subtle)}>
                        {spreadPageIndex + 2 >= totalPagesInChapter
                          ? '[End of Chapter]'
                          : '[Blank Page]'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Recto Page Number */}
                <div
                  className={cn('text-center font-mono text-xs pt-6', paletteTheme.subtle)}
                  dir="ltr"
                >
                  {rightPageNumber}
                </div>
              </article>
            </div>

            {/* Right Page Turn Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={
                currentChapterIndex === chapters.length - 1 &&
                spreadPageIndex + 2 >= totalPagesInChapter
              }
              className={cn(
                'absolute -right-2 sm:-right-6 lg:-right-10 z-20 p-2 sm:p-3 rounded-full border shadow-md transition-all',
                paletteTheme.surface,
                currentChapterIndex === chapters.length - 1 &&
                spreadPageIndex + 2 >= totalPagesInChapter
                  ? 'opacity-20 pointer-events-none'
                  : 'hover:scale-105 active:scale-95'
              )}
              title="Next Page / Chapter (→)"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE B: CONTINUOUS FOCUS SCROLL                                */}
        {/* ============================================================== */}
        {layoutMode === 'scroll' && currentChapter && (
          <main
            className={cn(
              'max-w-2xl w-full mx-auto rounded-xl p-8 sm:p-14 shadow-sm border transition-colors',
              paletteTheme.surface,
              fontClass
            )}
            style={{ fontSize: `${fontSize}px` }}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Chapter Header */}
            <div className={cn('space-y-2 border-b pb-6 mb-8 text-center', paletteTheme.border)}>
              <span className={cn('font-mono text-xs uppercase tracking-widest block', paletteTheme.subtle)}>
                Chapter {currentChapter.order} · {book.language.toUpperCase()}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">
                {currentChapter.title}
              </h1>
            </div>

            {/* Full Chapter Content */}
            <article className="space-y-3">
              {renderParagraphs(chapterParagraphs, true)}
            </article>

            {/* Chapter Navigation Footer */}
            <div
              className={cn(
                'pt-12 mt-12 border-t flex items-center justify-between text-xs font-mono',
                paletteTheme.border,
                paletteTheme.subtle
              )}
              dir="ltr"
            >
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentChapterIndex === 0}
                className="inline-flex items-center gap-1.5 hover:opacity-100 disabled:opacity-20"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev Chapter</span>
              </button>

              <span>
                {currentChapterIndex + 1} / {chapters.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentChapterIndex >= chapters.length - 1}
                className="inline-flex items-center gap-1.5 hover:opacity-100 disabled:opacity-20"
              >
                <span>Next Chapter</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </main>
        )}

        {chapters.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h2 className="font-serif text-2xl">No chapters in this book</h2>
            <p className={cn('text-xs font-mono', paletteTheme.subtle)}>
              Add chapters from the book workspace to preview the manuscript.
            </p>
            <Link to="/books/$id" params={{ id: id as any }}>
              <Button size="sm">Go to Workspace</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Floating Bottom Scrubber & Progress Tray */}
      <footer
        className={cn(
          'sticky bottom-0 z-40 px-6 py-2.5 border-t flex items-center justify-between backdrop-blur-md text-xs font-mono transition-all duration-300',
          paletteTheme.border,
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <div className={cn('flex items-center gap-3', paletteTheme.subtle)}>
          <span className="font-semibold text-foreground">{overallProgress}% Read</span>
          <span className="opacity-40">·</span>
          <span>
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </span>
          <span className="opacity-40 hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            {formatWordCount(
              chapters.slice(0, currentChapterIndex + 1).reduce((acc: number, ch: any) => {
                return acc + (ch.content || '').split(/\s+/).filter(Boolean).length
              }, 0)
            )}{' '}
            read
          </span>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 max-w-xs mx-6 hidden sm:flex items-center gap-1.5">
          {chapters.map((ch: any, idx: number) => (
            <button
              key={ch._id}
              onClick={() => {
                setCurrentChapterIndex(idx)
                setSpreadPageIndex(0)
              }}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                idx < currentChapterIndex
                  ? 'bg-primary'
                  : idx === currentChapterIndex
                    ? 'bg-primary ring-2 ring-primary/30'
                    : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'
              )}
              title={`Jump to Chapter ${ch.order}: ${ch.title}`}
            />
          ))}
        </div>

        {/* Keyboard Hints */}
        <div className={cn('hidden md:flex items-center gap-2 text-[11px]', paletteTheme.subtle)}>
          <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">←</span>
          <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">→</span>
          <span>Turn Page</span>
          <span className="opacity-40">·</span>
          <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">F</span>
          <span>Fullscreen</span>
        </div>
      </footer>

      {/* Slide-out Table of Contents Drawer */}
      {tocDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setTocDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          />

          {/* Drawer Sidebar */}
          <aside
            className={cn(
              'relative z-10 w-80 max-w-full h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r animate-in slide-in-from-left duration-200',
              paletteTheme.surface
            )}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">
                    Manuscript Index
                  </h3>
                </div>
                <button
                  onClick={() => setTocDrawerOpen(false)}
                  className="p-1 rounded hover:opacity-100 opacity-60"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Book Info */}
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-medium leading-snug">{book.title}</h4>
                <p className={cn('text-xs font-mono', paletteTheme.subtle)}>By {book.author}</p>
              </div>

              {/* Chapter Listing */}
              <nav className="space-y-1 font-mono text-xs">
                {chapters.map((ch: any, idx: number) => {
                  const chWords = (ch.content || '').split(/\s+/).filter(Boolean).length
                  const isCurrent = currentChapterIndex === idx

                  return (
                    <button
                      key={ch._id}
                      onClick={() => {
                        setCurrentChapterIndex(idx)
                        setSpreadPageIndex(0)
                        setTocDrawerOpen(false)
                      }}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between gap-2',
                        isCurrent
                          ? cn(paletteTheme.accent, 'font-semibold')
                          : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                      )}
                    >
                      <div className="truncate space-y-0.5">
                        <span className="opacity-50 text-[10px] uppercase block">
                          Chapter {ch.order}
                        </span>
                        <span className="font-serif text-sm block truncate">{ch.title}</span>
                      </div>
                      <span className={cn('text-[11px] shrink-0', paletteTheme.subtle)}>
                        {formatWordCount(chWords)}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-current/10 text-center">
              <Link to="/books/$id/print" params={{ id: id as any }}>
                <Button variant="outline" size="sm" className="w-full text-xs font-mono gap-1.5">
                  <Printer className="h-3.5 w-3.5" />
                  <span>Open Print Formatter</span>
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
