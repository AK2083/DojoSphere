import { afterEach, describe, expect, it } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

import {
  assertNoDuplicateCompetitor,
  buildCompetitorDuplicateKeys,
  DUPLICATE_COMPETITOR_ERROR,
  findDuplicateCompetitorId,
  serializeCompetitorDuplicateKey
} from './competitor-duplicate'

describe('competitor-duplicate', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('builds pass-number keys for real pass numbers', () => {
    expect(
      buildCompetitorDuplicateKeys({ givenName: 'Yuki', familyName: 'Tanaka', passNumber: 'JP-1' })
    ).toEqual([{ kind: 'pass_number', value: 'JP-1' }])
  })

  it('builds license and identity fallback keys when no pass number is provided', () => {
    expect(
      buildCompetitorDuplicateKeys({
        givenName: 'Yuki',
        familyName: 'Tanaka',
        birthDate: '2012-01-01',
        licenseNumber: 'WL-1'
      })
    ).toEqual([{ kind: 'license_number', value: 'WL-1' }])

    expect(
      buildCompetitorDuplicateKeys({
        givenName: 'Yuki',
        familyName: 'Tanaka',
        birthDate: '2012-01-01'
      })
    ).toEqual([
      {
        kind: 'identity',
        givenName: 'Yuki',
        familyName: 'Tanaka',
        birthDate: '2012-01-01'
      }
    ])
  })

  it('serializes duplicate keys for import batch tracking', () => {
    const [passKey] = buildCompetitorDuplicateKeys({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      birthDate: '2012-01-01',
      passNumber: 'JP-1'
    })

    expect(serializeCompetitorDuplicateKey(passKey!)).toBe('pass:JP-1')
    expect(serializeCompetitorDuplicateKey({ kind: 'license_number', value: 'WL-1' })).toBe(
      'license:WL-1'
    )
    expect(
      serializeCompetitorDuplicateKey({
        kind: 'identity',
        givenName: 'Yuki',
        familyName: 'Tanaka',
        birthDate: '2012-01-01'
      })
    ).toBe('identity:yuki:tanaka:2012-01-01')
  })

  it('ignores the excluded competitor id during duplicate lookup', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Exclude Actor', userType: 'system' })
    const db = getDatabase()
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      passNumber: 'JP-1'
    })

    expect(
      findDuplicateCompetitorId(
        db,
        {
          givenName: 'Yuki',
          familyName: 'Tanaka',
          passNumber: 'JP-1'
        },
        competitor.id
      )
    ).toBeNull()
  })

  it('detects duplicates by pass number, license number, and identity fallback', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Duplicate Actor', userType: 'system' })
    const db = getDatabase()

    addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      passNumber: 'JP-1'
    })

    expect(
      findDuplicateCompetitorId(db, {
        givenName: 'Other',
        familyName: 'Person',
        passNumber: 'JP-1'
      })
    ).not.toBeNull()

    addCompetitor(actorUserId, {
      givenName: 'Lina',
      familyName: 'Bauer',
      licenseNumber: 'WL-9'
    })

    expect(
      findDuplicateCompetitorId(db, {
        givenName: 'Different',
        familyName: 'Name',
        licenseNumber: 'WL-9'
      })
    ).not.toBeNull()

    addCompetitor(actorUserId, {
      givenName: 'Mia',
      familyName: 'Schmidt',
      birthDate: '2011-05-05'
    })

    expect(
      findDuplicateCompetitorId(db, {
        givenName: 'Mia',
        familyName: 'Schmidt',
        birthDate: '2011-05-05'
      })
    ).not.toBeNull()

    expect(() =>
      assertNoDuplicateCompetitor(db, {
        givenName: 'Mia',
        familyName: 'Schmidt',
        birthDate: '2011-05-05'
      })
    ).toThrow(DUPLICATE_COMPETITOR_ERROR)
  })
})
