import { getStorageItem, setStorageItem } from '@shared/lib'
import { type ThemePreference } from '@shared/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation } from '../monitoring/monitoring'
import { getThemeFromStorage, setThemeToStorage } from './theme-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    SETTINGS_THEME_WRITE: 'SETTINGS_THEME_WRITE',
    SETTINGS_THEME_READ: 'SETTINGS_THEME_READ'
  }
}))

describe('theme-storage (unit)', () => {
  const THEME_KEY = 'dojosphere.settings.theme'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes theme to storage and logs event', () => {
    const theme = 'dark' as ThemePreference

    setThemeToStorage(theme)

    expect(monitorInformation).toHaveBeenCalledWith('SETTINGS_THEME_WRITE', { theme })
    expect(setStorageItem).toHaveBeenCalledWith(THEME_KEY, theme)
  })

  it('reads theme from storage and logs event', () => {
    const theme = 'light' as ThemePreference

    vi.mocked(getStorageItem).mockReturnValue(theme)

    const result = getThemeFromStorage()

    expect(monitorInformation).toHaveBeenCalledWith('SETTINGS_THEME_READ', { THEMEKEY: THEME_KEY })
    expect(getStorageItem).toHaveBeenCalledWith(THEME_KEY)
    expect(result).toBe(theme)
  })

  it('returns null when nothing is stored', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getThemeFromStorage()

    expect(result).toBeNull()
  })
})
