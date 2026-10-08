import * as React from 'react'
import { motion } from 'motion/react'

export function AgenticIntegrationsSection() {
  const agents = [
    { name: 'CHATGPT', color: 'text-emerald-600' },
    { name: 'CODEX', color: 'text-indigo-600' },
    { name: 'CLAUDE', color: 'text-amber-600' },
    { name: 'ANTIGRAVITY', color: 'text-blue-600' },
  ]

  return (
    <section className="space-y-8">
      <div className="space-y-1 text-center md:text-left">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#615fff]">
          AGENTIC INTEGRATIONS
        </div>
        <h2 className="text-[28px] md:text-[34px] font-sans font-medium text-foreground">
          Works with your favorite agent.
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200">
        {agents.map((agent) => (
          <a
            key={agent.name}
            href="#agent"
            className="p-4 py-6 bg-card hover:border-foreground transition-colors flex items-center justify-center group"
          >
            <div className="flex items-center gap-2.5">
              <motion.span className="font-mono text-xl font-bold uppercase tracking-[0.05em] text-foreground">
                {agent.name}
              </motion.span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
