import { describe, expect, it } from 'vitest'

import { isCompatibleFieldMapping } from './match-field-data-type'

describe('isCompatibleFieldMapping', () => {
  it('rejects date samples for licenseNumber', () => {
    expect(
      isCompatibleFieldMapping('licenseNumber', 'Spalte X', ['19.09.2026', '20.09.2026'])
    ).toBe(false)
  })

  it('accepts license-like samples for licenseNumber', () => {
    expect(isCompatibleFieldMapping('licenseNumber', 'Lizenz-Nr.', ['WL-123', 'WL-456'])).toBe(true)
  })

  it('rejects event metadata headers for any field', () => {
    expect(isCompatibleFieldMapping('birthDate', 'Wettkampftag', ['19.09.2026'])).toBe(false)
    expect(isCompatibleFieldMapping('licenseNumber', 'Wettkampftag', ['WL-1'])).toBe(false)
  })

  it('accepts compatible types for specialized fields', () => {
    expect(isCompatibleFieldMapping('birthDate', 'Geburtsdatum', ['2012-01-01'])).toBe(true)
    expect(isCompatibleFieldMapping('birthDate', 'Lizenz-Nr.', ['WL-1'])).toBe(false)
    expect(isCompatibleFieldMapping('gender', 'Geschlecht', ['m', 'w'])).toBe(true)
    expect(isCompatibleFieldMapping('gender', 'Spalte X', ['2012-01-01'])).toBe(false)
    expect(isCompatibleFieldMapping('clubContactEmail', 'E-Mail', ['a@b.invalid'])).toBe(true)
    expect(isCompatibleFieldMapping('grade', 'Kyu', ['8.', '6.'])).toBe(true)
    expect(isCompatibleFieldMapping('weightKg', 'Gewicht', ['45', '52'])).toBe(true)
    expect(isCompatibleFieldMapping('registrationStatus', 'Status', ['gemeldet'])).toBe(true)
    expect(isCompatibleFieldMapping('startEligible', 'Start', ['ja', 'nein'])).toBe(true)
    expect(isCompatibleFieldMapping('givenName', 'Vorname', ['Yuki'])).toBe(true)
  })

  it('falls back to text compatibility for unknown field keys', () => {
    expect(isCompatibleFieldMapping('unknownField' as 'givenName', 'Spalte X', ['value'])).toBe(
      true
    )
  })
})
