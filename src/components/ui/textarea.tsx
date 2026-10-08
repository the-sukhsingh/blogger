import * as React from 'react'
import { cn } from '#/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2',
          // 16px on mobile to avoid iOS Safari zoom, 14px on sm
          'text-base sm:text-sm',
          'transition-[border-color,box-shadow] duration-150 ease-out',
          'placeholder:text-muted-foreground/60',
          'border-input focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50',
          'resize-y leading-relaxed',
          error && 'border-destructive focus-visible:ring-destructive/30',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
