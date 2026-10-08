import * as React from 'react'
import {
  Heading,
  Code,
  Image,
  Table,
  Quote,
  MessageSquare,
  Link,
  Sparkles,
  RefreshCw,
  FileText,
  Search,
} from 'lucide-react'
import { cn } from '#/lib/utils'

export interface SlashCommandItem {
  id: string
  label: string
  description: string
  category: 'Block' | 'AI Action' | 'Formatting'
  icon: React.ReactNode
  shortcut?: string
}

export const DEFAULT_SLASH_COMMANDS: SlashCommandItem[] = [
  // Blocks
  {
    id: 'heading',
    label: '/heading',
    description: 'Insert big section heading (H2/H3)',
    category: 'Block',
    icon: <Heading className="h-4 w-4" />,
  },
  {
    id: 'code',
    label: '/code',
    description: 'Add syntax-highlighted code block',
    category: 'Block',
    icon: <Code className="h-4 w-4" />,
  },
  {
    id: 'callout',
    label: '/callout',
    description: 'Add contextual note or technical warning',
    category: 'Block',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 'quote',
    label: '/quote',
    description: 'Add quotation or citation block',
    category: 'Block',
    icon: <Quote className="h-4 w-4" />,
  },
  {
    id: 'table',
    label: '/table',
    description: 'Insert comparative data table',
    category: 'Block',
    icon: <Table className="h-4 w-4" />,
  },
  {
    id: 'image',
    label: '/image',
    description: 'Embed technical diagram or screenshot',
    category: 'Block',
    icon: <Image className="h-4 w-4" />,
  },
  {
    id: 'link',
    label: '/link',
    description: 'Link phrase to existing blog post',
    category: 'Block',
    icon: <Link className="h-4 w-4" />,
    shortcut: '⌘K',
  },

  // AI Assistant (AGENTS.md § 9)
  {
    id: 'improve',
    label: '/improve',
    description: 'Polish clarity while preserving your voice',
    category: 'AI Action',
    icon: <Sparkles className="h-4 w-4 text-primary" />,
  },
  {
    id: 'explain',
    label: '/explain',
    description: 'Clarify complex technical concept',
    category: 'AI Action',
    icon: <FileText className="h-4 w-4 text-primary" />,
  },
  {
    id: 'add-example',
    label: '/add-example',
    description: 'Generate concise code demonstration',
    category: 'AI Action',
    icon: <Code className="h-4 w-4 text-primary" />,
  },
  {
    id: 'rewrite',
    label: '/rewrite',
    description: 'Propose alternate technical phrasing (diff view)',
    category: 'AI Action',
    icon: <RefreshCw className="h-4 w-4 text-primary" />,
  },
]

export interface SlashCommandMenuProps {
  items?: SlashCommandItem[]
  onSelect?: (item: SlashCommandItem) => void
  onClose?: () => void
  className?: string
}

export function SlashCommandMenu({
  items = DEFAULT_SLASH_COMMANDS,
  onSelect,
  className,
}: SlashCommandMenuProps) {
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items
    const lower = query.toLowerCase().replace(/^\//, '')
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    )
  }, [items, query])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(
        (prev) =>
          (prev - 1 + filteredItems.length) % (filteredItems.length || 1),
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        onSelect?.(filteredItems[selectedIndex])
      }
    }
  }

  return (
    <div
      className={cn(
        'w-80 rounded-[12px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] p-2 text-[#292524] dark:text-[#fafaf9] shadow-lg overflow-hidden',
        // Emil Kowalski principle: Origin aware scale
        'animate-in fade-in zoom-in-95 duration-125 ease-out',
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      <div className="relative mb-2 px-1">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#a6a09b]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter commands..."
          className="w-full rounded-[8px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] py-1.5 pl-8 pr-3 text-xs text-[#292524] dark:text-[#fafaf9] placeholder:text-[#a6a09b] focus:outline-none focus:border-[#615fff]"
          autoFocus
        />
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1 pr-1 overscroll-contain">
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#79716b] dark:text-[#a6a09b]">
            No matching command
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  'flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-left cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-[#fafaf9] dark:bg-[#211f1e] text-[#292524] dark:text-[#fafaf9]'
                    : 'text-[#292524] dark:text-[#fafaf9] hover:bg-[#fafaf9]/80 dark:hover:bg-[#211f1e]/80',
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] bg-white dark:bg-[#171514] text-[#79716b] dark:text-[#a6a09b]">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-[#79716b] dark:text-[#a6a09b] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-[#79716b] dark:text-[#a6a09b]">
                      {item.description}
                    </p>
                  </div>
                </div>
                {item.shortcut && (
                  <kbd className="ml-2 rounded-[6px] border border-[#e7e5e4] dark:border-[#292524] bg-[#fafaf9] dark:bg-[#121110] px-1.5 py-0.5 text-[10px] font-mono text-[#79716b] dark:text-[#a6a09b]">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
