import * as React from 'react'
import {
  X,
  BookOpen,
  Printer,
  FileText,
  Clock,
  Calendar,
  Tag,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  slug: string
  topics: string[]
  author?: string
  readingTime?: string
  coverImage?: string
}

type PreviewView = 'reader' | 'print' | 'manuscript'
type PreviewFont = 'serif' | 'sans' | 'mono'
type PreviewPaper = 'paper' | 'white' | 'dark'

export function PreviewModal({
  isOpen,
  onClose,
  title,
  content,
  slug,
  topics,
  author = 'Staff Engineer',
  readingTime = '5 min read',
  coverImage,
}: PreviewModalProps) {
  const [activeView, setActiveView] = React.useState<PreviewView>('reader')
  const [fontFamily, setFontFamily] = React.useState<PreviewFont>('serif')
  const [paperTheme, setPaperTheme] = React.useState<PreviewPaper>('paper')
  const [fontSize, setFontSize] = React.useState<number>(18)
  const [measureWidth, setMeasureWidth] = React.useState<'compact' | 'standard' | 'wide'>('standard')

  // Keyboard shortcut: Escape to close
  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const cleanTitle = title.trim() || 'Untitled Article'
  const cleanSlug = slug.trim() || 'untitled-article'
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const charCount = content.length

  const measureClass =
    measureWidth === 'compact'
      ? 'max-w-xl'
      : measureWidth === 'wide'
        ? 'max-w-3xl'
        : 'max-w-2xl'

  const fontClass =
    fontFamily === 'serif'
      ? 'font-serif'
      : fontFamily === 'mono'
        ? 'font-mono'
        : 'font-sans'

  const paperStyles: Record<PreviewPaper, { bg: string; text: string; border: string }> = {
    paper: {
      bg: 'bg-[#fcfaf7] dark:bg-[#1a1816]',
      text: 'text-[#2b2622] dark:text-[#ede8e1]',
      border: 'border-[#ede7de] dark:border-[#2e2a26]',
    },
    white: {
      bg: 'bg-white dark:bg-[#141414]',
      text: 'text-neutral-900 dark:text-neutral-100',
      border: 'border-neutral-200 dark:border-neutral-800',
    },
    dark: {
      bg: 'bg-[#18181b] text-neutral-100',
      text: 'text-neutral-100',
      border: 'border-neutral-800',
    },
  }

  // Parse markdown into clean editorial blocks
  const renderEditorialContent = (rawText: string) => {
    const blocks = rawText.split('\n\n')
    return blocks.map((block, index) => {
      const trimmed = block.trim()
      if (!trimmed) return null

      if (trimmed.startsWith('# ')) {
        return (
          <h1
            key={index}
            className="font-serif text-3xl sm:text-4xl font-normal tracking-tight mt-10 mb-4 leading-snug"
          >
            {trimmed.replace(/^# /, '')}
          </h1>
        )
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="font-serif text-2xl font-normal tracking-tight mt-8 mb-3 leading-snug border-b pb-2"
          >
            {trimmed.replace(/^## /, '')}
          </h2>
        )
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={index}
            className="font-serif text-lg font-medium tracking-tight mt-6 mb-2 leading-snug"
          >
            {trimmed.replace(/^### /, '')}
          </h3>
        )
      }
      if (trimmed.startsWith('>')) {
        return (
          <blockquote
            key={index}
            className="border-l-2 border-foreground/30 pl-4 py-1 my-5 italic text-sm sm:text-base opacity-80"
          >
            {trimmed.replace(/^>\s*/, '')}
          </blockquote>
        )
      }
      if (trimmed.startsWith('```')) {
        const code = trimmed
          .replace(/^```[a-z]*\n?/i, '')
          .replace(/\n?```$/, '')
        return (
          <pre
            key={index}
            className="p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-current/10 font-mono text-xs overflow-x-auto leading-relaxed my-6"
            dir="ltr"
          >
            <code>{code}</code>
          </pre>
        )
      }

      return (
        <p key={index} className="leading-relaxed my-4">
          {trimmed}
        </p>
      )
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl h-[92vh] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <header className="px-6 py-3.5 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground mr-2">
              Preview
            </span>

            {/* View Modes */}
            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveView('reader')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded transition-colors',
                  activeView === 'reader'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Reader</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('print')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded transition-colors',
                  activeView === 'print'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('manuscript')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded transition-colors',
                  activeView === 'manuscript'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Metadata</span>
              </button>
            </div>
          </div>

          {/* Right: Typography Tuning & Close */}
          <div className="flex items-center gap-3">
            {activeView === 'reader' && (
              <div className="hidden md:flex items-center gap-3 text-xs font-mono">
                {/* Paper Theme */}
                <div className="flex items-center gap-1 border border-border rounded p-0.5">
                  <button
                    onClick={() => setPaperTheme('paper')}
                    className={cn(
                      'px-2 py-0.5 rounded text-[11px] transition-colors',
                      paperTheme === 'paper' ? 'bg-[#ede7de] dark:bg-[#2e2a26] font-semibold' : 'opacity-60'
                    )}
                    title="Warm Paper"
                  >
                    Warm
                  </button>
                  <button
                    onClick={() => setPaperTheme('white')}
                    className={cn(
                      'px-2 py-0.5 rounded text-[11px] transition-colors',
                      paperTheme === 'white' ? 'bg-muted font-semibold' : 'opacity-60'
                    )}
                    title="Clean White"
                  >
                    White
                  </button>
                </div>

                {/* Font Selector */}
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  aria-label="Font selection"
                  className="bg-transparent border border-border rounded px-2 py-1 text-[11px] focus:outline-none"
                >
                  <option value="serif">Serif</option>
                  <option value="sans">Sans</option>
                  <option value="mono">Mono</option>
                </select>

                {/* Measure Width */}
                <select
                  value={measureWidth}
                  onChange={(e) => setMeasureWidth(e.target.value as any)}
                  aria-label="Reading width"
                  className="bg-transparent border border-border rounded px-2 py-1 text-[11px] focus:outline-none"
                >
                  <option value="compact">Narrow</option>
                  <option value="standard">Standard</option>
                  <option value="wide">Wide</option>
                </select>

                {/* Font Size A- / A+ */}
                <div className="flex items-center gap-1 border border-border rounded px-1.5 py-0.5">
                  <button
                    onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                    className="px-1 hover:opacity-100 opacity-60"
                    title="Smaller"
                  >
                    A-
                  </button>
                  <span className="opacity-30">|</span>
                  <button
                    onClick={() => setFontSize((s) => Math.min(24, s + 2))}
                    className="px-1 hover:opacity-100 opacity-60"
                    title="Larger"
                  >
                    A+
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Close preview (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          {/* 1. READER PREVIEW */}
          {activeView === 'reader' && (
            <div
              className={cn(
                'mx-auto rounded-xl p-8 sm:p-14 border transition-colors shadow-xs',
                paperStyles[paperTheme].bg,
                paperStyles[paperTheme].text,
                paperStyles[paperTheme].border,
                measureClass
              )}
              style={{ fontSize: `${fontSize}px` }}
            >
              {coverImage && (
                <div className="w-full h-56 sm:h-72 rounded-lg overflow-hidden border border-current/10 mb-8">
                  <img
                    src={coverImage}
                    alt={cleanTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4 pb-6 border-b border-current/10">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono opacity-70">
                  <span>{author}</span>
                  <span>·</span>
                  <span>{readingTime}</span>
                  {topics.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{topics.join(', ')}</span>
                    </>
                  )}
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight leading-[1.15]">
                  {cleanTitle}
                </h1>
              </div>

              <article className={cn('pt-4', fontClass)}>
                {renderEditorialContent(content)}
              </article>
            </div>
          )}

          {/* 2. PRINT SHEET VIEW */}
          {activeView === 'print' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white text-black p-12 sm:p-16 rounded-sm shadow-xl border border-neutral-300 font-serif min-h-[700px] flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Running Header */}
                  <div className="flex items-center justify-between font-mono text-[9pt] text-neutral-500 border-b pb-2">
                    <span>{cleanTitle}</span>
                    <span>{author}</span>
                  </div>

                  {/* Title Block */}
                  <div className="pt-6 pb-4 space-y-2 text-center">
                    <h1 className="text-3xl font-normal tracking-tight leading-tight">
                      {cleanTitle}
                    </h1>
                    <p className="font-mono text-xs text-neutral-600">
                      By {author} · Published via Beelog Press
                    </p>
                  </div>

                  {/* Body Content */}
                  <div className="text-[10.5pt] leading-relaxed space-y-3">
                    {renderEditorialContent(content.slice(0, 1800))}
                    {content.length > 1800 && (
                      <p className="text-xs font-mono text-neutral-400 italic pt-4">
                        [... Manuscript continues onto subsequent pages ...]
                      </p>
                    )}
                  </div>
                </div>

                {/* Page Number */}
                <div className="text-center font-mono text-[9pt] text-neutral-400 pt-8">
                  — 1 —
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-mono text-muted-foreground">
                  Simulated 8.5" × 11" document sheet with 1-inch standard margins.
                </p>
              </div>
            </div>
          )}

          {/* 3. MANUSCRIPT METADATA */}
          {activeView === 'manuscript' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="border border-border rounded-xl p-6 bg-card space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground">
                    Manuscript Specification
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Direct metrics and archive properties.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Words & Reading Time
                    </span>
                    <p className="font-semibold text-foreground text-sm">
                      {wordCount.toLocaleString()} words · {readingTime}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Characters
                    </span>
                    <p className="font-semibold text-foreground text-sm">
                      {charCount.toLocaleString()} chars
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Canonical Slug
                    </span>
                    <p className="font-semibold text-foreground truncate">
                      /{cleanSlug}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Author
                    </span>
                    <p className="font-semibold text-foreground truncate">
                      {author}
                    </p>
                  </div>
                </div>

                {topics.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-mono text-muted-foreground">
                      Assigned Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {topics.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-xs bg-muted text-foreground font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border bg-card flex items-center justify-between text-xs font-mono text-muted-foreground shrink-0">
          <div>
            {wordCount} words · {readingTime}
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
            Close Preview
          </Button>
        </footer>
      </div>
    </div>
  )
}
