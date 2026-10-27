import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/books/$id')({
  component: BookDetailLayout,
})

function BookDetailLayout() {
  return <Outlet />
}
