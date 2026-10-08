import * as React from 'react'
import { cn } from '#/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      leftIcon,
      rightIcon,
      error,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full rounded-md border bg-background px-3 py-1',
            // 16px on mobile to prevent iOS Safari auto-zoom, 14px (sm) on desktop (better-typography)
            'text-base sm:text-sm',
            'transition-[border-color,box-shadow] duration-150 ease-out',
            'placeholder:text-muted-foreground/60',
            'border-input focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-destructive focus-visible:ring-destructive/30',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
