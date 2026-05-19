import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../theme'
import { Hero } from './Hero'

function renderHero() {
  return render(
    <ThemeProvider initialTheme="light">
      <Hero />
    </ThemeProvider>,
  )
}

describe('Hero', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    })
  })

  it('renders the h1 heading', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lex Polaris')
  })

  it('renders the role subtitle', () => {
    renderHero()
    expect(screen.getByText('Full-Stack Engineer')).toBeInTheDocument()
  })

  it('renders the bio paragraph', () => {
    renderHero()
    expect(screen.getByText(/boring technology/i)).toBeInTheDocument()
  })

  it('View Projects link points to #projects', () => {
    renderHero()
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute('href', '#projects')
  })

  it('Contact Me link is present', () => {
    renderHero()
    expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument()
  })

  it('GitHub link opens in a new tab with safe rel', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /GitHub/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('card container is visible by default', () => {
    renderHero()
    expect(screen.getByTestId('hero-card-container').classList.contains('opacity-100')).toBe(true)
  })

  it('mouse enter shows copy overlay and hides the card', () => {
    renderHero()
    fireEvent.mouseEnter(screen.getByTestId('animation-wrapper'))

    expect(screen.getByTestId('hero-card-container').classList.contains('opacity-0')).toBe(true)
    const copyBtn = screen.getByRole('button', { name: /copy animation/i })
    expect(copyBtn.parentElement?.classList.contains('opacity-100')).toBe(true)
  })

  it('mouse leave hides the copy overlay and restores the card', () => {
    renderHero()
    const wrapper = screen.getByTestId('animation-wrapper')
    fireEvent.mouseEnter(wrapper)
    fireEvent.mouseLeave(wrapper)

    expect(screen.getByTestId('hero-card-container').classList.contains('opacity-100')).toBe(true)
    const copyBtn = screen.getByRole('button', { name: /copy animation/i })
    expect(copyBtn.parentElement?.classList.contains('opacity-0')).toBe(true)
  })

  it('touch does not trigger overlay when pointer is not coarse', () => {
    // matchMedia returns matches:false (pointer: fine / desktop)
    renderHero()
    fireEvent.touchStart(screen.getByTestId('animation-wrapper'))
    expect(screen.getByTestId('hero-card-container').classList.contains('opacity-100')).toBe(true)
  })

  it('touch triggers overlay when pointer is coarse', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    renderHero()
    fireEvent.touchStart(screen.getByTestId('animation-wrapper'))
    expect(screen.getByTestId('hero-card-container').classList.contains('opacity-0')).toBe(true)
  })
})
