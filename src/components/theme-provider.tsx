import * as React from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemePreset = 'zinc' | 'paper' | 'terminal' | 'cobalt' | 'forest'

interface ThemeProviderState {
  mode: ThemeMode
  theme: ThemePreset
  resolvedMode: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  setTheme: (theme: ThemePreset) => void
  toggleMode: () => void
}

const initialState: ThemeProviderState = {
  mode: 'system',
  theme: 'zinc',
  resolvedMode: 'light',
  setMode: () => null,
  setTheme: () => null,
  toggleMode: () => null,
}

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultMode?: ThemeMode
  defaultTheme?: ThemePreset
  storageKeyMode?: string
  storageKeyTheme?: string
}

export function ThemeProvider({
  children,
  defaultMode = 'system',
  defaultTheme = 'zinc',
  storageKeyMode = 'blog-changer-mode',
  storageKeyTheme = 'blog-changer-theme',
}: ThemeProviderProps) {
  const [mode, setModeState] = React.useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKeyMode) as ThemeMode | null
      if (stored) return stored
    }
    return defaultMode
  })

  const [theme, setThemeState] = React.useState<ThemePreset>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKeyTheme) as ThemePreset | null
      if (stored) return stored
    }
    return defaultTheme
  })

  const [resolvedMode, setResolvedMode] = React.useState<'light' | 'dark'>(
    'light',
  )

  // Suppress transition smearing during theme switch (better-ui recipe)
  const applyThemeClasses = React.useCallback(
    (nextMode: ThemeMode, nextTheme: ThemePreset) => {
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

      // Update class and attributes
      root.classList.remove('light', 'dark')
      root.classList.add(targetMode)
      root.setAttribute('data-mode', targetMode)
      root.setAttribute('data-theme', nextTheme)

      // Force style flush
      window.getComputedStyle(root).opacity

      // Restore transitions after frame
      requestAnimationFrame(() => {
        root.classList.remove('theme-transition-disabled')
      })
    },
    [],
  )

  React.useEffect(() => {
    applyThemeClasses(mode, theme)
  }, [mode, theme, applyThemeClasses])

  // Listen for OS system theme changes
  React.useEffect(() => {
    if (mode !== 'system') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyThemeClasses('system', theme)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode, theme, applyThemeClasses])

  const setMode = React.useCallback(
    (newMode: ThemeMode) => {
      localStorage.setItem(storageKeyMode, newMode)
      setModeState(newMode)
    },
    [storageKeyMode],
  )

  const setTheme = React.useCallback(
    (newTheme: ThemePreset) => {
      localStorage.setItem(storageKeyTheme, newTheme)
      setThemeState(newTheme)
    },
    [storageKeyTheme],
  )

  const toggleMode = React.useCallback(() => {
    const next = resolvedMode === 'dark' ? 'light' : 'dark'
    setMode(next)
  }, [resolvedMode, setMode])

  const value = React.useMemo(
    () => ({
      mode,
      theme,
      resolvedMode,
      setMode,
      setTheme,
      toggleMode,
    }),
    [mode, theme, resolvedMode, setMode, setTheme, toggleMode],
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
