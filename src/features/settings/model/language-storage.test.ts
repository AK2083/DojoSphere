import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getLanguageFromStorage,
  setLanguageToStorage
} from './language-storage'

import * as storage from '@shared/lib/browser/local-storage'

import { LanguageCode } from '@shared/lib/i18n/languages'

describe('language-storage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('stores language in local storage', () => {
    const spy = vi.spyOn(storage, 'setStorageItem').mockImplementation(() => {})

    setLanguageToStorage(LanguageCode.DE)

    expect(spy).toHaveBeenCalledWith('preferredlanguage', LanguageCode.DE)
  })

  it('returns language from storage', () => {
    vi.spyOn(storage, 'getStorageItem').mockReturnValue(LanguageCode.EN)

    const result = getLanguageFromStorage()

    expect(result).toBe(LanguageCode.EN)
  })

  it('returns null if nothing stored', () => {
    vi.spyOn(storage, 'getStorageItem').mockReturnValue(null)

    const result = getLanguageFromStorage()

    expect(result).toBeNull()
  })
})
