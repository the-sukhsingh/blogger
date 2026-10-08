import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArticleEditor } from '#/components/article-editor'

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

  return (
    <ArticleEditor isNew={true} initialTopic={topic} initialTitle={title} />
  )
}
