import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Printer,
  Save,
  Check,
  Sliders,
  RotateCcw,
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

function BookPrintPdfPage() {
  const { id } = Route.useParams()
  const book = useQuery(api.books.get, { id: id as any })
  const updatePrintSettings = useMutation(api.books.updatePrintSettings)

  // Local print settings state
  const [settings, setSettings] = React.useState<PrintSettings>(DEFAULT_PRINT_SETTINGS)
  const [saved, setSaved] = React.useState(false)
  const [controlsCollapsed, setControlsCollapsed] = React.useState(false)

  // Load settings from book when available
  React.useEffect(() => {
    if (book?.printSettings) {
      setSettings(book.printSettings)
    }
  }, [book?.printSettings])

  if (!book) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
        <p className="text-sm text-muted-foreground animate-pulse font-mono">
          Loading print manuscript...
        </p>
      </div>
    )
  }

  const chapters = book.chapters || []
  const trimSpec = TRIM_SIZE_SPECS[settings.trimSize]
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
  }

  // Dynamic CSS stylesheet for browser print dialog
  const printStyles = generatePrintStylesheet(settings, book.title)

  return (
    <div className="min-h-screen bg-[#e7e5e4] dark:bg-[#1c1917] text-foreground flex flex-col font-sans transition-colors">
      {/* Inject print media CSS into the document head */}
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
              }
            }
          `,
        }}
      />

      {/* Floating Controls Bar (Hidden during print) */}
      <header className="no-print sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/books/$id"
              params={{ id: id as any }}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Return to Book Overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="text-xs font-mono">
              <span className="font-semibold text-foreground">{book.title}</span>
              <span className="text-muted-foreground ml-2">Print Layout</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setControlsCollapsed(!controlsCollapsed)}
              className="text-xs px-2.5 py-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-mono"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{controlsCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="text-xs px-2.5 py-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-mono"
              title="Reset to standard KDP / IngramSpark specifications"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Standard Specs</span>
            </button>

            <Button
              onClick={handleSaveSettings}
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 gap-1.5 font-sans"
            >
              {saved ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Format</span>
                </>
              )}
            </Button>

            <Button
              onClick={handlePrint}
              size="sm"
              className="text-xs h-8 px-4 gap-1.5 font-sans"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
          </div>
        </div>

        {/* Collapsible Format Adjustment Drawer */}
        {!controlsCollapsed && (
          <div className="border-t border-border bg-muted/20 px-6 py-4 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-mono">
            {/* Trim Size */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase block font-semibold">
                Trim Size
              </label>
              <select
                value={settings.trimSize}
                onChange={(e) =>
                  setSettings({ ...settings, trimSize: e.target.value as any })
                }
                className="w-full p-1.5 rounded border border-border bg-card text-foreground focus:outline-none"
              >
                {Object.entries(TRIM_SIZE_SPECS).map(([k, s]) => (
                  <option key={k} value={k}>
                    {s.name} ({s.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Font Family */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase block font-semibold">
                Font Family
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) =>
                  setSettings({ ...settings, fontFamily: e.target.value as any })
                }
                className="w-full p-1.5 rounded border border-border bg-card text-foreground focus:outline-none"
              >
                <option value="serif">Serif (Lora / Georgia)</option>
                <option value="sans">Sans (Geist)</option>
                <option value="mono">Monospace</option>
              </select>
            </div>

            {/* Font Size in pt */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase block font-semibold">
                Font Size: {settings.fontSizePt}pt
              </label>
              <input
                type="range"
                min={9}
                max={14}
                step={0.5}
                value={settings.fontSizePt}
                onChange={(e) =>
                  setSettings({ ...settings, fontSizePt: parseFloat(e.target.value) })
                }
                className="w-full accent-foreground cursor-pointer"
              />
            </div>

            {/* Line Spacing / Leading */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase block font-semibold">
                Leading: {settings.lineSpacing}×
              </label>
              <input
                type="range"
                min={1.15}
                max={1.75}
                step={0.05}
                value={settings.lineSpacing}
                onChange={(e) =>
                  setSettings({ ...settings, lineSpacing: parseFloat(e.target.value) })
                }
                className="w-full accent-foreground cursor-pointer"
              />
            </div>

            {/* Gutter (Binding Margin) */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase block font-semibold">
                Gutter (Spine): {settings.gutterMarginIn}"
              </label>
              <input
                type="range"
                min={0.5}
                max={1.25}
                step={0.05}
                value={settings.gutterMarginIn}
                onChange={(e) =>
                  setSettings({ ...settings, gutterMarginIn: parseFloat(e.target.value) })
                }
                className="w-full accent-foreground cursor-pointer"
              />
            </div>

            {/* Outer Margin */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase block font-semibold">
                Outer Margin: {settings.outerMarginIn}"
              </label>
              <input
                type="range"
                min={0.375}
                max={0.875}
                step={0.05}
                value={settings.outerMarginIn}
                onChange={(e) =>
                  setSettings({ ...settings, outerMarginIn: parseFloat(e.target.value) })
                }
                className="w-full accent-foreground cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-6 flex flex-wrap items-center gap-6 pt-2 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.justifyText}
                  onChange={(e) => setSettings({ ...settings, justifyText: e.target.checked })}
                  className="rounded border-border accent-foreground"
                />
                <span>Justified Text</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.firstLineIndent}
                  onChange={(e) => setSettings({ ...settings, firstLineIndent: e.target.checked })}
                  className="rounded border-border accent-foreground"
                />
                <span>First-Line Indent</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.includeToC}
                  onChange={(e) => setSettings({ ...settings, includeToC: e.target.checked })}
                  className="rounded border-border accent-foreground"
                />
                <span>Include Table of Contents</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showPageNumbers}
                  onChange={(e) => setSettings({ ...settings, showPageNumbers: e.target.checked })}
                  className="rounded border-border accent-foreground"
                />
                <span>Page Numbers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.runningHeaders}
                  onChange={(e) => setSettings({ ...settings, runningHeaders: e.target.checked })}
                  className="rounded border-border accent-foreground"
                />
                <span>Running Headers</span>
              </label>
            </div>
          </div>
        )}
      </header>

      {/* Sheet Simulation Container */}
      <main className="flex-1 py-12 px-4 flex flex-col items-center gap-12 overflow-y-auto">
        <div className="no-print text-center space-y-1 mb-2">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Print Sheet Simulation · {trimSpec.name} ({trimSpec.label})
          </p>
          <p className="text-[11px] text-muted-foreground">
            Margins: {settings.gutterMarginIn}" Gutter (Inside spine) × {settings.outerMarginIn}" Outer Margin · {settings.fontSizePt}pt {settings.fontFamily}
          </p>
        </div>

        {/* 1. Title / Half-title Page */}
        <section
          className="print-sheet bg-white text-black shadow-lg rounded-sm p-16 flex flex-col justify-between"
          style={{
            width: `${Math.min(720, trimSpec.widthIn * 96)}px`,
            minHeight: `${trimSpec.heightIn * 96}px`,
            fontFamily:
              settings.fontFamily === 'serif'
                ? '"Lora", Georgia, serif'
                : settings.fontFamily === 'mono'
                  ? 'monospace'
                  : 'sans-serif',
          }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="pt-24 space-y-4 text-center">
            <h1 className="font-serif text-4xl font-normal tracking-tight text-black leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-lg text-neutral-600 font-serif italic">
                {book.subtitle}
              </p>
            )}
          </div>

          <div className="text-center space-y-2 pb-12 font-mono text-xs text-neutral-700">
            <p className="font-serif text-base text-black font-medium">{book.author}</p>
            {book.isbn && <p>ISBN: {book.isbn}</p>}
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Beelog Press · First Edition
            </p>
          </div>
        </section>

        {/* 2. Table of Contents Sheet (if enabled) */}
        {settings.includeToC && chapters.length > 0 && (
          <section
            className="print-sheet bg-white text-black shadow-lg rounded-sm p-16 flex flex-col justify-between"
            style={{
              width: `${Math.min(720, trimSpec.widthIn * 96)}px`,
              minHeight: `${trimSpec.heightIn * 96}px`,
              fontFamily:
                settings.fontFamily === 'serif'
                  ? '"Lora", Georgia, serif'
                  : settings.fontFamily === 'mono'
                    ? 'monospace'
                    : 'sans-serif',
            }}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="space-y-8">
              <h2 className="font-serif text-2xl font-normal text-center border-b pb-4">
                Contents
              </h2>

              <div className="space-y-3 font-serif text-sm">
                {chapters.map((ch: any, i: number) => (
                  <div key={ch._id} className="flex items-baseline justify-between border-b border-dotted pb-1">
                    <span>
                      <span className="font-mono text-xs text-neutral-500 mr-2">
                        {ch.order}.
                      </span>
                      {ch.title}
                    </span>
                    <span className="font-mono text-xs text-neutral-600">
                      p. {i * 4 + 5}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center font-mono text-[10px] text-neutral-400">
              v
            </div>
          </section>
        )}

        {/* 3. Each Chapter rendered into printable pages */}
        {chapters.map((chapter: any, idx: number) => {
          return (
            <section
              key={chapter._id}
              className="print-sheet bg-white text-black shadow-lg rounded-sm p-16 flex flex-col justify-between space-y-8"
              style={{
                width: `${Math.min(720, trimSpec.widthIn * 96)}px`,
                minHeight: `${trimSpec.heightIn * 96}px`,
                fontSize: `${settings.fontSizePt}pt`,
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
              {/* Running header simulation */}
              {settings.runningHeaders && (
                <div
                  className="flex items-center justify-between text-[8.5pt] font-mono text-neutral-500 pb-2 border-b border-neutral-200"
                  dir="ltr"
                >
                  <span className="italic">{book.title}</span>
                  <span className="italic">{chapter.title}</span>
                </div>
              )}

              {/* Chapter Title Block */}
              <div className="pt-8 pb-4 text-center space-y-2">
                <span className="font-mono text-[10pt] uppercase tracking-widest text-neutral-500 block">
                  Chapter {chapter.order}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
                  {chapter.title}
                </h2>
              </div>

              {/* Content */}
              <div
                className={cn(
                  'space-y-4 leading-relaxed',
                  settings.firstLineIndent ? '[&>p]:indent-6 [&>p:first-of-type]:indent-0' : ''
                )}
              >
                {chapter.content
                  .split('\n')
                  .filter((l: string) => !l.startsWith('# '))
                  .map((line: string, lIdx: number) => {
                    if (line.startsWith('## ')) {
                      return (
                        <h3
                          key={lIdx}
                          className="font-serif text-lg font-semibold mt-6 mb-2 tracking-tight text-center"
                        >
                          {line.replace('## ', '')}
                        </h3>
                      )
                    }
                    if (line.startsWith('> ')) {
                      return (
                        <blockquote
                          key={lIdx}
                          className="my-4 px-4 py-2 border-l-2 border-neutral-400 italic text-neutral-700 bg-neutral-50"
                        >
                          {line.replace('> ', '')}
                        </blockquote>
                      )
                    }
                    if (line.trim().length > 0) {
                      return <p key={lIdx}>{line}</p>
                    }
                    return null
                  })}
              </div>

              {/* Running footer with page number simulation */}
              {settings.showPageNumbers && (
                <div className="pt-8 text-center font-mono text-[9pt] text-neutral-500">
                  {idx * 4 + 7}
                </div>
              )}
            </section>
          )
        })}
      </main>
    </div>
  )
}
