import { createI18n } from 'vue-i18n'
import authDe from '@features/authentication/i18n/de'
import authEn from '@features/authentication/i18n/en'
import { getInitialLanguage } from '@features/settings'
import settingsDe from '@features/settings/i18n/de'
import settingsEn from '@features/settings/i18n/en'
import sharedDe from '@shared/lib/i18n/de'
import sharedEn from '@shared/lib/i18n/en'
import { FallbackLanguage } from '@shared/lib/i18n/languages'

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
