import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import { Button } from '#/components/ui/button'
import { AuthModal } from '#/components/auth-modal'
import { useConvexAuth } from '@convex-dev/auth/react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Play,
  Terminal,
  Activity,
  Code2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react'

export const Route = createFileRoute('/integrations')({
  component: IntegrationsPage,
})

const CONVEX_SITE_URL =
  import.meta.env.VITE_CONVEX_SITE_URL || 'https://quick-mole-268.convex.site'

export function IntegrationsPage() {
  const { isAuthenticated } = useConvexAuth()
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  // Navigation tab: 'keys' | 'console' | 'guides'
  const [activeTab, setActiveTab] = React.useState<'keys' | 'console' | 'guides'>('keys')

  // API Keys & Analytics from Convex
  const apiKeys = useQuery(api.apiKeys.list) || []
  const analytics = useQuery(api.apiKeys.getAnalytics, { limit: 25 })
  const createKeyMutation = useMutation(api.apiKeys.create)
  const revokeKeyMutation = useMutation(api.apiKeys.revoke)
  const deleteKeyMutation = useMutation(api.apiKeys.remove)

  // Key creation dialog state
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [newKeyName, setNewKeyName] = React.useState('')
  const [isCreatingKey, setIsCreatingKey] = React.useState(false)
  const [createError, setCreateError] = React.useState<string | null>(null)
  const [newlyCreatedKey, setNewlyCreatedKey] = React.useState<{
    name: string
    key: string
    preview: string
  } | null>(null)

  // Copy feedback state
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Interactive Live Console state
  const [selectedApiKey, setSelectedApiKey] = React.useState<string>('')
  const [consoleEndpoint, setConsoleEndpoint] = React.useState<
    '/api/v1/blogs' | '/api/v1/blogs/get' | '/api/v1/me'
  >('/api/v1/blogs')
  const [filterStatus, setFilterStatus] = React.useState<'published' | 'draft' | 'all'>('published')
  const [filterSlug, setFilterSlug] = React.useState('building-an-mcp-server-with-typescript')
  const [filterLimit, setFilterLimit] = React.useState('10')
  const [isSendingRequest, setIsSendingRequest] = React.useState(false)
  const [consoleResponse, setConsoleResponse] = React.useState<{
    status: number
    durationMs: number
    data: any
  } | null>(null)

  // Framework Guide active tab
  const [activeGuide, setActiveGuide] = React.useState<'astro' | 'nextjs' | 'curl' | 'typescript'>('astro')

  // Sync selected key default
  React.useEffect(() => {
    if (newlyCreatedKey) {
      setSelectedApiKey(newlyCreatedKey.key)
    } else if (apiKeys.length > 0 && !selectedApiKey) {
      const active = apiKeys.find((k) => k.status === 'active')
      if (active) setSelectedApiKey(active.preview)
    }
  }, [apiKeys, newlyCreatedKey, selectedApiKey])

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    setIsCreatingKey(true)
    setCreateError(null)

    try {
      const res = await createKeyMutation({ name: newKeyName.trim() })
      setNewlyCreatedKey(res)
      setNewKeyName('')
      setCreateModalOpen(false)
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create key')
    } finally {
      setIsCreatingKey(false)
    }
  }

  const handleRevokeKey = async (id: any) => {
    if (confirm('Revoke this API key? External applications using it will immediately be denied.')) {
      await revokeKeyMutation({ id })
    }
  }

  const handleDeleteKey = async (id: any) => {
    if (confirm('Permanently delete this API key?')) {
      await deleteKeyMutation({ id })
    }
  }

  const handleRunConsoleTest = async () => {
    const keyToUse = newlyCreatedKey ? newlyCreatedKey.key : selectedApiKey
    if (!keyToUse) {
      alert('Please select or create an active API key to test the endpoints.')
      return
    }

    setIsSendingRequest(true)
    const start = performance.now()

    try {
      let url = `${CONVEX_SITE_URL}${consoleEndpoint}`
      const params = new URLSearchParams()

      if (consoleEndpoint === '/api/v1/blogs') {
        if (filterStatus) params.set('status', filterStatus)
        if (filterLimit) params.set('limit', filterLimit)
      } else if (consoleEndpoint === '/api/v1/blogs/get') {
        if (filterSlug) params.set('slug', filterSlug)
      }

      const q = params.toString()
      if (q) url += `?${q}`

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${keyToUse}`,
          'Content-Type': 'application/json',
        },
      })

      const durationMs = Math.round(performance.now() - start)
      const data = await res.json().catch(() => ({ raw: 'Non-JSON response' }))

      setConsoleResponse({
        status: res.status,
        durationMs,
        data,
      })
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - start)
      setConsoleResponse({
        status: 0,
        durationMs,
        data: { error: err?.message || 'Network request failed' },
      })
    } finally {
      setIsSendingRequest(false)
    }
  }

  const activeKeysCount = apiKeys.filter((k) => k.status === 'active').length

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 w-full py-10 space-y-8">
        {/* Minimal Header */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-sans font-bold text-foreground tracking-tight">
                API & Integrations
              </h1>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Connect your technical articles to your personal Astro, Next.js, or Hugo site via secure REST endpoints.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isAuthenticated ? (
                <Button
                  size="sm"
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Generate Key
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs"
                >
                  Sign In to Create Keys
                </Button>
              )}
            </div>
          </div>

          {/* Quick Endpoint Copy Bar */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-muted/60 border border-border text-[12px] font-mono text-muted-foreground">
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
              API Base
            </span>
            <span className="text-border">|</span>
            <code className="text-foreground select-all">{CONVEX_SITE_URL}</code>
            <button
              type="button"
              onClick={() => copyToClipboard(CONVEX_SITE_URL, 'base-endpoint')}
              className="ml-1 hover:text-foreground transition-colors"
              title="Copy base URL"
            >
              {copiedId === 'base-endpoint' ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Secret Key Revealed Card (Shown once immediately after key generation) */}
        {newlyCreatedKey && (
          <div className="p-4 rounded-[12px] bg-amber-500/10 border border-amber-500/30 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>API Key Generated: &quot;{newlyCreatedKey.name}&quot;</span>
              </div>
              <button
                type="button"
                onClick={() => setNewlyCreatedKey(null)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Copy this secret token now. For your security, Beelog cannot show it again.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-[8px] bg-background border border-amber-500/40 font-mono text-[12px] text-foreground select-all break-all">
                {newlyCreatedKey.key}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(newlyCreatedKey.key, 'secret-key-copy')}
                className="border-amber-500/40 text-amber-600 dark:text-amber-400 shrink-0 text-xs"
              >
                {copiedId === 'secret-key-copy' ? (
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                {copiedId === 'secret-key-copy' ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        {/* Clean Nav Tabs */}
        <div className="flex items-center border-b border-border gap-6 text-[13px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('keys')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'keys'
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>API Keys</span>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
              {apiKeys.length}
            </span>
            {activeTab === 'keys' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'console'
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Console</span>
            {activeTab === 'console' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              activeTab === 'guides'
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Framework Quickstart</span>
            {activeTab === 'guides' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: API KEYS & TELEMETRY */}
        {activeTab === 'keys' && (
          <div className="space-y-8">
            {/* Minimal Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[12px] bg-card border border-border">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">
                  Active Keys
                </div>
                <div className="text-xl font-bold font-mono text-foreground">
                  {activeKeysCount}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">
                  Total Requests
                </div>
                <div className="text-xl font-bold font-mono text-foreground">
                  {analytics?.totalRequests || 0}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">
                  Requests (24h)
                </div>
                <div className="text-xl font-bold font-mono text-amber-500">
                  {analytics?.requestsLast24h || 0}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">
                  Success Rate
                </div>
                <div className="text-xl font-bold font-mono text-emerald-500">
                  {analytics?.totalRequests
                    ? `${Math.round(((analytics.successCount || 0) / analytics.totalRequests) * 100)}%`
                    : '100%'}
                </div>
              </div>
            </div>

            {/* Keys List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                  Your Credentials
                </h3>
              </div>

              {!isAuthenticated ? (
                <div className="p-8 text-center rounded-[12px] bg-card border border-border space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                    <Key className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Sign In to Access API Keys
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Sign in to generate credentials and query your articles programmatically.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                  >
                    Sign In or Register
                  </Button>
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="p-8 text-center rounded-[12px] bg-card border border-border space-y-3">
                  <p className="text-xs text-muted-foreground">
                    No API keys created yet. Generate a key to begin syncing your blog with external sites.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Generate Key
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border rounded-[12px] border border-border bg-card overflow-hidden">
                  {apiKeys.map((key) => {
                    const isActive = key.status === 'active'
                    return (
                      <div
                        key={key._id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {key.name}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                                isActive
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
                                }`}
                              />
                              {isActive ? 'Active' : 'Revoked'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                            <span className="bg-muted px-1.5 py-0.5 rounded text-foreground">
                              {key.preview}
                            </span>
                            <span>·</span>
                            <span>{key.totalRequests} calls</span>
                            <span>·</span>
                            <span>
                              Last used:{' '}
                              {key.lastUsedAt
                                ? new Date(key.lastUsedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'Never'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isActive && (
                            <button
                              type="button"
                              onClick={() => handleRevokeKey(key._id)}
                              className="px-2.5 py-1 rounded-[6px] text-[11px] font-mono text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-muted transition-colors"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteKey(key._id)}
                            className="p-1 rounded-[6px] text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors"
                            title="Delete Key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recent Telemetry Stream */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                Recent Request Stream
              </h3>

              {!analytics || analytics.recentLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground rounded-[12px] border border-border bg-card">
                  No requests recorded yet. Fire an API call via cURL or the Interactive Console tab.
                </div>
              ) : (
                <div className="rounded-[12px] border border-border bg-card divide-y divide-border overflow-hidden">
                  {analytics.recentLogs.map((log) => {
                    const isSuccess = log.status >= 200 && log.status < 300
                    return (
                      <div
                        key={log._id}
                        className="px-4 py-3 flex items-center justify-between text-xs font-mono hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isSuccess
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {log.status}
                          </span>
                          <span className="text-foreground font-semibold">
                            {log.method} {log.endpoint}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
                          <span>{log.durationMs !== undefined ? `${log.durationMs}ms` : '—'}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE LIVE CONSOLE */}
        {activeTab === 'console' && (
          <div className="space-y-6">
            <div className="p-4 rounded-[12px] bg-card border border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-foreground font-semibold">
                  <Play className="w-3.5 h-3.5 text-amber-500" />
                  <span>Request Builder</span>
                </div>

                {/* API Key in use */}
                <div className="flex items-center gap-2 font-mono text-muted-foreground">
                  <span>Key:</span>
                  <code className="text-foreground bg-muted px-2 py-0.5 rounded">
                    {newlyCreatedKey ? newlyCreatedKey.preview : selectedApiKey || 'No active key'}
                  </code>
                </div>
              </div>

              {/* Endpoint selection & params bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5">
                  <select
                    value={consoleEndpoint}
                    onChange={(e) => setConsoleEndpoint(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-[8px] bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-amber-500"
                  >
                    <option value="/api/v1/blogs">GET /api/v1/blogs</option>
                    <option value="/api/v1/blogs/get">GET /api/v1/blogs/get</option>
                    <option value="/api/v1/me">GET /api/v1/me</option>
                  </select>
                </div>

                {consoleEndpoint === '/api/v1/blogs' && (
                  <>
                    <div className="sm:col-span-4">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-[8px] bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-amber-500"
                      >
                        <option value="published">status: published</option>
                        <option value="draft">status: draft</option>
                        <option value="all">status: all</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <Button
                        size="sm"
                        onClick={handleRunConsoleTest}
                        disabled={isSendingRequest}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                      >
                        {isSendingRequest ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" /> Send
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}

                {consoleEndpoint === '/api/v1/blogs/get' && (
                  <>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="slug or article id"
                        value={filterSlug}
                        onChange={(e) => setFilterSlug(e.target.value)}
                        className="w-full px-3 py-2 rounded-[8px] bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Button
                        size="sm"
                        onClick={handleRunConsoleTest}
                        disabled={isSendingRequest}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                      >
                        {isSendingRequest ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" /> Send
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}

                {consoleEndpoint === '/api/v1/me' && (
                  <div className="sm:col-span-7">
                    <Button
                      size="sm"
                      onClick={handleRunConsoleTest}
                      disabled={isSendingRequest}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                    >
                      {isSendingRequest ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" /> Send
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Live Terminal Output */}
            <div className="rounded-[12px] bg-card border border-border overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Response Payload</span>
                {consoleResponse && (
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        consoleResponse.status >= 200 && consoleResponse.status < 300
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      HTTP {consoleResponse.status}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {consoleResponse.durationMs}ms
                    </span>
                  </div>
                )}
              </div>

              {!consoleResponse ? (
                <div className="p-12 text-center text-xs text-muted-foreground font-mono">
                  Click &quot;Send&quot; above to execute a live authenticated request against {CONVEX_SITE_URL}.
                </div>
              ) : (
                <pre className="p-4 font-mono text-[11px] text-foreground max-h-96 overflow-auto leading-relaxed select-all">
                  {JSON.stringify(consoleResponse.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: FRAMEWORK QUICKSTART */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            {/* Framework Switcher */}
            <div className="flex border-b border-border gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveGuide('astro')}
                className={`pb-2 transition-colors ${
                  activeGuide === 'astro'
                    ? 'border-b-2 border-amber-500 text-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Astro (Static Generation)
              </button>
              <button
                type="button"
                onClick={() => setActiveGuide('nextjs')}
                className={`pb-2 transition-colors ${
                  activeGuide === 'nextjs'
                    ? 'border-b-2 border-amber-500 text-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Next.js (App Router ISR)
              </button>
              <button
                type="button"
                onClick={() => setActiveGuide('curl')}
                className={`pb-2 transition-colors ${
                  activeGuide === 'curl'
                    ? 'border-b-2 border-amber-500 text-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                cURL
              </button>
              <button
                type="button"
                onClick={() => setActiveGuide('typescript')}
                className={`pb-2 transition-colors ${
                  activeGuide === 'typescript'
                    ? 'border-b-2 border-amber-500 text-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                TypeScript Fetch
              </button>
            </div>

            {/* Code Snippet Box with 1-click Copy */}
            <div className="space-y-3">
              {activeGuide === 'astro' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>src/pages/blog/[slug].astro</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `export async function getStaticPaths() {\n  const res = await fetch('${CONVEX_SITE_URL}/api/v1/blogs?status=published', {\n    headers: { 'Authorization': \`Bearer \${import.meta.env.BEELOG_API_KEY}\` }\n  });\n  const { data: posts } = await res.json();\n  return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));\n}`,
                          'code-astro'
                        )
                      }
                      className="hover:text-foreground flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedId === 'code-astro' ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedId === 'code-astro' ? 'Copied' : 'Copy Snippet'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-[12px] bg-card border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const res = await fetch('${CONVEX_SITE_URL}/api/v1/blogs?status=published', {
    headers: {
      'Authorization': \`Bearer \${import.meta.env.BEELOG_API_KEY}\`
    }
  });

  const { data: posts } = await res.json();

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<article>
  <h1>{post.title}</h1>
  <p>{post.readingTime}</p>
  <div set:html={post.content} />
</article>`}
                  </pre>
                </div>
              )}

              {activeGuide === 'nextjs' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>app/blog/page.tsx</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `export default async function BlogPage() {\n  const res = await fetch('${CONVEX_SITE_URL}/api/v1/blogs?status=published', {\n    headers: { 'Authorization': \`Bearer \${process.env.BEELOG_API_KEY}\` },\n    next: { revalidate: 60 }\n  });\n  const { data: articles } = await res.json();\n  return <div>{articles.map(a => <h2 key={a.id}>{a.title}</h2>)}</div>;\n}`,
                          'code-next'
                        )
                      }
                      className="hover:text-foreground flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedId === 'code-next' ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedId === 'code-next' ? 'Copied' : 'Copy Snippet'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-[12px] bg-card border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`// app/blog/page.tsx
export default async function BlogIndexPage() {
  const res = await fetch('${CONVEX_SITE_URL}/api/v1/blogs?status=published', {
    headers: {
      'Authorization': \`Bearer \${process.env.BEELOG_API_KEY}\`
    },
    next: { revalidate: 60 } // Incremental Static Regeneration (ISR)
  });

  const { data: articles } = await res.json();

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <a key={article.id} href={\`/blog/\${article.slug}\`}>
          <h2>{article.title}</h2>
        </a>
      ))}
    </div>
  );
}`}
                  </pre>
                </div>
              )}

              {activeGuide === 'curl' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Terminal cURL</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `curl -X GET '${CONVEX_SITE_URL}/api/v1/blogs?status=published' -H 'Authorization: Bearer YOUR_API_KEY'`,
                          'code-curl'
                        )
                      }
                      className="hover:text-foreground flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedId === 'code-curl' ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedId === 'code-curl' ? 'Copied' : 'Copy Snippet'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-[12px] bg-card border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`curl -X GET '${CONVEX_SITE_URL}/api/v1/blogs?status=published' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`}
                  </pre>
                </div>
              )}

              {activeGuide === 'typescript' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>fetch-articles.ts</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `const res = await fetch('${CONVEX_SITE_URL}/api/v1/blogs', { headers: { 'Authorization': \`Bearer \${process.env.BEELOG_API_KEY}\` } }); const { data } = await res.json();`,
                          'code-ts'
                        )
                      }
                      className="hover:text-foreground flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedId === 'code-ts' ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedId === 'code-ts' ? 'Copied' : 'Copy Snippet'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-[12px] bg-card border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  readingTime: string
  publishedAt?: number
}

export async function fetchPublishedArticles(apiKey: string): Promise<BlogArticle[]> {
  const response = await fetch('${CONVEX_SITE_URL}/api/v1/blogs?status=published', {
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
    },
  });

  if (!response.ok) {
    throw new Error(\`Failed to fetch blogs: \${response.status}\`);
  }

  const payload = await response.json();
  return payload.data;
}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Generate API Key Dialog */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-card border border-border rounded-[14px] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Generate API Key
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Key Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Astro Blog Production"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3 py-2 rounded-[8px] bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              {createError && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {createError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreatingKey}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                >
                  {isCreatingKey ? 'Creating...' : 'Create Key'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}
