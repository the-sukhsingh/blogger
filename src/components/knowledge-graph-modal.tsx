import * as React from 'react'
import { X, Network, ExternalLink, Sparkles, Filter } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { BlogIntelligence } from '#/lib/blog-intelligence'
import type { Article } from '#/lib/blog-store'
import type { KnowledgeGraphData } from '#/lib/blog-intelligence'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '#/lib/utils'

interface KnowledgeGraphModalProps {
  isOpen: boolean
  onClose: () => void
  articles: Article[]
  onSelectTopic?: (topic: string) => void
}

export function KnowledgeGraphModal({
  isOpen,
  onClose,
  articles,
  onSelectTopic,
}: KnowledgeGraphModalProps) {
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null)

  const graphData: KnowledgeGraphData = React.useMemo(() => {
    return BlogIntelligence.buildKnowledgeGraph(articles)
  }, [articles])

  if (!isOpen) return null

  const activeNodeData = graphData.nodes.find((n) => n.id === selectedNode)

  // Calculate cluster layout positions in SVG
  const width = 720
  const height = 480
  const centerX = width / 2
  const centerY = height / 2

  const topicNodes = graphData.nodes.filter((n) => n.type === 'topic')
  const articleNodes = graphData.nodes.filter((n) => n.type === 'article')

  // Distribute topics in an inner circle, articles in an outer orbit
  const positions: Record<string, { x: number; y: number }> = {}

  topicNodes.forEach((node, i) => {
    const angle = (i / Math.max(topicNodes.length, 1)) * 2 * Math.PI
    const radius = 110
    positions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  articleNodes.forEach((node, i) => {
    const angle = (i / Math.max(articleNodes.length, 1)) * 2 * Math.PI + 0.3
    const radius = 200
    positions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-background border border-[#e7e5e4] dark:border-[#292524] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e7e5e4] dark:border-[#292524] flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#615fff]/10 flex items-center justify-center text-[#615fff]">
              <Network className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Publication Knowledge Graph</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Interactive relationship map between published articles, topics, and conceptual entities
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

        {/* Graph Canvas */}
        <div className="relative flex-1 bg-muted/10 overflow-hidden flex items-center justify-center min-h-[460px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full max-h-[500px] select-none"
          >
            {/* Background grid dots */}
            <defs>
              <pattern id="graph-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" className="fill-[#e7e5e4] dark:fill-[#292524]" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#graph-grid)" />

            {/* Links / Edges */}
            <g className="stroke-[#e7e5e4] dark:stroke-[#292524] stroke-[1.5]">
              {graphData.links.map((link, idx) => {
                const sourcePos = positions[link.source]
                const targetPos = positions[link.target]
                if (!sourcePos || !targetPos) return null

                const isHighlighted =
                  selectedNode &&
                  (link.source === selectedNode || link.target === selectedNode)

                return (
                  <line
                    key={idx}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    className={cn(
                      'transition-all duration-200',
                      isHighlighted
                        ? 'stroke-[#615fff] stroke-[2.5] opacity-100'
                        : 'opacity-50'
                    )}
                  />
                )
              })}
            </g>

            {/* Nodes */}
            {graphData.nodes.map((node) => {
              const pos = positions[node.id]
              if (!pos) return null

              const isTopic = node.type === 'topic'
              const isSelected = selectedNode === node.id

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Outer glow ring if selected */}
                  {isSelected && (
                    <circle
                      r={isTopic ? 26 : 20}
                      className="fill-none stroke-[#615fff] stroke-[2] animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isTopic ? 18 : 12}
                    className={cn(
                      'transition-all duration-150',
                      isTopic
                        ? 'fill-[#615fff] text-white shadow-md'
                        : 'fill-card stroke-[#e7e5e4] dark:stroke-[#292524] stroke-2 group-hover:stroke-[#615fff]'
                    )}
                  />

                  {/* Label */}
                  <text
                    y={isTopic ? 32 : 24}
                    textAnchor="middle"
                    className={cn(
                      'text-[10px] font-mono font-medium transition-colors',
                      isSelected
                        ? 'fill-[#615fff] font-bold'
                        : 'fill-muted-foreground group-hover:fill-foreground'
                    )}
                  >
                    {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Node Inspector Floating Card */}
          {activeNodeData && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 p-4 rounded-xl border border-[#e7e5e4] dark:border-[#292524] bg-card/95 backdrop-blur-md shadow-lg space-y-2 animate-in fade-in slide-in-from-bottom duration-150">
              <div className="flex items-center justify-between">
                <Badge
                  variant={activeNodeData.type === 'topic' ? 'indigo' : 'outline'}
                  size="xs"
                  className="font-mono text-[10px] uppercase"
                >
                  {activeNodeData.type}
                </Badge>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-xs font-semibold text-foreground line-clamp-2">
                {activeNodeData.label}
              </div>

              <div className="pt-2 flex items-center gap-2">
                {activeNodeData.type === 'article' ? (
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => {
                      onClose()
                      navigate({ to: '/blog/$id', params: { id: activeNodeData.id } })
                    }}
                    className="w-full text-xs font-mono flex items-center justify-center gap-1"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      onSelectTopic?.(activeNodeData.label)
                      onClose()
                    }}
                    className="w-full text-xs font-mono flex items-center justify-center gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    <span>Filter by "{activeNodeData.label}"</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e7e5e4] dark:border-[#292524] bg-card flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div>
            {graphData.nodes.length} Nodes · {graphData.links.length} Connected Edges
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#615fff]" /> Topics
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full border border-[#79716b]" /> Articles
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
