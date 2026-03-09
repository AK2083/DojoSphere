import {
  getLanguageFromStorage,
  setLanguageToStorage
} from '@features/settings/model/language-storage'
import {
  AvailableLanguages,
  FallbackLanguage,
  LanguageCode
} from '@shared/lib/i18n/languages'

function getSystemLanguage(): LanguageCode {
  const browserLanguages = navigator.languages ?? [navigator.language]

  for (const lang of browserLanguages) {
    const code = lang.split('-')[0]

    const match = AvailableLanguages.find((l) => l.code === code)

    if (match) return match.code
  }

  return FallbackLanguage
}

export function getInitialLanguage(): LanguageCode {
  const stored = getLanguageFromStorage()

  if (stored && AvailableLanguages.some((lang) => lang.code === stored)) {
    return stored
  }

  const systemLang = getSystemLanguage()
  setLanguageToStorage(systemLang)

  return systemLang
}
