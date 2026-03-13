import { Theme } from '@shared/types/theme-modes'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getInitialTheme } from './theme-service'

describe('theme-service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function mockMatchMedia(matches: boolean) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches
      }))
    })
  }

  it('returns stored theme if present', () => {
    localStorage.setItem('thememode', JSON.stringify(Theme.DARK))

    const theme = getInitialTheme()

    expect(theme).toBe(Theme.DARK)
  })

  it('returns system dark theme if no storage value', () => {
    mockMatchMedia(true)

    const theme = getInitialTheme()

    expect(theme).toBe(Theme.DARK)
  })

  it('returns system light theme if system prefers light', () => {
    mockMatchMedia(false)

    const theme = getInitialTheme()

    expect(theme).toBe(Theme.LIGHT)
  })
})
