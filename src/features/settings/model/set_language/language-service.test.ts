import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getInitialLanguage } from './language-service'
import { getLanguageFromStorage, setLanguageToStorage } from './language-storage'

vi.mock('@shared/lib', () => ({
  LanguageCode: {
    DE: 'de',
    EN: 'en'
  },
  AvailableLanguages: [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' }
  ],
  FallbackLanguage: 'en'
}))

vi.mock('./language-storage', () => ({
  getLanguageFromStorage: vi.fn(),
  setLanguageToStorage: vi.fn()
}))

describe('language-service (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses stored language when it is supported', () => {
    vi.mocked(getLanguageFromStorage).mockReturnValue('de')
    vi.stubGlobal('navigator', { languages: ['en-US'] })

    const result = getInitialLanguage()

    expect(result).toBe('de')
    expect(setLanguageToStorage).not.toHaveBeenCalled()
  })

  it('uses matching browser language and stores it when storage is invalid', () => {
    vi.mocked(getLanguageFromStorage).mockReturnValue('fr' as never)
    vi.stubGlobal('navigator', { languages: ['de-DE', 'en-US'] })

    const result = getInitialLanguage()

    expect(result).toBe('de')
    expect(setLanguageToStorage).toHaveBeenCalledWith('de')
  })

  it('falls back to default language when browser language is unsupported', () => {
    vi.mocked(getLanguageFromStorage).mockReturnValue(null)
    vi.stubGlobal('navigator', { language: 'fr-FR' })

    const result = getInitialLanguage()

    expect(result).toBe('en')
    expect(setLanguageToStorage).toHaveBeenCalledWith('en')
  })

  it('falls back to default language when navigator has no language data', () => {
    vi.mocked(getLanguageFromStorage).mockReturnValue(null)
    vi.stubGlobal('navigator', {})

    const result = getInitialLanguage()

    expect(result).toBe('en')
    expect(setLanguageToStorage).toHaveBeenCalledWith('en')
  })
})
