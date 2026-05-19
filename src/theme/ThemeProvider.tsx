import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'
import { DEFAULT_THEME, STORAGE_KEY, THEMES, THEME_CLASS, isTheme, type Theme } from './themes'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isTheme(stored)) return stored
  } catch {
    // ignore storage errors
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return DEFAULT_THEME
}

function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  for (const t of THEMES) root.classList.remove(THEME_CLASS[t])
  root.classList.add(THEME_CLASS[theme])
  root.dataset.theme = theme
}

type ThemeProviderProps = {
  children: ReactNode
  initialTheme?: Theme
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => initialTheme ?? readInitialTheme())

  useEffect(() => {
    applyThemeClass(theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore storage errors
    }
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
