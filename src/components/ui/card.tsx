import * as React from 'react'
import { cn } from '#/lib/utils'

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'subtle' | 'outline' | 'interactive' }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border text-card-foreground transition-[border-color,box-shadow,transform] duration-150 ease-out',
      // Better-ui: clean surface, forced-colors mode border compatibility
      {
        'bg-card border-border/80 shadow-xs': variant === 'default',
        'bg-secondary/40 border-border/50': variant === 'subtle',
        'bg-transparent border-border': variant === 'outline',
        'bg-card border-border/80 shadow-xs hover:border-foreground/30 hover:shadow-sm cursor-pointer enabled:active:scale-[0.99]':
          variant === 'interactive',
      },
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Better-typography: headings at normal font-style (no italic headers per hallmark), tracking -0.01em
      'text-base font-semibold leading-snug tracking-tight text-foreground',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-muted-foreground leading-relaxed', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0 text-sm leading-relaxed', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between p-5 pt-0 text-xs text-muted-foreground', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'
