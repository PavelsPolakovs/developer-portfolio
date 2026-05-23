import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CustomCursor } from './CustomCursor'

describe('CustomCursor', () => {
  it('renders the cursor element', () => {
    render(<CustomCursor />)
    expect(screen.getByTestId('custom-cursor')).toBeInTheDocument()
  })

  it('starts invisible (opacity 0)', () => {
    render(<CustomCursor />)
    const cursor = screen.getByTestId('custom-cursor')
    expect(cursor.style.opacity).toBe('0')
  })

  it('starts in idle state', () => {
    render(<CustomCursor />)
    expect(screen.getByTestId('custom-cursor')).toHaveAttribute('data-state', 'idle')
  })

  it('has pointer-events-none so it does not block clicks', () => {
    render(<CustomCursor />)
    const cursor = screen.getByTestId('custom-cursor')
    expect(cursor.className).toContain('pointer-events-none')
  })
})
