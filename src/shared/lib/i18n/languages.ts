export const LanguageCode = {
  DE: 'de',
  EN: 'en'
} as const

export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode]

export const AvailableLanguages = [
  { code: LanguageCode.DE, label: 'Deutsch' },
  { code: LanguageCode.EN, label: 'English' }
]

export const FallbackLanguage: LanguageCode = LanguageCode.EN
