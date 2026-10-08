import * as React from 'react'
import { createPortal } from 'react-dom'
import { Trash2, X } from 'lucide-react'
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
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const popoverRef = React.useRef<HTMLDivElement>(null)
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null)
  const [position, setPosition] = React.useState<{
    top: number
    left: number
    side: 'top' | 'bottom'
  } | null>(null)

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const width = 320
    const gap = 12
    const viewportPadding = 16
    const estimatedHeight = 174
    const canFitBelow =
      rect.bottom + gap + estimatedHeight <=
      window.innerHeight - viewportPadding
    const nextSide =
      side === 'bottom' && !canFitBelow
        ? 'top'
        : side === 'top' && rect.top - gap - estimatedHeight < viewportPadding
          ? 'bottom'
          : side

    let left =
      align === 'left'
        ? rect.left
        : align === 'center'
          ? rect.left + rect.width / 2 - width / 2
          : rect.right - width

    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - width - viewportPadding),
    )

    const top =
      nextSide === 'bottom'
        ? rect.bottom + gap
        : Math.max(viewportPadding, rect.top - gap - estimatedHeight)

    setPosition({ top, left, side: nextSide })
  }, [align, side])

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, updatePosition])

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
    setIsOpen((prev) => {
      const next = !prev
      if (next) requestAnimationFrame(updatePosition)
      return next
    })
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

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        onClick={handleTriggerClick}
        className="inline-flex items-center"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {children}
      </div>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={popoverRef}
            role="alertdialog"
            aria-modal="false"
            aria-label={title}
            style={{ top: position.top, left: position.left }}
            className={cn(
              'fixed z-[100] w-[min(320px,calc(100vw-32px))] rounded-[14px] p-4',
              'bg-white/95 dark:bg-[#171514]/95 backdrop-blur-md',
              'border border-[#e7e5e4] dark:border-[#292524]',
              'shadow-[0_18px_45px_-16px_rgba(41,37,36,0.35)]',
              'animate-in fade-in zoom-in-95 duration-150',
            )}
          >
            <div
              className={cn(
                'absolute h-2.5 w-2.5 rotate-45 bg-white dark:bg-[#171514] border-[#e7e5e4] dark:border-[#292524]',
                position.side === 'bottom'
                  ? '-top-1.5 border-t border-l'
                  : '-bottom-1.5 border-b border-r',
                align === 'right'
                  ? 'right-4'
                  : align === 'left'
                    ? 'left-4'
                    : 'left-1/2 -translate-x-1/2',
              )}
            />

            <div className="relative space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ff0000]/10 text-[#ff0000] dark:bg-[#ff3333]/15 dark:text-[#ff3333]">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-semibold leading-tight text-[#292524] dark:text-[#fafaf9]">
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed text-[#79716b] dark:text-[#a6a09b]">
                    {description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  aria-label="Close delete confirmation"
                  className="rounded-[6px] p-1 text-[#a6a09b] transition-colors hover:bg-[#fafaf9] hover:text-[#292524] dark:hover:bg-[#201d1b] dark:hover:text-[#fafaf9]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#e7e5e4] pt-3 dark:border-[#292524]">
                <button
                  ref={cancelButtonRef}
                  type="button"
                  onClick={handleCancel}
                  className="rounded-[7px] border border-transparent px-3 py-1.5 text-xs font-medium text-[#79716b] transition-colors hover:bg-[#fafaf9] hover:text-[#292524] dark:text-[#a6a09b] dark:hover:bg-[#201d1b] dark:hover:text-[#fafaf9]"
                >
                  Keep article
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 rounded-[7px] bg-[#ff0000] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-[background-color,transform] hover:bg-[#d90000] enabled:active:scale-[0.97]"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
