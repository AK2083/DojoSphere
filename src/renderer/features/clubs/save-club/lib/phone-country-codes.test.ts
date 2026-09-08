import { describe, expect, it } from 'vitest'

import {
  DEFAULT_PHONE_COUNTRY_CODE,
  joinPhoneCountryCode,
  PHONE_COUNTRY_CODES,
  splitPhoneCountryCode
} from './phone-country-codes'

describe('phone-country-codes', () => {
  it('exposes only country codes for supported languages', () => {
    expect(PHONE_COUNTRY_CODES.map((entry) => entry.value)).toEqual(['+49', '+44'])
    expect(DEFAULT_PHONE_COUNTRY_CODE).toBe('+49')
  })

  it('splits international numbers by country calling code', () => {
    expect(splitPhoneCountryCode('+49 40 555 0100')).toEqual({
      phoneCountryCode: '+49',
      phoneNumber: '40 555 0100'
    })
    expect(splitPhoneCountryCode('+44 20 7946 0958')).toEqual({
      phoneCountryCode: '+44',
      phoneNumber: '20 7946 0958'
    })
    expect(splitPhoneCountryCode('')).toEqual({
      phoneCountryCode: '+49',
      phoneNumber: ''
    })
  })

  it('joins country code and national number', () => {
    expect(joinPhoneCountryCode('+49', '40 555 0100')).toBe('+49 40 555 0100')
    expect(joinPhoneCountryCode('+44', '')).toBeNull()
    expect(joinPhoneCountryCode('+44', '20 7946 0958')).toBe('+44 20 7946 0958')
  })
})
