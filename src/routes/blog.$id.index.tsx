import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Edit3,
  Download,
  Share2,
  GitBranch,
  GitCommit,
  Clock,
  Sparkles,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  FileText,
  Search,
  Cpu,
  Layers,
  Trash2,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import { HealthGauge } from '#/components/ui/health-gauge'
import { DiffViewer } from '#/components/ui/diff-viewer'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
import { BlogStore, formatUpdateDate } from '#/lib/blog-store'
import type { Article } from '#/lib/blog-store'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/blog/$id/')({
  component: BlogReaderPage,
})

function BlogReaderPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const convexArticle = useQuery(api.blogs.getByIdOrSlug, { idOrSlug: id })
  const convexArticles = useQuery(api.blogs.list, {})
  const removeBlog = useMutation(api.blogs.remove)

  const [copiedLink, setCopiedLink] = React.useState(false)
  const [copiedCodeIndex, setCopiedCodeIndex] = React.useState<number | null>(null)

  const article = React.useMemo<Article | null>(() => {
    if (convexArticle) {
      const art = convexArticle
      const topics = art.topics || ['Engineering']
      const content = art.content || ''
      const title = art.title || 'Untitled'
      const all = (convexArticles || []).map((a) => ({
        id: a._id,
        title: a.title,
        slug: a.slug,
      }))
      const seo = BlogStore.computeSeo(title, content)
      const aeo = BlogStore.computeAeo(title, content)
      const internalLinks = BlogStore.computeInternalLinks(art._id, content, all as any)
      const healthMetrics = BlogStore.computeHealth(content, seo, aeo, internalLinks.outbound.length)
      const healthScore =
        art.healthScore ||
        Math.round(
          (healthMetrics.content +
            healthMetrics.seo +
            healthMetrics.aeo +
            healthMetrics.links +
            healthMetrics.freshness +
            healthMetrics.technical) /
            6,
        )

      return {
        id: art._id,
        slug: art.slug,
        title: art.title,
        excerpt: art.excerpt || '',
        content: art.content,
        publishedAt: art.publishedAt ? formatUpdateDate(art.publishedAt) : 'Draft',
        updatedAt: art.updatedAt ? formatUpdateDate(art.updatedAt) : 'Recently',
        readingTime: art.readingTime || '5 min read',
        gitBranch: art.gitBranch || 'main',
        commitHash: 'main',
        status: art.status as any,
        topics,
        healthScore,
        healthMetrics,
        isStale: false,
        proposedDiffs: [],
        seo,
        aeo,
        internalLinks,
        revisionHistory: [],
      }
    }
    return BlogStore.getArticleById(id) || null
  }, [convexArticle, convexArticles, id])

  const allArticles = React.useMemo<Article[]>(() => {
    if (convexArticles && convexArticles.length > 0) {
      return convexArticles.map((a) => ({
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
        topics: a.topics || ['Engineering'],
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
        seo: BlogStore.computeSeo(a.title, a.content),
        aeo: BlogStore.computeAeo(a.title, a.content),
        internalLinks: { outbound: [], suggestions: [] },
        revisionHistory: [],
      }))
    }
    return BlogStore.getArticles()
  }, [convexArticles])

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-[1240px] mx-auto px-6 py-20 text-center space-y-4">
          <p className="text-lg text-[#79716b]">Article not found.</p>
          <Link to="/blogs">
            <Button variant="default">Back to Publications</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const handleExportMarkdown = () => {
    const blob = new Blob([article.content], {
      type: 'text/markdown;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${article.slug || 'article'}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleAcceptDiff = (diffId: string) => {
    const updated = BlogStore.acceptDiff(article.id, diffId)
    if (updated) setArticle({ ...updated })
  }

  const handleRejectDiff = (diffId: string) => {
    const updated = BlogStore.rejectDiff(article.id, diffId)
    if (updated) setArticle({ ...updated })
  }

  // Render markdown with rich styling for headings, code blocks, callouts, and links
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeLanguage = ''
    let codeBuffer: string[] = []
    let blockIndex = 0

    lines.forEach((line, index) => {
      // Code block start or end
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim() || 'text'
          codeBuffer = []
        } else {
          inCodeBlock = false
          const currentCode = codeBuffer.join('\n')
          const currentIndex = blockIndex++

          elements.push(
            <div
              key={`code-${index}`}
              className="my-6 rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] overflow-hidden text-xs"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] font-mono text-[11px] text-[#79716b]">
                <span className="uppercase font-semibold tracking-wider">
                  {codeLanguage}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentCode)
                    setCopiedCodeIndex(currentIndex)
                    setTimeout(() => setCopiedCodeIndex(null), 1800)
                  }}
                  className="hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  {copiedCodeIndex === currentIndex ? (
                    <>
                      <Check className="h-3 w-3 text-[#5ea500]" />
                      <span className="text-[#5ea500]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 font-mono text-[13px] leading-relaxed overflow-x-auto text-[#292524] dark:text-[#fafaf9]">
                <code>{currentCode}</code>
              </pre>
            </div>,
          )
        }
        return
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        return
      }

      // Title line # (skip if already shown in header)
      if (line.startsWith('# ')) {
        return
      }

      // H2 Headings
      if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-2xl sm:text-[26px] font-bold text-[#292524] dark:text-[#fafaf9] mt-10 mb-4 tracking-tight border-b border-[#e7e5e4] dark:border-[#292524] pb-2 font-display"
          >
            {line.replace('## ', '')}
          </h2>,
        )
        return
      }

      // H3 Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-lg sm:text-xl font-semibold text-[#292524] dark:text-[#fafaf9] mt-6 mb-2 tracking-tight"
          >
            {line.replace('### ', '')}
          </h3>,
        )
        return
      }

      // Blockquotes / Callouts
      if (line.startsWith('> ')) {
        const quoteText = line.replace('> ', '')
        const isWarning =
          quoteText.includes('⚠️') ||
          quoteText.toLowerCase().includes('warning')
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className={cn(
              'my-4 p-4 rounded-[8px] border text-sm leading-relaxed',
              isWarning
                ? 'border-[#d97757]/40 bg-[#d97757]/10 text-[#292524] dark:text-[#fafaf9]'
                : 'border-[#615fff]/30 bg-[#615fff]/5 text-[#292524] dark:text-[#fafaf9]',
            )}
          >
            {quoteText}
          </blockquote>,
        )
        return
      }

      // Divider
      if (line.trim() === '---') {
        elements.push(
          <hr
            key={`hr-${index}`}
            className="my-8 border-[#e7e5e4] dark:border-[#292524]"
          />,
        )
        return
      }

      // Bullet lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li
            key={`li-${index}`}
            className="ml-5 list-disc text-sm sm:text-base text-[#292524] dark:text-[#e7e5e4] leading-relaxed my-1"
          >
            {line.substring(2)}
          </li>,
        )
        return
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li
            key={`oli-${index}`}
            className="ml-5 list-decimal text-sm sm:text-base text-[#292524] dark:text-[#e7e5e4] leading-relaxed my-1"
          >
            {line.replace(/^\d+\.\s/, '')}
          </li>,
        )
        return
      }

      // Standard paragraphs (with bold/links)
      if (line.trim().length > 0) {
        elements.push(
          <p
            key={`p-${index}`}
            className="text-base sm:text-[17px] text-[#292524] dark:text-[#d6d3d1] leading-[1.65] my-4 font-sans"
          >
            {line}
          </p>,
        )
      }
    })

    return elements
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 py-10 space-y-10">
        {/* =================================================================
            1. BREADCRUMBS & TOP ACTIONS
            ================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5e4] dark:border-[#292524] pb-4">
          <Link
            to="/blogs"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Publications</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="text-xs px-2.5 py-1.5 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:text-foreground flex items-center gap-1.5 font-mono transition-colors"
              title="Copy shareable link"
            >
              {copiedLink ? (
                <Check className="h-3 w-3 text-[#5ea500]" />
              ) : (
                <Share2 className="h-3 w-3" />
              )}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="text-xs px-2.5 py-1.5 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:text-foreground flex items-center gap-1.5 font-mono transition-colors"
              title="Export as plain Markdown (.md)"
            >
              <Download className="h-3 w-3" />
              <span>Export .md</span>
            </button>

            <DeleteConfirmPopover
              onConfirm={async () => {
                if ((convexArticle as any)?._id) {
                  await removeBlog({ id: (convexArticle as any)._id })
                }
                BlogStore.deleteArticle(article.id)
                navigate({ to: '/blogs' })
              }}
              title="Delete this article?"
              description="This will permanently delete this post from the database."
              align="right"
            >
              <button
                type="button"
                className="text-xs px-2.5 py-1.5 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] text-[#79716b] hover:text-[#ff0000] dark:text-[#a6a09b] dark:hover:text-[#ff3333] hover:border-[#ff0000]/40 flex items-center gap-1.5 font-mono transition-colors"
                title="Delete Article"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </DeleteConfirmPopover>

            <Link to="/blog/$id/edit" params={{ id: article.id }}>
              <Button variant="default" size="sm">
                <Edit3 className="h-3 w-3 mr-1.5" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* =================================================================
            2. TWO-COLUMN LAYOUT: ARTICLE CONTENT & INTELLIGENCE SIDEBAR
            ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Body (8 cols) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Header / Dek */}
            <div className="space-y-4">
              {/* Topics Pills — indigo-tinted, compact */}
              <div className="flex flex-wrap items-center gap-1.5">
                {article.topics.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono bg-[#615fff]/8 text-[#615fff] dark:bg-[#615fff]/15 dark:text-[#9b95ff] border border-[#615fff]/20 select-none"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Title (Cooper Display Serif) */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-[#292524] dark:text-[#fafaf9] leading-[1.18]">
                {article.title}
              </h1>

              {/* Subtitle / Excerpt */}
              <p className="text-[#79716b] dark:text-[#a6a09b] text-base sm:text-lg leading-relaxed font-sans">
                {article.excerpt}
              </p>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#79716b] dark:text-[#a6a09b] border-y border-[#e7e5e4] dark:border-[#292524] py-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readingTime}
                </span>
                <span>·</span>
                <span>Updated {formatUpdateDate(article.updatedAt).date}</span>
                <span>·</span>
                <span>Author: Sukhadia / Engineering</span>
                <span>·</span>
                <span className="text-[#615fff]">Git-tracked Markdown</span>
              </div>
            </div>

            {/* Stale Alert & Proposed Refresh Diff (AGENTS.md § 20) */}
            {article.isStale && (
              <div className="rounded-[16px] border border-[#d97757]/40 bg-[#d97757]/5 p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-[#d97757] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[#292524] dark:text-[#fafaf9]">
                      Content Refresh Sentinel: Stale Information Detected
                    </h3>
                    <p className="text-xs text-[#79716b] dark:text-[#a6a09b] leading-relaxed">
                      {article.staleReason ||
                        'External dependencies or API versions have changed.'}
                    </p>
                  </div>
                </div>

                {article.proposedDiffs.map((diff) => (
                  <div key={diff.id} className="pt-2">
                    <DiffViewer
                      title={diff.title}
                      description={diff.description}
                      diffs={diff.lines}
                      onAccept={() => handleAcceptDiff(diff.id)}
                      onReject={() => handleRejectDiff(diff.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Rendered Article Content */}
            <div className="prose prose-stone dark:prose-invert max-w-none">
              {renderFormattedContent(article.content)}
            </div>

            {/* Outbound & Inbound Connected Articles (AGENTS.md § 16) */}
            <div className="pt-8 border-t border-[#e7e5e4] dark:border-[#292524] space-y-4">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#292524] dark:text-[#fafaf9]">
                Connected Publication Graph
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allArticles
                  .filter((a) => a.id !== article.id)
                  .slice(0, 2)
                  .map((rel) => (
                    <Link
                      key={rel.id}
                      to="/blog/$id"
                      params={{ id: rel.id }}
                      className="group p-4 rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] hover:border-[#615fff] transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#79716b]">
                        <span>RELATED IN CLUSTER</span>
                        <span className="text-[#5ea500]">
                          Health {rel.healthScore}%
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold group-hover:text-[#615fff] transition-colors line-clamp-1">
                        {rel.title}
                      </h5>
                      <p className="text-[11px] text-[#79716b] line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Revision History (AGENTS.md § 28) */}
            <div className="pt-6 border-t border-[#e7e5e4] dark:border-[#292524] space-y-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#79716b]">
                Git Revision History
              </h4>
              <div className="space-y-2">
                {article.revisionHistory.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-center justify-between text-xs font-mono py-1.5 px-3 rounded-[6px] bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524]"
                  >
                    <div className="flex items-center gap-2 text-[#292524] dark:text-[#fafaf9]">
                      <GitCommit className="h-3.5 w-3.5 text-[#615fff]" />
                      <span>{rev.summary}</span>
                    </div>
                    <div className="text-[11px] text-[#79716b] flex items-center gap-2">
                      <span>{rev.author}</span>
                      <span>·</span>
                      <span>{rev.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Intelligence Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Article Health Gauge */}
            <HealthGauge
              overallScore={article.healthScore}
              statusText="Article Health Vector"
              metrics={[
                {
                  name: 'Content',
                  score: article.healthMetrics.content,
                  note: 'Word depth & structure',
                },
                {
                  name: 'SEO',
                  score: article.healthMetrics.seo,
                  note: 'Search intent match',
                },
                {
                  name: 'AEO',
                  score: article.healthMetrics.aeo,
                  note: 'Direct answer clarity',
                },
                {
                  name: 'Links',
                  score: article.healthMetrics.links,
                  note: 'Topic graph connectivity',
                },
                {
                  name: 'Freshness',
                  score: article.healthMetrics.freshness,
                  note: 'Current APIs & packages',
                },
                {
                  name: 'Technical',
                  score: article.healthMetrics.technical,
                  note: 'Executable code examples',
                },
              ]}
            />

            {/* AEO Engine Readiness Box (AGENTS.md § 14) */}
            <Card className="border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#615fff]" />
                    <CardTitle className="text-sm font-semibold">
                      AEO Answer Readiness
                    </CardTitle>
                  </div>
                  <Badge variant="indigo" size="sm" shape="pill">
                    {article.aeo.readinessScore}% Ready
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-mono text-[11px] text-[#79716b] uppercase block mb-1">
                    Target User Query:
                  </span>
                  <p className="font-medium text-[#292524] dark:text-[#fafaf9] bg-[#fafaf9] dark:bg-[#121110] p-2.5 rounded-[8px] border border-[#e7e5e4] dark:border-[#292524]">
                    "{article.aeo.primaryQuestion}"
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-[#79716b] uppercase block mb-1">
                    Direct Extracted Answer:
                  </span>
                  <p className="text-[#79716b] dark:text-[#a6a09b] italic border-l-2 border-[#615fff] pl-3 py-1">
                    "{article.aeo.directAnswerSnippet}"
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#e7e5e4] dark:border-[#292524]">
                  <span className="font-mono text-[11px] text-[#79716b] uppercase block">
                    LLM Answerability Checks:
                  </span>
                  <div className="flex items-center gap-1.5 text-[#5ea500] text-[11px]">
                    <Check className="h-3 w-3" />
                    <span>Definition placed upfront</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#5ea500] text-[11px]">
                    <Check className="h-3 w-3" />
                    <span>Structured code examples present</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Architecture Box (AGENTS.md § 13) */}
            <Card className="border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#292524] dark:text-[#fafaf9]" />
                    <CardTitle className="text-sm font-semibold">
                      SEO Architecture
                    </CardTitle>
                  </div>
                  <Badge variant="lichen" size="sm" shape="pill">
                    Score {article.seo.readabilityScore}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-mono text-[11px] text-[#79716b] uppercase block mb-0.5">
                    Search Intent:
                  </span>
                  <span className="font-medium text-[#292524] dark:text-[#fafaf9]">
                    {article.seo.searchIntent}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-[#79716b] uppercase block mb-0.5">
                    Target Keyword:
                  </span>
                  <code className="text-[11px] font-mono bg-[#fafaf9] dark:bg-[#121110] px-2 py-0.5 rounded border border-[#e7e5e4] dark:border-[#292524]">
                    {article.seo.primaryKeyword}
                  </code>
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] p-3 space-y-1">
                  <span className="text-[10px] font-mono text-[#79716b] block">
                    SERP Preview
                  </span>
                  <div className="text-[11px] text-[#007ebb] hover:underline font-medium truncate">
                    {article.seo.title}
                  </div>
                  <div className="text-[10px] text-[#5ea500] font-mono">
                    https://beelog.dev/blog/{article.slug}
                  </div>
                  <p className="text-[11px] text-[#79716b] line-clamp-2">
                    {article.seo.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action Button */}
            <div className="pt-2">
              <Link
                to="/blog/$id/edit"
                params={{ id: article.id }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-mono uppercase"
                >
                  Open in Custom Editor →
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
