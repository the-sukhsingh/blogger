import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '#/lib/utils'

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange],
  )

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ asChild, onClick, children, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error('DialogTrigger must be used within Dialog')

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler
    }>
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e)
        context.setOpen(true)
      },
    })
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={(e) => {
        onClick?.(e)
        context.setOpen(true)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = 'DialogTrigger'

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  DialogCloseProps
>(({ asChild, onClick, children, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error('DialogClose must be used within Dialog')

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler
    }>
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e)
        context.setOpen(false)
      },
    })
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={(e) => {
        onClick?.(e)
        context.setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DialogClose.displayName = 'DialogClose'

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, children, onClose, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error('DialogContent must be used within Dialog')

  const { open, setOpen } = context

  // Handle Escape key
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen, onClose])

  // Body scroll lock
  React.useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [open])

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with blur (Emil / better-ui) */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity duration-150 ease-out animate-in fade-in"
        onClick={() => {
          setOpen(false)
          onClose?.()
        }}
        aria-hidden="true"
      />

      {/* Modal Window: centered origin, scale(0.96) enter, overscroll contain */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl my-auto',
          'transition-[transform,opacity] duration-150 ease-out origin-center',
          'animate-in fade-in zoom-in-95',
          'overscroll-contain',
          className,
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            onClose?.()
          }}
          className="absolute right-4 top-4 z-20 rounded-md p-1.5 text-[#79716b] hover:text-[#292524] dark:text-[#a6a09b] dark:hover:text-[#fafaf9] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#201d1b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#615fff]"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
})
DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-left mb-4', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-base font-semibold leading-none tracking-tight text-foreground',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-muted-foreground leading-relaxed', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6',
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'
