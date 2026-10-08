import * as React from 'react'
import { cn } from '#/lib/utils'

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : uncontrolledChecked

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      props.onClick?.(e)
      const next = !checked
      if (!isControlled) {
        setUncontrolledChecked(next)
      }
      onCheckedChange?.(next)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      props.onKeyDown?.(e)
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (disabled) return
        const next = !checked
        if (!isControlled) {
          setUncontrolledChecked(next)
        }
        onCheckedChange?.(next)
      }
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-muted-foreground/30 dark:bg-muted',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-xs ring-0',
            'transition-transform duration-150 ease-out',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
    )
  },
)
Switch.displayName = 'Switch'
