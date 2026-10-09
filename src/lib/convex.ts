import { ConvexReactClient } from 'convex/react'

const convexUrl =
  (import.meta as any).env?.VITE_CONVEX_URL ||
  'https://quick-mole-268.convex.cloud'

export const convex = new ConvexReactClient(convexUrl)
