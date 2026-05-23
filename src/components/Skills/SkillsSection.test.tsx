import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkillsSection } from './SkillsSection'

describe('SkillsSection', () => {
  it('renders the section with the correct id', () => {
    render(<SkillsSection />)
    expect(screen.getByTestId('skills-section')).toHaveAttribute('id', 'skills')
  })

  it('renders the section heading', () => {
    render(<SkillsSection />)
    expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument()
  })

  it('renders the hint text', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/click a star/i)).toBeInTheDocument()
  })

  it('renders the constellation canvas', () => {
    render(<SkillsSection />)
    expect(screen.getByTestId('constellation-canvas')).toBeInTheDocument()
  })

  it('canvas wrapper has the correct testid', () => {
    render(<SkillsSection />)
    expect(screen.getByTestId('skills-canvas-wrapper')).toBeInTheDocument()
  })
})
