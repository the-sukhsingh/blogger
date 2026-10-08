import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '#/lib/utils'

export interface CheckboxProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
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

    const toggle = () => {
      if (disabled) return
      const next = !checked
      if (!isControlled) {
        setUncontrolledChecked(next)
      }
      onCheckedChange?.(next)
    }

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        ref={ref}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            toggle()
          }
        }}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-xs border border-primary/50 shadow-xs cursor-pointer',
          'transition-[background-color,border-color,box-shadow] duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'flex items-center justify-center',
          checked
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background hover:border-primary',
          className,
        )}
        {...props}
      >
        {checked && (
          <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
        )}
      </button>
    )
  },
)
Checkbox.displayName = 'Checkbox'
