import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Search,
  Plus,
  Edit3,
  ExternalLink,
  Trash2,
  FileText,
  RotateCcw,
} from 'lucide-react'

import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { BlogStore } from '#/lib/blog-store'
import type { Article } from '#/lib/blog-store'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/blogs')({
  component: BlogsIndexPage,
})

function BlogsIndexPage() {
  const navigate = useNavigate()
  const [articles, setArticles] = React.useState<Article[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')

  // Load articles from localStorage on mount
  React.useEffect(() => {
    setArticles(BlogStore.getArticles())
  }, [])

  // Filter articles by title
  const filteredArticles = React.useMemo(() => {
    if (!searchQuery.trim()) return articles
    const q = searchQuery.toLowerCase().trim()
    return articles.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.slug.toLowerCase().includes(q) ||
        art.topics.some((t) => t.toLowerCase().includes(q)),
    )
  }, [articles, searchQuery])

  const handleDeleteArticle = (
    id: string,
    title: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      BlogStore.deleteArticle(id)
      setArticles(BlogStore.getArticles())
    }
  }

  const handleResetData = () => {
    if (window.confirm('Reset articles to default demo data?')) {
      const seeded = BlogStore.resetToSeedData()
      setArticles(seeded)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-[1040px] w-full mx-auto px-6 py-12 space-y-8">
        {/* =================================================================
            1. MINIMAL CMS HEADER
            ================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e7e5e4] dark:border-[#292524] pb-6">
          <div className="space-y-1.5">
            <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#292524] dark:text-[#fafaf9]">
              Articles
            </h1>
            <p className="text-xs text-[#79716b] dark:text-[#a6a09b]">
              Manage and publish your blog posts. Stored in localStorage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="Reset seed posts"
              className="text-xs font-mono text-[#79716b] dark:text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Seed</span>
            </button>

            <Link to="/new">
              <Button
                variant="default"
                size="sm"
                className="h-8 px-3.5 text-xs font-semibold uppercase tracking-[0.04em] shadow-none hover:bg-[#4f39f6]"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* =================================================================
            2. MINIMAL SEARCH & COUNTER TOOLBAR
            ================================================================= */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#79716b] dark:text-[#a6a09b]" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#171514] border border-[#e7e5e4] dark:border-[#292524] rounded-[8px] pl-9 pr-3 py-1.5 text-xs text-[#292524] dark:text-[#fafaf9] placeholder:text-[#a6a09b] focus:outline-none focus:border-[#615fff] focus:ring-1 focus:ring-[#615fff] transition-all font-mono"
            />
          </div>

          <div className="text-xs font-mono text-[#79716b] dark:text-[#a6a09b]">
            {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? 'post' : 'posts'}
          </div>
        </div>

        {/* =================================================================
            3. CLEAN CMS TABLE (TITLE, DATE, ACTIONS)
            ================================================================= */}
        <div className="rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110]">
                  <th className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[#79716b] dark:text-[#a6a09b]">
                    Title
                  </th>
                  <th className="py-3 px-5 text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[#79716b] dark:text-[#a6a09b] w-36">
                    Date
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
                      className="py-12 px-5 text-center text-xs text-[#79716b] dark:text-[#a6a09b]"
                    >
                      No articles found.
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-[#615fff] ml-2 hover:underline font-mono"
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => (
                    <tr
                      key={art.id}
                      className="group hover:bg-[#fafaf9] dark:hover:bg-[#1c1917] transition-colors"
                    >
                      {/* Title Column */}
                      <td className="py-3.5 px-5 align-middle">
                        <div className="space-y-1">
                          <Link
                            to="/blog/$id"
                            params={{ id: art.id }}
                            className="text-sm font-medium text-[#292524] dark:text-[#fafaf9] group-hover:text-[#615fff] transition-colors line-clamp-1"
                          >
                            {art.title}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b]">
                            <span>/{art.slug}</span>
                            {art.status === 'draft' && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#d97757]/10 text-[#d97757] border border-[#d97757]/30">
                                Draft
                              </span>
                            )}
                            {art.isStale && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#d97757]/10 text-[#d97757] border border-[#d97757]/30">
                                Stale
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="py-3.5 px-5 align-middle text-xs font-mono text-[#79716b] dark:text-[#a6a09b] whitespace-nowrap">
                        {art.publishedAt}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-5 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to="/blog/$id/edit"
                            params={{ id: art.id }}
                            className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] text-[#292524] dark:text-[#fafaf9] hover:border-[#615fff] hover:text-[#615fff] transition-colors bg-white dark:bg-[#171514]"
                            title="Edit Post"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </Link>

                          <Link
                            to="/blog/$id"
                            params={{ id: art.id }}
                            className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-[6px] text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9] hover:bg-[#fafaf9] dark:hover:bg-[#201d1b] transition-colors"
                            title="View / Read Post"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Read</span>
                          </Link>

                          <button
                            onClick={(e) =>
                              handleDeleteArticle(art.id, art.title, e)
                            }
                            className="p-1 text-[#79716b] hover:text-[#ff0000] rounded transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================================================================
            4. MINIMAL FOOTNOTE
            ================================================================= */}
        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#79716b] dark:text-[#a6a09b]">
          <span>✦ Standard blog CMS table view</span>
          <Link to="/new" className="text-[#615fff] hover:underline">
            + Create another article →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
