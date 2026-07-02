import type { Competitor } from '@shared/types/electron-api'
import { describe, expect, it } from 'vitest'

import { mapCompetitorToRow } from './map-competitor-to-row'

const t = (key: string) => key

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

describe('mapCompetitorToRow', () => {
  it('maps competitor fields and resolves reference labels', () => {
    const row = mapCompetitorToRow(createCompetitor(), t)

    expect(row).toMatchObject({
      id: 'competitor-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      givenName: 'Yuki',
      familyName: 'Tanaka',
      gender: 'm',
      club: 'Dojo Nord',
      weightClass: '-60',
      passNumber: 'JP-000142',
      clubContactEmail: ''
    })
    expect(row.ageClass).toContain('competitors.saveParticipant.reference.')
    expect(row.grade).toContain('competitors.saveParticipant.reference.')
  })

  it('falls back to empty strings for null optional fields', () => {
    const row = mapCompetitorToRow(
      createCompetitor({
        club: null,
        weightClass: null,
        licenseNumber: null,
        contactPhone: null,
        coach: null,
        gradeId: null
      }),
      t
    )

    expect(row.club).toBe('')
    expect(row.weightClass).toBe('')
    expect(row.licenseNumber).toBe('')
    expect(row.contactPhone).toBe('')
    expect(row.coach).toBe('')
    expect(row.grade).toBe('competitors.getParticipantOverview.emptyGrade')
  })

  it('returns empty age class label for unknown age class id', () => {
    const row = mapCompetitorToRow(createCompetitor({ ageClassId: 'unknown-age-class' }), t)

    expect(row.ageClass).toBe('')
  })

  it('returns empty grade label for unknown grade id', () => {
    const row = mapCompetitorToRow(createCompetitor({ gradeId: 'unknown-grade' }), t)

    expect(row.grade).toBe('competitors.getParticipantOverview.emptyGrade')
  })
})
