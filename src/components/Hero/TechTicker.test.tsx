import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TechTicker } from './TechTicker'

const ITEMS = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Tailwind Variants',
  'Vite',
  'Storybook',
  'Claude Code',
]

describe('TechTicker', () => {
  it('renders all tech items', () => {
    render(<TechTicker />)
    for (const item of ITEMS) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('renders each item twice for a seamless scroll loop', () => {
    render(<TechTicker />)
    for (const item of ITEMS) {
      expect(screen.getAllByText(item)).toHaveLength(2)
    }
  })

  it('applies the ticker-scroll animation', () => {
    render(<TechTicker />)
    const track = document.querySelector('[style*="animate-ticker"]') as HTMLElement
    expect(track?.style.animation).toContain('var(--animate-ticker)')
  })
})
