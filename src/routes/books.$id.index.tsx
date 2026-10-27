import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Plus,
  Edit3,
  BookOpen,
  Printer,
  Share2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Sliders,
} from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { useConvexAuth } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { AuthModal } from '#/components/auth-modal'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
import {
  SUPPORTED_LANGUAGES,
  TRIM_SIZE_SPECS,
  formatWordCount,
  getLanguageDirection,
} from '#/lib/book-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/books/$id/')({
  component: BookDetailPage,
})

function BookDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useConvexAuth()

  const book = useQuery(api.books.get, { id: id as any })
  const updateBook = useMutation(api.books.update)
  const removeBook = useMutation(api.books.remove)
  const createChapter = useMutation(api.books.createChapter)
  const deleteChapter = useMutation(api.books.deleteChapter)
  const reorderChapters = useMutation(api.books.reorderChapters)
  const toggleShareLink = useMutation(api.books.toggleShareLink)

  const [addChapterModalOpen, setAddChapterModalOpen] = React.useState(false)
  const [newChapterTitle, setNewChapterTitle] = React.useState('')
  const [editMetaModalOpen, setEditMetaModalOpen] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [copiedShare, setCopiedShare] = React.useState(false)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  // Edit metadata form state
  const [editTitle, setEditTitle] = React.useState('')
  const [editSubtitle, setEditSubtitle] = React.useState('')
  const [editAuthor, setEditAuthor] = React.useState('')
  const [editDescription, setEditDescription] = React.useState('')
  const [editGenre, setEditGenre] = React.useState('')
  const [editLanguage, setEditLanguage] = React.useState('en')
  const [editDirection, setEditDirection] = React.useState<'ltr' | 'rtl'>('ltr')
  const [editStatus, setEditStatus] = React.useState<'draft' | 'published'>('draft')

  // Sync state when book data loads
  React.useEffect(() => {
    if (book) {
      setEditTitle(book.title)
      setEditSubtitle(book.subtitle || '')
      setEditAuthor(book.author)
      setEditDescription(book.description || '')
      setEditGenre(book.genre || '')
      setEditLanguage(book.language || 'en')
      setEditDirection(book.direction || 'ltr')
      setEditStatus(book.status)
    }
  }, [book])

  if (!book) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          <Navbar />
          <main className="flex-1 max-w-md mx-auto px-6 py-24 text-center space-y-4">
            <h1 className="font-serif text-3xl font-medium">Private Manuscript</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This manuscript is currently in private draft. If you are the author, please sign in. If you are reviewing this book, please use the private share link provided by the author.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button size="sm" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
              <Link to="/books">
                <Button variant="outline" size="sm">
                  Browse Public Books
                </Button>
              </Link>
            </div>
          </main>
          <Footer />
          <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-24 text-center space-y-4">
          <h1 className="font-serif text-3xl font-medium">Book not found</h1>
          <p className="text-sm text-muted-foreground">
            The book you are looking for does not exist or may have been deleted.
          </p>
          <Link to="/books">
            <Button variant="outline" size="sm">
              Back to Books
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const chapters = book.chapters || []
  const trimSpec = TRIM_SIZE_SPECS[book.printSettings?.trimSize || '6x9']

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChapterTitle.trim()) return

    try {
      const chapterId = await createChapter({
        bookId: book._id,
        title: newChapterTitle.trim(),
        status: 'draft',
      })
      setNewChapterTitle('')
      setAddChapterModalOpen(false)
      navigate({
        to: '/books/$id/chapters/$chapterId',
        params: { id: book._id as any, chapterId: chapterId as any },
      })
    } catch (err) {
      console.error('Failed to create chapter:', err)
    }
  }

  const handleMoveChapter = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= chapters.length) return

    const newChapters = [...chapters]
    const temp = newChapters[index]
    newChapters[index] = newChapters[targetIndex]
    newChapters[targetIndex] = temp

    const updates = newChapters.map((ch, idx) => ({
      id: ch._id,
      order: idx + 1,
    }))

    await reorderChapters({ chapterOrders: updates })
  }

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateBook({
      id: book._id,
      title: editTitle.trim(),
      subtitle: editSubtitle.trim() || undefined,
      author: editAuthor.trim(),
      description: editDescription.trim() || undefined,
      genre: editGenre.trim() || undefined,
      language: editLanguage,
      direction: editDirection,
      status: editStatus,
    })
    setEditMetaModalOpen(false)
  }

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/share/${book.shareToken}`
    navigator.clipboard.writeText(url)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 sm:py-14 space-y-10">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Books</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setShareModalOpen(true)}
                className="text-xs px-3 py-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Link</span>
              </button>
            )}

            <Link to="/books/$id/print" params={{ id: book._id as any }}>
              <Button variant="outline" size="sm" className="text-xs h-8 px-3 gap-1.5 font-sans">
                <Printer className="h-3.5 w-3.5" />
                <span>Print PDF</span>
              </Button>
            </Link>

            <Link to="/books/$id/preview" params={{ id: book._id as any }}>
              <Button size="sm" className="text-xs h-8 px-3.5 gap-1.5 font-sans">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Preview Book</span>
              </Button>
            </Link>

            {isAuthenticated && (
              <DeleteConfirmPopover
                onConfirm={async () => {
                  await removeBook({ id: book._id })
                  navigate({ to: '/books' })
                }}
                title="Delete this entire book?"
                description={`"${book.title}" and all its chapters will be permanently deleted.`}
                align="right"
              >
                <Button variant="ghost" size="sm" className="text-xs h-8 px-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </DeleteConfirmPopover>
            )}
          </div>
        </div>

        {/* Book Header Banner */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="uppercase px-2 py-0.5 rounded bg-muted text-foreground font-semibold">
                {book.language.toUpperCase()} {book.direction === 'rtl' ? '(RTL)' : '(LTR)'}
              </span>
              {book.status === 'draft' ? (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Draft
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                  Published
                </span>
              )}
              {book.genre && (
                <span className="text-muted-foreground">· {book.genre}</span>
              )}
            </div>

            {isAuthenticated && (
              <button
                onClick={() => setEditMetaModalOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono transition-colors"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Edit Details</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground leading-[1.15]">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground font-serif italic">
                {book.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
            <span>By {book.author}</span>
            <span>·</span>
            <span>{chapters.length} chapters</span>
            <span>·</span>
            <span>{formatWordCount(book.totalWords || 0)}</span>
            <span>·</span>
            <span>Trim: {trimSpec?.name} ({trimSpec?.label})</span>
          </div>

          {book.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl pt-2">
              {book.description}
            </p>
          )}
        </div>

        {/* Chapters Section */}
        <div className="space-y-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-medium text-foreground">
                Chapters
              </h2>
              <p className="text-xs text-muted-foreground">
                Organize and order your manuscript. Each chapter supports rich formatting and print pagination.
              </p>
            </div>

            {isAuthenticated && (
              <Button
                onClick={() => setAddChapterModalOpen(true)}
                size="sm"
                className="text-xs h-8 px-3 gap-1.5 font-sans"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Chapter</span>
              </Button>
            )}
          </div>

          {chapters.length === 0 ? (
            <div className="border border-border rounded-xl p-12 text-center space-y-3 bg-card">
              <p className="font-serif text-base text-foreground">No chapters yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Begin your manuscript by creating Chapter 1.
              </p>
              <Button
                onClick={() => setAddChapterModalOpen(true)}
                size="sm"
                className="text-xs font-sans"
              >
                Create Chapter 1
              </Button>
            </div>
          ) : (
            <div className="border border-border rounded-xl bg-card divide-y divide-border overflow-hidden">
              {chapters.map((chapter: any, idx: number) => {
                const words = chapter.content
                  ? chapter.content.split(/\s+/).filter(Boolean).length
                  : 0

                return (
                  <div
                    key={chapter._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          #{chapter.order}
                        </span>
                        {isAuthenticated ? (
                          <Link
                            to="/books/$id/chapters/$chapterId"
                            params={{ id: book._id as any, chapterId: chapter._id as any }}
                            className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors leading-snug"
                          >
                            {chapter.title}
                          </Link>
                        ) : (
                          <Link
                            to="/books/$id/preview"
                            params={{ id: book._id as any }}
                            className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors leading-snug"
                          >
                            {chapter.title}
                          </Link>
                        )}
                        {chapter.status === 'draft' && isAuthenticated && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Draft
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span>/{chapter.slug}</span>
                        <span>·</span>
                        <span>{formatWordCount(words)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {isAuthenticated ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMoveChapter(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMoveChapter(idx, 'down')}
                            disabled={idx === chapters.length - 1}
                            title="Move Down"
                            className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>

                          <Link
                            to="/books/$id/chapters/$chapterId"
                            params={{ id: book._id as any, chapterId: chapter._id as any }}
                          >
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5 gap-1">
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </Button>
                          </Link>

                          <DeleteConfirmPopover
                            onConfirm={async () => {
                              await deleteChapter({ id: chapter._id })
                            }}
                            title="Delete chapter?"
                            description={`"${chapter.title}" will be permanently removed.`}
                            align="right"
                          >
                            <button
                              type="button"
                              className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete Chapter"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </DeleteConfirmPopover>
                        </>
                      ) : (
                        <Link
                          to="/books/$id/preview"
                          params={{ id: book._id as any }}
                        >
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2.5 gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>Read</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Add Chapter Modal */}
      {addChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-serif text-lg font-medium text-foreground">
                Add New Chapter
              </h2>
              <button
                type="button"
                onClick={() => setAddChapterModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddChapter} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Chapter Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Chapter 2: Memory Consistency Models"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddChapterModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newChapterTitle.trim()}
                  size="sm"
                  className="text-xs font-sans"
                >
                  Create & Write
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Metadata Modal */}
      {editMetaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-serif text-lg font-medium text-foreground">
                Edit Book Details
              </h2>
              <button
                type="button"
                onClick={() => setEditMetaModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMetadata} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Author
                  </label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Publishing Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Language
                  </label>
                  <select
                    value={editLanguage}
                    onChange={(e) => {
                      setEditLanguage(e.target.value)
                      setEditDirection(getLanguageDirection(e.target.value))
                    }}
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
                    value={editDirection}
                    onChange={(e) => setEditDirection(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
                  >
                    <option value="ltr">LTR (Left to Right)</option>
                    <option value="rtl">RTL (Right to Left)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:border-foreground resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMetaModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs font-sans">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Link Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-serif text-lg font-medium text-foreground">
                Share Book Link
              </h2>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Anyone with this private link can preview your manuscript and read all published and draft chapters directly in their browser.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Public Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      typeof window !== 'undefined'
                        ? `${window.location.origin}/share/${book.shareToken}`
                        : ''
                    }
                    className="flex-1 px-3 py-2 text-xs rounded border border-border bg-muted/40 font-mono text-foreground focus:outline-none select-all"
                  />
                  <Button
                    onClick={handleCopyShareLink}
                    size="sm"
                    className="text-xs h-9 px-3 gap-1 font-sans shrink-0"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <span>Copy Link</span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Link access status</span>
                <button
                  type="button"
                  onClick={async () => {
                    await toggleShareLink({
                      id: book._id,
                      enabled: !book.isPublicLinkEnabled,
                    })
                  }}
                  className={cn(
                    'font-mono px-2.5 py-1 rounded transition-colors',
                    book.isPublicLinkEnabled
                      ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {book.isPublicLinkEnabled ? 'Active (Enabled)' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareModalOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
