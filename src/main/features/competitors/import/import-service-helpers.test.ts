import { describe, expect, it } from 'vitest'

import {
  hasImportWeight,
  importResultRowLabel,
  isImportRowSuccessful,
  toImportNullable
} from './import-service-helpers'

describe('import-service helpers', () => {
  it('normalizes missing values to null', () => {
    expect(toImportNullable(undefined)).toBeNull()
    expect(toImportNullable(null)).toBeNull()
    expect(toImportNullable('DE')).toBe('DE')
  })

  it('returns stable import result labels', () => {
    expect(importResultRowLabel(undefined, 'givenName')).toBe('')
    expect(
      importResultRowLabel({ givenName: 'Yuki', familyName: 'Tanaka', startEligible: true }, 'club')
    ).toBe('')
    expect(
      importResultRowLabel(
        { givenName: 'Yuki', familyName: 'Tanaka', club: 'Dojo Nord', startEligible: true },
        'club'
      )
    ).toBe('Dojo Nord')
  })

  it('detects rows with a parsed weight', () => {
    expect(hasImportWeight(undefined)).toBe(false)
    expect(hasImportWeight(45)).toBe(true)
  })

  it('detects successful import rows', () => {
    expect(isImportRowSuccessful(undefined)).toBe(false)
    expect(isImportRowSuccessful({ success: false })).toBe(false)
    expect(isImportRowSuccessful({ success: true })).toBe(true)
  })
})
