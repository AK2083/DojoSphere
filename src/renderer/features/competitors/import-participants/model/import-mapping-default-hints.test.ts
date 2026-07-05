import { describe, expect, it, vi } from 'vitest'

import saveParticipantTranslationKeys from '../../save-participant/i18n/keys'
import { importDefaultValueLabel } from './import-mapping-default-hints'

const t = (key: string): string => key

vi.mock('@shared/domain/competitor-import-fields', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/domain/competitor-import-fields')>()

  return {
    ...actual,
    usesImportDefaultWhenUnmapped: vi.fn(actual.usesImportDefaultWhenUnmapped)
  }
})

import { usesImportDefaultWhenUnmapped } from '@shared/domain/competitor-import-fields'

describe('importDefaultValueLabel', () => {
  it('returns the Germany reference label for nationality', () => {
    expect(importDefaultValueLabel('nationality', t)).toBe(
      saveParticipantTranslationKeys.reference.nationalities.DE
    )
  })

  it('does not return the unknown-club label for nationality', () => {
    expect(importDefaultValueLabel('nationality', t)).not.toBe(
      saveParticipantTranslationKeys.reference.clubs.unknown
    )
  })

  it('returns the female label for gender', () => {
    expect(importDefaultValueLabel('gender', t)).toBe(saveParticipantTranslationKeys.gender.female)
  })

  it('returns null for fields without an unmapped default', () => {
    expect(importDefaultValueLabel('givenName', t)).toBeNull()
    expect(importDefaultValueLabel('contactPerson', t)).toBeNull()
  })

  it('returns localized labels for other unmapped defaults', () => {
    expect(importDefaultValueLabel('birthDate', t)).toBe(
      'competitors.importParticipants.steps.mapping.defaultValues.birthDate'
    )
    expect(importDefaultValueLabel('passNumber', t)).toBe(
      'competitors.importParticipants.steps.mapping.defaultValues.passNumber'
    )
    expect(importDefaultValueLabel('club', t)).toBe(
      saveParticipantTranslationKeys.reference.clubs.unknown
    )
  })

  it('returns null for unexpected default keys', () => {
    vi.mocked(usesImportDefaultWhenUnmapped).mockReturnValue(true)

    expect(importDefaultValueLabel('contactPerson', t)).toBeNull()
  })
})
