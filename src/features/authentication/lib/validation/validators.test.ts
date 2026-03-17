import {
  emailRules,
  mapRule,
  PASSWORD_MIN_LENGTH,
  passwordRules
} from '@features/authentication/lib/validation/validators'
import { describe, expect, it, vi } from 'vitest'

import { ErrorCode } from './error-manager'

describe('emailRules', () => {
  it('returns error if email is empty', () => {
    const result = emailRules[0]!('')
    expect(result).toBe(ErrorCode.REQUIRED)
  })

  it('accepts a valid email', () => {
    const result = emailRules[1]!('test@example.com')
    expect(result).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = emailRules[1]!('invalid-email')
    expect(result).toBe(ErrorCode.INVALID_EMAIL)
  })

  it('rejects undefined email', () => {
    const result = emailRules[0]!(undefined)
    expect(result).toBe(ErrorCode.REQUIRED)
  })

  it('rejects undefined for format rule', () => {
    const result = emailRules[1]!(undefined)
    expect(result).toBe(ErrorCode.INVALID_EMAIL)
  })
})

describe('passwordRules', () => {
  it('rejects password shorter than minimum length', () => {
    const result = passwordRules[0]!('short')
    expect(result).toBe(ErrorCode.PASSWORD_MIN_LENGTH)
  })

  it('accepts password with minimum length', () => {
    const validPassword = 'a'.repeat(PASSWORD_MIN_LENGTH)
    const result = passwordRules[0]!(validPassword)
    expect(result).toBe(true)
  })

  it('rejects password without letters', () => {
    const result = passwordRules[1]!('123456789012')
    expect(result).toBe(ErrorCode.PASSWORD_MISSING_LETTER)
  })

  it('accepts password with letters', () => {
    const result = passwordRules[1]!('abcd1234efgh')
    expect(result).toBe(true)
  })

  it('rejects undefined password', () => {
    const result = passwordRules[0]!(undefined)
    expect(result).toBe(ErrorCode.PASSWORD_MIN_LENGTH)
  })

  it('rejects undefined for letter rule', () => {
    const result = passwordRules[1]!(undefined)
    expect(result).toBe(ErrorCode.PASSWORD_MISSING_LETTER)
  })
})

describe('mapRule', () => {
  it('returns true if rule passes', () => {
    const rule = () => true as const
    const t = vi.fn()

    const mapped = mapRule(rule, t)

    expect(mapped('value')).toBe(true)
    expect(t).not.toHaveBeenCalled()
  })

  it('translates error code if rule fails', () => {
    const rule = () => ErrorCode.REQUIRED
    const t = vi.fn().mockReturnValue('translated')

    const mapped = mapRule(rule, t)

    expect(mapped('')).toBe('translated')
    expect(t).toHaveBeenCalled()
  })
})
