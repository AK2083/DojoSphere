import { createI18n } from 'vue-i18n'

import appDe from '@app/i18n/de'
import appEn from '@app/i18n/en'

import { authDe, authEn } from '@features/authentication/i18n'
import { settingsDe, settingsEn } from '@features/settings/i18n'

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
