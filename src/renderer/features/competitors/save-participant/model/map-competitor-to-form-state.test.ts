import type { Competitor } from '@shared/types/electron-api'
import { describe, expect, it } from 'vitest'

import { DE_DJB_SYSTEM_ID } from './grade-reference-data'
import { mapCompetitorToFormState } from './map-competitor-to-form-state'

function createCompetitor(overrides: Partial<Competitor> = {}): Competitor {
  return {
    id: 'competitor-1',
    givenName: 'Yuki',
    familyName: 'Tanaka',
    gender: 'm',
    birthDate: '2011-04-12',
    nationality: 'DE',
    passNumber: 'JP-000142',
    club: 'Dojo Nord',
    weightClass: '-60',
    licenseNumber: 'WL-2024-001',
    contactPhone: '+49 555 010201',
    coach: 'S. Fischer',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000008',
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    gradeId: 'a1000000-0000-4000-8000-000000000001',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: null,
    ...overrides
  }
}

describe('mapCompetitorToFormState', () => {
  it('maps competitor fields to form state', () => {
    expect(mapCompetitorToFormState(createCompetitor())).toEqual({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      gender: 'm',
      birthDate: '2011-04-12',
      clubId: '00000000-0000-0000-0000-000000000000',
      nationality: 'DE',
      ageClassId: 'c2000000-0000-4000-8000-000000000003',
      weightClassId: 'b3000000-0000-4000-8000-000000000008',
      passNumber: 'JP-000142',
      gradingSystemId: DE_DJB_SYSTEM_ID,
      gradeId: 'a1000000-0000-4000-8000-000000000001',
      licenseNumber: 'WL-2024-001',
      contactPhone: '+49 555 010201',
      coach: 'S. Fischer'
    })
  })

  it('maps nullable optional fields to empty strings', () => {
    expect(
      mapCompetitorToFormState(
        createCompetitor({
          gradeId: null,
          licenseNumber: null,
          contactPhone: null,
          coach: null
        })
      )
    ).toMatchObject({
      gradeId: '',
      licenseNumber: '',
      contactPhone: '',
      coach: ''
    })
  })
})
