import { describe, expect, it, vi } from 'vitest'

import translationKeys from '../i18n/keys'
import { ErrorCode, errorTranslationMap, translateError } from './error-manager'

describe('ErrorCode', () => {
  it('contains all expected error codes', () => {
    expect(ErrorCode).toEqual({
      REQUIRED: 'required',
      INVALID_EMAIL: 'invalidEmail',
      PASSWORD_MIN_LENGTH: 'passwordMinLength',
      PASSWORD_MISSING_LETTER: 'passwordMissingLetter',
      UNKNOWN: 'unknown'
    })
  })
})

describe('errorTranslationMap', () => {
  it('maps all error codes to translation keys', () => {
    expect(errorTranslationMap).toEqual({
      required: translationKeys.validation.email.required,
      invalidEmail: translationKeys.validation.email.invalid,
      passwordMinLength: translationKeys.validation.password.lessCharacters,
      passwordMissingLetter: translationKeys.validation.password.noLetter,
      unknown: translationKeys.error.unknown
    })
  })
})

describe('translateError', () => {
  it('translates a known error code', () => {
    const t = vi.fn((key: string) => `translated:${key}`)

    const result = translateError(ErrorCode.REQUIRED, t)

    expect(t).toHaveBeenCalledWith(translationKeys.validation.email.required)
    expect(result).toBe(`translated:${translationKeys.validation.email.required}`)
  })

  it('translates another known error code', () => {
    const t = vi.fn((key: string) => key)

    const result = translateError(ErrorCode.PASSWORD_MIN_LENGTH, t)

    expect(t).toHaveBeenCalledWith(translationKeys.validation.password.lessCharacters)
    expect(result).toBe(translationKeys.validation.password.lessCharacters)
  })

  it('falls back to unknown if code is not in map', () => {
    const t = vi.fn((key: string) => key)

    const result = translateError('notExisting' as ErrorCode, t)

    expect(t).toHaveBeenCalledWith(translationKeys.error.unknown)
    expect(result).toBe(translationKeys.error.unknown)
  })
})
