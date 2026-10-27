import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArticleEditor } from '#/components/article-editor'
import { BlogStore } from '#/lib/blog-store'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { useQuery } from 'convex/react'
import { useConvexAuth } from '@convex-dev/auth/react'
import { AuthModal } from '#/components/auth-modal'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/blog/$id/edit')({
  component: EditBlogPage,
})

function EditBlogPage() {
  const { id } = Route.useParams()
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  const convexArticle = useQuery(api.blogs.getByIdOrSlug, { idOrSlug: id })
  const localArticle = React.useMemo(() => BlogStore.getArticleById(id), [id])

  if (authLoading || (convexArticle === undefined && !localArticle)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-muted-foreground">
        Loading article data...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-6 py-24 text-center space-y-4">
          <h1 className="font-serif text-3xl font-medium">Authentication required</h1>
          <p className="text-sm text-muted-foreground">
            You must be signed in to edit this article.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              Sign in
            </Button>
            <Link to="/blog/$id" params={{ id }}>
              <Button variant="outline" size="sm">
                Read Article
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
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
        author: (article as any).author,
      }}
      isNew={false}
    />
  )
}
