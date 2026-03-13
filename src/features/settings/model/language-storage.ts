import { getStorageItem, setStorageItem } from '@shared/lib/browser/local-storage'
import type { LanguageCode } from '@shared/lib/i18n/languages'

const LANGUAGEKEY = 'preferredlanguage'

export function setLanguageToStorage(language: LanguageCode) {
  setStorageItem(LANGUAGEKEY, language)
}

export function getLanguageFromStorage() {
  return getStorageItem<LanguageCode>(LANGUAGEKEY)
}
