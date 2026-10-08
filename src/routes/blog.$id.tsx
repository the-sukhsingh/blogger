import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$id')({
  component: BlogLayout,
})

function BlogLayout() {
  return <Outlet />
}
