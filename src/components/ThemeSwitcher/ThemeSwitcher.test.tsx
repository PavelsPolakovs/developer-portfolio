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

  it('activates an electron with the keyboard (Enter)', async () => {
    const user = userEvent.setup()
    renderWithProvider('light')
    const darkBtn = screen.getByRole('button', { name: /dark theme/i })
    darkBtn.focus()
    expect(darkBtn).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true)
    expect(darkBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps state stable when clicking the already-active electron', async () => {
    const user = userEvent.setup()
    renderWithProvider('nord')
    const nordBtn = screen.getByRole('button', { name: /nord theme/i })
    expect(nordBtn).toHaveAttribute('aria-pressed', 'true')
    await user.click(nordBtn)
    expect(nordBtn).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.classList.contains('theme-nord')).toBe(true)
  })
})
