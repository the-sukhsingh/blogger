import * as React from 'react'
import {
  Heart,
  Sparkles,
  Bookmark,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Send,
  User,
  Share2,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { cn } from '#/lib/utils'

interface ArticleEngagementProps {
  blogId?: string
  title: string
  slug: string
  author?: string
}

export function ArticleEngagement({
  blogId,
  title,
  slug,
  author = 'Staff Engineer',
}: ArticleEngagementProps) {
  // Convex ID validation
  const validId = blogId && blogId.length > 10 ? (blogId as Id<'blogs'>) : null

  // Reactions query & mutations
  const reactions = useQuery(api.reactions.get, validId ? { blogId: validId } : 'skip')
  const addReaction = useMutation(api.reactions.add)

  // Comments query & mutations
  const comments = useQuery(api.comments.list, validId ? { blogId: validId } : 'skip')
  const addComment = useMutation(api.comments.add)
  const likeComment = useMutation(api.comments.like)
  const removeComment = useMutation(api.comments.remove)

  // Local state for smooth optimistic claps
  const [localClaps, setLocalClaps] = React.useState(0)
  const [floatingParticles, setFloatingParticles] = React.useState<
    { id: number; x: number }[]
  >([])

  // Comment input form
  const [commentName, setCommentName] = React.useState('')
  const [commentText, setCommentText] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Initial claps sync
  const clapCount = (reactions?.clap || 0) + localClaps

  const handleClap = async (e: React.MouseEvent) => {
    // Spawn floating particle
    const particleId = Date.now() + Math.random()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 10
    setFloatingParticles((prev) => [...prev, { id: particleId, x }])
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== particleId))
    }, 1000)

    setLocalClaps((prev) => prev + 1)

    if (validId) {
      try {
        await addReaction({
          blogId: validId,
          reactionType: 'clap',
          amount: 1,
        })
      } catch (err) {
        console.error('Failed to add clap:', err)
      }
    }
  }

  const handleAddReaction = async (
    type: 'sparkle' | 'insightful' | 'bookmark'
  ) => {
    if (validId) {
      try {
        await addReaction({
          blogId: validId,
          reactionType: type,
          amount: 1,
        })
      } catch (err) {
        console.error('Failed to add reaction:', err)
      }
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setIsSubmitting(true)
    try {
      if (validId) {
        await addComment({
          blogId: validId,
          authorName: commentName.trim() || 'Software Engineer',
          content: commentText.trim(),
        })
      }
      setCommentText('')
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10 pt-8 border-t border-[#e7e5e4] dark:border-[#292524]">
      {/* =================================================================
          1. REACTIONS & CLAPS BAR
          ================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card">
        <div className="flex items-center gap-3">
          {/* Main Clap Button with Particle Float */}
          <div className="relative">
            <button
              onClick={handleClap}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#615fff]/10 hover:bg-[#615fff]/20 text-[#615fff] font-mono text-xs font-semibold transition-all active:scale-95 select-none"
              title="Clap for this article"
            >
              <Heart className="h-4 w-4 fill-current" />
              <span>{clapCount} Claps</span>
            </button>

            {/* Floating micro-animation particles */}
            {floatingParticles.map((p) => (
              <span
                key={p.id}
                style={{ left: `${p.x}px` }}
                className="absolute -top-6 pointer-events-none text-xs font-bold text-[#615fff] animate-out fade-out slide-out-to-top duration-700"
              >
                +1 👏
              </span>
            ))}
          </div>

          {/* Secondary reaction buttons */}
          <button
            onClick={() => handleAddReaction('sparkle')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            title="Brilliant insight"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#5ea500]" />
            <span>{reactions?.sparkle || 0}</span>
          </button>

          <button
            onClick={() => handleAddReaction('insightful')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            title="Insightful architecture"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#d97757]" />
            <span>{reactions?.insightful || 0}</span>
          </button>

          <button
            onClick={() => handleAddReaction('bookmark')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            title="Bookmarked"
          >
            <Bookmark className="h-3.5 w-3.5 text-[#22b8cd]" />
            <span>{reactions?.bookmark || 0}</span>
          </button>
        </div>

        <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{(comments || []).length} Comments</span>
        </div>
      </div>

      {/* =================================================================
          2. COMMUNITY DISCUSSION & COMMENTS
          ================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
            Discussion & Peer Review ({(comments || []).length})
          </h3>
          <span className="text-[11px] font-mono text-muted-foreground">
            Convex Realtime Synced
          </span>
        </div>

        {/* New Comment Input */}
        <form
          onSubmit={handleCommentSubmit}
          className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#615fff]/10 flex items-center justify-center text-[#615fff] text-xs font-mono font-semibold">
              <User className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              placeholder="Your name or handle (e.g. Alex, Staff SRE)"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="flex-1 bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-[#615fff]"
            />
          </div>

          <textarea
            placeholder="Share feedback, architectural questions, or alternative implementation approaches..."
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg p-3 text-xs font-sans text-foreground focus:outline-none focus:border-[#615fff] resize-y"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-muted-foreground">
              Supports markdown code blocks and snippets
            </span>

            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting || !commentText.trim()}
              className="text-xs font-mono flex items-center gap-1.5"
            >
              <Send className="h-3 w-3" />
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </Button>
          </div>
        </form>

        {/* Comments Feed */}
        <div className="space-y-3">
          {comments && comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-2 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#615fff]/10 flex items-center justify-center text-[#615fff] text-[10px] font-mono font-semibold">
                      {c.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {c.authorName}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => likeComment({ commentId: c._id })}
                      className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-[#e7e5e4] dark:border-[#292524] text-muted-foreground hover:text-foreground transition-colors"
                      title="Like comment"
                    >
                      <ThumbsUp className="h-3 w-3 text-[#5ea500]" />
                      <span>{c.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => removeComment({ commentId: c._id })}
                      className="p-1 rounded text-muted-foreground hover:text-[#ff0000] transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed font-sans pl-8 whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-[#e7e5e4] dark:border-[#292524] text-center text-xs font-mono text-muted-foreground">
              No comments yet. Be the first to start the technical discussion!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
