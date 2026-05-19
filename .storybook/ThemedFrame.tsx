import { useEffect, type ReactNode } from 'react'
import { ThemeProvider } from '../src/theme/ThemeProvider'
import { THEMES, THEME_CLASS, type Theme } from '../src/theme/themes'

export default function ThemedFrame({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    const body = document.body
    THEMES.forEach((t) => body.classList.remove(THEME_CLASS[t]))
    body.classList.add(THEME_CLASS[theme])
    body.dataset.theme = theme
  }, [theme])

  return (
    <ThemeProvider key={theme} initialTheme={theme}>
      <div className="bg-bg text-fg min-h-screen p-6">{children}</div>
    </ThemeProvider>
  )
}
