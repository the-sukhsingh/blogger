import * as React from 'react'
import {
  X,
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { BlogIntelligence } from '#/lib/blog-intelligence'
import type { Article } from '#/lib/blog-store'
import { cn } from '#/lib/utils'

interface PublicationChatModalProps {
  isOpen: boolean
  onClose: () => void
  articles: Article[]
}

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

const PRESET_QUERIES = [
  'What should I write next?',
  'Which articles are outdated?',
  'What are my main topic clusters?',
  'Analyze my internal linking density',
]

export function PublicationChatModal({
  isOpen,
  onClose,
  articles,
}: PublicationChatModalProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I have indexed all ${articles.length} articles in your publication. Ask me anything about your topic clusters, missing content gaps, article freshness, or internal linking!`,
      timestamp: 'Just now',
    },
  ])
  const [input, setInput] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const chatEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isOpen) return null

  const handleSend = (queryText: string) => {
    const trimmed = queryText.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = BlogIntelligence.answerPublicationQuery(trimmed, articles)
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-background border border-[#e7e5e4] dark:border-[#292524] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#615fff]/10 flex items-center justify-center text-[#615fff]">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Publication Analyst AI</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Ask questions about your entire technical blog knowledge base
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

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[350px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex gap-3',
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {m.sender === 'assistant' && (
                <div className="h-7 w-7 rounded-full bg-[#615fff]/15 flex items-center justify-center text-[#615fff] shrink-0 text-xs font-mono font-semibold">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed space-y-1',
                  m.sender === 'user'
                    ? 'bg-[#615fff] text-white font-sans'
                    : 'bg-card border border-[#e7e5e4] dark:border-[#292524] text-foreground font-sans'
                )}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={cn(
                    'text-[10px] font-mono text-right',
                    m.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  )}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="h-7 w-7 rounded-full bg-muted/50 flex items-center justify-center text-foreground shrink-0 text-xs font-mono font-semibold">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pl-10">
              <span className="h-2 w-2 rounded-full bg-[#615fff] animate-ping" />
              <span>Analyzing publication database...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-6 py-2 border-t border-[#e7e5e4] dark:border-[#292524] bg-muted/20 flex flex-wrap gap-1.5">
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset}
              onClick={() => handleSend(preset)}
              className="text-[11px] font-mono px-2 py-1 rounded-md bg-card border border-[#e7e5e4] dark:border-[#292524] text-muted-foreground hover:text-foreground hover:border-[#615fff] transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(input)
          }}
          className="p-4 border-t border-[#e7e5e4] dark:border-[#292524] bg-card flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about your publication (e.g. gaps, topics, stale articles)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-muted/40 border border-[#e7e5e4] dark:border-[#292524] rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-[#615fff]"
          />
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={!input.trim() || isTyping}
            className="text-xs font-mono flex items-center gap-1.5 px-3"
          >
            <Send className="h-3 w-3" />
            <span>Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
