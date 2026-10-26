import * as React from 'react'
import {
  Sparkles,
  X,
  Check,
  RotateCcw,
  Code,
  Bot,
  Wand2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DiffViewer } from '#/components/ui/diff-viewer'
import { BlogIntelligence } from '#/lib/blog-intelligence'
import type { DiffLine } from '#/components/ui/diff-viewer'
import { cn } from '#/lib/utils'

interface AiAssistModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  onAcceptDiff: (newContent: string) => void
}

type AiActionType = 'polish' | 'aeo_boost' | 'add_code'

export function AiAssistModal({
  isOpen,
  onClose,
  title,
  content,
  onAcceptDiff,
}: AiAssistModalProps) {
  const [activeAction, setActiveAction] = React.useState<AiActionType>('polish')
  const [diffResult, setDiffResult] = React.useState<{
    summary: string
    lines: DiffLine[]
    updatedContent: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      runAiAction('polish')
    }
  }, [isOpen])

  const runAiAction = (action: AiActionType) => {
    setActiveAction(action)
    setIsProcessing(true)
    setTimeout(() => {
      const res = BlogIntelligence.generateAiImprovement(action, title, content)
      setDiffResult(res)
      setIsProcessing(false)
    }, 250)
  }

  const handleAccept = () => {
    if (diffResult) {
      onAcceptDiff(diffResult.updatedContent)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-background border border-[#e7e5e4] dark:border-[#292524] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#615fff]/10 flex items-center justify-center text-[#615fff]">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">AI Writing Assistant & Diff Review</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Review proposed technical enhancements before accepting changes into your article
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Selectors */}
        <div className="px-6 py-3 border-b border-[#e7e5e4] dark:border-[#292524] bg-muted/20 flex flex-wrap gap-2">
          <button
            onClick={() => runAiAction('polish')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border',
              activeAction === 'polish'
                ? 'bg-card text-[#615fff] border-[#615fff]/40 shadow-sm font-semibold'
                : 'bg-card text-muted-foreground border-[#e7e5e4] dark:border-[#292524] hover:text-foreground'
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Polish Flow & Voice</span>
          </button>

          <button
            onClick={() => runAiAction('aeo_boost')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border',
              activeAction === 'aeo_boost'
                ? 'bg-card text-[#615fff] border-[#615fff]/40 shadow-sm font-semibold'
                : 'bg-card text-muted-foreground border-[#e7e5e4] dark:border-[#292524] hover:text-foreground'
            )}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Strengthen AEO Upfront Definition</span>
          </button>

          <button
            onClick={() => runAiAction('add_code')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border',
              activeAction === 'add_code'
                ? 'bg-card text-[#615fff] border-[#615fff]/40 shadow-sm font-semibold'
                : 'bg-card text-muted-foreground border-[#e7e5e4] dark:border-[#292524] hover:text-foreground'
            )}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Inject Implementation Code Demonstration</span>
          </button>
        </div>

        {/* Diff Review Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {diffResult && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-lg bg-card border border-[#e7e5e4] dark:border-[#292524] text-xs font-mono text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#615fff] shrink-0" />
                <span>{diffResult.summary}</span>
              </div>

              <div className="border border-[#e7e5e4] dark:border-[#292524] rounded-lg overflow-hidden">
                <DiffViewer
                  title="Proposed Modifications (Before / After)"
                  diffs={diffResult.lines}
                  lines={diffResult.lines}
                  defaultCollapsed={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#e7e5e4] dark:border-[#292524] bg-card flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-mono">
            Discard
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleAccept}
            disabled={!diffResult}
            className="text-xs font-mono flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Accept Changes & Merge</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
