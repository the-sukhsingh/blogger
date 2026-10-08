import * as React from 'react'
import {
  Info,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '#/lib/utils'

export type CalloutType =
  'info' | 'tip' | 'warning' | 'error' | 'ai' | 'success'

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: CalloutType
  title?: string
  icon?: React.ReactNode
}

const icons: Record<CalloutType, React.ReactNode> = {
  info: <Info className="h-4 w-4 shrink-0 text-[#22b8cd]" />,
  tip: <Sparkles className="h-4 w-4 shrink-0 text-[#615fff]" />,
  warning: <AlertTriangle className="h-4 w-4 shrink-0 text-[#d97757]" />,
  error: <AlertCircle className="h-4 w-4 shrink-0 text-[#ff0000]" />,
  ai: <Sparkles className="h-4 w-4 shrink-0 text-[#615fff]" />,
  success: <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5ea500]" />,
}

export function Callout({
  type = 'info',
  title,
  icon,
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      role="region"
      className={cn(
        // design.md: 8px/12px radius, hairline stone border, white surface, restrained chrome
        'relative flex gap-3.5 rounded-[12px] border p-4 text-[13px] leading-relaxed',
        'bg-white dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524] text-[#292524] dark:text-[#fafaf9]',
        type === 'warning' && 'border-l-2 border-l-[#d97757]',
        type === 'error' && 'border-l-2 border-l-[#ff0000]',
        type === 'success' && 'border-l-2 border-l-[#5ea500]',
        type === 'ai' && 'border-l-2 border-l-[#615fff]',
        type === 'tip' && 'border-l-2 border-l-[#22b8cd]',
        className,
      )}
      {...props}
    >
      <div className="mt-0.5">{icon || icons[type]}</div>
      <div className="flex-1 space-y-1">
        {title && (
          <div className="font-semibold text-[#292524] dark:text-[#fafaf9] tracking-tight">
            {title}
          </div>
        )}
        <div className="text-[#79716b] dark:text-[#a6a09b] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
