import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHeaderScroll } from './useHeaderScroll'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true })
}

describe('useHeaderScroll', () => {
  beforeEach(() => {
    setScrollY(0)
  })
  afterEach(() => {
    setScrollY(0)
  })

  it('returns false at the top of the page', () => {
    const { result } = renderHook(() => useHeaderScroll())
    expect(result.current).toBe(false)
  })

  it('flips to true once window.scrollY passes the default threshold (8)', () => {
    const { result } = renderHook(() => useHeaderScroll())
    act(() => {
      setScrollY(20)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
  })

  it('respects a custom threshold and ignores scrolls at or below it', () => {
    const { result } = renderHook(() => useHeaderScroll(100))
    act(() => {
      setScrollY(100)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
    act(() => {
      setScrollY(101)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
  })

  it('flips back to false when scroll returns above the threshold', () => {
    const { result } = renderHook(() => useHeaderScroll(50))
    act(() => {
      setScrollY(200)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
    act(() => {
      setScrollY(0)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
  })

  it('re-evaluates when the threshold prop changes', () => {
    const { result, rerender } = renderHook(({ t }: { t: number }) => useHeaderScroll(t), {
      initialProps: { t: 300 },
    })
    act(() => {
      setScrollY(100)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
    rerender({ t: 50 })
    expect(result.current).toBe(true)
  })

  it('removes the scroll listener on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useHeaderScroll())
    unmount()
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
    remove.mockRestore()
  })
})
