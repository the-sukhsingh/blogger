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
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#79716b] dark:text-[#a6a09b]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            // Beelog design.md: bg #ffffff, 1px #e7e5e4 border, radius 12px, padding 12px 16px
            'flex h-[44px] w-full rounded-[12px] border bg-white dark:bg-[#171514] px-4 py-3',
            // 16px on mobile to prevent iOS Safari auto-zoom, 14px/16px text
            'text-[15px] sm:text-[14px] text-[#292524] dark:text-[#fafaf9]',
            'border-[#e7e5e4] dark:border-[#292524]',
            'transition-[border-color,box-shadow] duration-150 ease-out',
            'placeholder:text-[#a6a09b]',
            // Focus ring: border shifts to #615fff, ring 3px rgba(97,95,255,0.15)
            'focus-visible:outline-none focus-visible:border-[#615fff] focus-visible:ring-3 focus-visible:ring-[#615fff]/15',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-[#fafaf9] dark:disabled:bg-[#171514]',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-[#ff0000] focus-visible:ring-[#ff0000]/15',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#79716b] dark:text-[#a6a09b]">
            {rightIcon}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
