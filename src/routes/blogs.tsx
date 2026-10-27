import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Search,
  Plus,
  Edit3,
  ExternalLink,
  ArrowUpDown,
  Upload,
  Download,
  Check,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
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

type FilterTab = 'all' | 'published' | 'draft'
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
        const topics = a.topics || ['Writing']
        return {
          id: a._id,
          slug: a.slug,
          title: a.title || 'Untitled',
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
          author: a.author || 'Author',
          claps: a.claps || 0,
          views: a.views || 0,
          coverImage: a.coverImage,
          healthScore: a.healthScore || 100,
          healthMetrics: {
            content: 90,
            seo: 90,
            aeo: 90,
            links: 90,
            freshness: 90,
            technical: 90,
          },
          aeoStatus: {
            hasDefinition: true,
            hasTechnicalExplanation: true,
            hasCodeExample: false,
            hasExternalReference: false,
            definitionPosition: 'early',
          },
          seoStatus: {
            titleValid: true,
            descriptionValid: true,
            headingHierarchy: true,
            slugValid: true,
          },
          internalLinks: [],
        }
      })
    }
    return BlogStore.getArticles()
  }, [convexArticles])

  // Extract all unique topics
  const allTopics = React.useMemo(() => {
    const topicSet = new Set<string>()
    articles.forEach((a) => {
      a.topics.forEach((t) => topicSet.add(t))
    })
    return Array.from(topicSet).sort()
  }, [articles])

  // Filtering & Sorting
  const filteredArticles = React.useMemo(() => {
    return articles
      .filter((art) => {
        if (activeTab === 'published' && art.status !== 'published') return false
        if (activeTab === 'draft' && art.status !== 'draft') return false
        if (selectedTopic !== 'all' && !art.topics.includes(selectedTopic)) return false

        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase()
          const matchTitle = art.title.toLowerCase().includes(q)
          const matchSlug = art.slug.toLowerCase().includes(q)
          const matchExcerpt = art.excerpt.toLowerCase().includes(q)
          const matchTopic = art.topics.some((t) => t.toLowerCase().includes(q))
          return matchTitle || matchSlug || matchExcerpt || matchTopic
        }

        return true
      })
      .sort((a, b) => {
        if (sortOrder === 'title') {
          return a.title.localeCompare(b.title)
        }
        const timeA = getArticleTimestamp(a.updatedAt)
        const timeB = getArticleTimestamp(b.updatedAt)
        return sortOrder === 'newest-update' ? timeB - timeA : timeA - timeB
      })
  }, [articles, activeTab, selectedTopic, searchQuery, sortOrder])

  const stats = React.useMemo(() => {
    return {
      total: articles.length,
      published: articles.filter((a) => a.status === 'published').length,
      drafts: articles.filter((a) => a.status === 'draft').length,
    }
  }, [articles])

  const handleDeleteArticle = async (id: string) => {
    try {
      await removeBlog({ id: id as any })
    } catch {
      // fallback
    }
    BlogStore.deleteArticle(id)
  }

  const handleExportAll = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      publication: 'beelog.dev',
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
    link.download = `articles-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 sm:py-16 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Articles & Essays
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
              Manuscript Archive
            </h1>
            <p className="text-sm text-muted-foreground">
              {stats.total} total articles · {stats.published} published
              {stats.drafts > 0 && ` · ${stats.drafts} drafts`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportOpen(true)}
              className="text-xs h-9 px-3 gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="text-xs h-9 px-3 gap-1.5"
            >
              {exported ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Download className="h-3.5 w-3.5" />}
              <span>{exported ? 'Exported' : 'Export'}</span>
            </Button>

            <Link to="/new">
              <Button size="sm" className="text-xs h-9 px-3.5 gap-1.5 font-sans">
                <Plus className="h-3.5 w-3.5" />
                <span>New Article</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Toolbar: Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 border-b border-border sm:border-b-0 pb-2 sm:pb-0">
            {(['all', 'published', 'draft'] as FilterTab[]).map((tab) => (
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
                {tab === 'all' ? `All (${stats.total})` : tab === 'published' ? `Published (${stats.published})` : `Drafts (${stats.drafts})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setSortOrder((prev) =>
                  prev === 'newest-update' ? 'oldest-update' : 'newest-update'
                )
              }
              title="Toggle sort order"
              className="p-2 rounded border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Topics Filter */}
        {allTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={cn(
                'px-2.5 py-1 rounded text-xs transition-colors',
                selectedTopic === 'all'
                  ? 'bg-foreground text-background font-medium'
                  : 'text-muted-foreground hover:text-foreground bg-muted/40'
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
                  'px-2.5 py-1 rounded text-xs transition-colors',
                  selectedTopic === topic
                    ? 'bg-foreground text-background font-medium'
                    : 'text-muted-foreground hover:text-foreground bg-muted/40'
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {/* Articles List / Table */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          {filteredArticles.length === 0 ? (
            <div className="py-20 px-6 text-center space-y-4">
              <p className="font-serif text-lg text-foreground">No articles found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery || selectedTopic !== 'all' || activeTab !== 'all'
                  ? 'No articles match your current search or topic filter.'
                  : 'Your archive is empty. Begin writing your first article.'}
              </p>
              <Link to="/new">
                <Button size="sm" className="text-xs font-sans">
                  Write Article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredArticles.map((art) => {
                const isDraft = art.status === 'draft'
                return (
                  <div
                    key={art.id}
                    onClick={() => navigate({ to: '/blog/$id', params: { id: art.id } })}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors cursor-pointer group"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2.5">
                        <h2 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                          {art.title}
                        </h2>
                        {isDraft && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Draft
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span>/{art.slug}</span>
                        <span>·</span>
                        <span>{formatUpdateDate(art.updatedAt).date}</span>
                        <span>·</span>
                        <span>{art.readingTime}</span>
                        {art.topics.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[11px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 self-end sm:self-center shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to="/blog/$id"
                        params={{ id: art.id }}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Read article"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <Link
                        to="/blog/$id/edit"
                        params={{ id: art.id }}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit article"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      <DeleteConfirmPopover
                        onConfirm={() => handleDeleteArticle(art.id)}
                        title="Delete this article?"
                        description={`"${art.title.slice(0, 36)}..." will be permanently removed.`}
                        align="right"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImportSuccess={() => {}}
      />
    </div>
  )
}
