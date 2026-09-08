import { describe, expect, it } from 'vitest'

import {
  ClubFormErrorCode,
  optionalCityRule,
  optionalClubNumberRule,
  optionalEmailRule,
  optionalGermanPostalCodeRule,
  optionalHouseNumberRule,
  optionalMaxLengthRule,
  optionalPhoneNumberRule,
  optionalWebsiteHostRule,
  requiredFieldRule,
  requiredMaxLengthRule
} from './club-form-rules'

describe('club-form-rules', () => {
  it('requires non-empty trimmed values', () => {
    expect(requiredFieldRule('')).toBe(ClubFormErrorCode.REQUIRED)
    expect(requiredFieldRule('  ')).toBe(ClubFormErrorCode.REQUIRED)
    expect(requiredFieldRule('JC Nord')).toBe(true)
  })

  it('validates optional and required max lengths', () => {
    expect(optionalMaxLengthRule(3)('')).toBe(true)
    expect(optionalMaxLengthRule(3)('abcd')).toBe(ClubFormErrorCode.TEXT_TOO_LONG)
    expect(requiredMaxLengthRule(3)('')).toBe(ClubFormErrorCode.REQUIRED)
    expect(requiredMaxLengthRule(3)('ab')).toBe(true)
  })

  it('validates optional emails', () => {
    expect(optionalEmailRule('')).toBe(true)
    expect(optionalEmailRule('info@example.com')).toBe(true)
    expect(optionalEmailRule('bad-email')).toBe(ClubFormErrorCode.INVALID_EMAIL)
    expect(optionalEmailRule(`${'a'.repeat(120)}@example.com`)).toBe(
      ClubFormErrorCode.TEXT_TOO_LONG
    )
  })

  it('validates optional website hosts', () => {
    expect(optionalWebsiteHostRule('')).toBe(true)
    expect(optionalWebsiteHostRule('www.example.com')).toBe(true)
    expect(optionalWebsiteHostRule('example.com/path')).toBe(true)
    expect(optionalWebsiteHostRule('https://example.com')).toBe(ClubFormErrorCode.INVALID_WEBSITE)
    expect(optionalWebsiteHostRule('not a host')).toBe(ClubFormErrorCode.INVALID_WEBSITE)
    expect(optionalWebsiteHostRule('localhost')).toBe(ClubFormErrorCode.INVALID_WEBSITE)
    expect(optionalWebsiteHostRule(`${'a'.repeat(181)}.example.com`)).toBe(
      ClubFormErrorCode.TEXT_TOO_LONG
    )
  })

  it('validates optional German postal codes as five digits', () => {
    expect(optionalGermanPostalCodeRule('')).toBe(true)
    expect(optionalGermanPostalCodeRule('20095')).toBe(true)
    expect(optionalGermanPostalCodeRule('2009')).toBe(ClubFormErrorCode.INVALID_POSTAL_CODE)
    expect(optionalGermanPostalCodeRule('200951')).toBe(ClubFormErrorCode.INVALID_POSTAL_CODE)
    expect(optionalGermanPostalCodeRule('20a95')).toBe(ClubFormErrorCode.INVALID_POSTAL_CODE)
  })

  it('validates optional house numbers', () => {
    expect(optionalHouseNumberRule('')).toBe(true)
    expect(optionalHouseNumberRule('12')).toBe(true)
    expect(optionalHouseNumberRule('12a')).toBe(true)
    expect(optionalHouseNumberRule('12-14')).toBe(true)
    expect(optionalHouseNumberRule('??')).toBe(ClubFormErrorCode.INVALID_HOUSE_NUMBER)
  })

  it('validates optional club numbers as digits', () => {
    expect(optionalClubNumberRule('')).toBe(true)
    expect(optionalClubNumberRule('020123')).toBe(true)
    expect(optionalClubNumberRule('02A123')).toBe(ClubFormErrorCode.INVALID_CLUB_NUMBER)
  })

  it('validates optional national phone numbers', () => {
    expect(optionalPhoneNumberRule('')).toBe(true)
    expect(optionalPhoneNumberRule('40 555 0100')).toBe(true)
    expect(optionalPhoneNumberRule('12')).toBe(ClubFormErrorCode.INVALID_PHONE)
    expect(optionalPhoneNumberRule('abc')).toBe(ClubFormErrorCode.INVALID_PHONE)
  })

  it('validates optional city names', () => {
    expect(optionalCityRule('')).toBe(true)
    expect(optionalCityRule('Hamburg')).toBe(true)
    expect(optionalCityRule('Bad Homburg')).toBe(true)
    expect(optionalCityRule('###')).toBe(ClubFormErrorCode.INVALID_CITY)
  })
})
