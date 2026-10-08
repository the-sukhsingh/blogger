import * as React from 'react'
import { cn } from '#/lib/utils'

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null)

export interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ asChild, onClick, children, ...props }, ref) => {
  const context = React.useContext(DropdownContext)
  if (!context)
    throw new Error('DropdownMenuTrigger must be inside DropdownMenu')

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler
      'aria-expanded'?: boolean
    }>
    return React.cloneElement(child, {
      'aria-expanded': context.open,
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e)
        context.setOpen(!context.open)
      },
    })
  }

  return (
    <button
      type="button"
      ref={ref}
      aria-expanded={context.open}
      aria-haspopup="menu"
      onClick={(e) => {
        onClick?.(e)
        context.setOpen(!context.open)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right'
}

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = 'left', children, ...props }, ref) => {
  const context = React.useContext(DropdownContext)
  if (!context)
    throw new Error('DropdownMenuContent must be inside DropdownMenu')

  if (!context.open) return null

  return (
    <div
      ref={ref}
      role="menu"
      className={cn(
        'absolute z-50 mt-1.5 min-w-[10rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg',
        // Popover origin-aware: scales from top trigger
        align === 'right'
          ? 'right-0 origin-top-right'
          : 'left-0 origin-top-left',
        'animate-in fade-in zoom-in-95 duration-125 ease-out',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean
}

export const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ className, destructive, onClick, children, ...props }, ref) => {
  const context = React.useContext(DropdownContext)

  return (
    <button
      ref={ref}
      role="menuitem"
      type="button"
      onClick={(e) => {
        onClick?.(e)
        context?.setOpen(false)
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none',
        'transition-colors duration-100 ease-out',
        destructive
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('-mx-1 my-1 h-px bg-border/80', className)} {...props} />
)
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export const DropdownMenuLabel = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider',
      className,
    )}
    {...props}
  />
)
DropdownMenuLabel.displayName = 'DropdownMenuLabel'
