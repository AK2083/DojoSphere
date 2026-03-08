import { createI18n } from 'vue-i18n'

import appDe from '@app/i18n/de'
import appEn from '@app/i18n/en'

import authDe from '@features/authentication/i18n/de'
import authEn from '@features/authentication/i18n/en'

import settingsDe from '@features/settings/i18n/de'
import settingsEn from '@features/settings/i18n/en'

export const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    de: {
      app: appDe,
      auth: authDe,
      settings: settingsDe
    },
    en: {
      app: appEn,
      auth: authEn,
      settings: settingsEn
    }
  }
})
