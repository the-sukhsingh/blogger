import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none tabular-nums border',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground',
        secondary:
          'border-border/60 bg-secondary text-secondary-foreground',
        outline:
          'border-border text-foreground bg-transparent',
        muted:
          'border-transparent bg-muted text-muted-foreground',
        destructive:
          'border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20',
        success:
          'border-success/30 bg-success/10 text-success dark:bg-success/20',
        warning:
          'border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning dark:bg-warning/20',
        accent:
          'border-accent/40 bg-accent text-accent-foreground',
      },
      size: {
        sm: 'px-2 py-0.2 text-[11px] leading-4',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-xs font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: 'default' | 'success' | 'warning' | 'destructive'
}

export function Badge({
  className,
  variant,
  size,
  dot = false,
  dotColor = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', {
            'bg-current': dotColor === 'default',
            'bg-success': dotColor === 'success',
            'bg-warning': dotColor === 'warning',
            'bg-destructive': dotColor === 'destructive',
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}

export { badgeVariants }
