import { createI18n } from 'vue-i18n'
import { audienceDe, audienceEn } from '@features/audience'
import { authDe, authEn } from '@features/authentication'
import { getInitialLanguage, settingsDe, settingsEn } from '@features/settings'
import { statusDe, statusEn } from '@features/status'
import { FallbackLanguage, sharedDe, sharedEn } from '@shared/lib/i18n'
import { navigationDe, navigationEn } from '@widgets/navigation'

import appDe from './de'
import appEn from './en'

/** Root vue-i18n instance with feature message bundles. */
export const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: FallbackLanguage,
  messages: {
    de: {
      app: appDe,
      audience: audienceDe,
      navigation: navigationDe,
      status: statusDe,
      auth: authDe,
      settings: settingsDe,
      shared: sharedDe
    },
    en: {
      app: appEn,
      audience: audienceEn,
      navigation: navigationEn,
      status: statusEn,
      auth: authEn,
      settings: settingsEn,
      shared: sharedEn
    }
  }
})
