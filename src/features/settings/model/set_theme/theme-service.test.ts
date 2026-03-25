import { Theme } from '@shared/types/theme-modes'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getInitialTheme } from './theme-service'

vi.mock('./theme-storage', () => ({
  getThemeFromStorage: vi.fn(),
  setThemeToStorage: vi.fn()
}))

import { getThemeFromStorage, setThemeToStorage } from './theme-storage'

describe('getInitialTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns stored theme if valid (LIGHT)', () => {
    vi.mocked(getThemeFromStorage).mockReturnValue(Theme.LIGHT)

    const result = getInitialTheme()

    expect(result).toBe(Theme.LIGHT)
  })

  it('returns stored theme if valid (DARK)', () => {
    vi.mocked(getThemeFromStorage).mockReturnValue(Theme.DARK)

    const result = getInitialTheme()

    expect(result).toBe(Theme.DARK)
  })

  it('falls back to system theme (dark) if no valid stored value', () => {
    vi.mocked(getThemeFromStorage).mockReturnValue(null)

    globalThis.window!.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    const result = getInitialTheme()

    expect(result).toBe(Theme.DARK)
    expect(setThemeToStorage).toHaveBeenCalledWith(Theme.DARK)
  })

  it('falls back to system theme (light) if no valid stored value', () => {
    vi.mocked(getThemeFromStorage).mockReturnValue(null)

    // Mock matchMedia → light
    globalThis.window!.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    const result = getInitialTheme()

    expect(result).toBe(Theme.LIGHT)
    expect(setThemeToStorage).toHaveBeenCalledWith(Theme.LIGHT)
  })
})
