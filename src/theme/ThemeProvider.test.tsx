import { render, screen, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'
import { STORAGE_KEY } from './themes'

function Probe() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="current">{theme}</span>
      <button type="button" onClick={() => setTheme('nord')}>
        to-nord
      </button>
      <button type="button" onClick={() => setTheme('dark')}>
        to-dark
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.theme
  })

  it('applies the theme class to <html> on mount', () => {
    render(
      <ThemeProvider initialTheme="dark">
        <Probe />
      </ThemeProvider>,
    )
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('swaps the class when theme changes', () => {
    render(
      <ThemeProvider initialTheme="light">
        <Probe />
      </ThemeProvider>,
    )
    expect(document.documentElement.classList.contains('theme-light')).toBe(true)
    act(() => {
      screen.getByText('to-nord').click()
    })
    expect(document.documentElement.classList.contains('theme-nord')).toBe(true)
    expect(document.documentElement.classList.contains('theme-light')).toBe(false)
  })

  it('persists the active theme in localStorage', () => {
    render(
      <ThemeProvider initialTheme="light">
        <Probe />
      </ThemeProvider>,
    )
    act(() => {
      screen.getByText('to-dark').click()
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })

  it('reads the persisted theme on mount when no initialTheme is given', () => {
    window.localStorage.setItem(STORAGE_KEY, 'nord')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('current')).toHaveTextContent('nord')
  })

  it('falls back to the default theme when localStorage has a garbage value', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not-a-real-theme')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('current')).toHaveTextContent('light')
  })
})
