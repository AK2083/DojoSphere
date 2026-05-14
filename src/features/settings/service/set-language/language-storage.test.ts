import { getStorageItem, LanguageCode, setStorageItem } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getLanguageFromStorage, setLanguageToStorage } from './language-storage'

vi.mock('@shared/lib', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn()
}))

describe('language-storage (unit)', () => {
  const LANGUAGE_KEY = 'dojosphere.settings.language'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes language to storage and logs event', () => {
    const language = 'de' as LanguageCode

    setLanguageToStorage(language)

    expect(setStorageItem).toHaveBeenCalledWith(LANGUAGE_KEY, language)
  })

  it('reads language from storage and logs event', () => {
    const language = 'en' as LanguageCode

    vi.mocked(getStorageItem).mockReturnValue(language)

    const result = getLanguageFromStorage()

    expect(getStorageItem).toHaveBeenCalledWith(LANGUAGE_KEY)
    expect(result).toBe(language)
  })

  it('returns null when nothing is stored', () => {
    vi.mocked(getStorageItem).mockReturnValue(null)

    const result = getLanguageFromStorage()

    expect(result).toBeNull()
  })
})
