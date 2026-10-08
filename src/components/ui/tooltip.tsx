import * as React from 'react'
import { cn } from '#/lib/utils'

// Global state to track if a tooltip is currently active across the page
// Emil Kowalski principle: Skip delay on subsequent hovers
let globalTooltipActive = false
let globalTooltipTimeout: NodeJS.Timeout | null = null

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: 'top' | 'bottom' | 'left' | 'right'
  delayDuration?: number
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 250,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const showTooltip = React.useCallback(() => {
    if (globalTooltipTimeout) {
      clearTimeout(globalTooltipTimeout)
      globalTooltipTimeout = null
    }

    if (globalTooltipActive) {
      // Subsequent hover: instant! (Emil Kowalski principle)
      setOpen(true)
    } else {
      timerRef.current = setTimeout(() => {
        setOpen(true)
        globalTooltipActive = true
      }, delayDuration)
    }
  }, [delayDuration])

  const hideTooltip = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setOpen(false)

    // Keep global active flag for 300ms so moving to adjacent icon is instant
    globalTooltipTimeout = setTimeout(() => {
      globalTooltipActive = false
    }, 300)
  }, [])

  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-xs rounded-md shadow-md pointer-events-none select-none whitespace-nowrap',
            'bg-foreground text-background font-medium tracking-normal',
            // Emil principle: scale from 0.95 with opacity, under 150ms ease-out
            'animate-in fade-in zoom-in-95 duration-125 ease-out',
            side === 'top' && '-top-8 left-1/2 -translate-x-1/2 origin-bottom',
            side === 'bottom' && '-bottom-8 left-1/2 -translate-x-1/2 origin-top',
            side === 'left' && '-left-2 top-1/2 -translate-y-1/2 -translate-x-full origin-right',
            side === 'right' && '-right-2 top-1/2 -translate-y-1/2 translate-x-full origin-left'
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
