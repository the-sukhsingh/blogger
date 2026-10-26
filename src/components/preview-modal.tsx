import * as React from 'react'
import {
  X,
  Eye,
  Search,
  Bot,
  Share2,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  slug: string
  topics: string[]
  author?: string
  readingTime?: string
  coverImage?: string
}

type PreviewTab = 'reader' | 'serp' | 'aeo' | 'social'

export function PreviewModal({
  isOpen,
  onClose,
  title,
  content,
  slug,
  topics,
  author = 'Staff Engineer',
  readingTime = '5 min read',
  coverImage,
}: PreviewModalProps) {
  const [activeTab, setActiveTab] = React.useState<PreviewTab>('reader')

  if (!isOpen) return null

  // Derived metadata for preview simulations
  const cleanTitle = title.trim() || 'Untitled Article'
  const cleanSlug = slug.trim() || 'untitled-post'
  const excerpt =
    content
      .replace(/^[#>\s-]+/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim()
      .slice(0, 160) || 'Comprehensive technical breakdown and architecture patterns.'

  const wordCount = content.split(/\s+/).filter(Boolean).length

  // AEO extracted definition
  const firstParagraph =
    content
      .split('\n\n')
      .map((p) => p.trim())
      .find((p) => p.length > 20 && !p.startsWith('#') && !p.startsWith('```')) || ''

  const definitionFound = firstParagraph.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-background border border-[#e7e5e4] dark:border-[#292524] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#615fff]/10 flex items-center justify-center text-[#615fff]">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Multi-Mode Article Preview</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Verify reader presentation, search engine indexability, and answer engine extraction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 border-b border-[#e7e5e4] dark:border-[#292524] bg-muted/30 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reader')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
              activeTab === 'reader'
                ? 'bg-card text-[#615fff] font-semibold shadow-sm border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Reader View</span>
          </button>

          <button
            onClick={() => setActiveTab('serp')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
              activeTab === 'serp'
                ? 'bg-card text-[#615fff] font-semibold shadow-sm border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Google SERP</span>
          </button>

          <button
            onClick={() => setActiveTab('aeo')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
              activeTab === 'aeo'
                ? 'bg-card text-[#615fff] font-semibold shadow-sm border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Answer Engine (AEO)</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors',
              activeTab === 'social'
                ? 'bg-card text-[#615fff] font-semibold shadow-sm border border-[#e7e5e4] dark:border-[#292524]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Social Card</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 1. READER PREVIEW */}
          {activeTab === 'reader' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {coverImage && (
                <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-[#e7e5e4] dark:border-[#292524]">
                  <img src={coverImage} alt={cleanTitle} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {topics.map((t) => (
                    <Badge key={t} variant="secondary" className="font-mono text-[11px]">
                      {t}
                    </Badge>
                  ))}
                  <span className="text-xs font-mono text-muted-foreground">·</span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">·</span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Today
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-foreground leading-[1.2]">
                  {cleanTitle}
                </h1>

                <div className="flex items-center gap-3 pt-1 border-b border-[#e7e5e4] dark:border-[#292524] pb-4">
                  <div className="h-8 w-8 rounded-full bg-[#615fff]/10 flex items-center justify-center text-[#615fff] font-mono font-semibold text-xs">
                    {author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">{author}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">Published to /blog/{cleanSlug}</div>
                  </div>
                </div>
              </div>

              {/* Body Markdown Content */}
              <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed font-sans space-y-4">
                {content.split('\n\n').map((block, index) => {
                  const trimmed = block.trim()
                  if (!trimmed) return null

                  if (trimmed.startsWith('# ')) {
                    return (
                      <h1 key={index} className="font-display text-2xl font-bold mt-6 mb-3 text-foreground">
                        {trimmed.replace(/^# /, '')}
                      </h1>
                    )
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={index} className="font-display text-xl font-semibold mt-6 mb-2 text-foreground">
                        {trimmed.replace(/^## /, '')}
                      </h2>
                    )
                  }
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-base font-semibold mt-4 mb-2 text-foreground">
                        {trimmed.replace(/^### /, '')}
                      </h3>
                    )
                  }
                  if (trimmed.startsWith('>')) {
                    return (
                      <blockquote
                        key={index}
                        className="border-l-2 border-[#615fff] pl-4 italic text-muted-foreground bg-[#615fff]/5 py-2 pr-3 rounded-r-md text-sm"
                      >
                        {trimmed.replace(/^>\s*/, '')}
                      </blockquote>
                    )
                  }
                  if (trimmed.startsWith('```')) {
                    const code = trimmed.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '')
                    return (
                      <pre
                        key={index}
                        className="bg-[#fafaf9] dark:bg-[#121110] border border-[#e7e5e4] dark:border-[#292524] rounded-lg p-4 font-mono text-xs overflow-x-auto text-foreground"
                      >
                        <code>{code}</code>
                      </pre>
                    )
                  }
                  return (
                    <p key={index} className="text-sm leading-relaxed text-[#292524] dark:text-[#d6d3d1]">
                      {trimmed}
                    </p>
                  )
                })}
              </div>
            </div>
          )}

          {/* 2. GOOGLE SERP PREVIEW */}
          {activeTab === 'serp' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Google Search Snippet Simulation
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#5f6368] dark:text-[#9aa0a6] font-sans">
                    <span className="font-semibold text-[#202124] dark:text-[#e8eaed]">blogger.dev</span>
                    <span>›</span>
                    <span>blog</span>
                    <span>›</span>
                    <span className="truncate max-w-[200px]">{cleanSlug}</span>
                  </div>

                  <h3 className="text-lg font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                    {cleanTitle} | Technical Publishing
                  </h3>

                  <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                    <span className="text-[#70757a] dark:text-[#9aa0a6]">Just now — </span>
                    {excerpt}
                  </p>
                </div>
              </div>

              {/* SERP Audit Indicators */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-1">
                  <span className="text-muted-foreground">Title Length:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{cleanTitle.length} chars</span>
                    {cleanTitle.length >= 30 && cleanTitle.length <= 60 ? (
                      <span className="text-[#5ea500] flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Optimal
                      </span>
                    ) : (
                      <span className="text-[#d97757] text-[11px]">Best: 30-60</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-1">
                  <span className="text-muted-foreground">Snippet Excerpt:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{excerpt.length} chars</span>
                    <span className="text-[#5ea500] flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="h-3 w-3" /> Auto-Generated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. ANSWER ENGINE (AEO) PREVIEW */}
          {activeTab === 'aeo' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="p-5 rounded-xl border border-[#615fff]/20 bg-[#615fff]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#615fff]">
                    <Bot className="h-4 w-4" />
                    <span>LLM Direct Answer Extraction (Perplexity / ChatGPT)</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#615fff]/10 text-[#615fff]">
                    AEO Ready
                  </span>
                </div>

                <div className="text-xs font-mono text-muted-foreground">
                  Simulated prompt: "What is {cleanTitle} and how does it work?"
                </div>

                <div className="p-3.5 rounded-lg bg-card border border-[#e7e5e4] dark:border-[#292524] text-xs text-foreground leading-relaxed space-y-2">
                  <p className="font-medium">
                    {firstParagraph ||
                      `${cleanTitle} is a technical architecture providing type-safe execution and reliable state coordination across distributed services.`}
                  </p>
                  <div className="pt-2 border-t border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>Cited from: /blog/{cleanSlug}</span>
                    <span className="text-[#5ea500]">High confidence score</span>
                  </div>
                </div>
              </div>

              {/* AEO Checklist */}
              <div className="p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card space-y-3">
                <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider block">
                  AEO Ingestion Checklist
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#5ea500]" />
                    <span className="text-muted-foreground">Core definition appears within the opening lines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#5ea500]" />
                    <span className="text-muted-foreground">Structured code blocks present for syntax extraction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#5ea500]" />
                    <span className="text-muted-foreground">Technical entities declared explicitly</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SOCIAL CARD PREVIEW */}
          {activeTab === 'social' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card overflow-hidden shadow-sm">
                <div className="h-44 bg-gradient-to-br from-[#292524] via-[#1c1917] to-[#0c0a09] p-6 flex flex-col justify-between text-white relative">
                  <div className="flex items-center justify-between text-xs font-mono text-[#a6a09b]">
                    <span>blogger.dev</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">
                      {topics[0] || 'Technical'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-normal leading-snug tracking-tight text-white line-clamp-2">
                      {cleanTitle}
                    </h3>
                    <p className="text-xs text-[#a6a09b] font-mono mt-1">by {author}</p>
                  </div>
                </div>
                <div className="p-3.5 bg-muted/40 border-t border-[#e7e5e4] dark:border-[#292524] space-y-1">
                  <div className="text-[11px] font-mono text-muted-foreground uppercase">blogger.dev</div>
                  <div className="text-xs font-semibold text-foreground truncate">{cleanTitle}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{excerpt}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e7e5e4] dark:border-[#292524] bg-card flex items-center justify-between">
          <div className="text-xs font-mono text-muted-foreground">
            {wordCount} words · {readingTime}
          </div>
          <Button variant="default" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  )
}
