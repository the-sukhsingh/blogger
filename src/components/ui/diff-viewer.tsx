import * as React from 'react'
import { Check, X, GitCommit, Split, AlignJustify } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

export interface DiffLine {
  type: 'unchanged' | 'addition' | 'deletion'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

export interface DiffViewerProps {
  title?: string
  description?: string
  diffs: DiffLine[]
  onAccept?: () => void
  onReject?: () => void
  defaultViewMode?: 'split' | 'unified'
  className?: string
}

export function DiffViewer({
  title = 'Proposed AI Modification',
  description = 'Review the changes before accepting. Preserves your voice and technical precision.',
  diffs,
  onAccept,
  onReject,
  defaultViewMode = 'unified',
  className,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = React.useState<'split' | 'unified'>(defaultViewMode)
  const [status, setStatus] = React.useState<'pending' | 'accepted' | 'rejected'>('pending')

  const additionsCount = diffs.filter((d) => d.type === 'addition').length
  const deletionsCount = diffs.filter((d) => d.type === 'deletion').length

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
        'rounded-lg border border-border bg-card overflow-hidden shadow-xs text-xs',
        className
      )}
    >
      {/* Diff Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-secondary/30 px-4 py-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground text-sm tracking-tight">{title}</span>
            <div className="flex items-center gap-1.5 ml-1">
              <Badge variant="outline" size="sm" className="text-success border-success/30 bg-success/5 font-mono">
                +{additionsCount}
              </Badge>
              <Badge variant="outline" size="sm" className="text-destructive border-destructive/30 bg-destructive/5 font-mono">
                -{deletionsCount}
              </Badge>
            </div>
          </div>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={cn(
                'px-2 py-1 rounded-sm text-xs font-medium cursor-pointer transition-colors',
                viewMode === 'unified' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Unified diff view"
            >
              <AlignJustify className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={cn(
                'px-2 py-1 rounded-sm text-xs font-medium cursor-pointer transition-colors',
                viewMode === 'split' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Split diff view"
            >
              <Split className="h-3.5 w-3.5" />
            </button>
          </div>

          {status === 'pending' ? (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="text-xs h-7 px-2.5 hover:text-destructive hover:border-destructive/30"
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAccept}
                className="text-xs h-7 px-2.5"
              >
                <Check className="h-3 w-3 mr-1" />
                Accept
              </Button>
            </div>
          ) : (
            <Badge
              variant={status === 'accepted' ? 'success' : 'muted'}
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
        {viewMode === 'unified' ? (
          <div className="divide-y divide-border/20">
            {diffs.map((diff, idx) => (
              <div
                key={idx}
                className={cn('flex items-start px-3 py-1 font-mono leading-relaxed select-text', {
                  'bg-success/10 text-success-foreground border-l-2 border-success':
                    diff.type === 'addition',
                  'bg-destructive/10 text-destructive border-l-2 border-destructive':
                    diff.type === 'deletion',
                  'text-muted-foreground': diff.type === 'unchanged',
                })}
              >
                <span className="w-10 shrink-0 text-right pr-3 select-none text-muted-foreground/50 tabular-nums">
                  {diff.oldLineNumber || ''}
                </span>
                <span className="w-10 shrink-0 text-right pr-3 select-none text-muted-foreground/50 tabular-nums">
                  {diff.newLineNumber || ''}
                </span>
                <span className="w-5 shrink-0 select-none font-bold">
                  {diff.type === 'addition' ? '+' : diff.type === 'deletion' ? '-' : ' '}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all text-foreground">
                  {diff.content}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-border">
            {/* Split View: Left (Original) */}
            <div className="divide-y divide-border/20">
              <div className="bg-muted/40 px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none border-b border-border/40">
                Original
              </div>
              {diffs
                .filter((d) => d.type !== 'addition')
                .map((diff, idx) => (
                  <div
                    key={idx}
                    className={cn('flex items-start px-3 py-1 leading-relaxed select-text', {
                      'bg-destructive/10 text-destructive': diff.type === 'deletion',
                      'text-muted-foreground': diff.type === 'unchanged',
                    })}
                  >
                    <span className="w-8 shrink-0 text-right pr-2 select-none text-muted-foreground/50 tabular-nums">
                      {diff.oldLineNumber || ''}
                    </span>
                    <span className="w-4 shrink-0 select-none">
                      {diff.type === 'deletion' ? '-' : ' '}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all text-foreground">
                      {diff.content}
                    </span>
                  </div>
                ))}
            </div>

            {/* Split View: Right (Proposed) */}
            <div className="divide-y divide-border/20">
              <div className="bg-muted/40 px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none border-b border-border/40">
                Proposed
              </div>
              {diffs
                .filter((d) => d.type !== 'deletion')
                .map((diff, idx) => (
                  <div
                    key={idx}
                    className={cn('flex items-start px-3 py-1 leading-relaxed select-text', {
                      'bg-success/10 text-success-foreground': diff.type === 'addition',
                      'text-muted-foreground': diff.type === 'unchanged',
                    })}
                  >
                    <span className="w-8 shrink-0 text-right pr-2 select-none text-muted-foreground/50 tabular-nums">
                      {diff.newLineNumber || ''}
                    </span>
                    <span className="w-4 shrink-0 select-none">
                      {diff.type === 'addition' ? '+' : ' '}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all text-foreground">
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
