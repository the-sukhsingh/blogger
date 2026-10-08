
import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function AgenticIntegrationsSection() {
  const agents = [
    { name: 'CHATGPT' },
    { name: 'CODEX' },
    { name: 'CLAUDE' },
    { name: 'ANTIGRAVITY' },
    { name: 'OPENCODE' },
    { name: 'PERPLEXITY' },
    { name: 'VIVGRID' },
    { name: 'ZEPHYR' }
  ]
  // state for first half or second half 
  const [half, setHalf] = React.useState(0)

  // Change the half after every 2 seconds 
  React.useEffect(() => {
    const interval = setInterval(() => {
      setHalf((prevHalf) => (prevHalf === 0 ? 1 : 0))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

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
        {[0, 1, 2, 3].map((slotIndex) => {
          const agent = agents[slotIndex + half * 4]
          return (
            <a
              key={slotIndex}
              href="#agent"
              className="p-4 py-6 bg-card hover:border-foreground transition-colors flex items-center justify-center group"
            >
              <div className="relative h-7 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={agent.name}
                    initial={{
                      opacity: 0,
                      y: 16,
                      filter: 'blur(6px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      opacity: 0,
                      y: -16,
                      filter: 'blur(6px)',
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="font-mono text-xl font-bold uppercase tracking-[0.05em] text-foreground inline-block"
                  >
                    {agent.name}
                  </motion.span>
                </AnimatePresence>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
