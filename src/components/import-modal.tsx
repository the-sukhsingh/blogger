import * as React from 'react'
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { BlogStore } from '#/lib/blog-store'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const navigate = useNavigate()
  const createBlog = useMutation(api.blogs.create)

  const [fileName, setFileName] = React.useState('')
  const [content, setContent] = React.useState('')
  const [isImporting, setIsImporting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (!isOpen) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setContent(text || '')
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!content.trim()) return

    setIsImporting(true)
    setError(null)

    try {
      // Parse Title from frontmatter or first heading
      let title = 'Imported Article'
      const titleMatch = content.match(/^#\s+(.*)$/m) || content.match(/^title:\s*["']?(.*?)["']?$/m)
      if (titleMatch) {
        title = titleMatch[1].trim()
      } else if (fileName) {
        title = fileName.replace(/\.(md|mdx)$/, '').replace(/[-_]/g, ' ')
      }

      let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `post-${Date.now()}`

      let newId: string
      try {
        newId = await createBlog({
          title,
          slug,
          content,
          status: 'published',
          topics: ['Engineering', 'Imported'],
        })
      } catch (err: any) {
        if (err?.message?.includes('already exists')) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`
          newId = await createBlog({
            title,
            slug,
            content,
            status: 'published',
            topics: ['Engineering', 'Imported'],
          })
        } else {
          throw err
        }
      }

      BlogStore.saveArticle({
        id: newId,
        slug,
        title,
        content,
        topics: ['Engineering', 'Imported'],
        gitBranch: 'main',
        status: 'published',
        proposedDiffs: [],
      })

      onClose()
      navigate({ to: '/blog/$id', params: { id: newId } })
    } catch (err: any) {
      console.error('Import failed:', err)
      setError(err?.message || 'Failed to import article.')
      setIsImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-background border border-[#e7e5e4] dark:border-[#292524] rounded-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4] dark:border-[#292524]">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-[#615fff]" />
            <h3 className="text-sm font-semibold text-foreground">Import Markdown Article</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Upload box */}
        <label className="border-2 border-dashed border-[#e7e5e4] dark:border-[#292524] hover:border-[#615fff] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/10 transition-colors">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs font-mono font-medium text-foreground">
            {fileName || 'Click or drag a .md or .mdx file here'}
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            Supports standard Markdown with frontmatter
          </span>
          <input
            type="file"
            accept=".md,.mdx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Paste Option */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Or Paste Markdown Content Directly:
          </label>
          <textarea
            rows={5}
            placeholder="# Paste your markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg p-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-[#615fff] resize-y"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#ff0000]/10 border border-[#ff0000]/30 text-xs font-mono text-[#ff0000] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-mono">
            Cancel
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleImport}
            disabled={isImporting || !content.trim()}
            className="text-xs font-mono"
          >
            {isImporting ? 'Importing...' : 'Import into Blog'}
          </Button>
        </div>
      </div>
    </div>
  )
}
