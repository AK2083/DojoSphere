import { translationKeys } from '@features/authentication/i18n/keys'
import { describe, expect, it, vi } from 'vitest'

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
      required: translationKeys.form.mail.required,
      invalidEmail: translationKeys.form.mail.invalid,
      passwordMinLength: translationKeys.form.password.lessCharacters,
      passwordMissingLetter: translationKeys.form.password.noLetter,
      unknown: translationKeys.form.error.unknown
    })
  })
})

describe('translateError', () => {
  it('translates a known error code', () => {
    const t = vi.fn((key: string) => `translated:${key}`)

    const result = translateError(ErrorCode.REQUIRED, t)

    expect(t).toHaveBeenCalledWith(translationKeys.form.mail.required)
    expect(result).toBe(`translated:${translationKeys.form.mail.required}`)
  })

  it('translates another known error code', () => {
    const t = vi.fn((key: string) => key)

    const result = translateError(ErrorCode.PASSWORD_MIN_LENGTH, t)

    expect(t).toHaveBeenCalledWith(translationKeys.form.password.lessCharacters)
    expect(result).toBe(translationKeys.form.password.lessCharacters)
  })

  it('falls back to unknown if code is not in map', () => {
    const t = vi.fn((key: string) => key)

    const result = translateError('notExisting' as ErrorCode, t)

    expect(t).toHaveBeenCalledWith(translationKeys.form.error.unknown)
    expect(result).toBe(translationKeys.form.error.unknown)
  })
})
