import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Edit3,
  Share2,
  Check,
  Copy,
  Trash2,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { DeleteConfirmPopover } from '#/components/ui/delete-confirm-popover'
import { ArticleEngagement } from '#/components/article-engagement'
import { SocialShareModal } from '#/components/social-share-modal'
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
  const removeBlog = useMutation(api.blogs.remove)
  const incrementViews = useMutation(api.blogs.incrementViews)

  const [copiedCodeIndex, setCopiedCodeIndex] = React.useState<number | null>(null)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [scrollProgress, setScrollProgress] = React.useState(0)

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
      const topics = art.topics || ['Writing']
      const content = art.content || ''
      const title = art.title || 'Untitled'
      return {
        id: art._id,
        slug: art.slug,
        title,
        excerpt: art.excerpt || '',
        content,
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
        author: art.author || 'Author',
        claps: art.claps || 0,
        views: art.views || 0,
        coverImage: art.coverImage,
        healthScore: 100,
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
        internalLinks: { outbound: [], suggestions: [] },
      }
    }
    return BlogStore.getArticleById(id) || null
  }, [convexArticle, id])

  // Extract table of contents headings
  const tableOfContents = React.useMemo(() => {
    if (!article?.content) return []
    const lines = article.content.split('\n')
    const headings: Array<{ id: string; text: string; level: number }> = []

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim()
        const headingId = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        headings.push({ id: headingId, text, level: 2 })
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim()
        const headingId = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        headings.push({ id: headingId, text, level: 3 })
      }
    })
    return headings
  }, [article?.content])

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-24 text-center space-y-4">
          <h1 className="font-serif text-3xl font-medium">Article not found</h1>
          <p className="text-sm text-muted-foreground">
            The article you are looking for does not exist or was removed.
          </p>
          <Link to="/blogs">
            <Button variant="outline" size="sm">
              Return to Articles
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // Parse markdown into clean elements
  const renderFormattedContent = (rawMarkdown: string) => {
    const lines = rawMarkdown.split('\n')
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeBuffer: string[] = []
    let codeLanguage = 'typescript'

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLanguage = line.replace('```', '').trim() || 'code'
          codeBuffer = []
        } else {
          inCodeBlock = false
          const currentCode = codeBuffer.join('\n')
          const currentIndex = index
          elements.push(
            <div
              key={`code-${index}`}
              className="my-6 rounded-lg border border-border bg-muted/30 overflow-hidden font-mono"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card text-xs text-muted-foreground">
                <span className="uppercase font-semibold tracking-wider text-xs">
                  {codeLanguage}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentCode)
                    setCopiedCodeIndex(currentIndex)
                    setTimeout(() => setCopiedCodeIndex(null), 1800)
                  }}
                  className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  {copiedCodeIndex === currentIndex ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs leading-relaxed overflow-x-auto text-foreground">
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

      if (line.startsWith('# ')) {
        return
      }

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
            className="font-serif text-2xl sm:text-3xl font-medium text-foreground mt-12 mb-4 tracking-tight scroll-mt-20"
          >
            {hText}
          </h2>
        )
        return
      }

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
            className="font-serif text-lg sm:text-xl font-medium text-foreground mt-8 mb-3 tracking-tight scroll-mt-20"
          >
            {hText}
          </h3>
        )
        return
      }

      if (line.startsWith('> ')) {
        const quoteText = line.replace('> ', '')
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="my-6 pl-4 border-l-2 border-foreground italic text-muted-foreground text-base leading-relaxed"
          >
            {quoteText}
          </blockquote>
        )
        return
      }

      if (line.trim() === '---') {
        elements.push(
          <hr key={`hr-${index}`} className="my-10 border-border" />
        )
        return
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li
            key={`li-${index}`}
            className="ml-6 list-disc text-base text-foreground leading-relaxed my-1.5"
          >
            {line.substring(2)}
          </li>
        )
        return
      }

      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li
            key={`oli-${index}`}
            className="ml-6 list-decimal text-base text-foreground leading-relaxed my-1.5"
          >
            {line.replace(/^\d+\.\s/, '')}
          </li>
        )
        return
      }

      if (line.trim().length > 0) {
        elements.push(
          <p
            key={`p-${index}`}
            className="text-base sm:text-[17px] text-foreground leading-relaxed my-5 font-sans"
          >
            {line}
          </p>
        )
      }
    })

    return elements
  }

  const authorName = (convexArticle as any)?.author || 'Author'
  const coverImage = (convexArticle as any)?.coverImage

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <div
        style={{ width: `${scrollProgress}%` }}
        className="fixed top-0 left-0 h-[2px] bg-foreground z-50 transition-all duration-75"
      />

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Articles</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareModalOpen(true)}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>

            <Link to="/blog/$id/edit" params={{ id: article.id }}>
              <Button size="sm" className="text-xs h-8 px-3 gap-1.5 font-sans">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            </Link>

            <DeleteConfirmPopover
              onConfirm={async () => {
                if ((convexArticle as any)?._id) {
                  await removeBlog({ id: (convexArticle as any)._id })
                }
                BlogStore.deleteArticle(article.id)
                navigate({ to: '/blogs' })
              }}
              title="Delete this article?"
              description="This will permanently delete this post."
              align="right"
            >
              <Button variant="ghost" size="sm" className="text-xs h-8 px-2 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </DeleteConfirmPopover>
          </div>
        </div>

        {/* Layout: Main Article (with optional TOC sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <article className={cn('space-y-8', tableOfContents.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12 max-w-3xl mx-auto')}>
            {coverImage && (
              <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-border">
                <img
                  src={coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                <span>{authorName}</span>
                <span>·</span>
                <span>{formatUpdateDate(article.updatedAt).date}</span>
                <span>·</span>
                <span>{article.readingTime}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground leading-[1.15]">
                {article.title}
              </h1>

              {article.topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {article.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rendered Markdown Body */}
            <div className="pt-4 border-t border-border">
              {renderFormattedContent(article.content)}
            </div>

            {/* Engagement: Claps and Comments */}
            <div className="pt-8 border-t border-border">
              <ArticleEngagement
                blogId={article.id}
                title={article.title}
                slug={article.slug}
                author={authorName}
              />
            </div>
          </article>

          {/* Sticky Table of Contents Sidebar */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4 pl-4 border-l border-border">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block">
                Contents
              </span>
              <nav className="space-y-2 text-sm">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      'block text-muted-foreground hover:text-foreground transition-colors truncate',
                      item.level === 3 ? 'pl-3 text-xs' : 'font-medium'
                    )}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </main>

      <Footer />

      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={article.title}
        slug={article.slug}
        content={article.content}
        author={authorName}
      />
    </div>
  )
}
