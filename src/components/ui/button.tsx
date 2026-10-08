import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '#/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium select-none',
    'rounded-md cursor-pointer',
    'transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    // Emil & Better-UI press physics: scale(0.96) only when not disabled
    'enabled:active:scale-[0.96]',
    // Disabled state
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/95',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 border border-border/40',
        outline:
          'border border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
        ghost:
          'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        link:
          'text-primary underline-offset-4 hover:underline p-0 h-auto font-normal enabled:active:scale-100',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        subtle:
          'bg-accent/60 text-accent-foreground hover:bg-accent active:bg-accent/90',
        success:
          'bg-success text-success-foreground shadow-xs hover:bg-success/90',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        xs: 'h-7 px-2.5 text-xs rounded-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6 text-base',
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
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, static: isStatic, className }))}
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
  }
)
Button.displayName = 'Button'

export { buttonVariants }
