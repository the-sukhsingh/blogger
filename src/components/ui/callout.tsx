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
  info: <Info className="h-4 w-4 shrink-0 text-foreground/70" />,
  tip: <Sparkles className="h-4 w-4 shrink-0 text-foreground/80" />,
  warning: <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />,
  error: <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />,
  ai: <Sparkles className="h-4 w-4 shrink-0 text-primary" />,
  success: <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />,
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
        'relative flex gap-3 rounded-lg border p-4 text-xs leading-relaxed',
        // Restrained editorial styling (hallmark & AGENTS.md - avoid loud SaaS cards)
        'bg-secondary/40 border-border/80 text-foreground',
        type === 'warning' && 'border-warning/40 bg-warning/5 text-foreground',
        type === 'error' &&
          'border-destructive/40 bg-destructive/5 text-foreground',
        type === 'success' && 'border-success/40 bg-success/5 text-foreground',
        type === 'ai' && 'border-primary/30 bg-accent/40 text-foreground',
        className,
      )}
      {...props}
    >
      <div className="mt-0.5">{icon || icons[type]}</div>
      <div className="flex-1 space-y-1">
        {title && (
          <div className="font-semibold text-foreground tracking-tight">
            {title}
          </div>
        )}
        <div className="text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
