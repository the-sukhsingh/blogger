import * as React from 'react'
import { cn } from '#/lib/utils'

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'showcase' | 'feature' | 'subtle' | 'outline' | 'interactive'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border text-card-foreground transition-[border-color,box-shadow,transform] duration-150 ease-out',
      // AutoSend design.md: cards are flat and weightless, with soft shadow ONLY on showcase
      {
        'rounded-[16px] bg-white dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524]':
          variant === 'default',
        // Product Showcase Card (design.md § Surfaces & Elevation)
        'rounded-[16px] bg-white dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524] shadow-showcase':
          variant === 'showcase',
        // Feature Card in 3-column grid (design.md: 8px radius, 24px padding)
        'rounded-[8px] bg-white dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524] p-6':
          variant === 'feature',
        'rounded-[12px] bg-[#fafaf9] dark:bg-[#1f1c1a] border-[#e7e5e4] dark:border-[#292524]':
          variant === 'subtle',
        'rounded-[12px] bg-transparent border-[#e7e5e4] dark:border-[#292524]':
          variant === 'outline',
        'rounded-[16px] bg-white dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524] hover:border-[#292524]/60 cursor-pointer enabled:active:scale-[0.99]':
          variant === 'interactive',
      },
      className,
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
    className={cn('flex flex-col space-y-1.5 p-6 pb-3', className)}
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
      // design.md: Geist 18px weight 600 Charcoal (#292524)
      'text-[18px] font-semibold leading-snug tracking-tight text-[#292524] dark:text-[#fafaf9]',
      className,
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
    className={cn(
      // design.md: Geist 14px weight 400 Bark Grey (#79716b), 1.43 line-height
      'text-[14px] text-[#79716b] dark:text-[#a6a09b] leading-[1.43]',
      className,
    )}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0 text-[14px] leading-relaxed text-[#79716b] dark:text-[#a6a09b]', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between p-6 pt-0 text-xs text-[#79716b] dark:text-[#a6a09b]',
      className,
    )}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'
