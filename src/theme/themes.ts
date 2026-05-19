export const THEMES = ['light', 'dark', 'nord'] as const

export type Theme = (typeof THEMES)[number]

export const THEME_CLASS: Record<Theme, string> = {
  light: 'theme-light',
  dark: 'theme-dark',
  nord: 'theme-nord',
}

export const THEME_META: Record<Theme, { label: string; symbol: string }> = {
  light: { label: 'Light', symbol: '☀️' },
  dark: { label: 'Dark', symbol: '🌙' },
  nord: { label: 'Nord', symbol: '🏔' },
}

export const STORAGE_KEY = 'portfolio:theme'
export const DEFAULT_THEME: Theme = 'light'

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}
