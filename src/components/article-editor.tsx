import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Save,
  Sparkles,
  Eye,
  Columns,
  Search,
  Bot,
  Link2,
  Check,
  Plus,
  X,
  Code2,
  Heading,
  Quote,
  MessageSquare,
  Table,
  PanelRightClose,
  PanelRightOpen,
  GitBranch,
  Clock,
  Share2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import { HealthGauge } from '#/components/ui/health-gauge'
import { DiffViewer } from '#/components/ui/diff-viewer'
import { SlashCommandMenu, DEFAULT_SLASH_COMMANDS } from '#/components/ui/slash-command'
import { BlogStore, type Article, type ProposedDiff } from '#/lib/blog-store'
import { cn } from '#/lib/utils'

export interface ArticleEditorProps {
  initialArticle?: Article
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

  // Core Editor State
  const [title, setTitle] = React.useState(
    initialArticle?.title || initialTitle || (isNew ? 'New Technical Article' : ''),
  )
  const [slug, setSlug] = React.useState(initialArticle?.slug || '')
  const [content, setContent] = React.useState(
    initialArticle?.content ||
      (isNew
        ? `# ${initialTitle || 'New Technical Article'}\n\nStart writing your technical breakdown here. Explain the core architecture upfront within the first two paragraphs so search and answer engines can cite your definitions directly.\n\n## 1. Core Architecture\n\n\`\`\`typescript\n// Example TypeScript implementation\nexport function example() {\n  return "production-ready";\n}\n\`\`\`\n`
        : ''),
  )
  const [topics, setTopics] = React.useState<string[]>(
    initialArticle?.topics || (initialTopic ? [initialTopic, 'Engineering'] : ['TypeScript', 'Architecture']),
  )
  const [newTopicInput, setNewTopicInput] = React.useState('')
  const [gitBranch, setGitBranch] = React.useState(initialArticle?.gitBranch || 'main')
  const [status, setStatus] = React.useState<'published' | 'draft'>(
    initialArticle?.status === 'draft' ? 'draft' : 'published',
  )

  // Layout & UI State
  const [viewMode, setViewMode] = React.useState<'write' | 'preview' | 'split' | 'serp' | 'aeo'>('split')
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [activeSidebarTab, setActiveSidebarTab] = React.useState<'ai' | 'seo' | 'links' | 'health'>('ai')
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [activeDiffs, setActiveDiffs] = React.useState<ProposedDiff[]>(
    initialArticle?.proposedDiffs || [],
  )

  // All articles for internal link suggestions
  const [allArticles, setAllArticles] = React.useState<Article[]>([])
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Load articles
  React.useEffect(() => {
    setAllArticles(BlogStore.getArticles())
  }, [])

  // Live health and SEO calculation
  const liveHealth = React.useMemo(() => {
    return BlogStore.computeHealth(title, content, topics, false)
  }, [title, content, topics])

  const liveSeo = React.useMemo(() => {
    return BlogStore.computeSeo(title, content)
  }, [title, content])

  const liveAeo = React.useMemo(() => {
    return BlogStore.computeAeo(title, content)
  }, [title, content])

  const internalLinkSuggestions = React.useMemo(() => {
    return BlogStore.computeInternalLinks(initialArticle?.id || 'new', content, allArticles)
  }, [content, allArticles, initialArticle])

  // Word count & reading time
  const wordCount = React.useMemo(() => {
    return content.split(/\s+/).filter(Boolean).length
  }, [content])

  const readingTimeEstimate = React.useMemo(() => {
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`
  }, [wordCount])

  // Auto-generate slug from title if new
  React.useEffect(() => {
    if (isNew && !slug) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      )
    }
  }, [title, isNew, slug])

  // Mark unsaved changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setSaveStatus('unsaved')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setSaveStatus('unsaved')
  }

  // Save article to localStorage
  const handleSave = (publishState?: 'published' | 'draft') => {
    setSaveStatus('saving')
    const finalStatus = publishState || status

    const saved = BlogStore.saveArticle({
      id: initialArticle?.id,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      title,
      content,
      topics,
      gitBranch,
      status: finalStatus,
      proposedDiffs: activeDiffs,
    })

    setTimeout(() => {
      setSaveStatus('saved')
      if (isNew) {
        navigate({ to: '/blog/$id', params: { id: saved.id } })
      }
    }, 400)
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
  }, [title, content, topics, slug, gitBranch, status, activeDiffs])

  // Add / Remove Topic Tags
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

  // Insert markdown helper at cursor
  const insertFormatting = (prefix: string, suffix = '') => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`

    const newContent = content.substring(0, start) + replacement + content.substring(end)
    setContent(newContent)
    setSaveStatus('unsaved')

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4))
    }, 10)
  }

  // Link suggestion inserter
  const handleInsertLink = (phrase: string, targetSlug: string) => {
    const markdownLink = `[${phrase}](/blog/${targetSlug})`
    if (content.includes(phrase)) {
      setContent(content.replace(phrase, markdownLink))
    } else {
      setContent(`${content}\n\n*Related: ${markdownLink}*`)
    }
    setSaveStatus('unsaved')
  }

  // AI Assistant trigger mock
  const handleGenerateAiDiff = (action: 'improve' | 'stale-check' | 'explain') => {
    let diff: ProposedDiff

    if (action === 'improve') {
      diff = {
        id: `diff-${Date.now()}`,
        title: 'Writing Agent: Optimize Introduction Clarity',
        description: 'Placed the core architectural definition in paragraph 1 to optimize reader retention and AEO extraction.',
        status: 'pending',
        lines: [
          {
            type: 'unchanged',
            oldLineNumber: 1,
            newLineNumber: 1,
            content: `# ${title}`,
          },
          {
            type: 'deletion',
            oldLineNumber: 2,
            content: 'In this blog post, we are going to look into various features and how they work in production environments.',
          },
          {
            type: 'addition',
            newLineNumber: 2,
            content: `The architecture of ${title.split(':')[0]} provides deterministic isolation and high-throughput execution across distributed runtime boundaries.`,
          },
        ],
      }
    } else if (action === 'stale-check') {
      diff = {
        id: `diff-${Date.now()}`,
        title: 'Freshness Sentinel: Version & Parameter Audit',
        description: 'Verified package imports against latest repository declarations.',
        status: 'pending',
        lines: [
          {
            type: 'unchanged',
            oldLineNumber: 10,
            newLineNumber: 10,
            content: '// Configuration settings',
          },
          {
            type: 'deletion',
            oldLineNumber: 11,
            content: 'const timeout = 5000; // Legacy deprecated timeout key',
          },
          {
            type: 'addition',
            newLineNumber: 11,
            content: 'const timeoutMs = 5000; // Upgraded parameter signature',
          },
        ],
      }
    } else {
      diff = {
        id: `diff-${Date.now()}`,
        title: 'Technical Review: Add Comprehensive Type Signature',
        description: 'Supplied explicit return types and Zod runtime schema validation.',
        status: 'pending',
        lines: [
          {
            type: 'deletion',
            oldLineNumber: 24,
            content: 'export function process(data: any) {',
          },
          {
            type: 'addition',
            newLineNumber: 24,
            content: 'export function process<T extends BaseContext>(data: T): Result<T> {',
          },
        ],
      }
    }

    setActiveDiffs([diff, ...activeDiffs])
    setActiveSidebarTab('ai')
  }

  const handleAcceptDiff = (diffId: string) => {
    setActiveDiffs((prev) =>
      prev.map((d) => (d.id === diffId ? { ...d, status: 'accepted' } : d)),
    )
  }

  const handleRejectDiff = (diffId: string) => {
    setActiveDiffs((prev) =>
      prev.map((d) => (d.id === diffId ? { ...d, status: 'rejected' } : d)),
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* =================================================================
          1. MINIMAL CUSTOM EDITOR HEADER (AGENTS.md § 7)
          ================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-[#e7e5e4] dark:border-[#292524] transition-colors">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left: Back & Title */}
          <div className="flex items-center gap-4">
            <Link
              to="/blogs"
              className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Publications</span>
            </Link>

            <span className="text-[#e7e5e4] dark:text-[#292524]">/</span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#292524] dark:text-[#fafaf9] max-w-[200px] sm:max-w-[320px] truncate">
                {title || 'Untitled Post'}
              </span>
              <span
                className={cn(
                  'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                  saveStatus === 'saved'
                    ? 'text-[#5ea500] border-[#5ea500]/30 bg-[#5ea500]/5'
                    : 'text-[#d97757] border-[#d97757]/30 bg-[#d97757]/5',
                )}
              >
                {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
              </span>
            </div>
          </div>

          {/* Center: View Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-[#fafaf9] dark:bg-[#121110] p-1 rounded-[8px] border border-[#e7e5e4] dark:border-[#292524]">
            <button
              onClick={() => setViewMode('write')}
              className={cn(
                'px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all',
                viewMode === 'write'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm font-semibold'
                  : 'text-[#79716b] hover:text-[#292524]',
              )}
            >
              Write
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                'px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all',
                viewMode === 'split'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm font-semibold'
                  : 'text-[#79716b] hover:text-[#292524]',
              )}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={cn(
                'px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all',
                viewMode === 'preview'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm font-semibold'
                  : 'text-[#79716b] hover:text-[#292524]',
              )}
            >
              Reader
            </button>
            <button
              onClick={() => setViewMode('serp')}
              className={cn(
                'px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all',
                viewMode === 'serp'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm font-semibold'
                  : 'text-[#79716b] hover:text-[#292524]',
              )}
            >
              Search
            </button>
            <button
              onClick={() => setViewMode('aeo')}
              className={cn(
                'px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all',
                viewMode === 'aeo'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm font-semibold'
                  : 'text-[#79716b] hover:text-[#292524]',
              )}
            >
              AEO
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Toggle Sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                'p-1.5 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors',
                sidebarOpen ? 'bg-[#fafaf9] dark:bg-[#171514] text-[#615fff]' : '',
              )}
              title={sidebarOpen ? 'Hide Intelligence Panel' : 'Show Intelligence Panel'}
            >
              {sidebarOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </button>

            {/* Save Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave()}
              className="h-8 text-xs font-mono uppercase"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>

            {/* Publish Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave('published')}
              className="h-8 px-3.5 text-xs font-semibold uppercase tracking-[0.04em] shadow-none hover:bg-[#4f39f6]"
            >
              Publish
            </Button>
          </div>
        </div>
      </header>

      {/* =================================================================
          2. EDITOR BODY + COLLAPSIBLE INTELLIGENCE PANEL
          ================================================================= */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* Metadata Controls Bar */}
          <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Title Input */}
              <input
                type="text"
                placeholder="Enter article display title..."
                value={title}
                onChange={handleTitleChange}
                className="flex-1 font-display text-2xl sm:text-3xl bg-transparent border-none focus:outline-none text-[#292524] dark:text-[#fafaf9] placeholder:text-[#a6a09b]"
              />

              <div className="flex items-center gap-2 text-xs font-mono text-[#79716b]">
                <Clock className="h-3 w-3" />
                <span>{wordCount} words ({readingTimeEstimate})</span>
              </div>
            </div>

            {/* Slug & Branch Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#e7e5e4] dark:border-[#292524] text-xs font-mono">
              <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                <span className="text-[#79716b]">slug:</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setSaveStatus('unsaved')
                  }}
                  className="bg-[#fafaf9] dark:bg-[#121110] px-2 py-1 rounded border border-[#e7e5e4] dark:border-[#292524] text-xs font-mono w-full focus:outline-none focus:border-[#615fff]"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-[#79716b]" />
                <span className="text-[#79716b]">branch:</span>
                <select
                  value={gitBranch}
                  onChange={(e) => {
                    setGitBranch(e.target.value)
                    setSaveStatus('unsaved')
                  }}
                  className="bg-[#fafaf9] dark:bg-[#121110] px-2 py-1 rounded border border-[#e7e5e4] dark:border-[#292524] text-xs font-mono focus:outline-none"
                >
                  <option value="main">main</option>
                  <option value="feat/article-update">feat/article-update</option>
                  <option value="draft/research">draft/research</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#79716b]">status:</span>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as any)
                    setSaveStatus('unsaved')
                  }}
                  className="bg-[#fafaf9] dark:bg-[#121110] px-2 py-1 rounded border border-[#e7e5e4] dark:border-[#292524] text-xs font-mono focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Topics Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#e7e5e4] dark:border-[#292524]">
              <span className="text-[11px] font-mono text-[#79716b] uppercase mr-1">Topics:</span>
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

              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add topic"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                  className="text-[11px] font-mono bg-transparent border-none focus:outline-none w-20 text-[#292524] dark:text-[#fafaf9] placeholder:text-[#a6a09b]"
                />
                {newTopicInput && (
                  <button onClick={handleAddTopic} className="text-[#615fff]">
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Markdown Formatting Toolbar */}
          <div className="flex items-center gap-1 p-1 bg-[#fafaf9] dark:bg-[#121110] rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] w-fit">
            <button
              onClick={() => insertFormatting('## ')}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-[#171514] text-[#79716b] hover:text-[#292524] transition-colors"
              title="Heading 2"
            >
              <Heading className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('**', '**')}
              className="px-2 py-1 text-xs font-bold rounded hover:bg-white dark:hover:bg-[#171514] text-[#79716b] hover:text-[#292524] transition-colors"
              title="Bold"
            >
              B
            </button>
            <button
              onClick={() => insertFormatting('*', '*')}
              className="px-2 py-1 text-xs italic rounded hover:bg-white dark:hover:bg-[#171514] text-[#79716b] hover:text-[#292524] transition-colors"
              title="Italic"
            >
              I
            </button>
            <button
              onClick={() => insertFormatting('```typescript\n', '\n```')}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-[#171514] text-[#79716b] hover:text-[#292524] transition-colors"
              title="Code Block"
            >
              <Code2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('> ')}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-[#171514] text-[#79716b] hover:text-[#292524] transition-colors"
              title="Callout / Quote"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('[', '](https://)')}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-[#171514] text-[#79716b] hover:text-[#292524] transition-colors"
              title="Link"
            >
              <Link2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* VIEWPORT CONTROLS */}
          {/* Write or Split Mode */}
          {(viewMode === 'write' || viewMode === 'split') && (
            <div className={cn('grid gap-6 flex-1', viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
              {/* Editor Textarea */}
              <div className="flex flex-col space-y-2">
                <span className="text-[11px] font-mono text-[#79716b] uppercase">Markdown Source Editor</span>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Type your technical content in Markdown..."
                  className="w-full flex-1 min-h-[500px] p-5 font-mono text-sm leading-relaxed rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] text-[#292524] dark:text-[#fafaf9] placeholder:text-[#a6a09b] focus:outline-none focus:border-[#615fff] focus:ring-2 focus:ring-[#615fff]/15 resize-y transition-all"
                />
              </div>

              {/* Split Live Preview */}
              {viewMode === 'split' && (
                <div className="flex flex-col space-y-2">
                  <span className="text-[11px] font-mono text-[#79716b] uppercase">Live Article Preview</span>
                  <div className="w-full flex-1 min-h-[500px] p-6 rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] overflow-y-auto prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed">
                    <h1 className="font-display text-2xl font-normal text-[#292524] dark:text-[#fafaf9]">{title}</h1>
                    <div className="whitespace-pre-wrap font-sans text-[#292524] dark:text-[#d6d3d1]">{content}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reader Preview Mode */}
          {viewMode === 'preview' && (
            <div className="rounded-[16px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-8 max-w-3xl mx-auto w-full space-y-6">
              <div className="space-y-3 border-b border-[#e7e5e4] dark:border-[#292524] pb-6">
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <Badge key={t} variant="secondary" size="sm" shape="tag">
                      {t}
                    </Badge>
                  ))}
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-[#292524] dark:text-[#fafaf9]">{title}</h1>
                <div className="text-xs font-mono text-[#79716b]">
                  {readingTimeEstimate} · {wordCount} words · Git branch: {gitBranch}
                </div>
              </div>
              <div className="whitespace-pre-wrap font-sans leading-relaxed text-[#292524] dark:text-[#d6d3d1]">
                {content}
              </div>
            </div>
          )}

          {/* Search SERP Preview Mode (AGENTS.md § 25) */}
          {viewMode === 'serp' && (
            <div className="max-w-2xl mx-auto w-full space-y-6 py-6">
              <div className="space-y-1">
                <h3 className="font-display text-xl text-[#292524] dark:text-[#fafaf9]">
                  Search Engine Result Preview (SERP)
                </h3>
                <p className="text-xs text-[#79716b]">
                  How this article metadata will appear across Google search results.
                </p>
              </div>

              <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#79716b]">
                  <span className="text-[#5ea500]">https://autosend.dev</span>
                  <span>› blog › {slug}</span>
                </div>
                <h4 className="text-lg text-[#007ebb] hover:underline cursor-pointer font-medium leading-snug">
                  {liveSeo.title}
                </h4>
                <p className="text-xs text-[#79716b] dark:text-[#a6a09b] leading-relaxed">
                  {liveSeo.description}
                </p>
              </div>

              <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] p-4 text-xs space-y-2">
                <span className="font-mono font-semibold uppercase text-[#292524] dark:text-[#fafaf9]">SEO Checklist</span>
                <ul className="space-y-1 text-[#79716b]">
                  {liveSeo.insights.map((ins, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-[#5ea500] shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* AEO Preview Mode (AGENTS.md § 25) */}
          {viewMode === 'aeo' && (
            <div className="max-w-2xl mx-auto w-full space-y-6 py-6">
              <div className="space-y-1">
                <h3 className="font-display text-xl text-[#292524] dark:text-[#fafaf9]">
                  Answer Engine Optimization (AEO) Preview
                </h3>
                <p className="text-xs text-[#79716b]">
                  How AI assistants (Perplexity, ChatGPT, Claude) synthesize your answers.
                </p>
              </div>

              <div className="rounded-[12px] border border-[#615fff]/30 bg-white dark:bg-[#171514] p-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#615fff] uppercase">Synthesized Query</span>
                  <Badge variant="indigo" size="sm">{liveAeo.readinessScore}% Readiness</Badge>
                </div>
                <p className="text-sm font-semibold text-[#292524] dark:text-[#fafaf9]">
                  "{liveAeo.primaryQuestion}"
                </p>
                <div className="border-l-2 border-[#615fff] pl-3 py-1 text-xs text-[#79716b] dark:text-[#a6a09b] italic">
                  "{liveAeo.directAnswerSnippet}"
                </div>
              </div>

              <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] p-4 text-xs space-y-2">
                <span className="font-mono font-semibold uppercase text-[#292524] dark:text-[#fafaf9]">AEO Agent Audit</span>
                <ul className="space-y-1 text-[#79716b]">
                  {liveAeo.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-[#615fff] shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* =================================================================
            3. CONTEXTUAL RIGHT INTELLIGENCE SIDEBAR (AGENTS.md § 7 & § 10)
            ================================================================= */}
        {sidebarOpen && (
          <aside className="w-80 lg:w-96 border-l border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] p-5 flex flex-col space-y-5 overflow-y-auto transition-all">
            {/* Sidebar Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-white dark:bg-[#171514] rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] text-[11px] font-mono text-center">
              <button
                onClick={() => setActiveSidebarTab('ai')}
                className={cn(
                  'py-1 rounded-[6px] transition-colors',
                  activeSidebarTab === 'ai' ? 'bg-[#615fff] text-white font-bold' : 'text-[#79716b] hover:text-foreground',
                )}
              >
                AI Diffs
              </button>
              <button
                onClick={() => setActiveSidebarTab('seo')}
                className={cn(
                  'py-1 rounded-[6px] transition-colors',
                  activeSidebarTab === 'seo' ? 'bg-[#615fff] text-white font-bold' : 'text-[#79716b] hover:text-foreground',
                )}
              >
                SEO/AEO
              </button>
              <button
                onClick={() => setActiveSidebarTab('links')}
                className={cn(
                  'py-1 rounded-[6px] transition-colors',
                  activeSidebarTab === 'links' ? 'bg-[#615fff] text-white font-bold' : 'text-[#79716b] hover:text-foreground',
                )}
              >
                Links
              </button>
              <button
                onClick={() => setActiveSidebarTab('health')}
                className={cn(
                  'py-1 rounded-[6px] transition-colors',
                  activeSidebarTab === 'health' ? 'bg-[#615fff] text-white font-bold' : 'text-[#79716b] hover:text-foreground',
                )}
              >
                Health
              </button>
            </div>

            {/* TAB 1: AI ASSISTANT & DIFFS (AGENTS.md § 10 & § 11) */}
            {activeSidebarTab === 'ai' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="font-mono font-semibold uppercase text-[#292524] dark:text-[#fafaf9]">
                    Contextual AI Collaborator
                  </span>
                  <p className="text-[11px] text-[#79716b]">
                    AI proposes code and text modifications. You decide via structured diff reviews.
                  </p>
                </div>

                {/* AI Action Quick Triggers */}
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateAiDiff('improve')}
                    className="justify-start text-xs font-normal border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#615fff] mr-2" />
                    <span>Optimize Intro for AEO</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateAiDiff('stale-check')}
                    className="justify-start text-xs font-normal border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514]"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-[#d97757] mr-2" />
                    <span>Check Deprecated API Claims</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateAiDiff('explain')}
                    className="justify-start text-xs font-normal border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514]"
                  >
                    <Code2 className="h-3.5 w-3.5 text-[#5ea500] mr-2" />
                    <span>Review Technical Types</span>
                  </Button>
                </div>

                {/* Diff Viewer List */}
                <div className="space-y-3 pt-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#79716b] block">
                    Pending Diffs ({activeDiffs.filter((d) => d.status === 'pending').length})
                  </span>

                  {activeDiffs.length === 0 ? (
                    <div className="rounded-[8px] border border-dashed border-[#e7e5e4] dark:border-[#292524] p-4 text-center text-[#79716b]">
                      No active diffs. Trigger an action above to review proposed changes.
                    </div>
                  ) : (
                    activeDiffs.map((diff) => (
                      <DiffViewer
                        key={diff.id}
                        title={diff.title}
                        description={diff.description}
                        diffs={diff.lines}
                        onAccept={() => handleAcceptDiff(diff.id)}
                        onReject={() => handleRejectDiff(diff.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SEO & AEO ANALYSIS (AGENTS.md § 13 & § 14) */}
            {activeSidebarTab === 'seo' && (
              <div className="space-y-4 text-xs">
                <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase font-semibold">SEO Readiness</span>
                    <Badge variant="lichen" size="sm">{liveSeo.readabilityScore}%</Badge>
                  </div>
                  <div className="text-[11px] text-[#79716b] space-y-1">
                    <p>• Intent: <strong className="text-foreground">{liveSeo.searchIntent}</strong></p>
                    <p>• Headings found: <strong className="text-foreground">{liveSeo.headingCount}</strong></p>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase font-semibold text-[#615fff]">AEO Answerability</span>
                    <Badge variant="indigo" size="sm">{liveAeo.readinessScore}%</Badge>
                  </div>
                  <div className="text-[11px] text-[#79716b] space-y-1">
                    <p>• Extracted Definition: <strong className="text-foreground">{liveAeo.definitionPosition}</strong></p>
                    <p>• Structured Evidence: <strong className="text-foreground">{liveAeo.structuredEvidence ? 'Yes' : 'Missing'}</strong></p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INTERNAL LINKING OPPORTUNITIES (AGENTS.md § 16) */}
            {activeSidebarTab === 'links' && (
              <div className="space-y-4 text-xs">
                <span className="font-mono font-semibold uppercase text-[#292524] dark:text-[#fafaf9] block">
                  Internal Link Sentinel
                </span>
                <p className="text-[11px] text-[#79716b]">
                  Automatically discovers mentions of existing publications to eliminate orphan content.
                </p>

                <div className="space-y-2.5">
                  {internalLinkSuggestions.suggestions.length === 0 ? (
                    <div className="rounded-[8px] border border-dashed border-[#e7e5e4] dark:border-[#292524] p-4 text-center text-[#79716b]">
                      No new internal link opportunities detected in this draft.
                    </div>
                  ) : (
                    internalLinkSuggestions.suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-[#615fff]">Mention: "{sug.phrase}"</span>
                        </div>
                        <p className="text-[11px] text-[#79716b] leading-tight">
                          {sug.reason}
                        </p>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleInsertLink(sug.phrase, sug.targetSlug)}
                          className="w-full text-[11px] font-mono mt-1"
                        >
                          + Insert Link to Article
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: LIVE ARTICLE HEALTH (AGENTS.md § 19) */}
            {activeSidebarTab === 'health' && (
              <div className="space-y-4">
                <HealthGauge
                  overallScore={liveHealth.overall}
                  statusText="Draft Health Vector"
                  metrics={[
                    { name: 'Content', score: liveHealth.metrics.content },
                    { name: 'SEO', score: liveHealth.metrics.seo },
                    { name: 'AEO', score: liveHealth.metrics.aeo },
                    { name: 'Links', score: liveHealth.metrics.links },
                    { name: 'Freshness', score: liveHealth.metrics.freshness },
                    { name: 'Technical', score: liveHealth.metrics.technical },
                  ]}
                />
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
