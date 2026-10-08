import { AlertTriangle, Sparkles } from 'lucide-react'
import { cn } from '#/lib/utils'

export interface HealthMetric {
  name: 'Content' | 'SEO' | 'AEO' | 'Links' | 'Freshness' | 'Technical'
  score: number // 0 - 100
  note?: string
}

export interface HealthReportProps {
  overallScore: number
  metrics: HealthMetric[]
  statusText?: string
  warnings?: string[]
  className?: string
}

export function HealthGauge({
  overallScore,
  metrics,
  statusText = 'Article Health Analysis',
  warnings = [],
  className,
}: HealthReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success border-success/40'
    if (score >= 70) return 'text-warning border-warning/40'
    return 'text-destructive border-destructive/40'
  }

  const getBarBg = (score: number) => {
    if (score >= 85) return 'bg-success'
    if (score >= 70) return 'bg-warning'
    return 'bg-destructive'
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-xs text-xs space-y-4',
        className,
      )}
    >
      {/* Header with Overall Score */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground text-sm tracking-tight">
              {statusText}
            </span>
          </div>
          <p className="text-muted-foreground text-[11px]">
            Trained on technical publication intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono font-bold text-sm tabular-nums',
              getScoreColor(overallScore),
            )}
          >
            {overallScore}
          </div>
        </div>
      </div>

      {/* Metric Bars (AGENTS.md § 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div
            key={m.name}
            className="space-y-1.5 rounded-lg border border-border/50 bg-secondary/30 p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">
                {m.name}
              </span>
              <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                {m.score}
              </span>
            </div>
            {/* Progress Track */}
            <div className="h-1.5 w-full rounded-full bg-border/60 overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300 ease-out rounded-full',
                  getBarBg(m.score),
                )}
                style={{ width: `${m.score}%` }}
              />
            </div>
            {m.note && (
              <p className="text-[10px] text-muted-foreground truncate">
                {m.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Warnings & Explanations (AGENTS.md: "The numbers are secondary. The important part is the explanation.") */}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 space-y-2">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span>Attention Needed</span>
          </div>
          <ul className="space-y-1 text-muted-foreground pl-4 list-disc text-[11px] leading-relaxed">
            {warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
