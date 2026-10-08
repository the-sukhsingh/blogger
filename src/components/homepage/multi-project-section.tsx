import * as React from 'react'
import { Plus, ChevronDown } from 'lucide-react'

export function MultiProjectSection() {
  return (
    <section className="rounded-[16px] border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Left Description */}
        <div className="p-8 md:p-12 space-y-4 flex flex-col justify-center">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.10em] text-[#d97757]">
            MULTI PROJECT SUPPORT
          </div>
          <h2 className="text-[28px] md:text-[34px] font-sans font-medium text-foreground">
            Multiple Blogs, One Workspace.
          </h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Create isolated projects for every product, client, or
            publication environment you manage—each with its own Git
            repository, custom domains, and author voice models.
          </p>
        </div>

        {/* Right Project Switcher Card */}
        <div className="p-8 md:p-12 bg-muted flex items-center justify-center">
          <div className="w-full max-w-[340px] rounded-[12px] border border-border bg-card p-3 space-y-2 shadow-xs">
            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-muted border border-border">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#615fff]" />
                <span className="text-xs font-semibold text-foreground">
                  ConnectSphere
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            <div className="px-3 py-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>csphere.com</span>
              <span className="text-[10px] font-mono uppercase">
                ACTIVE
              </span>
            </div>

            <div className="border-t border-border pt-2 px-1 space-y-1">
              <div className="px-2 py-1.5 rounded-[6px] hover:bg-muted flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d97757]" />
                <span>Frostline (frostline.io)</span>
              </div>
              <div className="px-2 py-1.5 rounded-[6px] hover:bg-muted flex items-center gap-2 text-xs font-semibold text-[#615fff] cursor-pointer">
                <Plus className="h-3 w-3" />
                <span>NEW PROJECT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
