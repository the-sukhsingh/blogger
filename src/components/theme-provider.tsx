import * as React from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeProviderState {
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const initialState: ThemeProviderState = {
  mode: 'light',
  resolvedMode: 'light',
  setMode: () => null,
  toggleMode: () => null,
}

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultMode?: ThemeMode
  storageKeyMode?: string
}

export function ThemeProvider({
  children,
  defaultMode = 'light',
  storageKeyMode = 'blog-changer-mode',
}: ThemeProviderProps) {
  const [mode, setModeState] = React.useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKeyMode) as ThemeMode | null
      if (stored) return stored
    }
    return defaultMode
  })

  const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>(
    'light',
  )

  // Suppress transition smearing during theme switch
  const applyThemeClasses = React.useCallback((nextMode: ThemeMode) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    // Add suppression class
    root.classList.add('theme-transition-disabled')

    // Determine resolved mode
    let targetMode: 'light' | 'dark' = 'light'
    if (nextMode === 'system') {
      targetMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    } else {
      targetMode = nextMode
    }

    setResolvedMode(targetMode)

    // Update class and attributes on document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(targetMode)
    root.setAttribute('data-mode', targetMode)
    root.style.colorScheme = targetMode

    // Also update document.body
    if (document.body) {
      document.body.classList.remove('light', 'dark')
      document.body.classList.add(targetMode)
      document.body.setAttribute('data-mode', targetMode)
    }

    // Force style flush
    window.getComputedStyle(root).opacity

    // Restore transitions after frame
    requestAnimationFrame(() => {
      root.classList.remove('theme-transition-disabled')
    })
  }, [])

  React.useEffect(() => {
    applyThemeClasses(mode)
  }, [mode, applyThemeClasses])

  // Listen for OS system theme changes
  React.useEffect(() => {
    if (mode !== 'system') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyThemeClasses('system')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode, applyThemeClasses])

  const setMode = React.useCallback(
    (newMode: ThemeMode) => {
      localStorage.setItem(storageKeyMode, newMode)
      setModeState(newMode)
      applyThemeClasses(newMode)
    },
    [storageKeyMode, applyThemeClasses],
  )

  const toggleMode = React.useCallback(() => {
    const isDark =
      typeof document !== 'undefined'
        ? document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-mode') === 'dark'
        : resolvedMode === 'dark'
    const next: ThemeMode = isDark ? 'light' : 'dark'
    setMode(next)
  }, [resolvedMode, setMode])

  const value = React.useMemo(
    () => ({
      mode,
      resolvedMode,
      setMode,
      toggleMode,
    }),
    [mode, resolvedMode, setMode, toggleMode],
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeProviderContext)
}
