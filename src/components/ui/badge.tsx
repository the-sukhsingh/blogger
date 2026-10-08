import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-mono text-xs select-none tabular-nums border transition-colors',
  {
    variants: {
      variant: {
        // Electric Indigo brand badge
        default:
          'border-transparent bg-[#615fff] text-white font-sans font-medium',
        // Secondary warm neutral tag
        secondary:
          'border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] text-[#292524] dark:text-[#fafaf9] font-sans font-medium',
        // Minimal hairline outline
        outline:
          'border-[#e7e5e4] dark:border-[#292524] bg-transparent text-[#292524] dark:text-[#fafaf9] font-sans font-medium',
        // Lichen Green tag (design.md: 1px green outline accent)
        lichen:
          'border-[#5ea500] bg-[#5ea500]/5 text-[#5ea500] dark:text-[#7fd410] font-sans font-medium',
        // Tide Teal tag (design.md: teal decorative accent)
        teal:
          'border-[#22b8cd] bg-[#22b8cd]/5 text-[#22b8cd] font-sans font-medium',
        // Terracotta tag (design.md: warm orange accent)
        terracotta:
          'border-[#d97757] bg-[#d97757]/5 text-[#d97757] font-sans font-medium',
        // Alarm Red (design.md: red accent for action borders)
        alarm:
          'border-[#ff0000] bg-[#ff0000]/5 text-[#ff0000] font-sans font-medium',
        // Section Eyebrow Tag (design.md: Geist Mono 12px 600 uppercase tracking 0.10em #79716b)
        eyebrow:
          'border-transparent bg-transparent text-[#79716b] dark:text-[#a6a09b] uppercase tracking-[0.10em] text-[12px] font-semibold p-0',
      },
      shape: {
        pill: 'rounded-full px-2.5 py-0.5',
        tag: 'rounded-[8px] px-2.5 py-1',
        none: 'rounded-none p-0',
      },
      size: {
        sm: 'text-[11px] py-0 px-2 leading-4',
        default: 'text-xs',
        lg: 'text-xs font-semibold px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      shape: 'tag',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: 'default' | 'lichen' | 'terracotta' | 'alarm' | 'teal'
}

export function Badge({
  className,
  variant,
  shape,
  size,
  dot = false,
  dotColor = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, shape, size, className }))} {...props}>
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', {
            'bg-current': dotColor === 'default',
            'bg-[#5ea500]': dotColor === 'lichen',
            'bg-[#d97757]': dotColor === 'terracotta',
            'bg-[#ff0000]': dotColor === 'alarm',
            'bg-[#22b8cd]': dotColor === 'teal',
          })}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}

export { badgeVariants }
