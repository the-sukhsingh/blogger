import * as React from 'react'
import { cn } from '#/lib/utils'

export interface PageHeaderProps {
  eyebrow: string
  title: React.ReactNode
  description: React.ReactNode
  stats?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

/**
 * Editorial page header matching the design system of /blogs.
 * Uses font-display (Cooper / Lora serif), eyebrow tag, subtle description,
 * inline mono stats, and right-aligned actions with border-b divider.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  stats,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e7e5e4] dark:border-[#292524] pb-8',
        className,
      )}
    >
      <div className="space-y-2 max-w-2xl">
        <span className="eyebrow-tag block text-[#79716b] dark:text-[#a6a09b]">
          {eyebrow}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-[#292524] dark:text-[#fafaf9] leading-[1.15]">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#79716b] dark:text-[#a6a09b] leading-relaxed pt-1">
          {description}
        </p>
        {stats && (
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#a6a09b] dark:text-[#79716b]">
            {stats}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
