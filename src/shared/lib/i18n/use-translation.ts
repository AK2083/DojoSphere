import { useI18n } from 'vue-i18n'

/**
 * Provides access to the application's translation utilities.
 *
 * This composable wraps {@link useI18n} and exposes the translation
 * function and the current locale used by the application.
 *
 * It can be used inside Vue components to translate text and
 * reactively access or change the current language.
 *
 * @returns {{
 *   t: ReturnType<typeof useI18n>['t'],
 *   locale: ReturnType<typeof useI18n>['locale']
 * }} An object containing the translation function and the current locale.
 */
export function useTranslation() {
  const { t, locale } = useI18n()

  return {
    t,
    locale
  }
}
