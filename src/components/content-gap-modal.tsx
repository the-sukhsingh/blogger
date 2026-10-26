import * as React from 'react'
import {
  X,
  Compass,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Plus,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { BlogIntelligence } from '#/lib/blog-intelligence'
import type { Article } from '#/lib/blog-store'
import type { ContentGapRecommendation } from '#/lib/blog-intelligence'
import { useNavigate } from '@tanstack/react-router'

interface ContentGapModalProps {
  isOpen: boolean
  onClose: () => void
  articles: Article[]
}

export function ContentGapModal({
  isOpen,
  onClose,
  articles,
}: ContentGapModalProps) {
  const navigate = useNavigate()

  const recommendations: ContentGapRecommendation[] = React.useMemo(() => {
    return BlogIntelligence.discoverContentGaps(articles)
  }, [articles])

  if (!isOpen) return null

  const handleStartDraft = (rec: ContentGapRecommendation) => {
    onClose()
    navigate({
      to: '/new',
      search: {
        topic: rec.topic,
        title: rec.title,
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-background border border-[#e7e5e4] dark:border-[#292524] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#615fff]/10 flex items-center justify-center text-[#615fff]">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Content Gap Discovery</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Identifies strategic topics and architecture gaps based on your published clusters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List of Recommended Next Articles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card hover:border-[#615fff]/50 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="indigo" size="xs" className="font-mono text-[10px]">
                      {rec.topic}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Intent: {rec.targetIntent}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {rec.title}
                  </h3>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleStartDraft(rec)}
                  className="font-mono text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Start Draft</span>
                </Button>
              </div>

              {/* Rationale */}
              <p className="text-xs text-muted-foreground leading-relaxed font-sans bg-muted/20 p-3 rounded-lg border border-[#e7e5e4] dark:border-[#292524]">
                <strong className="text-foreground font-mono">Why write this: </strong>
                {rec.rationale}
              </p>

              {/* Suggested Outline Points */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Suggested Technical Outline:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                  {rec.suggestedOutline.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-card border border-[#e7e5e4] dark:border-[#292524]"
                    >
                      <span className="text-[#615fff] font-bold">›</span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e7e5e4] dark:border-[#292524] bg-card flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>{recommendations.length} High-Value Content Gaps Identified</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-mono">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
