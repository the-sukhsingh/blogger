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
  Network,
  Compass,
  Bot,
  Upload,
  Download,
  Check,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { PageHeader } from '#/components/page-header'
import { Button } from '#/components/ui/button'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
import { KnowledgeGraphModal } from '#/components/knowledge-graph-modal'
import { ContentGapModal } from '#/components/content-gap-modal'
import { PublicationChatModal } from '#/components/publication-chat-modal'
import { ImportModal } from '#/components/import-modal'
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

  // Modals
  const [graphOpen, setGraphOpen] = React.useState(false)
  const [gapOpen, setGapOpen] = React.useState(false)
  const [chatOpen, setChatOpen] = React.useState(false)
  const [importOpen, setImportOpen] = React.useState(false)
  const [exported, setExported] = React.useState(false)

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
          content: a.content || '',
          publishedAt: a.publishedAt
            ? typeof a.publishedAt === 'number'
              ? new Date(a.publishedAt).toISOString()
              : String(a.publishedAt)
            : 'Draft',
          updatedAt: a.updatedAt
            ? typeof a.updatedAt === 'number'
              ? new Date(a.updatedAt).toISOString()
              : String(a.updatedAt)
            : new Date().toISOString(),
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
      (a) => a.isStale || a.proposedDiffs.some((d) => d.status === 'pending')
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
        (a) => a.isStale || a.proposedDiffs.some((d) => d.status === 'pending')
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
          art.topics.some((t) => t.toLowerCase().includes(q))
      )
    }

    // 4. Sorting
    if (sortOrder === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === 'oldest-update') {
      result.sort((a, b) => getArticleTimestamp(a) - getArticleTimestamp(b))
    } else {
      result.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a))
    }

    return result
  }, [articles, activeTab, selectedTopic, searchQuery, sortOrder])

  // Deletion handler
  const handleDeleteArticle = async (id: string) => {
    try {
      await removeBlog({ id: id as any })
    } catch {
      // fallback
    }
    BlogStore.deleteArticle(id)
  }

  // Export entire publication as JSON backup
  const handleExportAll = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      publication: 'blogger.dev',
      totalArticles: articles.length,
      articles: articles.map((a) => ({
        title: a.title,
        slug: a.slug,
        topics: a.topics,
        status: a.status,
        publishedAt: a.publishedAt,
        content: a.content,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `publication-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* =================================================================
            1. REFINED EDITORIAL HEADER & WORKSPACE INTELLIGENCE ACTIONS
            ================================================================= */}
        <PageHeader
          eyebrow="PUBLICATION ARCHIVE"
          title={
            <>
              Curated technical essays &{' '}
              <span className="italic font-normal">knowledge graph</span>.
            </>
          }
          description="A living technical publication treating articles like code: versioned with Git, indexed for Answer Engines (AEO), and organized into topic clusters."
          stats={
            <>
              <span>{stats.total} articles</span>
              <span>·</span>
              <span className="text-[#5ea500]">{stats.published} published</span>
              {stats.drafts > 0 && (
                <>
                  <span>·</span>
                  <span className="text-[#d97757]">{stats.drafts} drafts</span>
                </>
              )}
            </>
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {/* Knowledge Graph Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGraphOpen(true)}
                className="text-xs font-mono flex items-center gap-1.5"
                title="View Connected Knowledge Graph"
              >
                <Network className="h-3.5 w-3.5 text-[#615fff]" />
                <span className="hidden sm:inline">Graph</span>
              </Button>

              {/* Content Gaps Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGapOpen(true)}
                className="text-xs font-mono flex items-center gap-1.5"
                title="Discover Content Gaps"
              >
                <Compass className="h-3.5 w-3.5 text-[#5ea500]" />
                <span className="hidden sm:inline">Gaps</span>
              </Button>

              {/* Ask Publication AI Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChatOpen(true)}
                className="text-xs font-mono flex items-center gap-1.5"
                title="Ask Publication AI"
              >
                <Bot className="h-3.5 w-3.5 text-[#615fff]" />
                <span className="hidden sm:inline">Ask AI</span>
              </Button>

              {/* Import Markdown Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportOpen(true)}
                className="text-xs font-mono flex items-center gap-1.5"
                title="Import Markdown (.md)"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Import</span>
              </Button>

              {/* Export All Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAll}
                className="text-xs font-mono flex items-center gap-1.5"
                title="Export Entire Publication"
              >
                {exported ? <Check className="h-3.5 w-3.5 text-[#5ea500]" /> : <Download className="h-3.5 w-3.5" />}
                <span className="hidden md:inline">{exported ? 'Exported' : 'Export'}</span>
              </Button>

              {/* Primary Create New Post */}
              <Link to="/new">
                <Button variant="default" size="sm" className="font-mono text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Post</span>
                </Button>
              </Link>
            </div>
          }
        />

        {/* =================================================================
            2. UNIFIED FILTER + SEARCH TOOLBAR
            ================================================================= */}
        <div className="rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card overflow-hidden">
          {/* Top bar: tabs + search + sort */}
          <div className="flex items-stretch border-b border-[#e7e5e4] dark:border-[#292524]">
            {/* Status tabs */}
            <div className="flex items-stretch shrink-0 border-r border-[#e7e5e4] dark:border-[#292524] overflow-x-auto">
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
                    'relative px-3.5 h-10 text-[11px] font-mono font-medium flex items-center gap-1.5 transition-colors select-none shrink-0',
                    activeTab === tab.key
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
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
                      activeTab === tab.key ? 'text-[#615fff]' : 'text-muted-foreground'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-transparent pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : (
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted/30 border border-[#e7e5e4] dark:border-[#292524] rounded">
                  /
                </kbd>
              )}
            </div>

            {/* Sort button */}
            <button
              type="button"
              onClick={() =>
                setSortOrder((prev) =>
                  prev === 'newest-update' ? 'oldest-update' : 'newest-update'
                )
              }
              title={
                sortOrder === 'newest-update'
                  ? 'Sorted: newest first — click to reverse'
                  : 'Sorted: oldest first — click to reverse'
              }
              className="shrink-0 w-10 h-10 flex items-center justify-center border-l border-[#e7e5e4] dark:border-[#292524] text-muted-foreground hover:text-[#615fff] transition-colors"
            >
              <ArrowUpDown
                className={cn(
                  'h-3.5 w-3.5 transition-colors',
                  sortOrder !== 'newest-update' ? 'text-[#615fff]' : ''
                )}
              />
            </button>
          </div>

          {/* Topic chips filter */}
          <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-none bg-muted/10">
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={cn(
                'px-2.5 py-0.5 rounded-full text-[11px] font-mono whitespace-nowrap transition-all shrink-0',
                selectedTopic === 'all'
                  ? 'bg-foreground text-background font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              )}
            >
              All Topics
            </button>
            {allTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[11px] font-mono whitespace-nowrap transition-all shrink-0',
                  selectedTopic === topic
                    ? 'bg-[#615fff]/15 text-[#615fff] font-medium border border-[#615fff]/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* =================================================================
            3. ARTICLES CMS TABLE
            ================================================================= */}
        <div className="rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e7e5e4] dark:border-[#292524] bg-muted/20">
                  <th className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Article Title
                  </th>
                  <th
                    onClick={() =>
                      setSortOrder((prev) =>
                        prev === 'newest-update' ? 'oldest-update' : 'newest-update'
                      )
                    }
                    className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground w-48 cursor-pointer select-none hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Updated</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </th>
                  <th className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground text-right w-44">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e5e4] dark:divide-[#292524]">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-16 px-5 text-center space-y-3">
                      <div className="h-10 w-10 mx-auto rounded-full bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] flex items-center justify-center text-muted-foreground">
                        <Search className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">No articles found</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          {searchQuery || selectedTopic !== 'all' || activeTab !== 'all'
                            ? 'No posts matched your current search filters.'
                            : 'Your publication archive is empty. Begin by creating your first technical post.'}
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-center gap-3">
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

                    return (
                      <tr
                        key={art.id}
                        onClick={() => navigate({ to: '/blog/$id', params: { id: art.id } })}
                        className="group hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        {/* Article Info */}
                        <td className="py-4 px-5 align-middle">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm sm:text-[15px] font-medium text-foreground group-hover:text-[#615fff] transition-colors leading-snug line-clamp-1">
                                {art.title}
                              </span>

                              {isDraft && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#d97757]/10 text-[#d97757] border border-[#d97757]/30 shrink-0">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#d97757]" />
                                  Draft
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-muted-foreground">
                              <span>/{art.slug}</span>
                              {art.topics.slice(0, 3).map((topic) => (
                                <span
                                  key={topic}
                                  className="px-1.5 py-0.2 rounded text-[10px] bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] text-muted-foreground"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 align-middle whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="text-xs font-mono font-medium text-foreground">
                              {formatUpdateDate(art.updatedAt).date}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              {art.readingTime}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td
                          className="py-4 px-5 align-middle text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to="/blog/$id"
                              params={{ id: art.id }}
                              className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                              title="Read Article"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span className="hidden sm:inline">Read</span>
                            </Link>

                            <Link
                              to="/blog/$id/edit"
                              params={{ id: art.id }}
                              className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded border border-[#e7e5e4] dark:border-[#292524] text-foreground hover:border-[#615fff] hover:text-[#615fff] bg-card transition-colors"
                              title="Edit Article"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </Link>

                            <DeleteConfirmPopover
                              onConfirm={() => handleDeleteArticle(art.id)}
                              title="Delete this article?"
                              description={`"${art.title.slice(0, 36)}..." will be permanently removed.`}
                              align="right"
                            >
                              <button
                                type="button"
                                className="p-1.5 text-muted-foreground hover:text-[#ff0000] hover:bg-[#ff0000]/5 rounded transition-colors"
                                title="Delete article"
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
            4. WORKSPACE FOOTER
            ================================================================= */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground border-t border-[#e7e5e4] dark:border-[#292524]">
          <div className="flex items-center gap-3">
            <span>✦ Git-backed Markdown storage</span>
            <span>·</span>
            <span>Interactive knowledge graph enabled</span>
          </div>

          <Link to="/new" className="text-[#615fff] hover:underline inline-flex items-center gap-1">
            <span>Draft a new article</span>
            <span>→</span>
          </Link>
        </div>
      </main>

      {/* Intelligence Modals */}
      <KnowledgeGraphModal
        isOpen={graphOpen}
        onClose={() => setGraphOpen(false)}
        articles={articles}
        onSelectTopic={(t) => setSelectedTopic(t)}
      />

      <ContentGapModal
        isOpen={gapOpen}
        onClose={() => setGapOpen(false)}
        articles={articles}
      />

      <PublicationChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        articles={articles}
      />

      <ImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
      />

      <Footer />
    </div>
  )
}
