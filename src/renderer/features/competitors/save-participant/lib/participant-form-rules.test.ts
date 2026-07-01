import { describe, expect, it } from 'vitest'

import {
  birthDateRule,
  createWeightClassRule,
  genderRule,
  nationalityRule,
  optionalLicenseNumberRule,
  optionalMaxLengthRule,
  optionalPhoneRule,
  ParticipantFormErrorCode,
  passNumberRule,
  requiredFieldRule
} from './participant-form-rules'

describe('participant-form-rules', () => {
  it('requires non-empty text fields', () => {
    expect(requiredFieldRule('')).toBe(ParticipantFormErrorCode.REQUIRED)
    expect(requiredFieldRule('Yuki')).toBe(true)
  })

  it('validates gender codes', () => {
    expect(genderRule('')).toBe(ParticipantFormErrorCode.REQUIRED)
    expect(genderRule('f')).toBe(true)
    expect(genderRule('female')).toBe(ParticipantFormErrorCode.INVALID_GENDER)
  })

  it('rejects invalid iso date parts', () => {
    expect(birthDateRule('2011-04')).toBe(ParticipantFormErrorCode.INVALID_BIRTH_DATE)
    expect(birthDateRule('2011-00-12')).toBe(ParticipantFormErrorCode.INVALID_BIRTH_DATE)
    expect(birthDateRule('2011-02-30')).toBe(ParticipantFormErrorCode.INVALID_BIRTH_DATE)
  })

  it('validates birth dates', () => {
    expect(birthDateRule('')).toBe(ParticipantFormErrorCode.REQUIRED)
    expect(birthDateRule('not-a-date')).toBe(ParticipantFormErrorCode.INVALID_BIRTH_DATE)
    expect(birthDateRule('2011-04-12')).toBe(true)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const future = tomorrow.toISOString().slice(0, 10)

    expect(birthDateRule(future)).toBe(ParticipantFormErrorCode.BIRTH_DATE_IN_FUTURE)
  })

  it('validates nationality codes', () => {
    expect(nationalityRule('')).toBe(ParticipantFormErrorCode.REQUIRED)
    expect(nationalityRule('DE')).toBe(true)
    expect(nationalityRule('de')).toBe(true)
    expect(nationalityRule('D')).toBe(ParticipantFormErrorCode.INVALID_NATIONALITY)
    expect(nationalityRule('12')).toBe(ParticipantFormErrorCode.INVALID_NATIONALITY)
    expect(nationalityRule('D1')).toBe(ParticipantFormErrorCode.INVALID_NATIONALITY)
    expect(nationalityRule('!D')).toBe(ParticipantFormErrorCode.INVALID_NATIONALITY)
  })

  it('accepts optional phone numbers only when valid', () => {
    expect(optionalPhoneRule('')).toBe(true)
    expect(optionalPhoneRule('+49 170 1234567')).toBe(true)
    expect(optionalPhoneRule('abc')).toBe(ParticipantFormErrorCode.INVALID_PHONE)
    expect(optionalPhoneRule('1'.repeat(33))).toBe(ParticipantFormErrorCode.INVALID_PHONE)
  })

  it('validates pass numbers with pragmatic length and character rules', () => {
    expect(passNumberRule('')).toBe(ParticipantFormErrorCode.REQUIRED)
    expect(passNumberRule('JP-000142')).toBe(true)
    expect(passNumberRule('12345678')).toBe(true)
    expect(passNumberRule('pass number')).toBe(ParticipantFormErrorCode.INVALID_PASS_NUMBER)
    expect(passNumberRule('a'.repeat(33))).toBe(ParticipantFormErrorCode.TEXT_TOO_LONG)
  })

  it('validates optional license numbers like pass numbers', () => {
    expect(optionalLicenseNumberRule('')).toBe(true)
    expect(optionalLicenseNumberRule('WL-2024-001')).toBe(true)
    expect(optionalLicenseNumberRule('invalid id')).toBe(
      ParticipantFormErrorCode.INVALID_PASS_NUMBER
    )
    expect(optionalLicenseNumberRule('1'.repeat(33))).toBe(ParticipantFormErrorCode.TEXT_TOO_LONG)
  })

  it('enforces optional max length', () => {
    const rule = optionalMaxLengthRule(5)

    expect(rule('')).toBe(true)
    expect(rule('12345')).toBe(true)
    expect(rule('123456')).toBe(ParticipantFormErrorCode.TEXT_TOO_LONG)
  })

  it('requires weight classes only for fixed age classes', () => {
    const rule = createWeightClassRule(
      () => 'age-class-1',
      () => [
        {
          id: 'weight-1',
          djbRow: 3,
          ageClassId: 'age-class-1',
          maxWeightKg: 60,
          minWeightKg: null,
          sortOrder: 1
        }
      ]
    )

    expect(rule('')).toBe(ParticipantFormErrorCode.REQUIRED)
    expect(rule('weight-1')).toBe(true)
    expect(rule('other')).toBe(ParticipantFormErrorCode.WEIGHT_CLASS_AGE_MISMATCH)

    const flexibleRule = createWeightClassRule(
      () => 'flex-age',
      () => []
    )

    expect(flexibleRule('')).toBe(true)
  })

  it('requires an age class before validating weight class', () => {
    const rule = createWeightClassRule(
      () => '',
      () => [
        {
          id: 'weight-1',
          djbRow: 3,
          ageClassId: 'age-class-1',
          maxWeightKg: 60,
          minWeightKg: null,
          sortOrder: 1
        }
      ]
    )

    expect(rule('weight-1')).toBe(ParticipantFormErrorCode.REQUIRED)
  })
})
