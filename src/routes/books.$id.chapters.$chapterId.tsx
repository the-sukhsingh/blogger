import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Save,
  Check,
  Eye,
  ArrowRight,
} from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { useConvexAuth } from '@convex-dev/auth/react'
import { AuthModal } from '#/components/auth-modal'
import { api } from '../../convex/_generated/api'
import { Button } from '#/components/ui/button'
import { NotionEditor } from '#/components/notion-editor'
import { PreviewModal } from '#/components/preview-modal'
import { formatWordCount } from '#/lib/book-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/books/$id/chapters/$chapterId')({
  component: ChapterEditorPage,
})

function ChapterEditorPage() {
  const { id: bookId, chapterId } = Route.useParams()

  const book = useQuery(api.books.get, { id: bookId as any })
  const chapter = useQuery(api.books.getChapter, { id: chapterId as any })
  const updateChapter = useMutation(api.books.updateChapter)

  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft')
  const [editorMode, setEditorMode] = React.useState<'visual' | 'markdown'>('visual')
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [previewOpen, setPreviewOpen] = React.useState(false)

  // Initialize data when chapter loads
  React.useEffect(() => {
    if (chapter) {
      setTitle(chapter.title || '')
      setContent(chapter.content || '')
      setStatus(chapter.status || 'draft')
      setSaveStatus('saved')
    }
  }, [chapter])

  // Word count and reading time
  const wordCount = React.useMemo(() => {
    return (content || '').split(/\s+/).filter(Boolean).length
  }, [content])

  const readingTime = React.useMemo(() => {
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`
  }, [wordCount])

  // Save handler
  const handleSave = async (newStatus?: 'draft' | 'published') => {
    setSaveStatus('saving')
    try {
      await updateChapter({
        id: chapterId as any,
        title: title.trim() || 'Untitled Chapter',
        content,
        status: newStatus || status,
      })
      if (newStatus) setStatus(newStatus)
      setSaveStatus('saved')
    } catch (err) {
      console.error('Failed to save chapter:', err)
      setSaveStatus('unsaved')
    }
  }

  // Keyboard shortcut: Cmd+S / Ctrl+S to save
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [title, content, status])

  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  if (authLoading || !book || !chapter) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
        <p className="text-sm text-muted-foreground animate-pulse font-mono">
          Loading chapter canvas...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <Link
            to="/books/$id"
            params={{ id: bookId as any }}
            className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {book.title}</span>
          </Link>
        </header>

        <main className="flex-1 max-w-lg mx-auto px-6 py-24 text-center space-y-4">
          <h1 className="font-serif text-3xl font-medium">Author sign-in required</h1>
          <p className="text-sm text-muted-foreground">
            You must be signed in to edit this book chapter.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              Sign in to Edit
            </Button>
            <Link to="/books/$id/preview" params={{ id: bookId as any }}>
              <Button variant="outline" size="sm">
                Read in Book Preview
              </Button>
            </Link>
          </div>
        </main>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    )
  }

  const allChapters = book.chapters || []
  const currentChapterIndex = allChapters.findIndex((c) => c._id === chapterId)
  const prevChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null
  const nextChapter =
    currentChapterIndex >= 0 && currentChapterIndex < allChapters.length - 1
      ? allChapters[currentChapterIndex + 1]
      : null

  const isRtl = book.direction === 'rtl'

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors selection:bg-accent selection:text-accent-foreground">
      {/* Top Header Toolbar */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Left: Back to Book & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/books/$id"
              params={{ id: bookId as any }}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Return to Chapter List"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 min-w-0 text-xs text-muted-foreground font-mono truncate">
              <Link
                to="/books/$id"
                params={{ id: bookId as any }}
                className="hover:text-foreground truncate hidden sm:inline"
              >
                {book.title}
              </Link>
              <span className="hidden sm:inline">/</span>
              <span className="text-foreground font-semibold truncate">
                Chapter {chapter.order}
              </span>
            </div>
          </div>

          {/* Right: Mode Toggle, Status, Word Count, Save */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Visual vs Markdown Source mode */}
            <div className="flex items-center border border-border rounded p-0.5 bg-muted/40 text-xs font-mono">
              <button
                type="button"
                onClick={() => setEditorMode('visual')}
                className={cn(
                  'px-2 py-0.5 rounded transition-colors',
                  editorMode === 'visual'
                    ? 'bg-card text-foreground font-medium shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Visual
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('markdown')}
                className={cn(
                  'px-2 py-0.5 rounded transition-colors',
                  editorMode === 'markdown'
                    ? 'bg-card text-foreground font-medium shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Markdown
              </button>
            </div>

            {/* Status Selector */}
            <select
              value={status}
              onChange={(e) => {
                const s = e.target.value as 'draft' | 'published'
                setStatus(s)
                handleSave(s)
              }}
              aria-label="Chapter status"
              className="px-2 py-1 text-xs rounded border border-border bg-card text-foreground font-mono focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewOpen(true)}
              className="text-xs h-8 px-2.5 gap-1 hidden sm:inline-flex"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </Button>

            {/* Word Count */}
            <span className="hidden md:inline-block text-xs font-mono text-muted-foreground">
              {formatWordCount(wordCount)}
            </span>

            {/* Save Button */}
            <Button
              onClick={() => handleSave()}
              size="sm"
              className="text-xs h-8 px-3 gap-1.5 font-sans"
            >
              {saveStatus === 'saved' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Saved</span>
                </>
              ) : saveStatus === 'saving' ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chapter Writing Canvas */}
      <main
        className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 sm:py-16 space-y-8"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Chapter Title input */}
        <div className="space-y-2 border-b border-border pb-4">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Chapter {chapter.order} · {book.language.toUpperCase()}
          </div>
          <input
            type="text"
            value={title}
            placeholder="Chapter Title..."
            onChange={(e) => {
              setTitle(e.target.value)
              setSaveStatus('unsaved')
            }}
            className="w-full font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground placeholder:text-muted-foreground/40 border-none bg-transparent focus:outline-none leading-[1.2]"
          />
        </div>

        {/* Content Mode 1: Notion-style Lexical Rich Editor */}
        {editorMode === 'visual' ? (
          <div className="min-h-[500px]">
            <NotionEditor
              initialMarkdown={content}
              onChange={(newMd) => {
                setContent(newMd)
                setSaveStatus('unsaved')
              }}
              placeholder="Begin writing this chapter... Use # for headings, - for lists, > for quotes."
            />
          </div>
        ) : (
          /* Content Mode 2: Clean Markdown Source Textarea */
          <div className="space-y-2">
            <textarea
              rows={24}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setSaveStatus('unsaved')
              }}
              placeholder="# Markdown source..."
              className="w-full p-4 font-mono text-sm leading-relaxed rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-foreground resize-y"
            />
          </div>
        )}

        {/* Bottom Pagination: Prev & Next Chapter Navigation */}
        <div
          className="pt-10 border-t border-border flex items-center justify-between gap-4 text-xs font-sans"
          dir="ltr"
        >
          {prevChapter ? (
            <Link
              to="/books/$id/chapters/$chapterId"
              params={{ id: bookId as any, chapterId: prevChapter._id as any }}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>
                Previous: <span className="font-medium text-foreground">{prevChapter.title}</span>
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <Link
              to="/books/$id/chapters/$chapterId"
              params={{ id: bookId as any, chapterId: nextChapter._id as any }}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group text-right"
            >
              <span>
                Next: <span className="font-medium text-foreground">{nextChapter.title}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      {/* Chapter Preview Modal */}
      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        content={content}
        slug={chapter.slug}
        topics={[book.genre || 'Book Chapter']}
        author={book.author}
        readingTime={readingTime}
      />
    </div>
  )
}
