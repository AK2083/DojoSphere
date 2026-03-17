import { getStorageItem, LanguageCode, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { monitorInformation } from '../monitoring/monitoring'
import { getLanguageFromStorage, setLanguageToStorage } from './language-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

vi.mock('../monitoring/monitoring', () => ({
  monitorInformation: vi.fn(),
  MONITORING_EVENTS: {
    SETTINGS_LANG_WRITE: 'SETTINGS_LANG_WRITE',
    SETTINGS_LANG_READ: 'SETTINGS_LANG_READ'
  }
}))

describe('language-storage (unit)', () => {
  const LANGUAGE_KEY = 'preferredlanguage'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes language to storage and logs event', () => {
    const language = 'de' as LanguageCode

    setLanguageToStorage(language)

    expect(monitorInformation).toHaveBeenCalledWith('SETTINGS_LANG_WRITE', { language })
    expect(setStorageItem).toHaveBeenCalledWith(LANGUAGE_KEY, language)
  })

  it('reads language from storage and logs event', () => {
    const language = 'en' as LanguageCode

    vi.mocked(getStorageItem).mockReturnValue(language)

    const result = getLanguageFromStorage()

    expect(monitorInformation).toHaveBeenCalledWith('SETTINGS_LANG_READ', {
      LANGUAGEKEY: LANGUAGE_KEY
    })
    expect(getStorageItem).toHaveBeenCalledWith(LANGUAGE_KEY)
    expect(result).toBe(language)
  })

  it('returns null when nothing is stored', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getLanguageFromStorage()

    expect(result).toBeNull()
  })
})
