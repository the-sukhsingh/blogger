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
    if (score >= 85) return 'text-[#5ea500] border-[#5ea500]'
    if (score >= 70) return 'text-[#d97757] border-[#d97757]'
    return 'text-[#ff0000] border-[#ff0000]'
  }

  const getBarBg = (score: number) => {
    if (score >= 85) return 'bg-[#5ea500]'
    if (score >= 70) return 'bg-[#d97757]'
    return 'bg-[#ff0000]'
  }

  return (
    <div
      className={cn(
        // design.md: rounded 16px, 1px stone mist border #e7e5e4, white panel
        'rounded-[16px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-5 text-xs space-y-4',
        className,
      )}
    >
      {/* Header with Overall Score */}
      <div className="flex items-center justify-between border-b border-[#e7e5e4] dark:border-[#292524] pb-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#615fff]" />
            <span className="font-semibold text-[#292524] dark:text-[#fafaf9] text-[15px] tracking-tight">
              {statusText}
            </span>
          </div>
          <p className="text-[#79716b] dark:text-[#a6a09b] text-[12px]">
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

      {/* Metric Bars (design.md: 8px radius for internal tiles, Lichen Green / Terracotta / Alarm Red indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div
            key={m.name}
            className="space-y-2 rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-[#79716b] dark:text-[#a6a09b]">
                {m.name}
              </span>
              <span className="font-mono text-xs font-bold tabular-nums text-[#292524] dark:text-[#fafaf9]">
                {m.score}
              </span>
            </div>
            {/* Progress Track */}
            <div className="h-1.5 w-full rounded-full bg-[#e7e5e4] dark:bg-[#292524] overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300 ease-out rounded-full',
                  getBarBg(m.score),
                )}
                style={{ width: `${m.score}%` }}
              />
            </div>
            {m.note && (
              <p className="text-[11px] text-[#79716b] dark:text-[#a6a09b] truncate">
                {m.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Warnings & Explanations (design.md: Terracotta alert styling) */}
      {warnings.length > 0 && (
        <div className="rounded-[8px] border border-[#d97757]/40 bg-[#d97757]/5 p-3.5 space-y-2">
          <div className="flex items-center gap-2 font-medium text-[#292524] dark:text-[#fafaf9] text-xs">
            <AlertTriangle className="h-4 w-4 text-[#d97757]" />
            <span>Attention Needed</span>
          </div>
          <ul className="space-y-1 text-[#79716b] dark:text-[#a6a09b] pl-5 list-disc text-[12px] leading-relaxed">
            {warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
