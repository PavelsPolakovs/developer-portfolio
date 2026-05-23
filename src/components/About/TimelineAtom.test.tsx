import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineAtom } from './TimelineAtom'

describe('TimelineAtom', () => {
  it('renders nucleus, orbit and electron', () => {
    render(<TimelineAtom active={false} />)
    expect(screen.getByTestId('atom-nucleus')).toBeInTheDocument()
    expect(screen.getByTestId('atom-orbit')).toBeInTheDocument()
    expect(screen.getByTestId('atom-electron')).toBeInTheDocument()
  })

  it('does not render wave when inactive', () => {
    render(<TimelineAtom active={false} />)
    expect(screen.queryByTestId('atom-wave')).not.toBeInTheDocument()
  })

  it('renders wave when active', () => {
    render(<TimelineAtom active={true} />)
    expect(screen.getByTestId('atom-wave')).toBeInTheDocument()
  })

  it('marks data-active correctly', () => {
    const { rerender } = render(<TimelineAtom active={false} />)
    expect(screen.getByTestId('timeline-atom')).toHaveAttribute('data-active', 'false')
    rerender(<TimelineAtom active={true} />)
    expect(screen.getByTestId('timeline-atom')).toHaveAttribute('data-active', 'true')
  })

  it('applies wave animation when active', () => {
    render(<TimelineAtom active={true} />)
    const wave = screen.getByTestId('atom-wave')
    expect(wave.style.animation).toContain('var(--animate-wave-expand)')
  })

  it('applies nucleus animation when active', () => {
    render(<TimelineAtom active={true} />)
    const nucleus = screen.getByTestId('atom-nucleus')
    expect(nucleus.style.animation).toContain('var(--animate-nucleus-dim)')
  })

  it('applies slow orbit spin when inactive', () => {
    render(<TimelineAtom active={false} />)
    const orbit = screen.getByTestId('atom-orbit')
    expect(orbit.style.animation).toContain('var(--animate-orbit-slow)')
  })
})
