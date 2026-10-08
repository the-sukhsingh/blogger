import * as React from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export interface DeleteConfirmPopoverProps {
  onConfirm: () => void
  title?: string
  description?: string
  children: React.ReactNode
  align?: 'left' | 'right' | 'center'
  side?: 'top' | 'bottom'
  disabled?: boolean
}

export function DeleteConfirmPopover({
  onConfirm,
  title = 'Delete article?',
  description = 'This cannot be undone.',
  children,
  align = 'right',
  side = 'bottom',
  disabled = false,
}: DeleteConfirmPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null)

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    // Capture click outside
    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Focus cancel button on open for safe keyboard navigation
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
  }

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    onConfirm()
  }

  // Position classes
  const alignmentClass =
    align === 'right'
      ? 'right-0'
      : align === 'left'
        ? 'left-0'
        : 'left-1/2 -translate-x-1/2'

  const sideClass = side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div onClick={handleTriggerClick} className="inline-flex items-center">
        {children}
      </div>

      {isOpen && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            'absolute z-50 w-64 rounded-[10px] p-3.5',
            'bg-white dark:bg-[#171514]',
            'border border-[#e7e5e4] dark:border-[#292524]',
            'shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)]',
            'animate-in fade-in zoom-in-95 duration-150',
            alignmentClass,
            sideClass,
          )}
        >
          {/* Subtle arrow pointer */}
          <div
            className={cn(
              'absolute h-2 w-2 rotate-45 bg-white dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524]',
              side === 'bottom'
                ? '-top-1 border-t border-l'
                : '-bottom-1 border-b border-r',
              align === 'right'
                ? 'right-3'
                : align === 'left'
                  ? 'left-3'
                  : 'left-1/2 -translate-x-1/2',
            )}
          />

          <div className="relative z-10 space-y-2.5">
            {/* Header with Alert icon */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff0000]/10 text-[#ff0000] dark:bg-[#ff3333]/15 dark:text-[#ff3333]">
                <Trash2 className="h-3 w-3" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#292524] dark:text-[#fafaf9] leading-tight">
                  {title}
                </p>
                <p className="text-[11px] text-[#79716b] dark:text-[#a6a09b] leading-tight">
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                aria-label="Close"
                className="text-[#a6a09b] hover:text-[#292524] dark:hover:text-[#fafaf9] transition-colors p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#e7e5e4] dark:border-[#292524]">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={handleCancel}
                className="px-2.5 py-1 text-[11px] font-mono rounded-[6px] text-[#79716b] hover:text-[#292524] dark:text-[#a6a09b] dark:hover:text-[#fafaf9] hover:bg-[#fafaf9] dark:hover:bg-[#201d1b] transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-[6px] bg-[#ff0000] hover:bg-[#d90000] text-white shadow-sm transition-colors inline-flex items-center gap-1"
              >
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
