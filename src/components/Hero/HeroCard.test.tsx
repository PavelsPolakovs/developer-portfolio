import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroCard } from './HeroCard'

describe('HeroCard', () => {
  it('renders the Open to work label', () => {
    render(<HeroCard />)
    expect(screen.getByText('Open to work')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<HeroCard />)
    expect(screen.getByText('Full-Stack · Remote')).toBeInTheDocument()
  })

  it('has a pulsing availability indicator', () => {
    render(<HeroCard />)
    // animate-ping span signals live availability status
    const ping = document.querySelector('.animate-ping')
    expect(ping).toBeInTheDocument()
  })

  it('applies the float animation style', () => {
    render(<HeroCard />)
    const root = screen.getByText('Open to work').closest('[style]') as HTMLElement
    expect(root?.style.animation).toContain('var(--animate-float)')
  })
})
