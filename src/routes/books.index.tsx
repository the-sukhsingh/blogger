import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Plus,
  Search,
  BookOpen,
  Printer,
  Share2,
  Trash2,
  X,
  Check,
  ArrowRight,
} from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { useConvexAuth } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
import {
  SUPPORTED_LANGUAGES,
  TRIM_SIZE_SPECS,
  formatWordCount,
  getLanguageDirection,
  type PrintSettings,
} from '#/lib/book-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/books/')({
  component: BooksLibraryPage,
})

type FilterTab = 'all' | 'published' | 'draft'

function BooksLibraryPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useConvexAuth()
  const books = useQuery(api.books.list, {})
  const createBook = useMutation(api.books.create)
  const removeBook = useMutation(api.books.remove)
  const seedBooks = useMutation(api.books.seed)

  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<FilterTab>('all')
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('all')
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null)

  // Form state for creating a new book
  const [newTitle, setNewTitle] = React.useState('')
  const [newSubtitle, setNewSubtitle] = React.useState('')
  const [newAuthor, setNewAuthor] = React.useState('Author')
  const [newLanguage, setNewLanguage] = React.useState('en')
  const [newDirection, setNewDirection] = React.useState<'ltr' | 'rtl'>('ltr')
  const [newGenre, setNewGenre] = React.useState('Technical')
  const [newDescription, setNewDescription] = React.useState('')
  const [newTrimSize, setNewTrimSize] = React.useState<PrintSettings['trimSize']>('6x9')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Seed sample books if database is empty
  React.useEffect(() => {
    if (books && books.length === 0) {
      seedBooks({ force: false }).catch(() => {})
    }
  }, [books, seedBooks])

  // Update direction automatically when language changes
  const handleLanguageChange = (langCode: string) => {
    setNewLanguage(langCode)
    setNewDirection(getLanguageDirection(langCode))
  }

  // Handle create submission
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setIsSubmitting(true)
    try {
      const slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const bookId = await createBook({
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || undefined,
        slug: slug || 'untitled-book',
        description: newDescription.trim() || undefined,
        author: newAuthor.trim() || 'Author',
        status: 'draft',
        language: newLanguage,
        direction: newDirection,
        genre: newGenre.trim() || undefined,
        printSettings: {
          trimSize: newTrimSize,
          fontFamily: 'serif',
          fontSizePt: 11,
          lineSpacing: 1.4,
          gutterMarginIn: 0.75,
          outerMarginIn: 0.5,
          justifyText: true,
          firstLineIndent: true,
          includeToC: true,
          showPageNumbers: true,
          runningHeaders: true,
        },
      })

      setCreateModalOpen(false)
      // Reset form
      setNewTitle('')
      setNewSubtitle('')
      setNewDescription('')
      // Navigate to book management
      navigate({ to: '/books/$id', params: { id: bookId as any } })
    } catch (err) {
      console.error('Failed to create book:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter books
  const filteredBooks = React.useMemo(() => {
    if (!books) return []
    return books.filter((b: any) => {
      if (activeTab === 'published' && b.status !== 'published') return false
      if (activeTab === 'draft' && b.status !== 'draft') return false
      if (selectedLanguage !== 'all' && b.language !== selectedLanguage) return false

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        const matchTitle = b.title.toLowerCase().includes(q)
        const matchSubtitle = b.subtitle?.toLowerCase().includes(q)
        const matchAuthor = b.author.toLowerCase().includes(q)
        const matchGenre = b.genre?.toLowerCase().includes(q)
        return matchTitle || matchSubtitle || matchAuthor || matchGenre
      }

      return true
    })
  }, [books, activeTab, selectedLanguage, searchQuery])

  // Aggregate stats
  const stats = React.useMemo(() => {
    const list = (books || []) as any[]
    return {
      total: list.length,
      published: list.filter((b: any) => b.status === 'published').length,
      drafts: list.filter((b: any) => b.status === 'draft').length,
      totalWords: list.reduce((acc: number, b: any) => acc + (b.totalWords || 0), 0),
    }
  }, [books])

  const handleCopyShareLink = (shareToken: string) => {
    const url = `${window.location.origin}/share/${shareToken}`
    navigator.clipboard.writeText(url)
    setCopiedToken(shareToken)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 sm:py-16 space-y-12">
        {/* Header with generous whitespace */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Manuscript Studio
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
              Books & Publications
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {stats.total} books · {stats.published} published · {stats.drafts} drafts ·{' '}
              {formatWordCount(stats.totalWords)} total written
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="text-xs h-9 px-4 font-sans gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Book</span>
              </Button>
            </div>
          )}
        </div>

        {/* Toolbar: Filter Tabs, Language Selector & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 border-b border-border sm:border-b-0 pb-2 sm:pb-0">
            {(isAuthenticated ? (['all', 'published', 'draft'] as FilterTab[]) : (['all', 'published'] as FilterTab[])).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded transition-colors capitalize font-medium',
                  activeTab === tab
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab === 'all'
                  ? `All Books (${stats.total})`
                  : tab === 'published'
                    ? `Published (${stats.published})`
                    : `Drafts (${stats.drafts})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Language filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Filter books by language"
              className="px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none focus:border-foreground"
            >
              <option value="all">All Languages</option>
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.native})
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="border border-border rounded-xl p-16 text-center space-y-4 bg-card">
            <h2 className="font-serif text-xl font-medium text-foreground">No books found</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {searchQuery || selectedLanguage !== 'all' || activeTab !== 'all'
                ? 'No books match your current filters. Try resetting the search or language.'
                : 'Your library is empty. Start your first book manuscript.'}
            </p>
            <Button
              onClick={() => setCreateModalOpen(true)}
              size="sm"
              className="text-xs font-sans"
            >
              Create Your First Book
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book: any) => {
              const isDraft = book.status === 'draft'
              const trimSizeKey = (book.printSettings?.trimSize || '6x9') as keyof typeof TRIM_SIZE_SPECS
              const trimSpec = TRIM_SIZE_SPECS[trimSizeKey]

              return (
                <div
                  key={book._id}
                  className="border border-border rounded-xl p-6 bg-card flex flex-col justify-between space-y-6 hover:border-foreground/30 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Top tags: status, language, trim */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="uppercase px-2 py-0.5 rounded bg-muted text-foreground font-semibold">
                          {book.language.toUpperCase()}
                          {book.direction === 'rtl' ? ' (RTL)' : ''}
                        </span>
                        {isDraft ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Draft
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                            Published
                          </span>
                        )}
                        {book.genre && (
                          <span className="hidden sm:inline-block">· {book.genre}</span>
                        )}
                      </div>

                      <span>{trimSpec?.label}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1">
                      <Link
                        to="/books/$id"
                        params={{ id: book._id as any }}
                        className="group inline-block"
                      >
                        <h2 className="font-serif text-xl sm:text-2xl font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                          {book.title}
                        </h2>
                      </Link>
                      {book.subtitle && (
                        <p className="text-xs text-muted-foreground font-serif italic">
                          {book.subtitle}
                        </p>
                      )}
                    </div>

                    {book.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {book.description}
                      </p>
                    )}

                    {/* Metadata line: Author, Chapters, Words */}
                    <div className="pt-2 text-xs font-mono text-muted-foreground flex flex-wrap items-center gap-3 border-t border-border/50">
                      <span>By {book.author}</span>
                      <span>·</span>
                      <span>{book.chapterCount || 0} chapters</span>
                      <span>·</span>
                      <span>{formatWordCount(book.totalWords || 0)}</span>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Link
                        to="/books/$id/preview"
                        params={{ id: book._id as any }}
                        className="p-2 text-xs text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors"
                        title="Read / Preview Book"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Link>

                      <Link
                        to="/books/$id/print"
                        params={{ id: book._id as any }}
                        className="p-2 text-xs text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors"
                        title="Print PDF Formatter"
                      >
                        <Printer className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCopyShareLink(book.shareToken)}
                        className="p-2 text-xs text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors"
                        title="Copy Public Share Link"
                      >
                        {copiedToken === book.shareToken ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                      </button>

                      {isAuthenticated && (
                        <DeleteConfirmPopover
                          onConfirm={async () => {
                            await removeBook({ id: book._id })
                          }}
                          title="Delete this book?"
                          description={`"${book.title}" and all its chapters will be permanently removed.`}
                          align="left"
                        >
                          <button
                            type="button"
                            className="p-2 text-xs text-muted-foreground hover:text-destructive rounded hover:bg-muted transition-colors"
                            title="Delete Book"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </DeleteConfirmPopover>
                      )}
                    </div>

                    <Link to="/books/$id" params={{ id: book._id as any }}>
                      <Button variant="outline" size="sm" className="text-xs h-8 px-3 gap-1 font-sans">
                        <span>Chapters</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Create New Book Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-serif text-lg font-medium text-foreground">
                Create New Book
              </h2>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Architecture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A Handbook for Resilient Infrastructure"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Genre / Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science, Non-Fiction"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Language
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Direction
                  </label>
                  <select
                    value={newDirection}
                    onChange={(e) => setNewDirection(e.target.value as 'ltr' | 'rtl')}
                    className="w-full px-3 py-2 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  >
                    <option value="ltr">Left-to-Right (LTR)</option>
                    <option value="rtl">Right-to-Left (RTL - Arabic, Hebrew)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Print Trim Size
                </label>
                <select
                  value={newTrimSize}
                  onChange={(e) => setNewTrimSize(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                >
                  {Object.entries(TRIM_SIZE_SPECS).map(([key, spec]) => (
                    <option key={key} value={key}>
                      {spec.name} ({spec.label}) — {spec.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Description / Synopsis
                </label>
                <textarea
                  rows={3}
                  placeholder="A brief summary of what this book covers..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  size="sm"
                  className="text-xs font-sans"
                >
                  {isSubmitting ? 'Creating...' : 'Create Book'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
