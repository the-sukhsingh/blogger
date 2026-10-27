import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import {
  BookOpen,
  Printer,
  Share2,
  FileText,
  Search,
  Check,
  Copy,
  ArrowRight,
  Globe,
} from 'lucide-react'
import { TRIM_SIZE_SPECS, SUPPORTED_LANGUAGES } from '#/lib/book-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

interface DocSection {
  id: string
  title: string
  category: string
  summary: string
  toc: { id: string; label: string }[]
  content: React.ReactNode
}

export function DocsPage() {
  const [activeSectionId, setActiveSectionId] = React.useState('introduction')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const sections: DocSection[] = [
    {
      id: 'introduction',
      category: 'Overview',
      title: 'Introduction to Beelog Press',
      summary: 'A quiet, distraction-free publishing workspace for authors to write multi-chapter books, articles, and format print-ready PDFs.',
      toc: [
        { id: 'vision', label: 'Product Vision' },
        { id: 'core-tenets', label: 'Core Tenets' },
      ],
      content: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground font-semibold">Beelog Press</strong> is a purposeful publishing environment built for authors, technical writers, and researchers. Unlike complex content management systems loaded with unnecessary widgets and popups, Beelog prioritizes calm typography, clean whitespace, and long-form writing flow.
          </p>

          <div id="vision" className="border-l-2 border-foreground pl-4 py-1 space-y-1">
            <h4 className="font-serif text-base font-medium text-foreground">
              Words over Widgets
            </h4>
            <p className="text-xs leading-relaxed">
              Whether you are writing a 300-page computer science monograph, a collection of technical essays, or a handbook in Spanish, Beelog gives you structured chapter management and precision print formatting.
            </p>
          </div>

          <div id="core-tenets" className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg border border-border bg-card space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-semibold text-foreground">
                01 · Multi-Chapter
              </span>
              <h5 className="font-serif text-sm font-medium text-foreground">Books & Essays</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Organize full manuscripts with sequenced chapters and seamless reordering.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-semibold text-foreground">
                02 · Multilingual
              </span>
              <h5 className="font-serif text-sm font-medium text-foreground">Any Language</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Native support for Latin, Cyrillic, CJK, and right-to-left scripts like Arabic and Hebrew.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-semibold text-foreground">
                03 · Print PDFs
              </span>
              <h5 className="font-serif text-sm font-medium text-foreground">POD Formatting</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                KDP and IngramSpark compliant trim sizes, spine gutters, and pagination.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'books-guide',
      category: 'Books',
      title: 'Writing Books & Chapters',
      summary: 'How to structure multi-chapter manuscripts, reorder chapters, and draft in any language.',
      toc: [
        { id: 'creating-books', label: 'Creating a Book' },
        { id: 'managing-chapters', label: 'Managing & Reordering Chapters' },
        { id: 'multilingual-support', label: 'Multilingual & RTL Support' },
      ],
      content: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            The Books studio lets you maintain multiple independent books simultaneously. Each book has its own metadata, chapter hierarchy, language settings, and print specifications.
          </p>

          <div id="creating-books" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              1. Creating a New Book
            </h4>
            <p>
              Navigate to <Link to="/books" className="text-foreground underline">Books</Link> and click <strong>Create Book</strong>. Enter your title, author name, language, and initial trim size. Beelog will automatically generate Chapter 1 to start your draft.
            </p>
          </div>

          <div id="managing-chapters" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              2. Managing & Reordering Chapters
            </h4>
            <p>
              Inside any book's overview, you can add new chapters with a single click. Use the up and down arrow controls to adjust the sequential order of chapters. The sequence updates instantly across the table of contents and print sheets.
            </p>
          </div>

          <div id="multilingual-support" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              3. Multilingual & RTL Support
            </h4>
            <p>
              Books can be authored in any language. When creating or editing a book, selecting Arabic, Hebrew, or Persian automatically sets text direction to Right-to-Left (<code>dir="rtl"</code>), adjusting alignment, indentation, and navigation controls.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/books">
              <Button size="sm" className="text-xs h-8 px-3 font-sans gap-1">
                <span>Open Books Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'print-formatting',
      category: 'Print PDF',
      title: 'Print-on-Demand & PDF Formatting',
      summary: 'Specifications for 6"x9" trade paperbacks, spine binding gutters, typography, and browser printing.',
      toc: [
        { id: 'trim-sizes', label: 'Standard Trim Sizes' },
        { id: 'gutters', label: 'Margins & Spine Gutters' },
        { id: 'typography-rules', label: 'Interior Typography Rules' },
        { id: 'export-pdf', label: 'Exporting to PDF' },
      ],
      content: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Formatting a book for Print-on-Demand (POD) platforms like Amazon KDP or IngramSpark requires strict adherence to physical page dimensions and spine margins.
          </p>

          <div id="trim-sizes" className="space-y-3">
            <h4 className="font-serif text-base font-medium text-foreground">
              Standard Trim Sizes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {Object.entries(TRIM_SIZE_SPECS).map(([k, spec]) => (
                <div key={k} className="p-3 rounded border border-border bg-card space-y-1">
                  <span className="font-semibold text-foreground">{spec.name}</span>
                  <p className="text-muted-foreground">{spec.label} · {spec.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="gutters" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              Spine Gutters & Facing Pages
            </h4>
            <p>
              Because physical books are bound at the spine, inner margins must be wider than outer margins. Beelog uses CSS Paged Media (<code>@page :left</code> and <code>@page :right</code>) to mirror margins automatically:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-xs">
              <li><strong>Left Page (Verso):</strong> Inner binding gutter sits on the right.</li>
              <li><strong>Right Page (Recto):</strong> Inner binding gutter sits on the left.</li>
              <li><strong>Gutter recommendations:</strong> 0.625" to 0.75" for books up to 300 pages; 0.875" for 400+ pages.</li>
            </ul>
          </div>

          <div id="typography-rules" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              Interior Typography Rules
            </h4>
            <ul className="list-disc ml-6 space-y-1 text-xs">
              <li><strong>Font Choice:</strong> Standard serif (Lora / Georgia) at 10.5pt to 11.5pt.</li>
              <li><strong>Leading / Line Spacing:</strong> 115% to 125% of font size for optimal eye tracking without fatigue.</li>
              <li><strong>Paragraph Indent:</strong> Traditional first-line indent of 0.25" with 0pt space between paragraphs.</li>
              <li><strong>Chapters:</strong> Start on right-hand (odd) pages with running headers indicating book title on verso and chapter title on recto.</li>
            </ul>
          </div>

          <div id="export-pdf" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              Exporting to Print PDF
            </h4>
            <p>
              Open any book's print layout, adjust the sliders for font size, trim size, and spine gutter, then click <strong>Print / Save PDF</strong>. In your browser's print dialog, select <em>"Save as PDF"</em> and set Margins to <em>"None"</em> so the stylesheet's exact dimensions are preserved.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sharing-feedback',
      category: 'Sharing',
      title: 'Sharing Over Link & Reader Modes',
      summary: 'Generate private preview links for editors and customize reader themes.',
      toc: [
        { id: 'share-links', label: 'Private Share Links' },
        { id: 'reader-modes', label: 'Reader Themes & Sizing' },
      ],
      content: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Feedback is essential when drafting a book. Rather than exporting loose files and emailing attachments, Beelog lets you share a private web link with editors, beta readers, or colleagues.
          </p>

          <div id="share-links" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              Private Share Links
            </h4>
            <p>
              Every book has a unique, cryptographically random share token (e.g. <code>/share/xyz123</code>). Anyone with this link can read your manuscript directly in their browser without creating an account. You can enable, disable, or regenerate the link at any time from the book overview.
            </p>
          </div>

          <div id="reader-modes" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              Reader Themes & Sizing
            </h4>
            <p>
              Both public share links and the preview studio offer custom reading modes:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-xs">
              <li><strong>Light Theme:</strong> Crisp paper-white reading.</li>
              <li><strong>Sepia Theme:</strong> Warm amber canvas for reduced eye fatigue during long reading sessions.</li>
              <li><strong>Dark Theme:</strong> Deep charcoal background with soft off-white typography.</li>
              <li><strong>Type Scaling:</strong> Adjustable font sizing (A- / A+) and serif/sans/mono switching.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'articles-guide',
      category: 'Articles',
      title: 'Writing Technical Articles & Essays',
      summary: 'Using the distraction-free visual and markdown canvas for standalone technical articles.',
      toc: [
        { id: 'visual-markdown', label: 'Visual vs Markdown Mode' },
        { id: 'import-export', label: 'Importing & Backing Up' },
      ],
      content: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            In addition to multi-chapter books, Beelog provides a dedicated editor for standalone technical essays, documentation, and blog posts.
          </p>

          <div id="visual-markdown" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              Visual vs Markdown Source Mode
            </h4>
            <p>
              Switch freely between a Notion-style rich text canvas (with headings, code blocks, and blockquotes) and raw Markdown source. Your content remains clean plain-text underneath.
            </p>
          </div>

          <div id="import-export" className="space-y-2">
            <h4 className="font-serif text-base font-medium text-foreground">
              Importing & Backing Up
            </h4>
            <p>
              You can import existing <code>.md</code> files directly into your archive, or export your entire publication archive as a clean JSON backup with a single click.
            </p>
          </div>
        </div>
      ),
    },
  ]

  // Filter sections by search query
  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) return sections
    const q = searchQuery.toLowerCase()
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    )
  }, [sections, searchQuery])

  const activeSection =
    sections.find((s) => s.id === activeSectionId) || sections[0]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-border">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Documentation & Standards
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
            Publishing Guide
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Everything you need to know about authoring books, managing chapters, adjusting print PDF specifications, and sharing manuscripts.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
        </div>

        {/* Documentation Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left Navigation */}
          <aside className="md:col-span-4 space-y-2 border-r border-border pr-6">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mb-2">
              Sections
            </span>
            <nav className="space-y-1 text-xs font-mono">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={cn(
                    'w-full text-left p-2.5 rounded transition-colors block',
                    activeSectionId === sec.id
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  )}
                >
                  <span className="text-[10px] text-muted-foreground uppercase block font-sans">
                    {sec.category}
                  </span>
                  <span>{sec.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <article className="md:col-span-8 space-y-8">
            <div className="space-y-2 border-b border-border pb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {activeSection.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground tracking-tight">
                {activeSection.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeSection.summary}
              </p>
            </div>

            {/* Rendered Content */}
            <div className="pt-2">
              {activeSection.content}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
