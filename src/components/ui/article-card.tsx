import * as React from 'react'
import { GitBranch, Clock, ArrowRight, AlertTriangle, FileCode2, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  slug: string
  publishedAt?: string
  readingTime?: string
  gitBranch?: string
  isStale?: boolean
  staleReason?: string
  healthScore: number
  topics: string[]
  pendingDiffsCount?: number
  onEdit?: (id: string) => void
  onReviewDiffs?: (id: string) => void
  className?: string
}

export function ArticleCard({
  id,
  title,
  excerpt,
  publishedAt = '3 days ago',
  readingTime = '6 min read',
  gitBranch = 'main',
  isStale = false,
  staleReason,
  healthScore,
  topics,
  pendingDiffsCount = 0,
  onEdit,
  onReviewDiffs,
  className,
}: ArticleCardProps) {
  const getHealthBadge = (score: number) => {
    if (score >= 85) return { variant: 'success' as const, label: `Health ${score}%` }
    if (score >= 70) return { variant: 'warning' as const, label: `Health ${score}%` }
    return { variant: 'destructive' as const, label: `Health ${score}%` }
  }

  const health = getHealthBadge(healthScore)

  return (
    <Card
      variant="default"
      className={cn(
        'group transition-[border-color,box-shadow,transform] duration-150 hover:border-foreground/30 hover:shadow-sm',
        className
      )}
    >
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-center justify-between gap-2">
          {/* Metadata & Git */}
          <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono">
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {gitBranch}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {publishedAt}
            </span>
          </div>

          {/* Health indicator */}
          <div className="flex items-center gap-1.5">
            <Badge variant={health.variant} size="sm" dot>
              {health.label}
            </Badge>
            {pendingDiffsCount > 0 && (
              <Badge variant="accent" size="sm">
                {pendingDiffsCount} AI Diffs
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="group-hover:text-primary transition-colors text-base font-semibold leading-snug">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Topics / Entities */}
        <div className="flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <Badge key={topic} variant="secondary" size="sm" className="font-mono text-[10px]">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Stale Alert if applicable (AGENTS.md § 20) */}
        {isStale && (
          <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-2 text-[11px] text-muted-foreground leading-snug">
            <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
            <span className="flex-1">
              <strong className="text-foreground font-medium">Stale content alert: </strong>
              {staleReason || 'Referenced packages or APIs have changed.'}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/40 pt-3">
        <span className="text-[11px] text-muted-foreground font-mono">{readingTime}</span>
        <div className="flex items-center gap-1.5">
          {pendingDiffsCount > 0 && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => onReviewDiffs?.(id)}
              className="text-xs text-primary hover:bg-primary/10"
            >
              Review Diffs
            </Button>
          )}
          <Button
            variant="default"
            size="xs"
            onClick={() => onEdit?.(id)}
            rightIcon={<ArrowRight className="h-3 w-3" />}
          >
            Open in Editor
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
