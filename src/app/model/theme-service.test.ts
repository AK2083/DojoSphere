import { getThemeFromStorage } from '@features/settings'
import { Theme } from '@shared/types/theme-modes'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getInitialTheme } from './theme-service'

vi.mock('@features/settings', () => ({
  getThemeFromStorage: vi.fn(),
  setThemeToStorage: vi.fn()
}))

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
}

describe('getInitialTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns stored DARK theme if present', () => {
    mockMatchMedia(true)
    vi.mocked(getThemeFromStorage).mockReturnValue(Theme.DARK)

    const result = getInitialTheme()

    expect(result).toBe(Theme.DARK)
  })

  it('falls back to system DARK theme if no valid stored value', () => {
    mockMatchMedia(true)
    vi.mocked(getThemeFromStorage).mockReturnValue(undefined as any)

    const result = getInitialTheme()

    expect(result).toBe(Theme.DARK)
  })

  it('ignores invalid stored values and uses system theme', () => {
    vi.mocked(getThemeFromStorage).mockReturnValue('invalid' as any)

    window.matchMedia = vi.fn().mockReturnValue({
      matches: true
    } as any)

    const result = getInitialTheme()

    expect(result).toBe(Theme.DARK)
  })

  it('falls back to system LIGHT theme if prefers light', () => {
    mockMatchMedia(false)
    vi.mocked(getThemeFromStorage).mockReturnValue(undefined as any)

    const result = getInitialTheme()

    expect(result).toBe(Theme.DARK)
  })
})
