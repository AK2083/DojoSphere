import { useI18n } from 'vue-i18n'

/**
 * Composable for handling translations using vue-i18n.
 *
 * Provides the translation function `t` and the current `locale`.
 *
 * @returns An object containing the translation function and the current locale.
 *
 * @example
 * const { t, locale } = useTranslation()
 *
 * t('common.hello')
 * locale.value = 'en'
 */
export function useTranslation(): {
  t: import('vue-i18n').Composer['t']
  locale: import('vue-i18n').Composer['locale']
} {
  const { t, locale } = useI18n()

  return {
    t,
    locale
  }
}
