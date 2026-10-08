import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Search,
  Plus,
  GitBranch,
  Sparkles,
  AlertTriangle,
  Network,
  LayoutGrid,
  Lightbulb,
  ArrowRight,
  Filter,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '#/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '#/components/ui/dialog'
import { DiffViewer } from '#/components/ui/diff-viewer'
import { BlogStore, type Article } from '#/lib/blog-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/blogs')({
  component: BlogsIndexPage,
})

function BlogsIndexPage() {
  const navigate = useNavigate()
  const [articles, setArticles] = React.useState<Article[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedTopic, setSelectedTopic] = React.useState<string>('All')
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'high' | 'stale' | 'draft'>('all')
  const [activeTab, setActiveTab] = React.useState<'grid' | 'graph' | 'gaps'>('grid')
  const [diffModalArticle, setDiffModalArticle] = React.useState<Article | null>(null)

  // Load articles from localStorage on mount
  React.useEffect(() => {
    setArticles(BlogStore.getArticles())
  }, [])

  // Collect all unique topics
  const allTopics = React.useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => a.topics.forEach((t) => set.add(t)))
    return ['All', ...Array.from(set)]
  }, [articles])

  // Filtered articles
  const filteredArticles = React.useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        searchQuery === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTopic = selectedTopic === 'All' || art.topics.includes(selectedTopic)

      let matchesStatus = true
      if (selectedStatus === 'high') matchesStatus = art.healthScore >= 85
      if (selectedStatus === 'stale') matchesStatus = art.isStale
      if (selectedStatus === 'draft') matchesStatus = art.status === 'draft'

      return matchesSearch && matchesTopic && matchesStatus
    })
  }, [articles, searchQuery, selectedTopic, selectedStatus])

  // Aggregate stats
  const stats = React.useMemo(() => {
    const total = articles.length
    const avgHealth = total > 0 ? Math.round(articles.reduce((acc, a) => acc + a.healthScore, 0) / total) : 0
    const staleCount = articles.filter((a) => a.isStale).length
    const entityCount = new Set(articles.flatMap((a) => a.entities)).size
    return { total, avgHealth, staleCount, entityCount }
  }, [articles])

  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      BlogStore.deleteArticle(id)
      setArticles(BlogStore.getArticles())
    }
  }

  const handleAcceptDiff = (diffId: string) => {
    if (!diffModalArticle) return
    const updated = BlogStore.acceptDiff(diffModalArticle.id, diffId)
    if (updated) {
      setDiffModalArticle(updated)
      setArticles(BlogStore.getArticles())
    }
  }

  const handleRejectDiff = (diffId: string) => {
    if (!diffModalArticle) return
    const updated = BlogStore.rejectDiff(diffModalArticle.id, diffId)
    if (updated) {
      setDiffModalArticle(updated)
      setArticles(BlogStore.getArticles())
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 py-12 space-y-12">
        {/* =================================================================
            1. HERO & WORKSPACE HEADER (Cooper Display Serif)
            ================================================================= */}
        <div className="space-y-4 max-w-3xl">
          <div className="eyebrow-tag">
            AGENT PUBLISHING WORKSPACE · PUBLICATION INTELLIGENCE
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-[#292524] dark:text-[#fafaf9] leading-[1.12]">
            Your technical publication, <span className="italic">understood</span>.
          </h1>
          <p className="text-[#79716b] dark:text-[#a6a09b] text-base sm:text-lg leading-relaxed">
            Treat your technical blog like a living codebase. Maintain internal links, evaluate AEO readiness, detect stale dependencies, and optimize search discoverability across every post.
          </p>
        </div>

        {/* =================================================================
            2. STATS BAR (design.md § Stats Bar)
            ================================================================= */}
        <section className="bg-white dark:bg-[#171514] border-y border-[#e7e5e4] dark:border-[#292524] -mx-6 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e7e5e4] dark:divide-[#292524]">
            <div className="py-6 px-4 text-center">
              <div className="font-mono text-2xl sm:text-3xl font-normal text-[#292524] dark:text-[#fafaf9] tabular-nums">
                {stats.total}
              </div>
              <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-mono mt-1">
                Articles Indexed
              </div>
            </div>

            <div className="py-6 px-4 text-center">
              <div className="font-mono text-2xl sm:text-3xl font-normal text-[#5ea500] tabular-nums">
                {stats.avgHealth}%
              </div>
              <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-mono mt-1">
                Avg Health Score
              </div>
            </div>

            <div className="py-6 px-4 text-center">
              <div className="font-mono text-2xl sm:text-3xl font-normal text-[#d97757] tabular-nums">
                {stats.staleCount}
              </div>
              <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-mono mt-1">
                Stale / Diff Pending
              </div>
            </div>

            <div className="py-6 px-4 text-center">
              <div className="font-mono text-2xl sm:text-3xl font-normal text-[#615fff] tabular-nums">
                {stats.entityCount}
              </div>
              <div className="text-[12px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider font-mono mt-1">
                Connected Entities
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. WORKSPACE VIEW SWITCHER & SEARCH
            ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e7e5e4] dark:border-[#292524] pb-5">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#fafaf9] dark:bg-[#121110] p-1 rounded-[10px] border border-[#e7e5e4] dark:border-[#292524] w-fit">
            <button
              onClick={() => setActiveTab('grid')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold uppercase tracking-[0.04em] transition-all',
                activeTab === 'grid'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm'
                  : 'text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9]',
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Articles ({filteredArticles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold uppercase tracking-[0.04em] transition-all',
                activeTab === 'graph'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm'
                  : 'text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9]',
              )}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Knowledge Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('gaps')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold uppercase tracking-[0.04em] transition-all',
                activeTab === 'gaps'
                  ? 'bg-white dark:bg-[#1f1c1a] text-[#292524] dark:text-[#fafaf9] shadow-sm'
                  : 'text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9]',
              )}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Content Gaps</span>
            </button>
          </div>

          {/* Quick Write Button */}
          <Link to="/new">
            <Button
              variant="default"
              size="default"
              className="h-9 px-4 text-xs font-semibold uppercase tracking-[0.04em] shadow-none hover:bg-[#4f39f6]"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Article
            </Button>
          </Link>
        </div>

        {/* =================================================================
            VIEW 1: ARTICLES GRID
            ================================================================= */}
        {activeTab === 'grid' && (
          <div className="space-y-6">
            {/* Filter Bar: Search, Topics, and Status */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search input (Geist 16px, 12px radius, stone mist border) */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#79716b] dark:text-[#a6a09b]" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or entities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#171514] border border-[#e7e5e4] dark:border-[#292524] rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-[#292524] dark:text-[#fafaf9] placeholder:text-[#a6a09b] focus:outline-none focus:border-[#615fff] focus:ring-2 focus:ring-[#615fff]/15 transition-all"
                />
              </div>

              {/* Status pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-[8px] font-mono transition-colors border',
                    selectedStatus === 'all'
                      ? 'bg-[#292524] text-white border-[#292524] dark:bg-[#fafaf9] dark:text-[#0c0a09] dark:border-[#fafaf9]'
                      : 'border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:border-[#292524]',
                  )}
                >
                  All Status
                </button>
                <button
                  onClick={() => setSelectedStatus('high')}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-[8px] font-mono transition-colors border',
                    selectedStatus === 'high'
                      ? 'bg-[#5ea500] text-white border-[#5ea500]'
                      : 'border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:border-[#5ea500]',
                  )}
                >
                  Health &gt; 85%
                </button>
                <button
                  onClick={() => setSelectedStatus('stale')}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-[8px] font-mono transition-colors border',
                    selectedStatus === 'stale'
                      ? 'bg-[#d97757] text-white border-[#d97757]'
                      : 'border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:border-[#d97757]',
                  )}
                >
                  Stale Claims ({stats.staleCount})
                </button>
              </div>
            </div>

            {/* Topic Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#79716b] mr-2 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Topic:
              </span>
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={cn(
                    'text-[12px] px-2.5 py-1 rounded-[6px] transition-all font-mono',
                    selectedTopic === topic
                      ? 'bg-[#615fff] text-white'
                      : 'bg-white dark:bg-[#171514] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:border-[#292524] dark:hover:border-[#fafaf9]',
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Articles List / Cards */}
            {filteredArticles.length === 0 ? (
              <div className="rounded-[16px] border border-dashed border-[#e7e5e4] dark:border-[#292524] p-12 text-center space-y-4">
                <p className="text-sm text-[#79716b] dark:text-[#a6a09b]">
                  No articles matched your filter criteria.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedTopic('All')
                    setSelectedStatus('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((art) => {
                  const healthColor =
                    art.healthScore >= 85
                      ? 'text-[#5ea500] border-[#5ea500]/30 bg-[#5ea500]/5'
                      : art.healthScore >= 70
                        ? 'text-[#d97757] border-[#d97757]/30 bg-[#d97757]/5'
                        : 'text-[#ff0000] border-[#ff0000]/30 bg-[#ff0000]/5'

                  return (
                    <Card
                      key={art.id}
                      className="group flex flex-col justify-between border-[#e7e5e4] dark:border-[#292524] hover:border-[#292524] dark:hover:border-[#fafaf9] transition-all duration-200 cursor-pointer bg-white dark:bg-[#171514]"
                      onClick={() => navigate({ to: '/blog/$id', params: { id: art.id } })}
                    >
                      <CardHeader className="space-y-3 pb-3">
                        {/* Top row: Git info & Health gauge */}
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b]">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              {art.gitBranch}
                            </span>
                            <span>·</span>
                            <span>{art.publishedAt}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full font-mono text-[11px] font-bold border',
                                healthColor,
                              )}
                            >
                              Health {art.healthScore}%
                            </span>
                            {art.proposedDiffs.some((d) => d.status === 'pending') && (
                              <span className="px-2 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#615fff]/10 text-[#615fff] border border-[#615fff]/30">
                                AI Diff
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Excerpt */}
                        <div>
                          <CardTitle className="text-lg font-semibold group-hover:text-[#615fff] transition-colors leading-snug">
                            {art.title}
                          </CardTitle>
                          <CardDescription className="text-xs text-[#79716b] dark:text-[#a6a09b] mt-1.5 line-clamp-2 leading-relaxed">
                            {art.excerpt}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 pb-4">
                        {/* Topics */}
                        <div className="flex flex-wrap gap-1.5">
                          {art.topics.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-[6px] bg-[#fafaf9] dark:bg-[#201d1b] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] dark:text-[#a6a09b]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Stale Alert if applicable */}
                        {art.isStale && (
                          <div
                            className="rounded-[8px] border border-[#d97757]/40 bg-[#d97757]/10 p-2.5 text-[11px] text-[#79716b] dark:text-[#a6a09b] flex items-start gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-[#d97757] shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-semibold text-[#292524] dark:text-[#fafaf9]">
                                Stale Content:
                              </span>{' '}
                              {art.staleReason}
                              {art.proposedDiffs.some((d) => d.status === 'pending') && (
                                <button
                                  onClick={() => setDiffModalArticle(art)}
                                  className="block text-[#615fff] font-medium hover:underline mt-1"
                                >
                                  Review Proposed Refresh Diff →
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter
                        className="border-t border-[#e7e5e4] dark:border-[#292524] pt-3 flex items-center justify-between text-xs font-mono text-[#79716b]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{art.readingTime}</span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteArticle(art.id, e)}
                            title="Delete article"
                            className="p-1 text-[#79716b] hover:text-[#ff0000] transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          <Link
                            to="/blog/$id/edit"
                            params={{ id: art.id }}
                            className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] hover:border-[#292524] dark:hover:border-[#fafaf9] text-[#292524] dark:text-[#fafaf9] transition-colors"
                          >
                            Edit Post
                          </Link>

                          <Link
                            to="/blog/$id"
                            params={{ id: art.id }}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-[6px] bg-[#615fff] text-white hover:bg-[#4f39f6] transition-colors"
                          >
                            <span>Read</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* =================================================================
            VIEW 2: KNOWLEDGE GRAPH VISUALIZER (AGENTS.md § 15)
            ================================================================= */}
        {activeTab === 'graph' && (
          <div className="space-y-6">
            <div className="rounded-[16px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="font-display text-2xl text-[#292524] dark:text-[#fafaf9]">
                  Publication Knowledge Graph
                </h3>
                <p className="text-sm text-[#79716b] dark:text-[#a6a09b]">
                  Visualizing conceptual dependencies, internal links, and topic clusters across your blog repository.
                </p>
              </div>

              {/* Interactive Visual Graph Canvas Representation */}
              <div className="relative rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#0c0a09] p-8 min-h-[380px] flex flex-col justify-between overflow-hidden">
                <div className="absolute top-3 right-3 text-[11px] font-mono text-[#79716b] bg-white dark:bg-[#171514] px-2.5 py-1 rounded border border-[#e7e5e4] dark:border-[#292524]">
                  Cluster Density: High · 4 Clusters · 8 Bidirectional Edges
                </div>

                {/* Graph Nodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {/* Cluster 1: AI Agents & MCP */}
                  <div className="rounded-[12px] border border-[#615fff]/30 bg-white dark:bg-[#171514] p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#615fff] uppercase">
                        Cluster: AI Agents & MCP
                      </span>
                      <span className="text-[10px] font-mono text-[#79716b]">Hub Node</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <Link
                        to="/blog/$id"
                        params={{ id: 'mcp-server-typescript' }}
                        className="block font-medium hover:text-[#615fff] transition-colors text-[#292524] dark:text-[#fafaf9]"
                      >
                        • Building an MCP Server with TypeScript
                      </Link>
                      <p className="text-[11px] text-[#79716b]">
                        Links to: Vector DBs, RAG Security
                      </p>
                    </div>
                  </div>

                  {/* Cluster 2: Vector DB & Retrieval */}
                  <div className="rounded-[12px] border border-[#d97757]/30 bg-white dark:bg-[#171514] p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#d97757] uppercase">
                        Cluster: Vector Databases & RAG
                      </span>
                      <span className="text-[10px] font-mono text-[#d97757]">Needs Refresh</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <Link
                        to="/blog/$id"
                        params={{ id: 'vector-databases-rag' }}
                        className="block font-medium hover:text-[#d97757] transition-colors text-[#292524] dark:text-[#fafaf9]"
                      >
                        • Understanding Vector Databases in RAG
                      </Link>
                      <p className="text-[11px] text-[#79716b]">
                        Links to: RAG Security, MCP Server
                      </p>
                    </div>
                  </div>

                  {/* Cluster 3: Enterprise Security */}
                  <div className="rounded-[12px] border border-[#5ea500]/30 bg-white dark:bg-[#171514] p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#5ea500] uppercase">
                        Cluster: RAG Pipeline Security
                      </span>
                      <span className="text-[10px] font-mono text-[#5ea500]">Fresh (92%)</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <Link
                        to="/blog/$id"
                        params={{ id: 'production-security-rag' }}
                        className="block font-medium hover:text-[#5ea500] transition-colors text-[#292524] dark:text-[#fafaf9]"
                      >
                        • Production Security for RAG Applications
                      </Link>
                      <p className="text-[11px] text-[#79716b]">
                        Links to: Vector DBs, MCP Server
                      </p>
                    </div>
                  </div>

                  {/* Cluster 4: GitOps & Publishing */}
                  <div className="rounded-[12px] border border-[#22b8cd]/30 bg-white dark:bg-[#171514] p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#22b8cd] uppercase">
                        Cluster: Content Architecture & Git
                      </span>
                      <span className="text-[10px] font-mono text-[#79716b]">Foundational</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <Link
                        to="/blog/$id"
                        params={{ id: 'clean-internal-link-structures' }}
                        className="block font-medium hover:text-[#22b8cd] transition-colors text-[#292524] dark:text-[#fafaf9]"
                      >
                        • Designing Clean Internal Link Structures
                      </Link>
                      <Link
                        to="/blog/$id"
                        params={{ id: 'git-backed-markdown-publishing' }}
                        className="block font-medium hover:text-[#22b8cd] transition-colors text-[#292524] dark:text-[#fafaf9]"
                      >
                        • Migrating to Git-backed Markdown
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between text-xs text-[#79716b]">
                  <span className="font-mono">
                    ✦ Connected knowledge graphs prevent duplicate posts and guide strategic linking.
                  </span>
                  <Link
                    to="/new"
                    className="font-semibold text-[#615fff] hover:underline flex items-center gap-1"
                  >
                    <span>Add New Graph Node</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            VIEW 3: CONTENT GAP DISCOVERY (AGENTS.md § 17)
            ================================================================= */}
        {activeTab === 'gaps' && (
          <div className="space-y-6">
            <div className="rounded-[16px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="font-display text-2xl text-[#292524] dark:text-[#fafaf9]">
                  Content Gap Analysis & Next Post Recommendations
                </h3>
                <p className="text-sm text-[#79716b] dark:text-[#a6a09b]">
                  The Publication Analyst examined your {articles.length} posts and discovered high-leverage missing concepts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gap Card 1 */}
                <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo" size="sm" shape="pill">
                      High Impact Gap
                    </Badge>
                    <span className="text-[11px] font-mono text-[#79716b]">Estimated 8 min read</span>
                  </div>

                  <h4 className="text-base font-semibold text-[#292524] dark:text-[#fafaf9]">
                    Evaluating Persistent Agent Memory: Short-Term vs Long-Term Reflection
                  </h4>

                  <div className="text-xs text-[#79716b] dark:text-[#a6a09b] space-y-1.5 leading-relaxed">
                    <p>• You have 3 articles on MCP and RAG, but agent state and episodic memory are never defined.</p>
                    <p>• Connects directly to: <em>Building an MCP Server</em> and <em>Understanding Vector Databases</em>.</p>
                    <p>• Zero overlap with existing posts; establishes authority in autonomous workflow patterns.</p>
                  </div>

                  <Link
                    to="/new"
                    search={{
                      topic: 'Agent Memory',
                      title: 'Evaluating Persistent Agent Memory: Short-Term vs Long-Term Reflection',
                    } as any}
                  >
                    <Button variant="default" size="sm" className="w-full text-xs font-mono uppercase mt-2">
                      Start Drafting This Post →
                    </Button>
                  </Link>
                </div>

                {/* Gap Card 2 */}
                <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="terracotta" size="sm" shape="pill">
                      Maintenance Priority
                    </Badge>
                    <span className="text-[11px] font-mono text-[#79716b]">Update Candidate</span>
                  </div>

                  <h4 className="text-base font-semibold text-[#292524] dark:text-[#fafaf9]">
                    ChromaDB 0.5+ Async Client Migration & Vector Indexing
                  </h4>

                  <div className="text-xs text-[#79716b] dark:text-[#a6a09b] space-y-1.5 leading-relaxed">
                    <p>• Your existing post on Vector Databases references deprecated synchronous methods.</p>
                    <p>• Proposed diff is ready for review in the Refresh Sentinel.</p>
                    <p>• Accepting the update will elevate article health from 68% to 92%.</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-mono uppercase mt-2"
                    onClick={() => {
                      const stale = articles.find((a) => a.id === 'vector-databases-rag')
                      if (stale) setDiffModalArticle(stale)
                    }}
                  >
                    Review Pending Refresh Diff →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =================================================================
          DIFF REVIEW MODAL (DiffViewer Component)
          ================================================================= */}
      {diffModalArticle && diffModalArticle.proposedDiffs.length > 0 && (
        <Dialog open={!!diffModalArticle} onOpenChange={(open) => !open && setDiffModalArticle(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#615fff]" />
                Content Refresh Agent: Proposed Update
              </DialogTitle>
              <DialogDescription className="text-xs text-[#79716b]">
                Review the proposed code and API update for "{diffModalArticle.title}". Accept or reject to preserve your voice and technical accuracy.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              {diffModalArticle.proposedDiffs.map((diff) => (
                <DiffViewer
                  key={diff.id}
                  title={diff.title}
                  description={diff.description}
                  diffs={diff.lines}
                  onAccept={() => handleAcceptDiff(diff.id)}
                  onReject={() => handleRejectDiff(diff.id)}
                />
              ))}

              <div className="flex justify-end pt-2">
                <Button variant="ghost" size="sm" onClick={() => setDiffModalArticle(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  )
}
