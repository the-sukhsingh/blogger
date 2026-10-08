import { Sun, Moon, Laptop, Palette } from 'lucide-react'
import { useTheme } from '#/components/theme-provider'
import type { ThemePreset } from '#/components/theme-provider'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '#/components/ui/dropdown-menu'
import { cn } from '#/lib/utils'

const THEME_PRESETS: { id: ThemePreset; name: string; color: string }[] = [
  { id: 'zinc', name: 'Zinc (Minimal)', color: 'bg-zinc-600' },
  { id: 'paper', name: 'Warm Paper', color: 'bg-amber-600' },
  { id: 'terminal', name: 'Terminal Mono', color: 'bg-emerald-600' },
  { id: 'cobalt', name: 'Cobalt Engineering', color: 'bg-blue-600' },
  { id: 'forest', name: 'Forest Sage', color: 'bg-emerald-700' },
]

export function ThemeSwitcher({ className }: { className?: string }) {
  const { mode, theme, resolvedMode, setMode, setTheme } = useTheme()

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {/* Mode Toggle Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Change color mode"
            title="Change color mode"
          >
            {resolvedMode === 'dark' ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="right">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setMode('light')}
            className={cn(mode === 'light' && 'font-bold bg-accent/60')}
          >
            <Sun className="h-3.5 w-3.5 mr-2" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setMode('dark')}
            className={cn(mode === 'dark' && 'font-bold bg-accent/60')}
          >
            <Moon className="h-3.5 w-3.5 mr-2" /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setMode('system')}
            className={cn(mode === 'system' && 'font-bold bg-accent/60')}
          >
            <Laptop className="h-3.5 w-3.5 mr-2" /> System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Presets Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs gap-1.5 font-normal"
            aria-label="Select theme preset"
          >
            <Palette className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="capitalize">{theme}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="right">
          <DropdownMenuLabel>Design Themes</DropdownMenuLabel>
          {THEME_PRESETS.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => setTheme(preset.id)}
              className={cn(theme === preset.id && 'font-bold bg-accent/60')}
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full mr-2 shrink-0',
                  preset.color,
                )}
              />
              {preset.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div className="px-2.5 py-1 text-[11px] text-muted-foreground">
            Easily swappable via Tailwind CSS variables
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
