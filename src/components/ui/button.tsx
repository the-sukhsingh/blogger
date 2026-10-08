import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '#/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap select-none',
    'rounded-[8px] cursor-pointer font-sans',
    'transition-[transform,background-color,border-color,color,opacity] duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    // Emil Kowalski press physics: scale(0.96) only when not disabled
    'enabled:active:scale-[0.96]',
    // Disabled state
    'disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        // Primary CTA (Electric Indigo #615fff, hover Deep Violet #4f39f6 per design.md)
        default:
          'bg-[#615fff] text-white font-semibold uppercase tracking-[0.04em] hover:bg-[#4f39f6] active:bg-[#4f39f6]',
        // Ghost Outline (Stone Mist border #e7e5e4, Charcoal text #292524 per design.md)
        outline:
          'bg-transparent border border-[#e7e5e4] dark:border-[#292524] text-[#292524] dark:text-[#fafaf9] font-semibold uppercase tracking-[0.04em] hover:border-[#292524] dark:hover:border-[#fafaf9]',
        // Ghost Text Only
        ghost:
          'bg-transparent text-[#292524] dark:text-[#fafaf9] font-semibold uppercase tracking-[0.04em] hover:bg-stone-200/50 dark:hover:bg-stone-800/50',
        // Secondary Flat Surface
        secondary:
          'bg-[#ffffff] dark:bg-[#171514] border border-[#e7e5e4] dark:border-[#292524] text-[#292524] dark:text-[#fafaf9] font-medium text-xs hover:border-[#292524]/60',
        // Arrow Link (Geist Mono 12px uppercase tracked 0.04em per design.md)
        arrow:
          'font-mono text-xs font-medium uppercase tracking-[0.04em] text-[#292524] dark:text-[#fafaf9] p-0 h-auto hover:opacity-60 enabled:active:scale-100',
        // Destructive / Alarm Red (#ff0000)
        destructive:
          'bg-[#ff0000] text-white font-semibold uppercase tracking-[0.04em] hover:bg-[#d90000]',
        // Lichen Green Accent
        success:
          'bg-[#5ea500] text-white font-semibold uppercase tracking-[0.04em] hover:bg-[#529000]',
        // Standard Text Link
        link: 'text-[#007ebb] hover:underline p-0 h-auto font-normal enabled:active:scale-100',
      },
      size: {
        default: 'h-[42px] px-4 py-2.5 text-[14px]',
        sm: 'h-8 px-3 text-xs',
        xs: 'h-7 px-2.5 text-[11px]',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0',
      },
      static: {
        true: 'enabled:active:scale-100',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      static: isStatic,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, static: isStatic, className }),
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span className="inline-flex shrink-0 -ml-0.5">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 -mr-0.5">{rightIcon}</span>
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
