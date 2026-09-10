/** Country calling code tied to a supported UI language. */
export type PhoneCountryCodeOption = {
  title: string
  value: string
  language: 'de' | 'en'
}

/**
 * Country calling codes for languages the app localizes.
 * Deutsch → +49, English → +44.
 */
export const PHONE_COUNTRY_CODES: PhoneCountryCodeOption[] = [
  { title: '+49', value: '+49', language: 'de' },
  { title: '+44', value: '+44', language: 'en' }
]

const COUNTRY_CODE_VALUES = [...PHONE_COUNTRY_CODES.map((entry) => entry.value)].sort(
  (left, right) => right.length - left.length
)

/** Default country calling code (German). */
export const DEFAULT_PHONE_COUNTRY_CODE = '+49'

/**
 * Splits a stored phone value into country calling code and national number.
 *
 * @param phone - Stored phone string (e.g. `+49 40 555 0100`).
 * @returns Country code and remaining national number.
 */
export function splitPhoneCountryCode(phone: string | null): {
  phoneCountryCode: string
  phoneNumber: string
} {
  const trimmed = phone?.trim() ?? ''

  if (!trimmed) {
    return { phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE, phoneNumber: '' }
  }

  for (const countryCode of COUNTRY_CODE_VALUES) {
    if (trimmed.startsWith(countryCode)) {
      return {
        phoneCountryCode: countryCode,
        phoneNumber: trimmed.slice(countryCode.length).trim()
      }
    }

    const dialWithoutPlus = countryCode.replace(/^\+/, '00')

    if (trimmed.startsWith(dialWithoutPlus)) {
      return {
        phoneCountryCode: countryCode,
        phoneNumber: trimmed.slice(dialWithoutPlus.length).trim()
      }
    }
  }

  return {
    phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
    phoneNumber: trimmed.replace(/^\+?49[\s-]*/, '').trim()
  }
}

/**
 * Joins country calling code and national number into a stored phone value.
 *
 * @param countryCode - Country calling code including `+`.
 * @param number - National number without country code.
 * @returns Combined phone string, or `null` when number is blank.
 */
export function joinPhoneCountryCode(countryCode: string, number: string): string | null {
  const trimmedNumber = number.trim().replace(/^\/+/, '')

  if (!trimmedNumber) {
    return null
  }

  return `${countryCode} ${trimmedNumber}`.replace(/\s+/g, ' ').trim()
}
