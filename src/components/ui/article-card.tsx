import { GitBranch, Clock, ArrowRight, AlertTriangle } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '#/components/ui/card'
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
    if (score >= 85)
      return {
        variant: 'lichen' as const,
        dotColor: 'lichen' as const,
        label: `Health ${score}%`,
      }
    if (score >= 70)
      return {
        variant: 'terracotta' as const,
        dotColor: 'terracotta' as const,
        label: `Health ${score}%`,
      }
    return {
      variant: 'alarm' as const,
      dotColor: 'alarm' as const,
      label: `Health ${score}%`,
    }
  }

  const health = getHealthBadge(healthScore)

  return (
    <Card
      variant="default"
      className={cn(
        // design.md: rounded 16px, 1px stone mist border #e7e5e4, flat and weightless
        'group transition-[border-color,transform] duration-150 hover:border-[#292524] dark:hover:border-[#fafaf9]',
        className,
      )}
    >
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-center justify-between gap-2">
          {/* Metadata & Git */}
          <div className="flex items-center gap-2 text-[#79716b] dark:text-[#a6a09b] text-[11px] font-mono">
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
            <Badge
              variant={health.variant}
              size="sm"
              shape="pill"
              dot
              dotColor={health.dotColor}
            >
              {health.label}
            </Badge>
            {pendingDiffsCount > 0 && (
              <Badge variant="teal" size="sm" shape="pill">
                {pendingDiffsCount} AI Diffs
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="group-hover:text-[#615fff] transition-colors text-[18px] font-semibold leading-snug">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-[14px] leading-[1.43]">
          {excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Topics / Entities */}
        <div className="flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              size="sm"
              shape="tag"
              className="font-mono text-[11px]"
            >
              {topic}
            </Badge>
          ))}
        </div>

        {/* Stale Alert if applicable (design.md: Terracotta accent) */}
        {isStale && (
          <div className="flex items-start gap-2.5 rounded-[8px] border border-[#d97757]/40 bg-[#d97757]/5 p-3 text-[12px] text-[#79716b] dark:text-[#a6a09b] leading-snug">
            <AlertTriangle className="h-4 w-4 text-[#d97757] shrink-0 mt-0.5" />
            <span className="flex-1">
              <strong className="text-[#292524] dark:text-[#fafaf9] font-medium">
                Stale content alert:{' '}
              </strong>
              {staleReason || 'Referenced packages or APIs have changed.'}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-[#e7e5e4] dark:border-[#292524] pt-3">
        <span className="text-[12px] text-[#79716b] dark:text-[#a6a09b] font-mono">
          {readingTime}
        </span>
        <div className="flex items-center gap-2">
          {pendingDiffsCount > 0 && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => onReviewDiffs?.(id)}
              className="text-xs text-[#615fff] hover:border-[#615fff]"
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
