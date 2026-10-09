import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArticleEditor } from '#/components/article-editor'
import { BlogStore } from '#/lib/blog-store'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/blog/$id/edit')({
  component: EditBlogPage,
})

function EditBlogPage() {
  const { id } = Route.useParams()
  const convexArticle = useQuery(api.blogs.getByIdOrSlug, { idOrSlug: id })
  const localArticle = React.useMemo(() => BlogStore.getArticleById(id), [id])

  if (convexArticle === undefined && !localArticle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-[#79716b]">
        Loading article data from database...
      </div>
    )
  }

  const article = convexArticle || localArticle

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-[1240px] mx-auto px-6 py-20 text-center space-y-4">
          <p className="text-lg text-[#79716b]">Article "{id}" not found.</p>
          <Link to="/blogs">
            <Button variant="default">Return to Publications</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <ArticleEditor
      initialArticle={{
        _id: (article as any)._id,
        id: (article as any)._id || (article as any).id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        topics: article.topics,
        gitBranch: article.gitBranch,
        status: article.status,
        author: article.author,
      }}
      isNew={false}
    />
  )
}
