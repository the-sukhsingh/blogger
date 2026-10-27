import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Printer,
  Save,
  Check,
  Sliders,
  RotateCcw,
  Columns2,
  Square,
  Grid,
  ZoomIn,
  ZoomOut,
  Eye,
  X,
} from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '#/components/ui/button'
import {
  TRIM_SIZE_SPECS,
  DEFAULT_PRINT_SETTINGS,
  generatePrintStylesheet,
  type PrintSettings,
} from '#/lib/book-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/books/$id/print')({
  component: BookPrintPdfPage,
})

type PageLayoutMode = 'spread' | 'single' | 'grid'

// Build the ordered sequence of physical book pages
interface BookPageData {
  pageNumber: number
  side: 'left' | 'right'
  type: 'title' | 'toc' | 'chapter-start' | 'chapter-body' | 'blank'
  chapterOrder?: number
  chapterTitle?: string
  contentBlocks?: string[]
  isOpening?: boolean
}

export function BookPrintPdfPage() {
  const { id } = Route.useParams()
  const book = useQuery(api.books.get, { id: id as any })
  const updatePrintSettings = useMutation(api.books.updatePrintSettings)

  // Local print settings
  const [settings, setSettings] = React.useState<PrintSettings>(DEFAULT_PRINT_SETTINGS)
  const [saved, setSaved] = React.useState(false)

  // Layout & View controls
  const [layoutMode, setLayoutMode] = React.useState<PageLayoutMode>('spread')
  const [zoomScale, setZoomScale] = React.useState<number>(100) // percent
  const [showGuidelines, setShowGuidelines] = React.useState<boolean>(false)
  const [chapterStartRecto, setChapterStartRecto] = React.useState<boolean>(true)
  const [dropCaps, setDropCaps] = React.useState<boolean>(true)
  const [controlsOpen, setControlsOpen] = React.useState<boolean>(false)

  // Load saved settings from book
  React.useEffect(() => {
    if (book?.printSettings) {
      setSettings(book.printSettings)
    }
  }, [book?.printSettings])

  const chapters = book?.chapters || []
  const trimSpec = TRIM_SIZE_SPECS[settings.trimSize]

  const assembledPages = React.useMemo(() => {
    const pages: BookPageData[] = []
    let pageNum = 1

    // 1. Title Page (Always Recto / Page 1)
    pages.push({
      pageNumber: pageNum++,
      side: 'right',
      type: 'title',
    })

    // Verso of Title Page (Blank / Copyright, Page 2)
    pages.push({
      pageNumber: pageNum++,
      side: 'left',
      type: 'blank',
    })

    // 2. Table of Contents (if enabled)
    if (settings.includeToC && chapters.length > 0) {
      pages.push({
        pageNumber: pageNum++,
        side: pageNum % 2 === 0 ? 'left' : 'right',
        type: 'toc',
      })
      // If next page is odd and chapter start recto is enabled, add blank if needed
      if (chapterStartRecto && pageNum % 2 === 0) {
        pages.push({
          pageNumber: pageNum++,
          side: 'left',
          type: 'blank',
        })
      }
    }

    // 3. Assemble chapters into structured pages
    chapters.forEach((ch: any) => {
      // Professional POD rule: chapter starts on Recto (right/odd page)
      if (chapterStartRecto && pageNum % 2 === 0) {
        pages.push({
          pageNumber: pageNum++,
          side: 'left',
          type: 'blank',
        })
      }

      const paragraphs = (ch.content || '')
        .split('\n\n')
        .map((p: string) => p.trim())
        .filter(Boolean)

      // Roughly 3 paragraphs per printed page
      const PARAS_PER_PRINT_PAGE = 3
      const numChapterPages = Math.max(1, Math.ceil(paragraphs.length / PARAS_PER_PRINT_PAGE))

      for (let pIdx = 0; pIdx < numChapterPages; pIdx++) {
        const slice = paragraphs.slice(
          pIdx * PARAS_PER_PRINT_PAGE,
          (pIdx + 1) * PARAS_PER_PRINT_PAGE
        )
        const isChapterOpening = pIdx === 0
        const side = pageNum % 2 === 0 ? 'left' : 'right'

        pages.push({
          pageNumber: pageNum++,
          side,
          type: isChapterOpening ? 'chapter-start' : 'chapter-body',
          chapterOrder: ch.order,
          chapterTitle: ch.title,
          contentBlocks: slice,
          isOpening: isChapterOpening,
        })
      }
    })

    return pages
  }, [chapters, settings.includeToC, chapterStartRecto])

  // Group assembled pages into 2-page spreads (Verso on left, Recto on right)
  const spreads = React.useMemo(() => {
    const list: BookPageData[][] = []
    for (let i = 0; i < assembledPages.length; i += 2) {
      list.push([assembledPages[i], assembledPages[i + 1]].filter(Boolean))
    }
    return list
  }, [assembledPages])

  if (!book) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-mono text-xs">
        <p className="animate-pulse">Loading book print sheets...</p>
      </div>
    )
  }

  const isRtl = book.direction === 'rtl'

  const handleSaveSettings = async () => {
    try {
      await updatePrintSettings({
        id: book._id,
        printSettings: settings,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save print settings:', err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleResetDefaults = () => {
    setSettings(DEFAULT_PRINT_SETTINGS)
    setChapterStartRecto(true)
    setDropCaps(true)
  }

  const printStyles = generatePrintStylesheet(settings, book.title)

  // Calculate base pixel dimensions from physical inches (96 DPI standard CSS pixel mapping)
  const baseSheetWidthPx = trimSpec.widthIn * 96
  const baseSheetHeightPx = trimSpec.heightIn * 96

  // Scaled dimensions for preview
  const scaleFactor = zoomScale / 100
  const sheetWidthPx = layoutMode === 'grid' ? baseSheetWidthPx * 0.45 : baseSheetWidthPx * scaleFactor
  const sheetHeightPx = layoutMode === 'grid' ? baseSheetHeightPx * 0.45 : baseSheetHeightPx * scaleFactor

  // Helper to render content blocks inside a page
  const renderBlocks = (blocks: string[] | undefined, hasDropCap: boolean) => {
    if (!blocks || blocks.length === 0) return null

    return blocks.map((block, idx) => {
      if (block.startsWith('# ')) return null

      if (block.startsWith('## ')) {
        return (
          <h3
            key={idx}
            className="font-serif text-center font-normal tracking-tight my-4 border-b border-current/10 pb-1"
            style={{ fontSize: `${settings.fontSizePt * 1.3}pt` }}
          >
            {block.replace('## ', '')}
          </h3>
        )
      }

      if (block.startsWith('>')) {
        return (
          <blockquote
            key={idx}
            className="my-3 pl-4 border-l border-neutral-400 italic opacity-80"
            style={{ fontSize: `${settings.fontSizePt * 0.95}pt` }}
          >
            {block.replace(/^>\s*/, '')}
          </blockquote>
        )
      }

      if (block.startsWith('```')) {
        const code = block.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '')
        return (
          <pre
            key={idx}
            className="p-3 my-3 bg-neutral-50 border border-neutral-200 font-mono text-[8pt] leading-tight overflow-x-auto"
            dir="ltr"
          >
            <code>{code}</code>
          </pre>
        )
      }

      const isOpeningPara = hasDropCap && idx === 0
      return (
        <p
          key={idx}
          className={cn(
            'my-2.5',
            settings.firstLineIndent && !isOpeningPara ? 'indent-5' : '',
            isOpeningPara && dropCaps
              ? 'first-letter:font-serif first-letter:text-4xl first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:font-semibold'
              : ''
          )}
        >
          {block}
        </p>
      )
    })
  }

  // Render a single simulated printed book sheet
  const renderSheet = (page: BookPageData) => {
    const isVerso = page.side === 'left' // Even page, gutter on RIGHT
    const isRecto = page.side === 'right' // Odd page, gutter on LEFT

    // Margins based on spine gutter
    const paddingLeftIn = isRecto ? settings.gutterMarginIn : settings.outerMarginIn
    const paddingRightIn = isVerso ? settings.gutterMarginIn : settings.outerMarginIn

    return (
      <div
        key={`page-${page.pageNumber}`}
        className={cn(
          'print-sheet bg-white text-black shadow-lg rounded-xs flex flex-col justify-between shrink-0 relative transition-transform duration-150',
          showGuidelines ? 'ring-1 ring-blue-500/30' : ''
        )}
        style={{
          width: `${sheetWidthPx}px`,
          minHeight: `${sheetHeightPx}px`,
          paddingTop: `${0.75 * scaleFactor}in`,
          paddingBottom: `${0.75 * scaleFactor}in`,
          paddingLeft: `${paddingLeftIn * scaleFactor}in`,
          paddingRight: `${paddingRightIn * scaleFactor}in`,
          fontSize: `${settings.fontSizePt * (layoutMode === 'grid' ? 0.6 : scaleFactor)}pt`,
          lineHeight: settings.lineSpacing,
          textAlign: settings.justifyText ? 'justify' : 'left',
          fontFamily:
            settings.fontFamily === 'serif'
              ? '"Lora", Georgia, serif'
              : settings.fontFamily === 'mono'
                ? 'monospace'
                : 'sans-serif',
        }}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Print Margin Guidelines Overlay (interactive inspection) */}
        {showGuidelines && (
          <div
            className="absolute inset-4 pointer-events-none border border-dashed border-red-400/40 z-20 flex flex-col justify-between p-2 text-[8px] font-mono text-red-500/70"
            dir="ltr"
          >
            <div className="flex justify-between">
              <span>TRIM BOUNDARY</span>
              <span>{trimSpec.label}</span>
            </div>
            <div className="flex justify-between">
              <span>{isVerso ? 'VERSO (LEFT)' : 'RECTO (RIGHT)'}</span>
              <span>GUTTER: {settings.gutterMarginIn}"</span>
            </div>
          </div>
        )}

        {/* 1. RUNNING HEADERS */}
        <div>
          {settings.runningHeaders && page.type !== 'title' && page.type !== 'blank' && !page.isOpening && (
            <div
              className="flex items-center justify-between text-[8.5pt] font-mono text-neutral-500 pb-2 border-b border-neutral-200 mb-6"
              dir="ltr"
            >
              <span className="italic truncate max-w-[200px]">
                {isVerso ? book.title : ''}
              </span>
              <span className="italic truncate max-w-[200px]">
                {isRecto ? page.chapterTitle : ''}
              </span>
            </div>
          )}

          {/* PAGE CONTENT */}
          {page.type === 'title' && (
            <div className="pt-20 text-center space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <span className="font-mono text-[9pt] uppercase tracking-widest text-neutral-400 block">
                  Beelog Press
                </span>
                <h1 className="text-3xl sm:text-4xl font-normal tracking-tight leading-tight">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-sm font-serif italic text-neutral-600">
                    {book.subtitle}
                  </p>
                )}
              </div>

              <div className="pt-16 space-y-1 font-mono text-xs text-neutral-600">
                <p className="font-serif text-sm font-medium text-black">{book.author}</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  First Edition · {book.language.toUpperCase()}
                </p>
              </div>
            </div>
          )}

          {page.type === 'blank' && (
            <div className="h-full flex items-center justify-center opacity-20 text-xs font-mono italic">
              [This page intentionally left blank]
            </div>
          )}

          {page.type === 'toc' && (
            <div className="space-y-6">
              <h2 className="text-xl font-normal text-center border-b pb-3 mb-6">
                Contents
              </h2>
              <div className="space-y-2.5 text-xs font-serif">
                {chapters.map((ch: any, i: number) => (
                  <div key={ch._id} className="flex items-baseline justify-between border-b border-dotted pb-1">
                    <span>
                      <span className="font-mono text-[10px] text-neutral-400 mr-2">
                        {ch.order}.
                      </span>
                      {ch.title}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {i * 4 + 5}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page.type === 'chapter-start' && (
            <div className="space-y-4">
              <div className="text-center pt-8 pb-4 space-y-1">
                <span className="font-mono text-[9pt] uppercase tracking-widest text-neutral-400 block">
                  Chapter {page.chapterOrder}
                </span>
                <h2 className="text-2xl font-normal tracking-tight">
                  {page.chapterTitle}
                </h2>
              </div>
              <div className="pt-2">{renderBlocks(page.contentBlocks, true)}</div>
            </div>
          )}

          {page.type === 'chapter-body' && (
            <div>{renderBlocks(page.contentBlocks, false)}</div>
          )}
        </div>

        {/* 2. RUNNING FOOTER / PAGE NUMBER */}
        {settings.showPageNumbers && page.type !== 'title' && page.type !== 'blank' && (
          <div
            className={cn(
              'pt-4 text-[9pt] font-mono text-neutral-500',
              isVerso ? 'text-left' : 'text-right'
            )}
            dir="ltr"
          >
            {page.pageNumber}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-200 dark:bg-neutral-900 text-foreground flex flex-col font-sans transition-colors">
      {/* Inject print stylesheet */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              ${printStyles}
              .no-print { display: none !important; }
              body { background: white !important; color: black !important; margin: 0 !important; }
              .print-sheet {
                box-shadow: none !important;
                margin: 0 !important;
                border: none !important;
                width: 100% !important;
                min-height: auto !important;
                page-break-after: always !important;
              }
            }
          `,
        }}
      />

      {/* Sleek Floating Header */}
      <header className="sticky top-0 z-40 px-6 py-3 border-b border-border bg-background/95 backdrop-blur-md flex items-center justify-between no-print shadow-xs">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/books/$id"
            params={{ id: id as any }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Book Studio</span>
          </Link>

          <span className="text-muted-foreground opacity-40">|</span>

          <div>
            <h1 className="font-serif text-sm font-medium leading-none truncate max-w-[220px]">
              {book.title}
            </h1>
            <span className="text-[11px] font-mono text-muted-foreground">
              {trimSpec.label} · {assembledPages.length} Pages
            </span>
          </div>
        </div>

        {/* Center: Layout View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg text-xs font-mono border border-border">
            <button
              onClick={() => setLayoutMode('spread')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded transition-colors',
                layoutMode === 'spread'
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="Facing Pages Spread (2-up)"
            >
              <Columns2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Spreads (2-up)</span>
            </button>

            <button
              onClick={() => setLayoutMode('single')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded transition-colors',
                layoutMode === 'single'
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="Single Page Stack (1-up)"
            >
              <Square className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Single</span>
            </button>

            <button
              onClick={() => setLayoutMode('grid')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded transition-colors',
                layoutMode === 'grid'
                  ? 'bg-card text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="Overview Sheet Grid (4-up)"
            >
              <Grid className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
          </div>

          {/* Zoom controls */}
          {layoutMode !== 'grid' && (
            <div className="hidden lg:flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg text-xs font-mono border border-border">
              <button
                onClick={() => setZoomScale((z) => Math.max(50, z - 10))}
                className="p-1 hover:text-foreground text-muted-foreground"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="px-1.5 text-[11px] font-semibold">{zoomScale}%</span>
              <button
                onClick={() => setZoomScale((z) => Math.min(130, z + 10))}
                className="p-1 hover:text-foreground text-muted-foreground"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Guidelines Toggle */}
          <button
            onClick={() => setShowGuidelines((g) => !g)}
            className={cn(
              'p-1.5 rounded-lg border text-xs font-mono transition-colors hidden sm:flex items-center gap-1.5',
              showGuidelines
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                : 'border-border text-muted-foreground hover:text-foreground'
            )}
            title="Toggle Print Margin Guidelines"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Guidelines</span>
          </button>
        </div>

        {/* Right: Controls Drawer Toggle & Print Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setControlsOpen((o) => !o)}
            className="text-xs h-8 px-3 gap-1.5 font-mono"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Format</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="text-xs h-8 px-3.5 gap-1.5 font-sans"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print PDF</span>
          </Button>
        </div>
      </header>

      {/* Main Drafting Board Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center">
          {/* SPREAD MODE (2-up facing pages) */}
          {layoutMode === 'spread' && (
            <div className="space-y-12 max-w-7xl mx-auto w-full flex flex-col items-center">
              {spreads.map((pair, sIdx) => {
                const left = pair[0]
                const right = pair[1]

                return (
                  <div key={`spread-${sIdx}`} className="flex flex-col items-center space-y-2">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 relative">
                      {/* Left Page (Verso) */}
                      {left ? (
                        renderSheet(left)
                      ) : (
                        <div
                          className="bg-neutral-300 dark:bg-neutral-800 rounded-xs opacity-20"
                          style={{ width: `${sheetWidthPx}px`, minHeight: `${sheetHeightPx}px` }}
                        />
                      )}

                      {/* Right Page (Recto) */}
                      {right ? (
                        renderSheet(right)
                      ) : (
                        <div
                          className="bg-neutral-300 dark:bg-neutral-800 rounded-xs opacity-20"
                          style={{ width: `${sheetWidthPx}px`, minHeight: `${sheetHeightPx}px` }}
                        />
                      )}
                    </div>

                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest no-print">
                      Spread {sIdx + 1} · Pages {left ? left.pageNumber : '—'} & {right ? right.pageNumber : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* SINGLE PAGE MODE (1-up stack) */}
          {layoutMode === 'single' && (
            <div className="space-y-10 flex flex-col items-center">
              {assembledPages.map((page) => (
                <div key={`single-${page.pageNumber}`} className="flex flex-col items-center space-y-2">
                  {renderSheet(page)}
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest no-print">
                    Page {page.pageNumber} ({page.side.toUpperCase()})
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* OVERVIEW GRID MODE (4-up thumbnails) */}
          {layoutMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
              {assembledPages.map((page) => (
                <div
                  key={`grid-${page.pageNumber}`}
                  className="flex flex-col items-center space-y-1.5 p-2 rounded-lg bg-card/40 border border-border"
                >
                  <div className="overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                    {renderSheet(page)}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    p. {page.pageNumber} ({page.side === 'left' ? 'V' : 'R'})
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Slide-out Formatting Inspector Drawer */}
        {controlsOpen && (
          <aside className="w-80 border-l border-border bg-card p-6 space-y-6 overflow-y-auto shrink-0 shadow-xl no-print animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">
                  Print Specification
                </h3>
              </div>
              <button
                onClick={() => setControlsOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 1. Trim Size Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">
                Standard Trim Size
              </label>
              <select
                value={settings.trimSize}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    trimSize: e.target.value as any,
                  }))
                }
                className="w-full text-xs font-mono bg-background border border-border rounded-lg p-2 focus:outline-none focus:border-foreground"
              >
                {(Object.keys(TRIM_SIZE_SPECS) as Array<keyof typeof TRIM_SIZE_SPECS>).map((key) => (
                  <option key={key} value={key}>
                    {TRIM_SIZE_SPECS[key].label} ({TRIM_SIZE_SPECS[key].name})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground font-serif italic">
                {trimSpec.description}
              </p>
            </div>

            {/* 2. Spine Gutter & Margins */}
            <div className="space-y-4 pt-2 border-t border-border">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">
                Binding & Margin Settings
              </label>

              {/* Spine Gutter Margin */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Spine Gutter:</span>
                  <span className="font-semibold">{settings.gutterMarginIn}"</span>
                </div>
                <input
                  type="range"
                  min="0.375"
                  max="1.25"
                  step="0.0625"
                  value={settings.gutterMarginIn}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      gutterMarginIn: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Extra inner margin allowing spine fold clearance.
                </span>
              </div>

              {/* Outer Margin */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Outer Margin:</span>
                  <span className="font-semibold">{settings.outerMarginIn}"</span>
                </div>
                <input
                  type="range"
                  min="0.375"
                  max="1.0"
                  step="0.0625"
                  value={settings.outerMarginIn}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      outerMarginIn: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Typography Tuning */}
            <div className="space-y-4 pt-2 border-t border-border">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">
                Typography & Measure
              </label>

              {/* Font Family */}
              <div className="space-y-1">
                <span className="text-xs font-mono text-muted-foreground">Typeface:</span>
                <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                  {(['serif', 'sans', 'mono'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, fontFamily: f }))}
                      className={cn(
                        'py-1.5 px-2 rounded border capitalize text-center transition-colors',
                        settings.fontFamily === f
                          ? 'border-foreground font-semibold bg-muted'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size in Points */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Body Size:</span>
                  <span className="font-semibold">{settings.fontSizePt} pt</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="14"
                  step="0.5"
                  value={settings.fontSizePt}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      fontSizePt: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Line Spacing */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Leading:</span>
                  <span className="font-semibold">{settings.lineSpacing}x</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="1.8"
                  step="0.05"
                  value={settings.lineSpacing}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lineSpacing: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Book Structure & Pagination Options */}
            <div className="space-y-3 pt-2 border-t border-border text-xs font-mono">
              <label className="text-xs uppercase tracking-wider text-muted-foreground block">
                Pagination & Layout Rules
              </label>

              {/* Chapter starts on Recto */}
              <label className="flex items-center justify-between cursor-pointer">
                <span>Start Chapters on Right Page</span>
                <input
                  type="checkbox"
                  checked={chapterStartRecto}
                  onChange={(e) => setChapterStartRecto(e.target.checked)}
                  className="rounded border-border"
                />
              </label>

              {/* Drop caps */}
              <label className="flex items-center justify-between cursor-pointer">
                <span>Chapter Opening Drop Caps</span>
                <input
                  type="checkbox"
                  checked={dropCaps}
                  onChange={(e) => setDropCaps(e.target.checked)}
                  className="rounded border-border"
                />
              </label>

              {/* First-line indent */}
              <label className="flex items-center justify-between cursor-pointer">
                <span>First-line Paragraph Indents</span>
                <input
                  type="checkbox"
                  checked={settings.firstLineIndent}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      firstLineIndent: e.target.checked,
                    }))
                  }
                  className="rounded border-border"
                />
              </label>

              {/* Justify text */}
              <label className="flex items-center justify-between cursor-pointer">
                <span>Justified Text Alignment</span>
                <input
                  type="checkbox"
                  checked={settings.justifyText}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      justifyText: e.target.checked,
                    }))
                  }
                  className="rounded border-border"
                />
              </label>

              {/* Running headers */}
              <label className="flex items-center justify-between cursor-pointer">
                <span>Running Headers</span>
                <input
                  type="checkbox"
                  checked={settings.runningHeaders}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      runningHeaders: e.target.checked,
                    }))
                  }
                  className="rounded border-border"
                />
              </label>

              {/* Table of contents */}
              <label className="flex items-center justify-between cursor-pointer">
                <span>Include Table of Contents</span>
                <input
                  type="checkbox"
                  checked={settings.includeToC}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      includeToC: e.target.checked,
                    }))
                  }
                  className="rounded border-border"
                />
              </label>
            </div>

            {/* Action Buttons: Save & Reset */}
            <div className="pt-4 border-t border-border space-y-2">
              <Button
                onClick={handleSaveSettings}
                className="w-full text-xs font-mono h-8 gap-1.5"
              >
                {saved ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Save className="h-3.5 w-3.5" />}
                <span>{saved ? 'Settings Saved' : 'Save as Default'}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetDefaults}
                className="w-full text-xs font-mono h-7 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Standard Specs</span>
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
