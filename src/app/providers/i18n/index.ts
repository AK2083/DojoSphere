import { createI18n } from 'vue-i18n'
import { authDe, authEn } from '@features/authentication'
import { networkStatusDe, networkStatusEn } from '@features/network-status'
import { getInitialLanguage, settingsDe, settingsEn } from '@features/settings'
import { FallbackLanguage, sharedDe, sharedEn } from '@shared/lib/i18n'
import { navigationDe, navigationEn } from '@widgets/navigation'

import appDe from './de'
import appEn from './en'

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: FallbackLanguage,
  messages: {
    de: {
      app: appDe,
      navigation: navigationDe,
      networkStatus: networkStatusDe,
      auth: authDe,
      settings: settingsDe,
      shared: sharedDe
    },
    en: {
      app: appEn,
      navigation: navigationEn,
      networkStatus: networkStatusEn,
      auth: authEn,
      settings: settingsEn,
      shared: sharedEn
    }
  }
})
