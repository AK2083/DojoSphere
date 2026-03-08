import { useI18n } from 'vue-i18n'

export function useTranslation() {
  const { t, locale } = useI18n()

  return {
    t,
    locale
  }
}
