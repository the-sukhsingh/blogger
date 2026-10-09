import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Search,
  Plus,
  Edit3,
  ExternalLink,
  Trash2,
  ArrowUpDown,
  AlertCircle,
  X,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
import {
  BlogStore,
  formatUpdateDate,
  getArticleTimestamp,
} from '#/lib/blog-store'
import type { Article } from '#/lib/blog-store'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/blogs')({
  component: BlogsIndexPage,
})

type FilterTab = 'all' | 'published' | 'draft' | 'review'
type SortOrder = 'newest-update' | 'oldest-update' | 'title'

function BlogsIndexPage() {
  const navigate = useNavigate()
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const convexArticles = useQuery(api.blogs.list, {})
  const removeBlog = useMutation(api.blogs.remove)
  const seedBlogs = useMutation(api.blogs.seed)

  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<FilterTab>('all')
  const [selectedTopic, setSelectedTopic] = React.useState<string>('all')
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('newest-update')

  // Auto-seed initial demo articles if database is completely empty
  React.useEffect(() => {
    if (convexArticles && convexArticles.length === 0) {
      seedBlogs({ force: false }).catch(() => {})
    }
  }, [convexArticles, seedBlogs])

  const articles = React.useMemo<Article[]>(() => {
    if (convexArticles && convexArticles.length > 0) {
      return convexArticles.map((a) => {
        const topics = a.topics || ['Engineering']
        const content = a.content || ''
        const title = a.title || 'Untitled'
        const seo = BlogStore.computeSeo(title, content)
        const aeo = BlogStore.computeAeo(title, content)
        return {
          id: a._id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || '',
          content: a.content,
          publishedAt: a.publishedAt ? formatUpdateDate(a.publishedAt) : 'Draft',
          updatedAt: a.updatedAt ? formatUpdateDate(a.updatedAt) : 'Recently',
          readingTime: a.readingTime || '5 min read',
          gitBranch: a.gitBranch || 'main',
          commitHash: 'main',
          status: a.status as any,
          topics,
          healthScore: a.healthScore || 90,
          healthMetrics: {
            content: 90,
            seo: 90,
            aeo: 90,
            links: 90,
            freshness: 90,
            technical: 90,
          },
          isStale: false,
          proposedDiffs: [],
          seo,
          aeo,
          internalLinks: { outbound: [], suggestions: [] },
          revisionHistory: [],
        }
      })
    }
    return BlogStore.getArticles()
  }, [convexArticles])

  // Global keyboard shortcut: press '/' to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Collect unique topics across articles
  const allTopics = React.useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => a.topics.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [articles])

  // Stats calculation
  const stats = React.useMemo(() => {
    const published = articles.filter((a) => a.status === 'published').length
    const drafts = articles.filter((a) => a.status === 'draft').length
    const needsReview = articles.filter(
      (a) => a.isStale || a.proposedDiffs.some((d) => d.status === 'pending'),
    ).length
    return { total: articles.length, published, drafts, needsReview }
  }, [articles])

  // Filter and sort articles
  const filteredArticles = React.useMemo(() => {
    let result = [...articles]

    // 1. Status tab filter
    if (activeTab === 'published') {
      result = result.filter((a) => a.status === 'published')
    } else if (activeTab === 'draft') {
      result = result.filter((a) => a.status === 'draft')
    } else if (activeTab === 'review') {
      result = result.filter(
        (a) => a.isStale || a.proposedDiffs.some((d) => d.status === 'pending'),
      )
    }

    // 2. Topic filter
    if (selectedTopic !== 'all') {
      result = result.filter((a) => a.topics.includes(selectedTopic))
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.slug.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.topics.some((t) => t.toLowerCase().includes(q)),
      )
    }

    // 4. Sorting by latest date of updation
    if (sortOrder === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === 'oldest-update') {
      result.sort((a, b) => getArticleTimestamp(a) - getArticleTimestamp(b))
    } else {
      // Default 'newest-update': latest date of updation first
      result.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a))
    }

    return result
  }, [articles, activeTab, selectedTopic, searchQuery, sortOrder])

  // Deletion handler using Convex mutation with local fallback
  const handleDeleteArticle = async (id: string) => {
    try {
      await removeBlog({ id: id as any })
    } catch {
      // fallback
    }
    BlogStore.deleteArticle(id)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-[1120px] w-full mx-auto px-6 py-12 space-y-8">
        {/* =================================================================
            1. REFINED EDITORIAL HEADER WITH COOPER / LORA SERIF
            ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e7e5e4] dark:border-[#292524] pb-8">
          <div className="space-y-2 max-w-2xl">
            <span className="eyebrow-tag block text-[#79716b] dark:text-[#a6a09b]">
              PUBLICATION ARCHIVE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-[#292524] dark:text-[#fafaf9] leading-[1.15]">
              Curated essays &{' '}
              <span className="italic font-normal">dispatches</span>.
            </h1>
            <p className="text-xs sm:text-sm text-[#79716b] dark:text-[#a6a09b] leading-relaxed pt-1">
              A living knowledge base of technical architecture, agent
              mechanics, and engineering notes. Versioned with Git and stored in
              local Markdown.
            </p>
            {/* Inline stats */}
            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-[#a6a09b] dark:text-[#79716b]">
              <span>{stats.total} articles</span>
              <span>·</span>
              <span className="text-[#5ea500]">{stats.published} published</span>
              {stats.drafts > 0 && (
                <>
                  <span>·</span>
                  <span className="text-[#d97757]">{stats.drafts} drafts</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/new">
              <Button variant="default" size="sm">
                <Plus className="h-3.5 w-3.5" />
                <span>New Article</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* =================================================================
            3. UNIFIED FILTER + SEARCH TOOLBAR
            ================================================================= */}
        <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] overflow-hidden">
          {/* Top bar: tabs + search + sort */}
          <div className="flex items-stretch border-b border-[#e7e5e4] dark:border-[#292524]">
            {/* Status tabs — flush bottom border active indicator */}
            <div className="flex items-stretch shrink-0 border-r border-[#e7e5e4] dark:border-[#292524]">
              {[
                { key: 'all' as const, label: 'All', count: stats.total, dot: null },
                { key: 'published' as const, label: 'Published', count: stats.published, dot: '#5ea500' },
                { key: 'draft' as const, label: 'Drafts', count: stats.drafts, dot: '#d97757' },
                ...(stats.needsReview > 0
                  ? [{ key: 'review' as const, label: 'Review', count: stats.needsReview, dot: '#ff0000' }]
                  : []),
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative px-4 h-10 text-[11px] font-mono font-medium flex items-center gap-1.5 transition-colors select-none shrink-0',
                    activeTab === tab.key
                      ? 'text-[#292524] dark:text-[#fafaf9]'
                      : 'text-[#a6a09b] dark:text-[#79716b] hover:text-[#79716b] dark:hover:text-[#a6a09b]',
                  )}
                >
                  {/* Active underline */}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#615fff]" />
                  )}
                  {tab.dot && (
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: tab.dot }}
                    />
                  )}
                  {tab.label}
                  <span
                    className={cn(
                      'text-[10px] tabular-nums',
                      activeTab === tab.key ? 'text-[#615fff]' : 'text-[#c6c3c0] dark:text-[#49443f]',
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search — flex grow */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a6a09b]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-transparent pl-9 pr-12 text-xs text-[#292524] dark:text-[#fafaf9] placeholder:text-[#c6c3c0] dark:placeholder:text-[#49443f] focus:outline-none font-mono"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : (
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none px-1.5 py-0.5 text-[10px] font-mono text-[#c6c3c0] dark:text-[#49443f] bg-[#fafaf9] dark:bg-[#1a1716] border border-[#e7e5e4] dark:border-[#292524] rounded">
                  /
                </kbd>
              )}
            </div>

            {/* Sort button — icon only with tooltip */}
            <button
              type="button"
              onClick={() =>
                setSortOrder((prev) =>
                  prev === 'newest-update' ? 'oldest-update' : 'newest-update',
                )
              }
              title={
                sortOrder === 'newest-update'
                  ? 'Sorted: newest first — click to reverse'
                  : 'Sorted: oldest first — click to reverse'
              }
              className="shrink-0 w-10 h-10 flex items-center justify-center border-l border-[#e7e5e4] dark:border-[#292524] text-[#a6a09b] hover:text-[#615fff] dark:hover:text-[#615fff] transition-colors"
            >
              <ArrowUpDown
                className={cn(
                  'h-3.5 w-3.5 transition-colors',
                  sortOrder !== 'newest-update' ? 'text-[#615fff]' : '',
                )}
              />
            </button>
          </div>

          {/* Topic chips — single scrollable row */}
          <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={cn(
                'px-2.5 py-0.5 rounded-full text-[11px] font-mono whitespace-nowrap transition-all shrink-0',
                selectedTopic === 'all'
                  ? 'bg-[#292524] dark:bg-[#fafaf9] text-white dark:text-[#0c0a09] font-medium'
                  : 'text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#f4f3f2] dark:hover:bg-[#201d1b]',
              )}
            >
              All
            </button>
            {allTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[11px] font-mono whitespace-nowrap transition-all shrink-0',
                  selectedTopic === topic
                    ? 'bg-[#615fff]/10 text-[#615fff] font-medium border border-[#615fff]/25'
                    : 'text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#f4f3f2] dark:hover:bg-[#201d1b]',
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* =================================================================
            4. CRAFTED CMS TABLE WITH TACTILE ROW DETAILS
            ================================================================= */}
        <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110]">
                  <th className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[#79716b] dark:text-[#a6a09b]">
                    Article
                  </th>
                  <th
                    onClick={() =>
                      setSortOrder((prev) =>
                        prev === 'newest-update'
                          ? 'oldest-update'
                          : 'newest-update',
                      )
                    }
                    className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[#79716b] dark:text-[#a6a09b] w-48 cursor-pointer select-none hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
                    title="Click to sort by updation date"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Updated</span>
                      <ArrowUpDown
                        className={cn(
                          'h-3 w-3 transition-opacity',
                          sortOrder.includes('update')
                            ? 'opacity-100 text-[#615fff]'
                            : 'opacity-40',
                        )}
                      />
                    </div>
                  </th>
                  <th className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[#79716b] dark:text-[#a6a09b] text-right w-44">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e5e4] dark:divide-[#292524]">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-16 px-5 text-center space-y-3"
                    >
                      <div className="h-10 w-10 mx-auto rounded-full bg-[#fafaf9] dark:bg-[#201d1b] border border-[#e7e5e4] dark:border-[#292524] flex items-center justify-center text-[#a6a09b]">
                        <Search className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#292524] dark:text-[#fafaf9]">
                          No articles found
                        </p>
                        <p className="text-xs text-[#79716b] dark:text-[#a6a09b] max-w-sm mx-auto">
                          {searchQuery ||
                          selectedTopic !== 'all' ||
                          activeTab !== 'all'
                            ? 'No posts matched your current search filters.'
                            : 'Your publication archive is empty. Begin by creating your first technical post.'}
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-center gap-3">
                        {(searchQuery ||
                          selectedTopic !== 'all' ||
                          activeTab !== 'all') && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('')
                              setSelectedTopic('all')
                              setActiveTab('all')
                            }}
                            className="px-3 py-1.5 text-xs font-mono text-[#615fff] hover:underline"
                          >
                            Reset filters
                          </button>
                        )}
                        <Link to="/new">
                          <Button variant="default" size="xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Create Article
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => {
                    const isDraft = art.status === 'draft'
                    const hasPendingDiffs = art.proposedDiffs.some(
                      (d) => d.status === 'pending',
                    )

                    return (
                      <tr
                        key={art.id}
                        onClick={() =>
                          navigate({
                            to: '/blog/$id',
                            params: { id: art.id },
                          })
                        }
                        className="group hover:bg-[#fafaf9]/90 dark:hover:bg-[#1a1716] transition-colors cursor-pointer"
                      >
                        {/* Article Column */}
                        <td className="py-4 px-5 align-middle">
                          <div className="space-y-1.5">
                            {/* Title with hover color */}
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm sm:text-[15px] font-medium text-[#292524] dark:text-[#fafaf9] group-hover:text-[#615fff] transition-colors leading-snug line-clamp-1">
                                {art.title}
                              </span>

                              {/* Subtle status tag */}
                              {isDraft && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-wider bg-[#d97757]/10 text-[#d97757] border border-[#d97757]/30 shrink-0">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#d97757]" />
                                  Draft
                                </span>
                              )}

                              {art.isStale && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-wider bg-[#d97757]/10 text-[#d97757] border border-[#d97757]/30 shrink-0">
                                  <AlertCircle className="h-2.5 w-2.5" />
                                  Stale
                                </span>
                              )}

                              {hasPendingDiffs && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-wider bg-[#615fff]/10 text-[#615fff] border border-[#615fff]/30 shrink-0">
                                  Diffs Ready
                                </span>
                              )}
                            </div>

                            {/* Secondary Line: Slug + Micro Topic Chips */}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b]">
                              <span className="text-[#a6a09b] dark:text-[#79716b]">
                                /{art.slug}
                              </span>

                              {art.topics.slice(0, 3).map((topic) => (
                                <span
                                  key={topic}
                                  className="px-1.5 py-0.2 rounded-[4px] text-[10px] bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] dark:text-[#a6a09b]"
                                >
                                  {topic}
                                </span>
                              ))}

                              {art.topics.length > 3 && (
                                <span className="text-[10px] text-[#a6a09b]">
                                  +{art.topics.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Date & Reading Time Column: Latest Date of Updation */}
                        <td className="py-4 px-5 align-middle whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="text-xs font-mono font-medium text-[#292524] dark:text-[#fafaf9]">
                              {formatUpdateDate(art.updatedAt).date}
                            </div>
                            <div className="text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] flex items-center gap-1.5">
                              <span>
                                {formatUpdateDate(art.updatedAt).time ||
                                  '12:00'}
                              </span>
                              <span className="text-[#e7e5e4] dark:text-[#292524]">
                                ·
                              </span>
                              <span>{art.readingTime}</span>
                            </div>
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td
                          className="py-4 px-5 align-middle text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Read Link */}
                            <Link
                              to="/blog/$id"
                              params={{ id: art.id }}
                              className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-[6px] text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#fafaf9] dark:hover:bg-[#201d1b] border border-transparent hover:border-[#e7e5e4] dark:hover:border-[#292524] transition-all"
                              title="Read Article"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span className="hidden sm:inline">Read</span>
                            </Link>

                            {/* Edit Link */}
                            <Link
                              to="/blog/$id/edit"
                              params={{ id: art.id }}
                              className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] text-[#292524] dark:text-[#fafaf9] hover:border-[#615fff] hover:text-[#615fff] bg-white dark:bg-[#171514] transition-all shadow-none"
                              title="Edit Article"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </Link>

                            {/* Delete Button with Tooltip Popover confirmation */}
                            <DeleteConfirmPopover
                              onConfirm={() => handleDeleteArticle(art.id)}
                              title="Delete this article?"
                              description={`"${art.title.slice(0, 36)}${art.title.length > 36 ? '...' : ''}" will be permanently removed.`}
                              align="right"
                            >
                              <button
                                type="button"
                                className="p-1.5 text-[#79716b] hover:text-[#ff0000] dark:text-[#a6a09b] dark:hover:text-[#ff3333] hover:bg-[#ff0000]/5 rounded-[6px] transition-colors"
                                title="Delete article"
                                aria-label={`Delete ${art.title}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </DeleteConfirmPopover>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================================================================
            5. QUIET FOOTNOTE & WORKSPACE STATUS
            ================================================================= */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b] border-t border-[#e7e5e4]/60 dark:border-[#292524]/60">
          <div className="flex items-center gap-3">
            <span>✦ Git-backed Markdown storage</span>
            <span className="hidden sm:inline text-[#e7e5e4] dark:text-[#292524]">
              |
            </span>
            <span className="hidden sm:inline">
              Press{' '}
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-[#1f1c1a] border border-[#e7e5e4] dark:border-[#292524] text-[10px]">
                /
              </kbd>{' '}
              to focus search
            </span>
          </div>

          <Link
            to="/new"
            className="text-[#615fff] hover:underline inline-flex items-center gap-1"
          >
            <span>Draft a new article</span>
            <span>→</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
