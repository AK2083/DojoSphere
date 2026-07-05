import { describe, expect, it } from 'vitest'

import {
  isExcludedImportSourceLabel,
  isParticipantFormRequiredImportField,
  usesImportDefaultWhenUnmapped
} from './competitor-import-fields'

describe('competitor-import-fields', () => {
  it('marks participant form required import fields', () => {
    expect(isParticipantFormRequiredImportField('givenName')).toBe(true)
    expect(isParticipantFormRequiredImportField('contactPerson')).toBe(false)
  })

  it('detects fields that use repository defaults when unmapped', () => {
    expect(usesImportDefaultWhenUnmapped('nationality')).toBe(true)
    expect(usesImportDefaultWhenUnmapped('givenName')).toBe(false)
    expect(usesImportDefaultWhenUnmapped('familyName')).toBe(false)
  })

  it('treats tournament metadata labels as excluded import sources', () => {
    expect(isExcludedImportSourceLabel('Wettkampftag')).toBe(true)
    expect(isExcludedImportSourceLabel('Ausrichter')).toBe(true)
    expect(isExcludedImportSourceLabel('Vorname')).toBe(false)
  })

  it('does not treat blank labels as excluded metadata', () => {
    expect(isExcludedImportSourceLabel('   ')).toBe(false)
  })
})
