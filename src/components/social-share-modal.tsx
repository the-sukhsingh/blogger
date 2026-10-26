import * as React from 'react'
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  FileCode,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

interface SocialShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  slug: string
  content: string
  author?: string
}

export function SocialShareModal({
  isOpen,
  onClose,
  title,
  slug,
  content,
  author = 'Staff Engineer',
}: SocialShareModalProps) {
  const [copiedLink, setCopiedLink] = React.useState(false)
  const [copiedCitation, setCopiedCitation] = React.useState(false)

  if (!isOpen) return null

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${slug}`
      : `https://blogger.dev/blog/${slug}`

  const tweetText = encodeURIComponent(
    `"${title}" by ${author} — exploring technical architecture and implementation:`
  )
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(
    shareUrl
  )}`

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyCitation = () => {
    const citation = `[${title}](${shareUrl}) — ${author}`
    navigator.clipboard.writeText(citation)
    setCopiedCitation(true)
    setTimeout(() => setCopiedCitation(false), 2000)
  }

  const handleDownload = (format: 'md' | 'mdx') => {
    const fullContent =
      format === 'mdx'
        ? `---
title: "${title}"
author: "${author}"
date: "${new Date().toISOString().split('T')[0]}"
---

${content}
`
        : content

    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug}.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-background border border-[#e7e5e4] dark:border-[#292524] rounded-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4] dark:border-[#292524]">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-[#615fff]" />
            <h3 className="text-sm font-semibold text-foreground">Share Article</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] bg-card text-xs font-mono text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Share on X</span>
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] bg-card text-xs font-mono text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Share on LinkedIn</span>
          </a>
        </div>

        {/* Direct Link */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Direct Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground truncate select-all"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs font-mono shrink-0"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-[#5ea500]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>
        </div>

        {/* Markdown Citation */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Markdown Citation
          </label>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-[#e7e5e4] dark:border-[#292524] text-xs font-mono">
            <span className="truncate text-muted-foreground max-w-[240px]">
              [{title}]({shareUrl})
            </span>
            <button
              onClick={handleCopyCitation}
              className="text-[#615fff] hover:underline font-mono text-[11px] ml-2 shrink-0"
            >
              {copiedCitation ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Export File */}
        <div className="pt-2 border-t border-[#e7e5e4] dark:border-[#292524] space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Download Source
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('md')}
              className="flex-1 text-xs font-mono flex items-center justify-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .md</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('mdx')}
              className="flex-1 text-xs font-mono flex items-center justify-center gap-1.5"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Download .mdx</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
