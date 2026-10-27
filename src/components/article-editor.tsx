import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Save,
  SlidersHorizontal,
  X,
  Plus,
  GitBranch,
  Clock,
  Check,
  Eye,
  FileCode,
  Layers,
  Image,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Code,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { NotionEditor } from '#/components/notion-editor'
import { PreviewModal } from '#/components/preview-modal'
import { BlogStore } from '#/lib/blog-store'
import type { Article } from '#/lib/blog-store'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { cn } from '#/lib/utils'

export interface ArticleEditorProps {
  initialArticle?: Partial<Article> & { _id?: string }
  isNew?: boolean
  initialTopic?: string
  initialTitle?: string
}

type EditorMode = 'visual' | 'markdown'

const CURATED_COVERS = [
  {
    name: 'Neural Gradient',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Circuit Board',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimal Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Dark Code Glow',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
]

export function ArticleEditor({
  initialArticle,
  isNew = false,
  initialTopic,
  initialTitle,
}: ArticleEditorProps) {
  const navigate = useNavigate()
  const convexArticles = useQuery(api.blogs.list, {})

  // Core Article State
  const [title, setTitle] = React.useState(
    initialArticle?.title || initialTitle || ''
  )
  const [slug, setSlug] = React.useState(initialArticle?.slug || '')
  const [content, setContent] = React.useState(
    initialArticle?.content ||
      (isNew
        ? `# ${initialTitle || 'Building High-Performance TypeScript Systems'}

> Technical architecture guide detailing deterministic execution, type safety, and fault-tolerant system design.

## 1. Core Architecture

Explain the core architecture upfront within the first two paragraphs so search and answer engines can cite your definitions directly.

\`\`\`typescript
export interface SystemConfig {
  workerPoolSize: number;
  heartbeatIntervalMs: number;
}
\`\`\`

## 2. Implementation Guide

Write your step-by-step technical implementation here.
`
        : '')
  )
  const [topics, setTopics] = React.useState<string[]>(
    initialArticle?.topics ||
      (initialTopic ? [initialTopic, 'Engineering'] : ['Engineering'])
  )
  const [newTopicInput, setNewTopicInput] = React.useState('')
  const [gitBranch, setGitBranch] = React.useState(
    initialArticle?.gitBranch || 'main'
  )
  const [status, setStatus] = React.useState<'published' | 'draft'>(
    initialArticle?.status === 'draft' ? 'draft' : 'published'
  )
  const [author, setAuthor] = React.useState(
    (initialArticle as any)?.author || 'Staff Engineer'
  )
  const [coverImage, setCoverImage] = React.useState(
    (initialArticle as any)?.coverImage || ''
  )

  // Editor mode: visual vs markdown source
  const [editorMode, setEditorMode] = React.useState<EditorMode>('visual')

  // Modals & Drawers
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)

  const [saveStatus, setSaveStatus] = React.useState<
    'saved' | 'saving' | 'unsaved'
  >('saved')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Auto-generate slug from title if new
  React.useEffect(() => {
    if (isNew && !slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      )
    }
  }, [title, isNew, slug])

  // Word count & reading time
  const wordCount = React.useMemo(() => {
    return ((content || '') + ' ' + (title || '')).split(/\s+/).filter(Boolean).length
  }, [content, title])

  const readingTimeEstimate = React.useMemo(() => {
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`
  }, [wordCount])

  // Content change handler from Lexical or Markdown Editor
  const handleContentChange = React.useCallback((markdown: string) => {
    setContent(markdown)
    setSaveStatus('unsaved')
  }, [])

  // Title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setSaveStatus('unsaved')
  }

  const createBlog = useMutation(api.blogs.create)
  const updateBlog = useMutation(api.blogs.update)

  // Save article to Convex database
  const handleSave = async (publishState?: 'published' | 'draft') => {
    setSaveStatus('saving')
    setErrorMessage(null)
    const finalStatus = publishState || status

    const finalTitle = title.trim() || 'Untitled'
    let finalSlug =
      slug.trim() ||
      finalTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `post-${Date.now()}`

    try {
      const blogId = (initialArticle as any)?._id || initialArticle?.id

      if (isNew || !blogId) {
        let savedId: string
        try {
          savedId = await createBlog({
            title: finalTitle,
            slug: finalSlug,
            content,
            topics,
            gitBranch,
            author,
            coverImage: coverImage || undefined,
            status: finalStatus === 'draft' ? 'draft' : 'published',
          })
        } catch (err: any) {
          if (err?.message?.includes('already exists')) {
            finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`
            savedId = await createBlog({
              title: finalTitle,
              slug: finalSlug,
              content,
              topics,
              gitBranch,
              author,
              coverImage: coverImage || undefined,
              status: finalStatus === 'draft' ? 'draft' : 'published',
            })
          } else {
            throw err
          }
        }

        // Also sync local storage
        BlogStore.saveArticle({
          id: savedId,
          slug: finalSlug,
          title: finalTitle,
          content,
          topics,
          gitBranch,
          status: finalStatus,
          proposedDiffs: [],
        })

        setSaveStatus('saved')
        navigate({ to: '/blog/$id', params: { id: savedId } })
      } else {
        await updateBlog({
          id: blogId as Id<'blogs'>,
          title: finalTitle,
          slug: finalSlug,
          content,
          topics,
          gitBranch,
          author,
          coverImage: coverImage || undefined,
          status: finalStatus === 'draft' ? 'draft' : 'published',
        })

        BlogStore.saveArticle({
          id: blogId,
          slug: finalSlug,
          title: finalTitle,
          content,
          topics,
          gitBranch,
          status: finalStatus,
          proposedDiffs: initialArticle?.proposedDiffs || [],
        })

        setSaveStatus('saved')
      }
    } catch (err: any) {
      console.error('Failed to save article:', err)
      setErrorMessage(err?.message || 'Failed to save article.')
      setSaveStatus('unsaved')
    }
  }

  // Keyboard shortcuts: Cmd/Ctrl+S to save, Cmd/Ctrl+P to preview
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        setPreviewOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [title, content, topics, slug, gitBranch, status, author, coverImage])

  // Topics management
  const handleAddTopic = () => {
    if (newTopicInput.trim() && !topics.includes(newTopicInput.trim())) {
      setTopics([...topics, newTopicInput.trim()])
      setNewTopicInput('')
      setSaveStatus('unsaved')
    }
  }

  const handleRemoveTopic = (t: string) => {
    setTopics(topics.filter((item) => item !== t))
    setSaveStatus('unsaved')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* =================================================================
          1. HEADER BAR: Breadcrumbs, Status, AI Triggers, Preview, Publish
          ================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#292524] transition-colors">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          {/* Left: Breadcrumbs & Save status */}
          <div className="flex items-center gap-3">
            <Link
              to="/blogs"
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Articles</span>
            </Link>

            <span className="text-[#e7e5e4] dark:text-[#292524]">/</span>

            <span className="text-xs font-medium text-[#292524] dark:text-[#fafaf9] max-w-[180px] sm:max-w-[240px] truncate">
              {title || 'Untitled'}
            </span>

            {/* Subtle Save Indicator */}
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border',
                saveStatus === 'saved'
                  ? 'text-[#5ea500] border-[#5ea500]/30 bg-[#5ea500]/5'
                  : 'text-[#d97757] border-[#d97757]/30 bg-[#d97757]/5'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  saveStatus === 'saved' ? 'bg-[#5ea500]' : 'bg-[#d97757]'
                )}
              />
              <span className="hidden sm:inline">
                {saveStatus === 'saved' ? 'Saved' : 'Unsaved'}
              </span>
            </span>
          </div>

          {/* Right: Editor Mode, Preview, Settings & Save */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Visual vs Markdown Source toggle */}
            <div className="hidden sm:flex items-center border border-[#e7e5e4] dark:border-[#292524] rounded-lg p-0.5 bg-muted/20 text-xs font-mono">
              <button
                onClick={() => setEditorMode('visual')}
                className={cn(
                  'px-2 py-0.5 rounded-md transition-colors',
                  editorMode === 'visual'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Visual
              </button>
              <button
                onClick={() => setEditorMode('markdown')}
                className={cn(
                  'px-2 py-0.5 rounded-md transition-colors',
                  editorMode === 'markdown'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Markdown
              </button>
            </div>

            {/* Multi-mode Preview */}
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
              title="Open Multi-mode Preview (Cmd+P)"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Settings Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] transition-colors',
                sidebarOpen
                  ? 'bg-[#fafaf9] dark:bg-[#1a1816] text-[#615fff] border-[#615fff]/40'
                  : 'text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9]'
              )}
              title="Article Metadata & Settings"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            {/* Primary Publish / Save Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave(status)}
              className="font-mono text-xs px-3"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {status === 'published' ? 'Publish' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      {/* =================================================================
          2. WRITING CANVAS: NOTION RICH TEXT OR MARKDOWN SOURCE
          ================================================================= */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
          <div className="w-full max-w-[760px] space-y-6">
            {/* Optional Cover Banner */}
            {coverImage && (
              <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-[#e7e5e4] dark:border-[#292524] group">
                <img
                  src={coverImage}
                  alt={title || 'Cover'}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Remove Cover</span>
                </button>
              </div>
            )}

            {/* Large Document Display Title */}
            <input
              type="text"
              placeholder="Untitled"
              value={title}
              onChange={handleTitleChange}
              className="w-full font-display text-3xl sm:text-5xl font-normal tracking-tight text-[#292524] dark:text-[#fafaf9] placeholder:text-[#d6d3d1] dark:placeholder:text-[#44403c] border-none bg-transparent focus:outline-none leading-[1.15]"
            />

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-[#ff0000]/10 border border-[#ff0000]/30 text-xs text-[#ff0000] font-mono flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Mode 1: Visual Notion-style Lexical Rich Editor */}
            {editorMode === 'visual' ? (
              <NotionEditor
                initialMarkdown={content}
                onChange={handleContentChange}
                placeholder="Write your story or technical post... Use # for headings, - for lists, > for quotes."
              />
            ) : (
              /* Mode 2: Clean Raw Markdown Source Editor */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-1 border-b border-[#e7e5e4] dark:border-[#292524]">
                  <span>Markdown Source Mode</span>
                  <span>{wordCount} words</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="# Enter markdown directly..."
                  rows={24}
                  className="w-full p-4 font-mono text-sm leading-relaxed bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524] rounded-lg text-foreground focus:outline-none focus:border-[#615fff] resize-y"
                />
              </div>
            )}
          </div>
        </main>

        {/* =================================================================
            3. SETTINGS SIDEBAR: URL Slug, Branch, Cover, Tags, Pre-flight
            ================================================================= */}
        {sidebarOpen && (
          <aside className="w-80 border-l border-[#e7e5e4] dark:border-[#292524] bg-card p-5 flex flex-col space-y-5 overflow-y-auto shadow-sm animate-in slide-in-from-right duration-150">
            <div className="flex items-center justify-between border-b border-[#e7e5e4] dark:border-[#292524] pb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                Article Settings
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                title="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any)
                  setSaveStatus('unsaved')
                }}
                className="w-full bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-[#615fff]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* URL Slug */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                URL Slug
              </label>
              <div className="flex items-center rounded-lg border border-[#e7e5e4] dark:border-[#292524] bg-muted/40 px-2.5 py-1.5 text-xs font-mono">
                <span className="text-muted-foreground">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  placeholder="post-slug"
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setSaveStatus('unsaved')
                  }}
                  className="bg-transparent border-none focus:outline-none flex-1 text-foreground font-mono"
                />
              </div>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value)
                  setSaveStatus('unsaved')
                }}
                className="w-full bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-[#615fff]"
              />
            </div>

            {/* Cover Image Picker */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Cover Image
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value)
                  setSaveStatus('unsaved')
                }}
                className="w-full bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg px-3 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#615fff]"
              />
              <div className="grid grid-cols-2 gap-1.5">
                {CURATED_COVERS.map((cov) => (
                  <button
                    key={cov.name}
                    type="button"
                    onClick={() => {
                      setCoverImage(cov.url)
                      setSaveStatus('unsaved')
                    }}
                    className="p-1 rounded border border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] text-[10px] font-mono truncate text-muted-foreground hover:text-foreground text-left"
                  >
                    {cov.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Git Branch */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Git Branch
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-[#e7e5e4] dark:border-[#292524] bg-muted/40 px-2.5 py-1.5 text-xs font-mono">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={gitBranch}
                  onChange={(e) => {
                    setGitBranch(e.target.value)
                    setSaveStatus('unsaved')
                  }}
                  className="bg-transparent border-none focus:outline-none flex-1 text-foreground"
                >
                  <option value="main">main</option>
                  <option value="feat/article-update">feat/article-update</option>
                  <option value="draft/research">draft/research</option>
                </select>
              </div>
            </div>

            {/* Topics & Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Topics & Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/50 border border-[#e7e5e4] dark:border-[#292524] text-foreground"
                  >
                    <span>{t}</span>
                    <button
                      onClick={() => handleRemoveTopic(t)}
                      className="hover:text-[#ff0000] transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="+ Add topic"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                  className="flex-1 bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-md px-2.5 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#615fff]"
                />
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleAddTopic}
                  disabled={!newTopicInput.trim()}
                  className="text-xs font-mono h-7"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Pre-flight Checklist */}
            <div className="pt-3 border-t border-[#e7e5e4] dark:border-[#292524] space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Publishing Checklist
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Word Count:</span>
                  <span className={wordCount >= 200 ? 'text-[#5ea500]' : 'text-[#d97757]'}>
                    {wordCount} words
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Reading Time:</span>
                  <span>{readingTimeEstimate}</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* =================================================================
          4. MODALS: Preview, Research, and AI Assist
          ================================================================= */}
      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        content={content}
        slug={slug}
        topics={topics}
        author={author}
        readingTime={readingTimeEstimate}
        coverImage={coverImage}
      />
    </div>
  )
}
