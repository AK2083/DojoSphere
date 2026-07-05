import { describe, expect, it } from 'vitest'

import { normalizeHeader, normalizeValue } from './normalize-text'

describe('normalizeHeader', () => {
  it('lowercases, strips diacritics and removes non-alphanumerics', () => {
    expect(normalizeHeader('  Geburts-Datum ')).toBe('geburtsdatum')
    expect(normalizeHeader('Nationalität')).toBe('nationalitat')
    expect(normalizeHeader('m/w/d')).toBe('mwd')
  })

  it('returns an empty string for punctuation-only input', () => {
    expect(normalizeHeader('---')).toBe('')
    expect(normalizeHeader('')).toBe('')
  })

  it('treats spacing and casing variants as equal', () => {
    expect(normalizeHeader('Vor Name')).toBe(normalizeHeader('vorname'))
  })
})

describe('normalizeValue', () => {
  it('lowercases and strips diacritics but keeps inner spaces', () => {
    expect(normalizeValue('  Männlich ')).toBe('mannlich')
    expect(normalizeValue('Late Registration')).toBe('late registration')
  })

  it('returns an empty string for whitespace-only input', () => {
    expect(normalizeValue('   ')).toBe('')
  })
})
