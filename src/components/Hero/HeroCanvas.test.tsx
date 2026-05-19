import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HeroCanvas } from './HeroCanvas'

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  // jsdom exposes navigator.clipboard via a getter — must replace the descriptor
  Object.defineProperty(navigator, 'clipboard', {
    get: () => ({ writeText }),
    configurable: true,
  })
  return writeText
}

describe('HeroCanvas', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders a canvas element', () => {
    render(<HeroCanvas overlayVisible={false} />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
  })

  it('copy overlay is hidden when overlayVisible is false', () => {
    render(<HeroCanvas overlayVisible={false} />)
    const overlay = screen.getByRole('button', { name: /copy animation/i }).parentElement!
    expect(overlay.classList.contains('opacity-0')).toBe(true)
  })

  it('copy overlay is visible when overlayVisible is true', () => {
    render(<HeroCanvas overlayVisible={true} />)
    const overlay = screen.getByRole('button', { name: /copy animation/i }).parentElement!
    expect(overlay.classList.contains('opacity-100')).toBe(true)
  })

  it('copy button parent has pointer-events-none when overlay is hidden', () => {
    render(<HeroCanvas overlayVisible={false} />)
    const overlay = screen.getByRole('button', { name: /copy animation/i }).parentElement!
    expect(overlay.classList.contains('pointer-events-none')).toBe(true)
  })

  it('clicking copy calls navigator.clipboard.writeText once', async () => {
    const writeText = mockClipboard()
    render(<HeroCanvas overlayVisible={true} />)

    fireEvent.click(screen.getByRole('button', { name: /copy animation/i }))
    // flush the Promise microtask so .then() runs
    await act(async () => {
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledTimes(1)
  })

  it('clipboard receives a non-empty animation code string', async () => {
    const writeText = mockClipboard()
    render(<HeroCanvas overlayVisible={true} />)

    fireEvent.click(screen.getByRole('button', { name: /copy animation/i }))
    await act(async () => {
      await Promise.resolve()
    })

    const code = writeText.mock.calls[0]?.[0] as string
    expect(typeof code).toBe('string')
    expect(code.length).toBeGreaterThan(100)
  })

  it('shows "Copied!" feedback after click, then reverts after 2 seconds', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const writeText = mockClipboard()
    render(<HeroCanvas overlayVisible={true} />)

    fireEvent.click(screen.getByRole('button', { name: /copy animation/i }))
    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText('Copied!')).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(2001)
    })
    expect(screen.queryByText('Copied!')).toBeNull()
  })

  describe('overlay toggle via prop re-render', () => {
    it('shows overlay after re-render with overlayVisible=true', () => {
      const { rerender } = render(<HeroCanvas overlayVisible={false} />)
      rerender(<HeroCanvas overlayVisible={true} />)
      const overlay = screen.getByRole('button', { name: /copy animation/i }).parentElement!
      expect(overlay.classList.contains('opacity-100')).toBe(true)
    })

    it('hides overlay after re-render with overlayVisible=false', () => {
      const { rerender } = render(<HeroCanvas overlayVisible={true} />)
      rerender(<HeroCanvas overlayVisible={false} />)
      const overlay = screen.getByRole('button', { name: /copy animation/i }).parentElement!
      expect(overlay.classList.contains('opacity-0')).toBe(true)
    })
  })
})
