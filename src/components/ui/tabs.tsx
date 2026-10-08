import * as React from 'react'
import { cn } from '#/lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'pill' | 'underline'
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = 'pill', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'inline-flex items-center text-muted-foreground',
          variant === 'pill' &&
            'h-9 rounded-lg bg-secondary/70 p-1 border border-border/40 gap-1',
          variant === 'underline' &&
            'border-b border-border w-full gap-4 pb-px',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  variant?: 'pill' | 'underline'
}

export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(({ className, value, variant = 'pill', children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const isSelected = context.value === value

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap text-xs font-medium cursor-pointer select-none',
        'transition-[color,background-color,border-color,box-shadow] duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'pill' && [
          'rounded-md px-3 py-1',
          isSelected
            ? 'bg-background text-foreground shadow-xs font-semibold'
            : 'hover:text-foreground hover:bg-background/40',
        ],
        variant === 'underline' && [
          'py-2 px-1 border-b-2 -mb-px',
          isSelected
            ? 'border-primary text-foreground font-semibold'
            : 'border-transparent hover:text-foreground hover:border-border',
        ],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = 'TabsTrigger'

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error('TabsContent must be used within Tabs')

    if (context.value !== value) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn(
          'mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = 'TabsContent'
