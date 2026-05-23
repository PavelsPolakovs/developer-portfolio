import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectsSection } from './ProjectsSection'

describe('ProjectsSection', () => {
  it('renders the section with the correct id', () => {
    render(<ProjectsSection />)
    expect(screen.getByTestId('projects-section')).toHaveAttribute('id', 'projects')
  })

  it('renders the section heading', () => {
    render(<ProjectsSection />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders the hint text', () => {
    render(<ProjectsSection />)
    expect(screen.getByText(/hover a card/i)).toBeInTheDocument()
  })

  it('renders the project grid', () => {
    render(<ProjectsSection />)
    expect(screen.getByTestId('projects-grid')).toBeInTheDocument()
  })

  it('renders all three project cards', () => {
    render(<ProjectsSection />)
    expect(screen.getAllByTestId('project-card')).toHaveLength(3)
  })
})
