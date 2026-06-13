import { describe, expect, it } from 'vitest'

import { countLetters, displayNameRules, WorkLocalErrorCode } from './validators'

describe('countLetters', () => {
  it('counts unicode letters only', () => {
    expect(countLetters('ab1')).toBe(2)
    expect(countLetters('Äbc')).toBe(3)
    expect(countLetters('ab cd')).toBe(4)
    expect(countLetters('')).toBe(0)
  })
})

describe('displayNameRules', () => {
  it('requires a non-empty value', () => {
    expect(displayNameRules[0]!('')).toBe(WorkLocalErrorCode.REQUIRED)
    expect(displayNameRules[0]!('   ')).toBe(WorkLocalErrorCode.REQUIRED)
    expect(displayNameRules[0]!('Ada')).toBe(true)
  })

  it('requires at least three letters', () => {
    expect(displayNameRules[1]!(undefined)).toBe(WorkLocalErrorCode.MIN_LETTERS)
    expect(displayNameRules[1]!('ab')).toBe(WorkLocalErrorCode.MIN_LETTERS)
    expect(displayNameRules[1]!('ab1')).toBe(WorkLocalErrorCode.MIN_LETTERS)
    expect(displayNameRules[1]!('abc')).toBe(true)
  })
})
