import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArticleEditor } from '#/components/article-editor'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'
import { useConvexAuth } from '@convex-dev/auth/react'
import { AuthModal } from '#/components/auth-modal'

interface NewBlogSearchParams {
  topic?: string
  title?: string
}

export const Route = createFileRoute('/new')({
  validateSearch: (search: Record<string, unknown>): NewBlogSearchParams => {
    return {
      topic: typeof search.topic === 'string' ? search.topic : undefined,
      title: typeof search.title === 'string' ? search.title : undefined,
    }
  },
  component: NewBlogPage,
})

function NewBlogPage() {
  const { topic, title } = Route.useSearch()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-muted-foreground">
        Checking author session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-6 py-24 text-center space-y-4">
          <h1 className="font-serif text-3xl font-medium">Author sign-in required</h1>
          <p className="text-sm text-muted-foreground">
            You must be signed in to author and publish new articles.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              Sign in to Continue
            </Button>
            <Link to="/blogs">
              <Button variant="outline" size="sm">
                Browse Articles
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    )
  }

  return (
    <ArticleEditor isNew={true} initialTopic={topic} initialTitle={title} />
  )
}
