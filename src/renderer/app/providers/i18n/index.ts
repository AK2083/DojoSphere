import { createI18n } from 'vue-i18n'
import { associationsDe, associationsEn } from '@features/associations'
import { authDe, authEn } from '@features/authentication'
import { competitorsDe, competitorsEn } from '@features/competitors'
import { getInitialLanguage, settingsDe, settingsEn } from '@features/settings'
import { statusDe, statusEn } from '@features/status'
import { FallbackLanguage, sharedDe, sharedEn } from '@shared/lib/i18n'
import { navigationDe, navigationEn } from '@widgets/navigation'

import appDe from './de'
import appEn from './en'
import permissionsDe from './permissions-de'
import permissionsEn from './permissions-en'

/** Root vue-i18n instance with feature message bundles. */
export const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: FallbackLanguage,
  messages: {
    de: {
      app: appDe,
      navigation: navigationDe,
      status: statusDe,
      auth: authDe,
      associations: associationsDe,
      competitors: competitorsDe,
      settings: settingsDe,
      shared: sharedDe,
      permissions: permissionsDe
    },
    en: {
      app: appEn,
      navigation: navigationEn,
      status: statusEn,
      auth: authEn,
      associations: associationsEn,
      competitors: competitorsEn,
      settings: settingsEn,
      shared: sharedEn,
      permissions: permissionsEn
    }
  }
})
