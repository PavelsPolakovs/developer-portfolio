import { renderHook } from '@testing-library/react'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { useTheme } from './useTheme'

const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

afterAll(() => {
  errorSpy.mockRestore()
})

describe('useTheme', () => {
  it('throws when used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(/within a <ThemeProvider>/)
  })
})
