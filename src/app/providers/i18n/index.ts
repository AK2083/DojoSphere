import { createI18n } from 'vue-i18n'
import { authDe, authEn } from '@features/authentication'
import { getInitialLanguage, settingsDe, settingsEn } from '@features/settings'
import { FallbackLanguage, sharedDe, sharedEn } from '@shared/lib/i18n'

import appDe from './de'
import appEn from './en'

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: FallbackLanguage,
  messages: {
    de: {
      app: appDe,
      auth: authDe,
      settings: settingsDe,
      shared: sharedDe
    },
    en: {
      app: appEn,
      auth: authEn,
      settings: settingsEn,
      shared: sharedEn
    }
  }
})
