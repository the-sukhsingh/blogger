import * as React from 'react'
import {
  Sparkles,
  X,
  BookOpen,
  ArrowRight,
  Check,
  Search,
  ExternalLink,
  Layers,
  FileCode,
  HelpCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { BlogIntelligence } from '#/lib/blog-intelligence'
import type { ResearchResult } from '#/lib/blog-intelligence'
import type { Article } from '#/lib/blog-store'
import { cn } from '#/lib/utils'

interface ResearchModalProps {
  isOpen: boolean
  onClose: () => void
  currentTopic?: string
  currentTitle?: string
  existingArticles?: Article[]
  onApplyOutline: (markdown: string) => void
}

const TRENDING_TOPICS = [
  'Building an MCP Server with TypeScript',
  'Optimistic Concurrency Control in Convex',
  'Hybrid Search: Combining BM25 with Dense Embeddings',
  'Deterministic State Machines for AI Agent Tooling',
]

export function ResearchModal({
  isOpen,
  onClose,
  currentTopic,
  currentTitle,
  existingArticles = [],
  onApplyOutline,
}: ResearchModalProps) {
  const [query, setQuery] = React.useState(currentTitle || currentTopic || '')
  const [researchResult, setResearchResult] = React.useState<ResearchResult | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [applied, setApplied] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      const initial = currentTitle || currentTopic || 'Building an MCP Server with TypeScript'
      setQuery(initial)
      runResearch(initial)
    }
  }, [isOpen, currentTitle, currentTopic])

  const runResearch = (topicText: string) => {
    setIsGenerating(true)
    setApplied(false)
    setTimeout(() => {
      const result = BlogIntelligence.runResearch(topicText, existingArticles)
      setResearchResult(result)
      setIsGenerating(false)
    }, 300)
  }

  const handleApply = () => {
    if (researchResult) {
      onApplyOutline(researchResult.suggestedMarkdown)
      setApplied(true)
      setTimeout(() => {
        onClose()
      }, 600)
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
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">AI Research Agent</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Investigates technical specifications, search intent, and structure before you draft
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

        {/* Input Bar */}
        <div className="p-6 border-b border-[#e7e5e4] dark:border-[#292524] bg-muted/20 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runResearch(query)}
                placeholder="Enter technical topic or architectural question..."
                className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-card border border-[#e7e5e4] dark:border-[#292524] rounded-lg text-foreground focus:outline-none focus:border-[#615fff]"
              />
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => runResearch(query)}
              disabled={isGenerating || !query.trim()}
              className="text-xs font-mono"
            >
              {isGenerating ? 'Researching...' : 'Research'}
            </Button>
          </div>

          {/* Quick topic tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-muted-foreground mr-1">Suggestions:</span>
            {TRENDING_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setQuery(t)
                  runResearch(t)
                }}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-card border border-[#e7e5e4] dark:border-[#292524] text-muted-foreground hover:text-foreground hover:border-[#615fff] transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {researchResult && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Intent & Core Concepts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-3.5 w-3.5 text-[#615fff]" />
                    <span>Search Intent</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{researchResult.intent}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Estimated reading time: {researchResult.estimatedReadTime}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <FileCode className="h-3.5 w-3.5 text-[#5ea500]" />
                    <span>Core Concepts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {researchResult.coreConcepts.map((c) => (
                      <Badge key={c} variant="outline" className="text-[11px] font-mono">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reader Questions */}
              <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <HelpCircle className="h-3.5 w-3.5 text-[#615fff]" />
                  <span>Key Questions Readers Expect Answered (AEO)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                  {researchResult.readerQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#615fff] font-bold">›</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested 5-part Technical Outline */}
              <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-[#615fff]" />
                  <span>Recommended Structural Outline</span>
                </div>

                <div className="space-y-3">
                  {researchResult.recommendedStructure.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-muted/30 border border-[#e7e5e4] dark:border-[#292524] space-y-1"
                    >
                      <div className="text-xs font-semibold text-foreground">{item.heading}</div>
                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                      {item.suggestedSnippet && (
                        <pre className="mt-2 p-2 rounded bg-card border border-[#e7e5e4] dark:border-[#292524] text-[10px] font-mono text-muted-foreground overflow-x-auto">
                          <code>{item.suggestedSnippet}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Authoritative References */}
              <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Authoritative References & RFCs
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {researchResult.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="truncate">
                        <div className="text-xs font-medium truncate">{ref.title}</div>
                        <div className="text-[10px] text-muted-foreground">{ref.source}</div>
                      </div>
                      <ExternalLink className="h-3 w-3 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#e7e5e4] dark:border-[#292524] bg-card flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-mono">
            Cancel
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            disabled={!researchResult || applied}
            className="text-xs font-mono flex items-center gap-1.5"
          >
            {applied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Outline Applied!</span>
              </>
            ) : (
              <>
                <span>Insert Outline into Article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
