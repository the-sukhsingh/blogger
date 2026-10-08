import { Sun, Moon } from 'lucide-react'
import { useTheme } from '#/components/theme-provider'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export function ThemeSwitcher({ className }: { className?: string }) {
  const { resolvedMode, toggleMode } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleMode}
      className={cn(
        'text-muted-foreground hover:text-foreground h-7 w-7 rounded-[8px]',
        className,
      )}
      aria-label={`Switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedMode === 'dark' ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}
