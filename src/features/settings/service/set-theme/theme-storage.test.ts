import { getStorageItem, setStorageItem } from '@shared/lib'
import { type ThemePreference } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getThemeFromStorage, setThemeToStorage } from './theme-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

describe('theme-storage (unit)', () => {
  const THEME_KEY = 'dojosphere.settings.theme'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes theme to storage and logs event', () => {
    const theme = 'dark' as ThemePreference

    setThemeToStorage(theme)

    expect(setStorageItem).toHaveBeenCalledWith(THEME_KEY, theme)
  })

  it('reads theme from storage and logs event', () => {
    const theme = 'light' as ThemePreference

    vi.mocked(getStorageItem).mockReturnValue(theme)

    const result = getThemeFromStorage()

    expect(getStorageItem).toHaveBeenCalledWith(THEME_KEY)
    expect(result).toBe(theme)
  })

  it('returns null when nothing is stored', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getThemeFromStorage()

    expect(result).toBeNull()
  })
})
