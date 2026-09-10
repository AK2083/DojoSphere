import { describe, expect, it } from 'vitest'

import {
  AssociationFormErrorCode,
  optionalAssociationNumberRule,
  optionalCityRule,
  optionalEmailRule,
  optionalGermanPostalCodeRule,
  optionalHouseNumberRule,
  optionalMaxLengthRule,
  optionalPhoneNumberRule,
  optionalWebsiteHostRule,
  requiredFieldRule,
  requiredMaxLengthRule
} from './association-form-rules'

describe('association-form-rules', () => {
  it('requires non-empty trimmed values', () => {
    expect(requiredFieldRule('')).toBe(AssociationFormErrorCode.REQUIRED)
    expect(requiredFieldRule('  ')).toBe(AssociationFormErrorCode.REQUIRED)
    expect(requiredFieldRule('JC Nord')).toBe(true)
  })

  it('validates optional and required max lengths', () => {
    expect(optionalMaxLengthRule(3)('')).toBe(true)
    expect(optionalMaxLengthRule(3)('abcd')).toBe(AssociationFormErrorCode.TEXT_TOO_LONG)
    expect(requiredMaxLengthRule(3)('')).toBe(AssociationFormErrorCode.REQUIRED)
    expect(requiredMaxLengthRule(3)('ab')).toBe(true)
  })

  it('validates optional emails', () => {
    expect(optionalEmailRule('')).toBe(true)
    expect(optionalEmailRule(null)).toBe(true)
    expect(optionalEmailRule(undefined)).toBe(true)
    expect(optionalEmailRule('info@example.com')).toBe(true)
    expect(optionalEmailRule('bad-email')).toBe(AssociationFormErrorCode.INVALID_EMAIL)
    expect(optionalEmailRule(`${'a'.repeat(120)}@example.com`)).toBe(
      AssociationFormErrorCode.TEXT_TOO_LONG
    )
  })

  it('validates optional website hosts', () => {
    expect(optionalWebsiteHostRule('')).toBe(true)
    expect(optionalWebsiteHostRule(null)).toBe(true)
    expect(optionalWebsiteHostRule(undefined)).toBe(true)
    expect(optionalWebsiteHostRule('www.example.com')).toBe(true)
    expect(optionalWebsiteHostRule('example.com/path')).toBe(true)
    expect(optionalWebsiteHostRule('https://example.com')).toBe(
      AssociationFormErrorCode.INVALID_WEBSITE
    )
    expect(optionalWebsiteHostRule('not a host')).toBe(AssociationFormErrorCode.INVALID_WEBSITE)
    expect(optionalWebsiteHostRule('localhost')).toBe(AssociationFormErrorCode.INVALID_WEBSITE)
    expect(optionalWebsiteHostRule('[')).toBe(AssociationFormErrorCode.INVALID_WEBSITE)
    expect(optionalWebsiteHostRule(`${'a'.repeat(181)}.example.com`)).toBe(
      AssociationFormErrorCode.TEXT_TOO_LONG
    )
  })

  it('validates optional German postal codes as five digits', () => {
    expect(optionalGermanPostalCodeRule('')).toBe(true)
    expect(optionalGermanPostalCodeRule(null)).toBe(true)
    expect(optionalGermanPostalCodeRule('20095')).toBe(true)
    expect(optionalGermanPostalCodeRule('2009')).toBe(AssociationFormErrorCode.INVALID_POSTAL_CODE)
    expect(optionalGermanPostalCodeRule('200951')).toBe(
      AssociationFormErrorCode.INVALID_POSTAL_CODE
    )
    expect(optionalGermanPostalCodeRule('20a95')).toBe(AssociationFormErrorCode.INVALID_POSTAL_CODE)
  })

  it('validates optional house numbers', () => {
    expect(optionalHouseNumberRule('')).toBe(true)
    expect(optionalHouseNumberRule(null)).toBe(true)
    expect(optionalHouseNumberRule('12')).toBe(true)
    expect(optionalHouseNumberRule('12a')).toBe(true)
    expect(optionalHouseNumberRule('12-14')).toBe(true)
    expect(optionalHouseNumberRule('??')).toBe(AssociationFormErrorCode.INVALID_HOUSE_NUMBER)
    expect(optionalHouseNumberRule('1'.repeat(11))).toBe(AssociationFormErrorCode.TEXT_TOO_LONG)
  })

  it('validates optional association numbers as digits', () => {
    expect(optionalAssociationNumberRule('')).toBe(true)
    expect(optionalAssociationNumberRule(null)).toBe(true)
    expect(optionalAssociationNumberRule('020123')).toBe(true)
    expect(optionalAssociationNumberRule('02A123')).toBe(
      AssociationFormErrorCode.INVALID_ASSOCIATION_NUMBER
    )
    expect(optionalAssociationNumberRule('1'.repeat(13))).toBe(
      AssociationFormErrorCode.TEXT_TOO_LONG
    )
  })

  it('validates optional national phone numbers', () => {
    expect(optionalPhoneNumberRule('')).toBe(true)
    expect(optionalPhoneNumberRule(null)).toBe(true)
    expect(optionalPhoneNumberRule('40 555 0100')).toBe(true)
    expect(optionalPhoneNumberRule('12')).toBe(AssociationFormErrorCode.INVALID_PHONE)
    expect(optionalPhoneNumberRule('abc')).toBe(AssociationFormErrorCode.INVALID_PHONE)
    expect(optionalPhoneNumberRule('1'.repeat(21))).toBe(AssociationFormErrorCode.TEXT_TOO_LONG)
  })

  it('validates optional city names', () => {
    expect(optionalCityRule('')).toBe(true)
    expect(optionalCityRule(null)).toBe(true)
    expect(optionalCityRule('Hamburg')).toBe(true)
    expect(optionalCityRule('Bad Homburg')).toBe(true)
    expect(optionalCityRule('###')).toBe(AssociationFormErrorCode.INVALID_CITY)
    expect(optionalCityRule('A'.repeat(81))).toBe(AssociationFormErrorCode.TEXT_TOO_LONG)
  })
})
