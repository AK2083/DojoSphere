import { getStorageItem, setStorageItem } from '@shared/lib/browser/local-storage'
import type { LanguageCode } from '@shared/lib/i18n/languages'

import { monitorInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

const LANGUAGEKEY = 'preferredlanguage'

export function setLanguageToStorage(language: LanguageCode) {
  monitorInformation(MONITORING_EVENTS.SETTINGS_LANG_WRITE, { language })
  setStorageItem(LANGUAGEKEY, language)
}

export function getLanguageFromStorage() {
  monitorInformation(MONITORING_EVENTS.SETTINGS_LANG_READ, { LANGUAGEKEY })
  return getStorageItem<LanguageCode>(LANGUAGEKEY)
}
