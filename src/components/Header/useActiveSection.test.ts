import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SectionId } from './sections'
import { useActiveSection } from './useActiveSection'

function mountSection(id: SectionId, top: number): HTMLElement {
  const el = document.createElement('section')
  el.id = id
  document.body.appendChild(el)
  el.getBoundingClientRect = () =>
    ({
      top,
      left: 0,
      right: 0,
      bottom: top,
      height: 0,
      width: 0,
      x: 0,
      y: top,
      toJSON() {
        return {}
      },
    }) as DOMRect
  return el
}

function setRectTop(el: HTMLElement, top: number) {
  el.getBoundingClientRect = () =>
    ({
      top,
      left: 0,
      right: 0,
      bottom: top,
      height: 0,
      width: 0,
      x: 0,
      y: top,
      toJSON() {
        return {}
      },
    }) as DOMRect
}

describe('useActiveSection', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('falls back to the first id when no section has crossed the offset line', () => {
    mountSection('hero', 500)
    mountSection('about', 1000)
    const ids = ['hero', 'about'] as const
    const { result } = renderHook(() => useActiveSection(ids))
    expect(result.current).toBe('hero')
  })

  it('returns the last section whose top is at or above the offset line', () => {
    mountSection('hero', -400)
    mountSection('about', -50)
    mountSection('skills', 800)
    const ids = ['hero', 'about', 'skills'] as const
    const { result } = renderHook(() => useActiveSection(ids, 96))
    expect(result.current).toBe('about')
  })

  it('updates on window scroll', () => {
    mountSection('hero', 0)
    const about = mountSection('about', 1000)
    const ids = ['hero', 'about'] as const
    const { result } = renderHook(() => useActiveSection(ids))
    expect(result.current).toBe('hero')

    setRectTop(about, -100)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe('about')
  })

  it('updates on window resize', () => {
    mountSection('hero', 0)
    const about = mountSection('about', 800)
    const ids = ['hero', 'about'] as const
    const { result } = renderHook(() => useActiveSection(ids))
    expect(result.current).toBe('hero')

    setRectTop(about, -50)
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe('about')
  })

  it('handles a missing DOM element by skipping it', () => {
    // 'hero' present, 'about' missing entirely
    mountSection('hero', -50)
    const ids = ['hero', 'about'] as const
    const { result } = renderHook(() => useActiveSection(ids))
    expect(result.current).toBe('hero')
  })

  it('respects a custom offset', () => {
    mountSection('hero', -10)
    mountSection('about', -5)
    const ids = ['hero', 'about'] as const
    // offset=0 means rect.top - 0 <= 0 → both pass, last wins
    const { result: a } = renderHook(() => useActiveSection(ids, 0))
    expect(a.current).toBe('about')

    // offset=100 means rect.top - 100 <= 0 → both still pass (very negative), last wins
    const { result: b } = renderHook(() => useActiveSection(ids, 100))
    expect(b.current).toBe('about')
  })

  it('removes scroll and resize listeners on unmount', () => {
    mountSection('hero', 0)
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useActiveSection(['hero'] as const))
    unmount()
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
    remove.mockRestore()
  })
})
