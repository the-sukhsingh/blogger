import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArticleEditor } from '#/components/article-editor'
import { BlogStore } from '#/lib/blog-store'
import type { Article } from '#/lib/blog-store'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/blog/$id/edit')({
  component: EditBlogPage,
})

function EditBlogPage() {
  const { id } = Route.useParams()
  const [article, setArticle] = React.useState<Article | null | undefined>(
    undefined,
  )

  React.useEffect(() => {
    const found = BlogStore.getArticleById(id)
    setArticle(found || null)
  }, [id])

  if (article === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-[#79716b]">
        Loading article data from localStorage...
      </div>
    )
  }

  if (article === null) {
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

  return <ArticleEditor initialArticle={article} isNew={false} />
}
