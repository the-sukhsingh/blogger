import * as React from 'react'
import { Check, X, GitCommit, Split, AlignJustify } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

export interface DiffLine {
  type: 'unchanged' | 'addition' | 'deletion' | 'added' | 'removed'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

export interface DiffViewerProps {
  title?: string
  description?: string
  diffs?: DiffLine[]
  lines?: DiffLine[]
  defaultCollapsed?: boolean
  onAccept?: () => void
  onReject?: () => void
  defaultViewMode?: 'split' | 'unified'
  className?: string
}

function isAddition(type: string): boolean {
  return type === 'addition' || type === 'added'
}

function isDeletion(type: string): boolean {
  return type === 'deletion' || type === 'removed'
}

export function DiffViewer({
  title = 'Proposed AI Modification',
  description = 'Review the changes before accepting. Preserves your voice and technical precision.',
  diffs,
  lines,
  onAccept,
  onReject,
  defaultViewMode = 'unified',
  className,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = React.useState<'split' | 'unified'>(
    defaultViewMode,
  )
  const [status, setStatus] = React.useState<
    'pending' | 'accepted' | 'rejected'
  >('pending')

  // Safely resolve diff list whether passed via diffs or lines prop
  const activeDiffs: DiffLine[] = Array.isArray(diffs)
    ? diffs
    : Array.isArray(lines)
      ? lines
      : []

  const additionsCount = activeDiffs.filter((d) => isAddition(d.type)).length
  const deletionsCount = activeDiffs.filter((d) => isDeletion(d.type)).length

  const handleAccept = () => {
    setStatus('accepted')
    onAccept?.()
  }

  const handleReject = () => {
    setStatus('rejected')
    onReject?.()
  }

  return (
    <div
      className={cn(
        // design.md: rounded 16px, 1px stone mist border #e7e5e4, white panel
        'rounded-[16px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] overflow-hidden text-xs',
        className,
      )}
    >
      {/* Diff Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] px-5 py-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-[#79716b] dark:text-[#a6a09b]" />
            <span className="font-semibold text-[#292524] dark:text-[#fafaf9] text-sm tracking-tight">
              {title}
            </span>
            <div className="flex items-center gap-1.5 ml-2">
              <Badge variant="lichen" size="sm">
                +{additionsCount}
              </Badge>
              <Badge variant="alarm" size="sm">
                -{deletionsCount}
              </Badge>
            </div>
          </div>
          {description && (
            <p className="text-[#79716b] dark:text-[#a6a09b] text-xs">
              {description}
            </p>
          )}
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={cn(
                'px-2 py-1 rounded-[6px] text-xs font-medium cursor-pointer transition-colors',
                viewMode === 'unified'
                  ? 'bg-[#fafaf9] dark:bg-[#292524] text-[#292524] dark:text-[#fafaf9] font-semibold'
                  : 'text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9]',
              )}
              title="Unified diff view"
            >
              <AlignJustify className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={cn(
                'px-2 py-1 rounded-[6px] text-xs font-medium cursor-pointer transition-colors',
                viewMode === 'split'
                  ? 'bg-[#fafaf9] dark:bg-[#292524] text-[#292524] dark:text-[#fafaf9] font-semibold'
                  : 'text-[#79716b] hover:text-[#292524] dark:hover:text-[#fafaf9]',
              )}
              title="Split diff view"
            >
              <Split className="h-3.5 w-3.5" />
            </button>
          </div>

          {status === 'pending' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="h-8 px-3 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAccept}
              >
                <Check className="h-3 w-3 mr-1" />
                Accept
              </Button>
            </div>
          ) : (
            <Badge
              variant={status === 'accepted' ? 'lichen' : 'secondary'}
              size="sm"
              className="capitalize"
            >
              {status}
            </Badge>
          )}
        </div>
      </div>

      {/* Diff Content */}
      <div className="font-mono text-xs overflow-x-auto">
        {activeDiffs.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground font-mono">
            No changes to display.
          </div>
        ) : viewMode === 'unified' ? (
          <div className="divide-y divide-[#e7e5e4]/50 dark:divide-[#292524]/50">
            {activeDiffs.map((diff, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-start px-4 py-1.5 font-mono leading-relaxed select-text',
                  {
                    'bg-[#5ea500]/8 text-[#292524] dark:text-[#fafaf9] border-l-2 border-[#5ea500]':
                      isAddition(diff.type),
                    'bg-[#ff0000]/8 text-[#292524] dark:text-[#fafaf9] border-l-2 border-[#ff0000]':
                      isDeletion(diff.type),
                    'text-[#79716b] dark:text-[#a6a09b]':
                      !isAddition(diff.type) && !isDeletion(diff.type),
                  },
                )}
              >
                <span className="w-10 shrink-0 text-right pr-3 select-none text-[#a6a09b] dark:text-[#79716b] tabular-nums">
                  {diff.oldLineNumber || ''}
                </span>
                <span className="w-10 shrink-0 text-right pr-3 select-none text-[#a6a09b] dark:text-[#79716b] tabular-nums">
                  {diff.newLineNumber || ''}
                </span>
                <span className="w-5 shrink-0 select-none font-bold">
                  {isAddition(diff.type)
                    ? '+'
                    : isDeletion(diff.type)
                      ? '-'
                      : ' '}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all text-[#292524] dark:text-[#fafaf9]">
                  {diff.content}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-[#e7e5e4] dark:divide-[#292524]">
            {/* Split View: Left (Original) */}
            <div className="divide-y divide-[#e7e5e4]/50 dark:divide-[#292524]/50">
              <div className="bg-[#fafaf9] dark:bg-[#121110] px-4 py-1.5 text-[11px] font-semibold text-[#79716b] uppercase tracking-wider select-none border-b border-[#e7e5e4] dark:border-[#292524]">
                Original
              </div>
              {activeDiffs
                .filter((d) => !isAddition(d.type))
                .map((diff, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-start px-4 py-1.5 leading-relaxed select-text',
                      {
                        'bg-[#ff0000]/8 text-[#292524] dark:text-[#fafaf9]':
                          isDeletion(diff.type),
                        'text-[#79716b] dark:text-[#a6a09b]':
                          !isDeletion(diff.type),
                      },
                    )}
                  >
                    <span className="w-8 shrink-0 text-right pr-2 select-none text-[#a6a09b] dark:text-[#79716b] tabular-nums">
                      {diff.oldLineNumber || ''}
                    </span>
                    <span className="w-4 shrink-0 select-none">
                      {isDeletion(diff.type) ? '-' : ' '}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all text-[#292524] dark:text-[#fafaf9]">
                      {diff.content}
                    </span>
                  </div>
                ))}
            </div>

            {/* Split View: Right (Proposed) */}
            <div className="divide-y divide-[#e7e5e4]/50 dark:divide-[#292524]/50">
              <div className="bg-[#fafaf9] dark:bg-[#121110] px-4 py-1.5 text-[11px] font-semibold text-[#79716b] uppercase tracking-wider select-none border-b border-[#e7e5e4] dark:border-[#292524]">
                Proposed
              </div>
              {activeDiffs
                .filter((d) => !isDeletion(d.type))
                .map((diff, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-start px-4 py-1.5 leading-relaxed select-text',
                      {
                        'bg-[#5ea500]/8 text-[#292524] dark:text-[#fafaf9]':
                          isAddition(diff.type),
                        'text-[#79716b] dark:text-[#a6a09b]':
                          !isAddition(diff.type),
                      },
                    )}
                  >
                    <span className="w-8 shrink-0 text-right pr-2 select-none text-[#a6a09b] dark:text-[#79716b] tabular-nums">
                      {diff.newLineNumber || ''}
                    </span>
                    <span className="w-4 shrink-0 select-none">
                      {isAddition(diff.type) ? '+' : ' '}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all text-[#292524] dark:text-[#fafaf9]">
                      {diff.content}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
