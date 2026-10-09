import * as React from 'react'
import {
  FolderGit2,
  Code2,
  RefreshCw,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { DiffViewer } from '#/components/ui/diff-viewer'
import type { DiffLine } from '#/components/ui/diff-viewer'

const SAMPLE_DIFFS: DiffLine[] = [
  {
    type: 'unchanged',
    oldLineNumber: 1,
    newLineNumber: 1,
    content: '## Understanding Model Context Protocol (MCP)',
  },
  {
    type: 'deletion',
    oldLineNumber: 2,
    content:
      'MCP is an emerging API for AI models that allows desktop tools to send prompts back and forth.',
  },
  {
    type: 'addition',
    newLineNumber: 2,
    content:
      'The Model Context Protocol (MCP) is an open standard that enables AI clients to securely access external tools, prompts, and resources through structured JSON-RPC interfaces.',
  },
  {
    type: 'unchanged',
    oldLineNumber: 3,
    newLineNumber: 3,
    content:
      'By decoupling client models from provider implementations, developers maintain complete control over local execution contexts.',
  },
  {
    type: 'deletion',
    oldLineNumber: 4,
    content:
      'To build a server, run npm install @modelcontextprotocol/sdk@0.4.0.',
  },
  {
    type: 'addition',
    newLineNumber: 4,
    content:
      'To build a server with current type definitions, install @modelcontextprotocol/sdk@1.0.0 and configure transport handlers.',
  },
]

export function TransactionalPublishingSection() {
  const [activeCodeTab, setActiveCodeTab] = React.useState<
    'diff' | 'curl' | 'typescript' | 'rust'
  >('diff')

  return (
    <section className="space-y-8 pt-6">
      <div className="space-y-2">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#d97757]">
          #01 — GIT-BACKED PUBLISHING & DIFF ENGINE
        </div>
        <h2 className="text-[28px] md:text-[36px] font-sans font-medium text-foreground">
          Git diffs, markdown sync, and technical reviews your readers can rely on.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Features List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex gap-3.5">
            <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
              <FolderGit2 className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-1">
              <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                GIT INTEGRATION / REST
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Connect existing Markdown/MDX blogs programmatically with a
                clean, reliable REST API or local Git hooks.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
              <Code2 className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-1">
              <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                DIFF REVIEWS
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Drop-in libraries for Node, Next, and Astro. Every AI
                suggestion is rendered as a clean, reviewable Git diff.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-1">
              <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                FRESHNESS AGENT
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Scans for outdated documentation, changed APIs, and broken
                links before your readers notice.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="h-6 w-6 rounded-[6px] border border-border flex items-center justify-center shrink-0 text-foreground">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-1">
              <div className="text-[13px] font-bold font-mono tracking-wide text-foreground uppercase">
                WEBHOOKS & CI
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Get real-time event notifications for every draft, lint
                pass, content health audit, or publish failure.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#transactional"
              className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[#615fff] hover:underline"
            >
              <span>ALL ABOUT TRANSACTIONAL PUBLISHING</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Right Mockup Code & Diff Card */}
        <div className="lg:col-span-7">
          <div className="rounded-[16px] border border-border bg-card overflow-hidden shadow-sm">
            {/* Code Tabs Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted">
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('diff')}
                  className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'diff' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Unified Diff
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('curl')}
                  className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'curl' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  cURL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('typescript')}
                  className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'typescript' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  TypeScript
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('rust')}
                  className={`px-2.5 py-1 rounded-[6px] transition-colors ${activeCodeTab === 'rust' ? 'bg-card font-semibold text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Rust
                </button>
              </div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground">
                api.beelog.dev
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeCodeTab === 'diff' ? (
                <DiffViewer
                  title="posts/building-mcp-server-typescript.md"
                  diffs={SAMPLE_DIFFS}
                />
              ) : (
                <pre className="text-xs font-mono p-4 rounded-[12px] bg-background border border-border text-foreground overflow-x-auto leading-relaxed">
                  {activeCodeTab === 'curl' &&
                    `curl --location 'https://api.beelog.dev/v1/publish' \\
--header 'Authorization: Bearer YOUR_API_KEY' \\
--header 'Content-Type: application/json' \\
--data-raw '{
  "slug": "mcp-server-architecture",
  "branch": "main",
  "review": {
    "freshness": true,
    "aeo_optimize": true
  }
}'`}
                  {activeCodeTab === 'typescript' &&
                    `import { Beelog } from '@beelog/client'

const client = new Beelog({ apiKey: process.env.BEELOG_KEY })

await client.articles.sync({
  path: './content/blog',
  onProposedDiff: async (diff) => {
    console.log('AI proposed review diff:', diff.summary)
  }
})`}
                  {activeCodeTab === 'rust' &&
                    `use beelog_sdk::Beelog;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Beelog::new("API_KEY");
    let review = client.review_post("mcp-typescript.md").await?;
    println!("Status: {:?}", review.health);
    Ok(())
}`}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
