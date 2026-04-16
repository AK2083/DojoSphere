import * as storage from '@features/settings/model/set_language/language-storage'
import { FallbackLanguage, LanguageCode } from '@shared/lib/i18n/languages'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getInitialLanguage } from './language-service'

describe('getInitialLanguage', () => {
  const originalNavigator = globalThis.navigator

  beforeEach(() => {
    vi.resetAllMocks()

    Object.defineProperty(globalThis, 'navigator', {
      value: { ...originalNavigator },
      configurable: true,
      writable: true
    })
  })

  it('returns stored language if valid', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(LanguageCode.DE)

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.DE)
  })

  it('falls back to system language if no stored language', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(globalThis.navigator, 'languages', {
      value: ['de-DE'],
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.DE)
  })

  it('stores detected system language', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    const setSpy = vi.spyOn(storage, 'setLanguageToStorage').mockImplementation(() => {})

    Object.defineProperty(globalThis.navigator, 'languages', {
      value: ['en-US'],
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.EN)
    expect(setSpy).toHaveBeenCalledWith(LanguageCode.EN)
  })

  it('returns fallback if browser language unsupported', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(globalThis.navigator, 'languages', {
      value: ['fr-FR'],
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(FallbackLanguage)
  })

  it('falls back to navigator.language if navigator.languages is undefined', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(globalThis.navigator, 'languages', {
      value: undefined,
      configurable: true
    })

    Object.defineProperty(globalThis.navigator, 'language', {
      value: 'de-DE',
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.DE)
  })

  it('falls back to system language if stored language is not in AvailableLanguages', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(
      'invalid-code' as unknown as LanguageCode
    )

    Object.defineProperty(globalThis.navigator, 'languages', {
      value: ['en-US'],
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(LanguageCode.EN)
  })

  it('returns fallback if navigator object is completely missing', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(globalThis, 'navigator', {
      value: undefined,
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(FallbackLanguage)
  })

  it('returns fallback if both languages and language are null/undefined', () => {
    vi.spyOn(storage, 'getLanguageFromStorage').mockReturnValue(null)

    Object.defineProperty(globalThis.navigator, 'languages', {
      value: null,
      configurable: true
    })
    Object.defineProperty(globalThis.navigator, 'language', {
      value: null,
      configurable: true
    })

    const result = getInitialLanguage()

    expect(result).toBe(FallbackLanguage)
  })
})
