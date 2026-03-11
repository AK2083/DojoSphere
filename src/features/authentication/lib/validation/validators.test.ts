import { describe, it, expect } from 'vitest'
import {
  emailRules,
  passwordRules
} from '@features/authentication/lib/validation/validators'

describe('emailRules', () => {
  it('returns error if email is empty', () => {
    const result = emailRules[0]!('')
    expect(result).toBe('required')
  })

  it('accepts a valid email', () => {
    const result = emailRules[1]!('test@example.com')
    expect(result).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = emailRules[1]!('invalid-email')
    expect(result).toBe('invalidEmail')
  })

  it('rejects undefined email', () => {
    const result = emailRules[0]!(undefined)
    expect(result).toBe('required')
  })

  it('rejects undefined for format rule', () => {
    const result = emailRules[1]!(undefined)
    expect(result).toBe('invalidEmail')
  })
})

describe('passwordRules', () => {
  it('rejects password shorter than 8 characters', () => {
    const result = passwordRules[0]!('abc123')
    expect(result).toBe('minLength')
  })

  it('accepts password with at least 8 characters', () => {
    const result = passwordRules[0]!('abcdefgh')
    expect(result).toBe('minLength')
  })

  it('rejects password without letters', () => {
    const result = passwordRules[1]!('12345678')
    expect(result).toBe('missingLetter')
  })

  it('accepts password with letters', () => {
    const result = passwordRules[1]!('abcd1234')
    expect(result).toBe(true)
  })

  it('rejects undefined password', () => {
    const result = passwordRules[0]!(undefined)
    expect(result).toBe('minLength')
  })

  it('rejects password with no letters', () => {
    const result = passwordRules[1]!('12345678')
    expect(result).toBe('missingLetter')
  })

  it('rejects undefined for letter rule', () => {
    const result = passwordRules[1]!(undefined)
    expect(result).toBe('missingLetter')
  })
})
