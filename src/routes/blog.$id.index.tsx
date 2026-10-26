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
  Eye,
  Layers,
  Trash2,
  Calendar,
  UserCheck,
  List,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import { HealthGauge } from '#/components/ui/health-gauge'
import { DiffViewer } from '#/components/ui/diff-viewer'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
import { ArticleEngagement } from '#/components/article-engagement'
import { SocialShareModal } from '#/components/social-share-modal'
import { BlogStore, formatUpdateDate } from '#/lib/blog-store'
import type { Article } from '#/lib/blog-store'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
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
  const incrementViews = useMutation(api.blogs.incrementViews)

  const [copiedCodeIndex, setCopiedCodeIndex] = React.useState<number | null>(null)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [isFollowing, setIsFollowing] = React.useState(false)
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [activeHeadingId, setActiveHeadingId] = React.useState<string>('')

  // Track scroll progress for reading bar
  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Increment views once on load
  const hasIncrementedRef = React.useRef(false)
  React.useEffect(() => {
    if (convexArticle && !hasIncrementedRef.current) {
      hasIncrementedRef.current = true
      incrementViews({ id: convexArticle._id }).catch(() => {})
    }
  }, [convexArticle, incrementViews])

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
        topics: a.topics || ['Engineering'],
      }))
      const seo = BlogStore.computeSeo(title, content)
      const aeo = BlogStore.computeAeo(title, content)
      const internalLinks = BlogStore.computeInternalLinks(art._id, content, all as any)
      const computedHealth = BlogStore.computeHealth(title, content, topics, false)
      const healthMetrics = computedHealth.metrics
      const healthScore = art.healthScore || computedHealth.overall

      return {
        id: art._id,
        slug: art.slug,
        title: art.title,
        excerpt: art.excerpt || '',
        content: art.content || '',
        publishedAt: art.publishedAt
          ? typeof art.publishedAt === 'number'
            ? new Date(art.publishedAt).toISOString()
            : String(art.publishedAt)
          : 'Draft',
        updatedAt: art.updatedAt
          ? typeof art.updatedAt === 'number'
            ? new Date(art.updatedAt).toISOString()
            : String(art.updatedAt)
          : new Date().toISOString(),
        readingTime: art.readingTime || '5 min read',
        gitBranch: art.gitBranch || 'main',
        commitHash: 'main',
        status: art.status as any,
        topics,
        entities: ['TypeScript', 'Convex', 'Node.js', 'React'],
        healthScore,
        healthMetrics,
        isStale: false,
        proposedDiffs: [],
        seo,
        aeo,
        internalLinks,
        revisionHistory: [
          {
            id: 'rev-1',
            timestamp: 'Initial Publication',
            summary: 'Published technical architectural specification',
            author: (art as any).author || 'Staff Engineer',
          },
        ],
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
        topics: a.topics || ['Engineering'],
        entities: ['TypeScript'],
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

  // Extract Table of Contents from markdown headings
  const tableOfContents = React.useMemo(() => {
    if (!article?.content) return []
    const headings: { id: string; text: string; level: number }[] = []
    const lines = article.content.split('\n')

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const headingId = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        headings.push({ id: headingId, text, level })
      }
    })

    return headings
  }, [article?.content])

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-[1240px] mx-auto px-6 py-20 text-center space-y-4">
          <p className="text-lg text-muted-foreground">Article not found.</p>
          <Link to="/blogs">
            <Button variant="default">Back to Publications</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Render markdown with rich typography, code highlighting & copy buttons
  const renderFormattedContent = (content: string) => {
    const lines = (typeof content === 'string' ? content : '').split('\n')
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
          codeLanguage = line.slice(3).trim() || 'typescript'
          codeBuffer = []
        } else {
          inCodeBlock = false
          const currentCode = codeBuffer.join('\n')
          const currentIndex = blockIndex++

          elements.push(
            <div
              key={`code-${index}`}
              className="my-6 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] overflow-hidden text-xs shadow-xs"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#e7e5e4] dark:border-[#292524] bg-card font-mono text-[11px] text-muted-foreground">
                <span className="uppercase font-semibold tracking-wider text-[#615fff]">
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
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 font-mono text-[13px] leading-relaxed overflow-x-auto text-[#292524] dark:text-[#fafaf9]">
                <code>{currentCode}</code>
              </pre>
            </div>
          )
        }
        return
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        return
      }

      // Title line #
      if (line.startsWith('# ')) {
        return
      }

      // H2 Headings
      if (line.startsWith('## ')) {
        const hText = line.replace('## ', '')
        const headingId = hText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        elements.push(
          <h2
            key={`h2-${index}`}
            id={headingId}
            className="text-2xl sm:text-[28px] font-bold text-foreground mt-10 mb-4 tracking-tight border-b border-[#e7e5e4] dark:border-[#292524] pb-2 font-display scroll-mt-20"
          >
            {hText}
          </h2>
        )
        return
      }

      // H3 Headings
      if (line.startsWith('### ')) {
        const hText = line.replace('### ', '')
        const headingId = hText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        elements.push(
          <h3
            key={`h3-${index}`}
            id={headingId}
            className="text-lg sm:text-xl font-semibold text-foreground mt-6 mb-2 tracking-tight scroll-mt-20"
          >
            {hText}
          </h3>
        )
        return
      }

      // Blockquotes / Callouts
      if (line.startsWith('> ')) {
        const quoteText = line.replace('> ', '')
        const isWarning =
          quoteText.includes('⚠️') || quoteText.toLowerCase().includes('warning')

        elements.push(
          <blockquote
            key={`quote-${index}`}
            className={cn(
              'my-4 p-4 rounded-xl border text-sm leading-relaxed',
              isWarning
                ? 'border-[#d97757]/40 bg-[#d97757]/10 text-foreground'
                : 'border-[#615fff]/30 bg-[#615fff]/5 text-foreground'
            )}
          >
            {quoteText}
          </blockquote>
        )
        return
      }

      // Divider
      if (line.trim() === '---') {
        elements.push(
          <hr
            key={`hr-${index}`}
            className="my-8 border-[#e7e5e4] dark:border-[#292524]"
          />
        )
        return
      }

      // Bullet lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li
            key={`li-${index}`}
            className="ml-5 list-disc text-sm sm:text-base text-foreground/90 leading-relaxed my-1"
          >
            {line.substring(2)}
          </li>
        )
        return
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li
            key={`oli-${index}`}
            className="ml-5 list-decimal text-sm sm:text-base text-foreground/90 leading-relaxed my-1"
          >
            {line.replace(/^\d+\.\s/, '')}
          </li>
        )
        return
      }

      // Standard paragraphs
      if (line.trim().length > 0) {
        elements.push(
          <p
            key={`p-${index}`}
            className="text-base sm:text-[17px] text-foreground/90 leading-[1.7] my-4 font-sans"
          >
            {line}
          </p>
        )
      }
    })

    return elements
  }

  const authorName = (convexArticle as any)?.author || 'Staff Engineer'
  const coverImage = (convexArticle as any)?.coverImage

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Reading Progress Bar */}
      <div
        style={{ width: `${scrollProgress}%` }}
        className="fixed top-0 left-0 h-[2.5px] bg-[#615fff] z-50 transition-all duration-75"
      />

      <Navbar />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* =================================================================
            1. BREADCRUMBS & TOP ACTIONS
            ================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5e4] dark:border-[#292524] pb-4">
          <Link
            to="/blogs"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Publications</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareModalOpen(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#e7e5e4] dark:border-[#292524] text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-mono transition-colors"
              title="Share article or export"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share & Export</span>
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
                className="text-xs px-2.5 py-1.5 rounded-lg border border-[#e7e5e4] dark:border-[#292524] text-muted-foreground hover:text-[#ff0000] hover:border-[#ff0000]/40 flex items-center gap-1.5 font-mono transition-colors"
                title="Delete Article"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </DeleteConfirmPopover>

            <Link to="/blog/$id/edit" params={{ id: article.id }}>
              <Button variant="default" size="sm" className="font-mono text-xs">
                <Edit3 className="h-3 w-3 mr-1.5" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* =================================================================
            2. TWO-COLUMN LAYOUT: ARTICLE BODY & INTELLIGENCE SIDEBAR
            ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Article Body (8 cols) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Optional Cover Banner */}
            {coverImage && (
              <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-[#e7e5e4] dark:border-[#292524]">
                <img
                  src={coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header & Metadata */}
            <div className="space-y-4">
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

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-foreground leading-[1.18]">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-sans">
                  {article.excerpt}
                </p>
              )}

              {/* Author & Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground border-y border-[#e7e5e4] dark:border-[#292524] py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#615fff]/10 flex items-center justify-center text-[#615fff] font-mono font-semibold text-xs">
                    {authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-foreground block">
                      {authorName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Staff Software Engineer
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {(convexArticle as any)?.views || 1} views
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatUpdateDate(article.updatedAt).date}
                  </span>
                </div>
              </div>
            </div>

            {/* Table of Contents for Long-form Articles */}
            {tableOfContents.length > 2 && (
              <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  <List className="h-3.5 w-3.5 text-[#615fff]" />
                  <span>Table of Contents</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        'block text-muted-foreground hover:text-[#615fff] transition-colors truncate',
                        item.level === 3 ? 'pl-4' : ''
                      )}
                    >
                      › {item.text}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Rendered Article Content */}
            <div className="prose prose-stone dark:prose-invert max-w-none">
              {renderFormattedContent(article.content)}
            </div>

            {/* Community Engagement: Claps, Reactions, and Comments */}
            <ArticleEngagement
              blogId={article.id}
              title={article.title}
              slug={article.slug}
              author={authorName}
            />

            {/* Related Articles in Topic Cluster */}
            <div className="pt-8 border-t border-[#e7e5e4] dark:border-[#292524] space-y-4">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                Connected Publication Articles
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
                      className="group p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card hover:border-[#615fff] transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                        <span>TOPIC CLUSTER</span>
                        <span className="text-[#5ea500]">
                          Health {rel.healthScore}%
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold group-hover:text-[#615fff] transition-colors line-clamp-1">
                        {rel.title}
                      </h5>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </article>

          {/* Intelligence Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Article Health Vector */}
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

            {/* AEO Engine Readiness Box */}
            <Card className="border-[#e7e5e4] dark:border-[#292524] bg-card">
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
                  <span className="font-mono text-[11px] text-muted-foreground uppercase block mb-1">
                    Target Search Query:
                  </span>
                  <p className="font-medium text-foreground bg-muted/30 p-2.5 rounded-lg border border-[#e7e5e4] dark:border-[#292524]">
                    "{article.aeo.primaryQuestion}"
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-muted-foreground uppercase block mb-1">
                    Direct Extracted Definition:
                  </span>
                  <p className="text-muted-foreground italic border-l-2 border-[#615fff] pl-3 py-1">
                    "{article.aeo.directAnswerSnippet}"
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#e7e5e4] dark:border-[#292524]">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase block">
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

            {/* SEO Architecture Box */}
            <Card className="border-[#e7e5e4] dark:border-[#292524] bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-foreground" />
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
                  <span className="font-mono text-[11px] text-muted-foreground uppercase block mb-0.5">
                    Search Intent:
                  </span>
                  <span className="font-medium text-foreground">
                    {article.seo.searchIntent}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-muted-foreground uppercase block mb-0.5">
                    Target Keyword:
                  </span>
                  <code className="text-[11px] font-mono bg-muted/40 px-2 py-0.5 rounded border border-[#e7e5e4] dark:border-[#292524]">
                    {article.seo.primaryKeyword}
                  </code>
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="rounded-lg border border-[#e7e5e4] dark:border-[#292524] bg-muted/30 p-3 space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    SERP Preview
                  </span>
                  <div className="text-[11px] text-[#007ebb] hover:underline font-medium truncate">
                    {article.seo.title}
                  </div>
                  <div className="text-[10px] text-[#5ea500] font-mono truncate">
                    https://blogger.dev/blog/{article.slug}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {article.seo.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card className="border-[#e7e5e4] dark:border-[#292524] bg-card">
              <CardContent className="pt-5 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#615fff]/15 flex items-center justify-center text-[#615fff] font-mono font-bold text-sm">
                    {authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm">
                      {authorName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      Technical Author
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Engineering deep-dives into reactive systems, distributed state, and AI agent architectures.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="w-full text-xs font-mono"
                >
                  {isFollowing ? 'Following ✓' : '+ Follow Author'}
                </Button>
              </CardContent>
            </Card>

            {/* Custom Editor CTA */}
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

      {/* Social Share & Export Modal */}
      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={article.title}
        slug={article.slug}
        content={article.content}
        author={authorName}
      />

      <Footer />
    </div>
  )
}
