import { describe, it, expect, vi, beforeEach } from 'vitest'

import { getInitialLanguage } from './language-service'

import * as storage from '@features/settings/model/language-storage'

import { LanguageCode, FallbackLanguage } from '@shared/lib/i18n/languages'

describe('getInitialLanguage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns stored language if valid', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(LanguageCode.DE)

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.DE)
  })

  it('falls back to system language if no stored language', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(navigator, 'languages', {
      value: ['de-DE'],
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.DE)
  })

  it('stores detected system language', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    const setSpy = vi
      .spyOn(storage, 'setLanguageToStorage')
      .mockImplementation(() => {})

    Object.defineProperty(navigator, 'languages', {
      value: ['en-US'],
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.EN)
    expect(setSpy).toHaveBeenCalledWith(LanguageCode.EN)
  })

  it('returns fallback if browser language unsupported', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(navigator, 'languages', {
      value: ['fr-FR'],
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(FallbackLanguage)
  })

  it('falls back to navigator.language if navigator.languages is undefined', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(navigator, 'languages', {
      value: undefined,
      configurable: true
    })

    Object.defineProperty(navigator, 'language', {
      value: 'de-DE',
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.DE)
  })
})
