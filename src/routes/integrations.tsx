import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import { Card } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { AuthModal } from '#/components/auth-modal'
import { useConvexAuth } from '@convex-dev/auth/react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  Key,
  Shield,
  Activity,
  Code2,
  Copy,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Play,
  Terminal,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react'

export const Route = createFileRoute('/integrations')({
  component: IntegrationsPage,
})

const CONVEX_SITE_URL =
  import.meta.env.VITE_CONVEX_SITE_URL || 'https://quick-mole-268.convex.site'

export function IntegrationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  // Tabs: 'keys' | 'logs' | 'tester' | 'guides'
  const [activeTab, setActiveTab] = React.useState<'keys' | 'logs' | 'tester' | 'guides'>('keys')

  // API Keys state
  const apiKeys = useQuery(api.apiKeys.list) || []
  const analytics = useQuery(api.apiKeys.getAnalytics, { limit: 50 })
  const createKeyMutation = useMutation(api.apiKeys.create)
  const revokeKeyMutation = useMutation(api.apiKeys.revoke)
  const deleteKeyMutation = useMutation(api.apiKeys.remove)

  // Key creation modal state
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [newKeyName, setNewKeyName] = React.useState('')
  const [isCreatingKey, setIsCreatingKey] = React.useState(false)
  const [createError, setCreateError] = React.useState<string | null>(null)
  const [newlyCreatedKey, setNewlyCreatedKey] = React.useState<{
    name: string
    key: string
    preview: string
  } | null>(null)

  // Copy helpers
  const [copiedKeyId, setCopiedKeyId] = React.useState<string | null>(null)
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKeyId(id)
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  // Interactive Live API Tester state
  const [selectedApiKey, setSelectedApiKey] = React.useState<string>('')
  const [testEndpoint, setTestEndpoint] = React.useState<'/api/v1/blogs' | '/api/v1/blogs/get' | '/api/v1/me'>('/api/v1/blogs')
  const [testStatusParam, setTestStatusParam] = React.useState<'published' | 'draft' | 'all'>('published')
  const [testSlugParam, setTestSlugParam] = React.useState('building-an-mcp-server-with-typescript')
  const [testLimitParam, setTestLimitParam] = React.useState('10')
  const [isExecutingTest, setIsExecutingTest] = React.useState(false)
  const [testResponse, setTestResponse] = React.useState<{
    status: number
    durationMs: number
    data: any
  } | null>(null)

  // Update selected API key when keys load or new key created
  React.useEffect(() => {
    if (newlyCreatedKey) {
      setSelectedApiKey(newlyCreatedKey.key)
    } else if (apiKeys.length > 0 && !selectedApiKey) {
      // Default to first active key
      const firstActive = apiKeys.find((k) => k.status === 'active')
      if (firstActive) {
        setSelectedApiKey(firstActive.preview)
      }
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
      setCreateError(err?.message || 'Failed to generate API key')
    } finally {
      setIsCreatingKey(false)
    }
  }

  const handleRevokeKey = async (id: any) => {
    if (confirm('Are you sure you want to revoke this API key? Any applications using it will immediately lose access.')) {
      await revokeKeyMutation({ id })
    }
  }

  const handleDeleteKey = async (id: any) => {
    if (confirm('Permanently delete this API key and its history?')) {
      await deleteKeyMutation({ id })
    }
  }

  const handleExecuteLiveTest = async () => {
    const keyToUse = newlyCreatedKey ? newlyCreatedKey.key : selectedApiKey
    if (!keyToUse) {
      alert('Please select or create an active API key to test the endpoints.')
      return
    }

    setIsExecutingTest(true)
    const startTime = performance.now()

    try {
      let url = `${CONVEX_SITE_URL}${testEndpoint}`
      const params = new URLSearchParams()

      if (testEndpoint === '/api/v1/blogs') {
        if (testStatusParam) params.set('status', testStatusParam)
        if (testLimitParam) params.set('limit', testLimitParam)
      } else if (testEndpoint === '/api/v1/blogs/get') {
        if (testSlugParam) params.set('slug', testSlugParam)
      }

      const queryString = params.toString()
      if (queryString) {
        url += `?${queryString}`
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${keyToUse}`,
          'Content-Type': 'application/json',
        },
      })

      const durationMs = Math.round(performance.now() - startTime)
      const data = await res.json().catch(() => ({ raw: 'Non-JSON response' }))

      setTestResponse({
        status: res.status,
        durationMs,
        data,
      })
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime)
      setTestResponse({
        status: 0,
        durationMs,
        data: { error: err?.message || 'Network request failed' },
      })
    } finally {
      setIsExecutingTest(false)
    }
  }

  const activeKeysCount = apiKeys.filter((k) => k.status === 'active').length

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 w-full py-8 space-y-8">
        {/* Top Header Banner */}
        <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-amber-500">
                DEVELOPER API & INTEGRATION
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                REST v1 Active
              </span>
            </div>
            <h1 className="text-3xl font-sans font-bold text-foreground">
              API Keys & Blog Access
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Programmatically fetch, query, and synchronize your published blogs to Astro, Next.js, Hugo, or custom apps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Generate API Key
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold"
              >
                Sign In to Manage Keys
              </Button>
            )}
          </div>
        </div>

        {/* Base URL Pill */}
        <div className="p-3.5 rounded-[12px] bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>API Base Endpoint:</span>
            <code className="text-foreground bg-muted px-2 py-0.5 rounded font-semibold">
              {CONVEX_SITE_URL}
            </code>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(CONVEX_SITE_URL, 'base-url')}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-[11px]"
          >
            {copiedKeyId === 'base-url' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedKeyId === 'base-url' ? 'Copied' : 'Copy URL'}
          </button>
        </div>

        {/* Newly Created Secret Key Banner (Shown only once) */}
        {newlyCreatedKey && (
          <div className="p-5 rounded-[14px] bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
              <Key className="w-4 h-4" />
              API Key Created: &quot;{newlyCreatedKey.name}&quot;
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Make sure to copy your API key now. For security purposes, Beelog will never display this full secret key again.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2.5 rounded-[8px] bg-background border border-amber-500/40 font-mono text-xs text-foreground select-all break-all">
                {newlyCreatedKey.key}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(newlyCreatedKey.key, 'new-secret')}
                className="border-amber-500/40 text-amber-600 dark:text-amber-400 shrink-0"
              >
                {copiedKeyId === 'new-secret' ? (
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                {copiedKeyId === 'new-secret' ? 'Copied!' : 'Copy Key'}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('keys')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'keys'
                ? 'border-amber-500 text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Keys</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted">
              {apiKeys.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'border-amber-500 text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Request Analytics & Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tester')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'tester'
                ? 'border-amber-500 text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive API Tester</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'guides'
                ? 'border-amber-500 text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Snippets & Astro</span>
          </button>
        </div>

        {/* TAB 1: API KEYS LIST */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            {!isAuthenticated ? (
              <Card className="p-8 text-center space-y-4 bg-card border-border">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Sign In to Manage Your API Keys
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  API keys allow you to query your private and published articles from custom static site generators, Astro themes, or external deployment pipelines.
                </p>
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                >
                  Sign In or Register
                </Button>
              </Card>
            ) : apiKeys.length === 0 ? (
              <Card className="p-8 text-center space-y-4 bg-card border-border">
                <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  No API Keys Generated Yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Create an API key to access your blogs via the REST API or connect your Astro, Next.js, or Hugo site.
                </p>
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Generate First Key
                </Button>
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-[12px] border border-border bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Key Preview</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Requests</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4">Last Used</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {apiKeys.map((key) => {
                      const isActive = key.status === 'active'
                      return (
                        <tr key={key._id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-foreground">
                            {key.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-muted-foreground">
                            <span className="bg-muted px-1.5 py-0.5 rounded">
                              {key.preview}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                                isActive
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-muted text-muted-foreground border border-border'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
                                }`}
                              />
                              {isActive ? 'Active' : 'Revoked'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-foreground font-semibold">
                            {key.totalRequests}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground">
                            {new Date(key.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground">
                            {key.lastUsedAt
                              ? new Date(key.lastUsedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Never'}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {isActive && (
                              <button
                                type="button"
                                onClick={() => handleRevokeKey(key._id)}
                                className="px-2 py-1 rounded text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                              >
                                Revoke
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteKey(key._id)}
                              className="px-2 py-1 rounded text-[11px] font-mono text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REQUEST ANALYTICS & LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-card border-border space-y-1">
                <div className="text-[11px] font-mono uppercase text-muted-foreground">
                  TOTAL REQUESTS
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {analytics?.totalRequests || 0}
                </div>
              </Card>

              <Card className="p-4 bg-card border-border space-y-1">
                <div className="text-[11px] font-mono uppercase text-muted-foreground">
                  REQUESTS (LAST 24H)
                </div>
                <div className="text-2xl font-bold font-mono text-amber-500">
                  {analytics?.requestsLast24h || 0}
                </div>
              </Card>

              <Card className="p-4 bg-card border-border space-y-1">
                <div className="text-[11px] font-mono uppercase text-muted-foreground">
                  SUCCESSFUL CALLS
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-500">
                  {analytics?.successCount || 0}
                </div>
              </Card>

              <Card className="p-4 bg-card border-border space-y-1">
                <div className="text-[11px] font-mono uppercase text-muted-foreground">
                  ACTIVE KEYS
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {activeKeysCount}
                </div>
              </Card>
            </div>

            {/* Request Logs Table */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground">
                Recent Request Tracking Log
              </h3>
              {!analytics || analytics.recentLogs.length === 0 ? (
                <Card className="p-6 text-center text-xs text-muted-foreground bg-card border-border">
                  No API requests recorded yet. Make a request via cURL or test using the Live Tester tab.
                </Card>
              ) : (
                <div className="overflow-x-auto rounded-[12px] border border-border bg-card">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Timestamp</th>
                        <th className="py-2.5 px-4">Method & Route</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Duration</th>
                        <th className="py-2.5 px-4">User Agent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {analytics.recentLogs.map((log) => {
                        const isSuccess = log.status >= 200 && log.status < 300
                        return (
                          <tr key={log._id} className="hover:bg-muted/30">
                            <td className="py-2.5 px-4 text-muted-foreground font-mono text-[11px]">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="py-2.5 px-4 font-mono font-semibold text-foreground">
                              <span className="text-amber-500 mr-2">{log.method}</span>
                              {log.endpoint}
                            </td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isSuccess
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-muted-foreground font-mono">
                              {log.durationMs !== undefined ? `${log.durationMs}ms` : '—'}
                            </td>
                            <td className="py-2.5 px-4 text-muted-foreground font-mono text-[11px] truncate max-w-xs">
                              {log.userAgent || 'Unknown Client'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE INTERACTIVE TESTER */}
        {activeTab === 'tester' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <Card className="lg:col-span-5 p-6 bg-card border-border space-y-4">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <Play className="w-4 h-4 text-amber-500" />
                Live API Request Config
              </div>

              {/* API Key selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Authorization Key
                </label>
                {newlyCreatedKey ? (
                  <div className="p-2 rounded bg-muted font-mono text-xs text-amber-500">
                    Using newly created key ({newlyCreatedKey.preview})
                  </div>
                ) : (
                  <input
                    type="text"
                    value={selectedApiKey}
                    onChange={(e) => setSelectedApiKey(e.target.value)}
                    placeholder="Enter blg_live_..."
                    className="w-full px-3 py-2 rounded-[8px] bg-background border border-border font-mono text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                )}
              </div>

              {/* Endpoint Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Select Endpoint
                </label>
                <select
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-[8px] bg-background border border-border font-mono text-xs text-foreground focus:outline-none focus:border-amber-500"
                >
                  <option value="/api/v1/blogs">GET /api/v1/blogs (List user blogs)</option>
                  <option value="/api/v1/blogs/get">GET /api/v1/blogs/get (Get single blog)</option>
                  <option value="/api/v1/me">GET /api/v1/me (Credentials check)</option>
                </select>
              </div>

              {/* Parameters based on endpoint */}
              {testEndpoint === '/api/v1/blogs' && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Filter by Status</label>
                    <select
                      value={testStatusParam}
                      onChange={(e) => setTestStatusParam(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-[8px] bg-background border border-border text-xs"
                    >
                      <option value="published">published only</option>
                      <option value="draft">draft only</option>
                      <option value="all">all articles</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Limit</label>
                    <input
                      type="number"
                      value={testLimitParam}
                      onChange={(e) => setTestLimitParam(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-[8px] bg-background border border-border text-xs"
                    />
                  </div>
                </div>
              )}

              {testEndpoint === '/api/v1/blogs/get' && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <label className="text-xs text-muted-foreground">Slug or Article ID</label>
                  <input
                    type="text"
                    value={testSlugParam}
                    onChange={(e) => setTestSlugParam(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-[8px] bg-background border border-border font-mono text-xs text-foreground"
                  />
                </div>
              )}

              <Button
                onClick={handleExecuteLiveTest}
                disabled={isExecutingTest}
                className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
              >
                {isExecutingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Send Request
                  </>
                )}
              </Button>
            </Card>

            {/* Test Response Inspector */}
            <Card className="lg:col-span-7 p-6 bg-card border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">API Response Inspector</span>
                {testResponse && (
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        testResponse.status >= 200 && testResponse.status < 300
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      HTTP {testResponse.status}
                    </span>
                    <span className="text-muted-foreground">
                      {testResponse.durationMs}ms
                    </span>
                  </div>
                )}
              </div>

              {!testResponse ? (
                <div className="p-12 text-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-[10px]">
                  Click &quot;Send Request&quot; to execute live test against {CONVEX_SITE_URL}.
                </div>
              ) : (
                <pre className="p-4 rounded-[10px] bg-background border border-border font-mono text-[11px] text-foreground max-h-96 overflow-auto leading-relaxed">
                  {JSON.stringify(testResponse.data, null, 2)}
                </pre>
              )}
            </Card>
          </div>
        )}

        {/* TAB 4: CODE SNIPPETS & ASTRO GUIDE */}
        {activeTab === 'guides' && (
          <div className="space-y-6 text-xs leading-relaxed text-muted-foreground">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">
                Connecting Beelog to Astro
              </h3>
              <p>
                In your Astro project, add your Beelog API key to <code className="px-1 bg-muted rounded">.env</code> as <code className="px-1 bg-muted rounded">BEELOG_API_KEY</code>, then dynamically render static pages with <code className="px-1 bg-muted rounded">getStaticPaths</code>:
              </p>

              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-foreground overflow-x-auto">
{`---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const res = await fetch('${CONVEX_SITE_URL}/api/v1/blogs?status=published', {
    headers: {
      'Authorization': \`Bearer \${import.meta.env.BEELOG_API_KEY}\`
    }
  });

  const { data: articles } = await res.json();

  return articles.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<article>
  <h1>{post.title}</h1>
  <p>Reading Time: {post.readingTime}</p>
  <div set:html={post.content} />
</article>`}
              </pre>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-base font-bold text-foreground">
                Next.js App Router
              </h3>
              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-foreground overflow-x-auto">
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
    <div>
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

            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-base font-bold text-foreground">
                cURL
              </h3>
              <pre className="p-4 rounded-[12px] bg-background border border-border font-mono text-foreground overflow-x-auto">
{`curl -X GET '${CONVEX_SITE_URL}/api/v1/blogs?status=published' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Generate New API Key */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-border rounded-[16px] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Generate New API Key
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Key Name / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Astro Blog Production, Local CLI Sync"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-[8px] bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              {createError && (
                <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {createError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreatingKey}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold"
                >
                  {isCreatingKey ? 'Generating...' : 'Create Key'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}
