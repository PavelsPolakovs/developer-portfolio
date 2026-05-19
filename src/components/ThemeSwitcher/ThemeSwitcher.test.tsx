import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ThemeProvider } from '../../theme/ThemeProvider'

function renderWithProvider(initial: 'light' | 'dark' | 'nord' = 'light') {
  return render(
    <ThemeProvider initialTheme={initial}>
      <ThemeSwitcher />
    </ThemeProvider>,
  )
}

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
  })

  it('renders one button per theme', () => {
    renderWithProvider('light')
    expect(screen.getByRole('button', { name: /light theme/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dark theme/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nord theme/i })).toBeInTheDocument()
  })

  it('marks the active theme with aria-pressed and data-active', () => {
    renderWithProvider('dark')
    const darkBtn = screen.getByRole('button', { name: /dark theme/i })
    expect(darkBtn).toHaveAttribute('aria-pressed', 'true')
    expect(darkBtn).toHaveAttribute('data-active', 'true')
    expect(screen.getByRole('button', { name: /light theme/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('switches theme on click', async () => {
    const user = userEvent.setup()
    renderWithProvider('light')
    await user.click(screen.getByRole('button', { name: /nord theme/i }))
    expect(document.documentElement.classList.contains('theme-nord')).toBe(true)
    expect(screen.getByRole('button', { name: /nord theme/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
