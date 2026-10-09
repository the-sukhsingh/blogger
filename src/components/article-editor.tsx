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
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { NotionEditor } from '#/components/notion-editor'
import { BlogStore } from '#/lib/blog-store'
import type { Article } from '#/lib/blog-store'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { cn } from '#/lib/utils'

export interface ArticleEditorProps {
  initialArticle?: Partial<Article> & { _id?: string }
  isNew?: boolean
  initialTopic?: string
  initialTitle?: string
}

export function ArticleEditor({
  initialArticle,
  isNew = false,
  initialTopic,
  initialTitle,
}: ArticleEditorProps) {
  const navigate = useNavigate()

  // Article State
  const [title, setTitle] = React.useState(
    initialArticle?.title || initialTitle || '',
  )
  const [slug, setSlug] = React.useState(initialArticle?.slug || '')
  const [content, setContent] = React.useState(
    initialArticle?.content ||
      (isNew
        ? `Start writing your technical breakdown here.\n\nExplain the core architecture upfront within the first two paragraphs so search and answer engines can cite your definitions directly.\n\n## 1. Core Architecture\n\n- Deterministic state machines\n- Type-safe tool interfaces\n- Automated schema validation\n`
        : ''),
  )
  const [topics, setTopics] = React.useState<string[]>(
    initialArticle?.topics ||
      (initialTopic ? [initialTopic, 'Engineering'] : ['Engineering']),
  )
  const [newTopicInput, setNewTopicInput] = React.useState('')
  const [gitBranch, setGitBranch] = React.useState(
    initialArticle?.gitBranch || 'main',
  )
  const [status, setStatus] = React.useState<'published' | 'draft'>(
    initialArticle?.status === 'draft' ? 'draft' : 'published',
  )

  // Sidebar is BY DEFAULT CLOSED as requested
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<
    'saved' | 'saving' | 'unsaved'
  >('saved')

  // Auto-generate slug from title if new
  React.useEffect(() => {
    if (isNew && !slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      )
    }
  }, [title, isNew, slug])

  // Word count & reading time
  const wordCount = React.useMemo(() => {
    return (content + ' ' + title).split(/\s+/).filter(Boolean).length
  }, [content, title])

  const readingTimeEstimate = React.useMemo(() => {
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`
  }, [wordCount])

  // Content change handler from Lexical
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
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

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

  // Keyboard shortcut for Cmd/Ctrl+S
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [title, content, topics, slug, gitBranch, status])

  // Topic tags management
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
          1. REDESIGNED CLEAN & MINIMAL NOTION HEADER
          ================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#292524] transition-colors">
        <div className="max-w-[1240px] mx-auto px-6 h-12 flex items-center justify-between">
          {/* Left: Breadcrumb / Back */}
          <div className="flex items-center gap-3">
            <Link
              to="/blogs"
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Articles</span>
            </Link>

            <span className="text-[#e7e5e4] dark:text-[#292524]">/</span>

            <span className="text-xs font-medium text-[#292524] dark:text-[#fafaf9] max-w-[220px] truncate">
              {title || 'Untitled'}
            </span>

            {/* Subtle Save Indicator */}
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border',
                saveStatus === 'saved'
                  ? 'text-[#5ea500] border-[#5ea500]/30 bg-[#5ea500]/5'
                  : 'text-[#d97757] border-[#d97757]/30 bg-[#d97757]/5',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  saveStatus === 'saved' ? 'bg-[#5ea500]' : 'bg-[#d97757]',
                )}
              />
              <span>{saveStatus === 'saved' ? 'Saved' : 'Unsaved'}</span>
            </span>
          </div>

          {/* Right: Meta Count + Sidebar Toggle + Primary CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#79716b] dark:text-[#a6a09b]">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>{readingTimeEstimate}</span>
            </div>

            {/* Sidebar Toggle (Settings / Properties) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] transition-colors',
                sidebarOpen
                  ? 'bg-[#fafaf9] dark:bg-[#1a1816] text-[#615fff] border-[#615fff]/40'
                  : 'text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9]',
              )}
              title="Toggle Article Settings (Slug, Branch, Status, Topics)"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Primary Save / Publish Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave(status)}
            >
              <Save className="h-3 w-3 mr-1" />
              {status === 'published' ? 'Publish' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      {/* =================================================================
          2. NOTION-STYLE WRITING CANVAS & RIGHT DRAWER
          ================================================================= */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Main Clean Document Canvas */}
        <main className="flex-1 overflow-y-auto px-6 py-12 flex justify-center">
          <div className="w-full max-w-[760px] space-y-6">
            {/* Large Notion Display Title */}
            <input
              type="text"
              placeholder="Untitled"
              value={title}
              onChange={handleTitleChange}
              className="w-full font-display text-4xl sm:text-5xl font-normal tracking-tight text-[#292524] dark:text-[#fafaf9] placeholder:text-[#d6d3d1] dark:placeholder:text-[#44403c] border-none bg-transparent focus:outline-none leading-[1.15]"
            />

            {/* Notion Rich-Text Lexical Editor */}
            <NotionEditor
              initialMarkdown={content}
              onChange={handleContentChange}
              placeholder="Write your story or technical post... Use # for headings, - for lists, > for quotes."
            />
          </div>
        </main>

        {/* =================================================================
            3. RIGHT SETTINGS SIDEBAR (BY DEFAULT CLOSED)
            Contains: Slug, Branch, Status, Topics, and Health Vector
            ================================================================= */}
        {sidebarOpen && (
          <aside className="w-80 border-l border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-5 flex flex-col space-y-5 overflow-y-auto shadow-sm animate-in slide-in-from-right duration-150">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-[#e7e5e4] dark:border-[#292524] pb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#292524] dark:text-[#fafaf9]">
                Article Settings
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] p-1 rounded transition-colors"
                title="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 1. Status Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider block">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any)
                  setSaveStatus('unsaved')
                }}
                className="w-full bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524] rounded-[8px] px-3 py-1.5 text-xs font-mono text-[#292524] dark:text-[#fafaf9] focus:outline-none focus:border-[#615fff]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* 2. Slug Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider block">
                URL Slug
              </label>
              <div className="flex items-center rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] px-2.5 py-1.5 text-xs font-mono">
                <span className="text-[#a6a09b]">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  placeholder="post-slug"
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setSaveStatus('unsaved')
                  }}
                  className="bg-transparent border-none focus:outline-none flex-1 text-[#292524] dark:text-[#fafaf9] font-mono"
                />
              </div>
            </div>

            {/* 3. Git Branch */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider block">
                Git Branch
              </label>
              <div className="flex items-center gap-2 rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] px-2.5 py-1.5 text-xs font-mono">
                <GitBranch className="h-3.5 w-3.5 text-[#79716b]" />
                <select
                  value={gitBranch}
                  onChange={(e) => {
                    setGitBranch(e.target.value)
                    setSaveStatus('unsaved')
                  }}
                  className="bg-transparent border-none focus:outline-none flex-1 text-[#292524] dark:text-[#fafaf9]"
                >
                  <option value="main">main</option>
                  <option value="feat/article-update">
                    feat/article-update
                  </option>
                  <option value="draft/research">draft/research</option>
                </select>
              </div>
            </div>

            {/* 4. Topics / Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider block">
                Topics & Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-[6px] bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524] text-[#292524] dark:text-[#fafaf9]"
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
                  className="flex-1 bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524] rounded-[6px] px-2.5 py-1 text-xs font-mono text-[#292524] dark:text-[#fafaf9] placeholder:text-[#a6a09b] focus:outline-none focus:border-[#615fff]"
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
          </aside>
        )}
      </div>
    </div>
  )
}
