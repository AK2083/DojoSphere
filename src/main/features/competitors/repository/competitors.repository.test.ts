import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'

describe('competitors.repository', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await closeTestDatabase()
  })

  it('returns an empty list before competitors are added', async () => {
    await initTestDatabase()
    const { getCompetitors } = await import('./competitors.repository')

    expect(getCompetitors()).toEqual([])
  })

  it('persists and returns created competitors', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, getCompetitors } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'List Keeper', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })

    expect(competitor).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })
    expect(competitor.id).toEqual(expect.any(String))
    expect(getCompetitors()).toHaveLength(1)
  })

  it('stores optional fields with null defaults', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'List Keeper', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    expect(competitor).toMatchObject({
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: null,
      weightClass: null
    })
  })

  it('throws when creating a competitor with an empty given name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })

    expect(() =>
      addCompetitor(actorUserId, {
        givenName: '   ',
        familyName: 'Tanaka'
      })
    ).toThrow('Given name must not be empty')
  })

  it('throws when creating a competitor with an empty family name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })

    expect(() =>
      addCompetitor(actorUserId, {
        givenName: 'Yuki',
        familyName: '   '
      })
    ).toThrow('Family name must not be empty')
  })

  it('throws when the competitor row disappears after insert', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Insert Actor', userType: 'system' })
    const db = getDatabase()
    const originalPrepare = db.prepare.bind(db)

    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      const statement = originalPrepare(sql)

      if (!sql.includes('INSERT INTO competitors')) {
        return statement
      }

      return {
        run: (...args: unknown[]) => {
          const result = statement.run(...args)

          vi.spyOn(db, 'prepare').mockImplementation((innerSql: string) => {
            if (innerSql.includes('FROM competitors') && innerSql.includes('WHERE id = ?')) {
              return {
                get: () => undefined
              } as never
            }

            return originalPrepare(innerSql)
          })

          return result
        }
      } as never
    })

    expect(() =>
      addCompetitor(actorUserId, {
        givenName: 'Yuki',
        familyName: 'Tanaka'
      })
    ).toThrow('Competitor not found')
  })

  it('records a created audit row when adding a competitor', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Audit Actor', userType: 'system' })

    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'created'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
      newValueJson: string
    }

    expect(auditRow).toMatchObject({
      action: 'created',
      entityType: 'competitor',
      entityId: competitor.id,
      actorUserId,
      newValueJson: JSON.stringify({
        fields: ['given_name', 'family_name', 'club', 'weight_class']
      })
    })
    expect(auditRow.newValueJson).not.toContain('Yuki')
    expect(auditRow.newValueJson).not.toContain('Tanaka')
    expect(auditRow.newValueJson).not.toContain('Tokyo Dojo')
  })

  it('updates competitors and records changed field names only', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Update Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      club: 'Tokyo Dojo',
      weightClass: '-60'
    })

    const updated = updateCompetitor(actorUserId, competitor.id, {
      club: 'Osaka Dojo',
      weightClass: '-66'
    })

    expect(updated).toMatchObject({
      club: 'Osaka Dojo',
      weightClass: '-66',
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { action: string; newValueJson: string }

    expect(auditRow).toMatchObject({
      action: 'updated',
      newValueJson: JSON.stringify({ changed_fields: ['club', 'weight_class'] })
    })
    expect(auditRow.newValueJson).not.toContain('Osaka Dojo')
  })

  it('updates given and family names when provided explicitly', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Name Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    const updated = updateCompetitor(actorUserId, competitor.id, {
      givenName: '  Hana  ',
      familyName: '  Sato  '
    })

    expect(updated).toMatchObject({
      givenName: 'Hana',
      familyName: 'Sato'
    })

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT new_value_json AS newValueJson
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { newValueJson: string }

    expect(JSON.parse(auditRow.newValueJson)).toEqual({
      changed_fields: ['given_name', 'family_name']
    })
  })

  it('throws when updating an unknown competitor id', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { updateCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Missing Actor', userType: 'system' })

    expect(() =>
      updateCompetitor(actorUserId, 'missing-competitor-id', {
        club: 'Osaka Dojo'
      })
    ).toThrow('Competitor not found')
  })

  it('throws when updating with an empty given name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    expect(() =>
      updateCompetitor(actorUserId, competitor.id, {
        givenName: '   '
      })
    ).toThrow('Given name must not be empty')
  })

  it('throws when updating with an empty family name', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    expect(() =>
      updateCompetitor(actorUserId, competitor.id, {
        familyName: '   '
      })
    ).toThrow('Family name must not be empty')
  })

  it('throws when the competitor row disappears after update', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Update Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })
    const db = getDatabase()
    const originalPrepare = db.prepare.bind(db)

    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      const statement = originalPrepare(sql)

      if (!sql.includes('UPDATE competitors')) {
        return statement
      }

      return {
        run: (...args: unknown[]) => {
          const result = statement.run(...args)

          vi.spyOn(db, 'prepare').mockImplementation((innerSql: string) => {
            if (innerSql.includes('FROM competitors') && innerSql.includes('WHERE id = ?')) {
              return {
                get: () => undefined
              } as never
            }

            return originalPrepare(innerSql)
          })

          return result
        }
      } as never
    })

    expect(() =>
      updateCompetitor(actorUserId, competitor.id, {
        club: 'Osaka Dojo'
      })
    ).toThrow('Competitor not found')
  })

  it('skips update audit when no fields change', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, updateCompetitor } = await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'No-op Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    updateCompetitor(actorUserId, competitor.id, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    const auditCount = getDatabase()
      .prepare(
        `
        SELECT COUNT(*) AS count
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'updated'
      `
      )
      .get() as { count: number }

    expect(auditCount.count).toBe(0)
  })

  it('throws when deleting an unknown competitor id', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { deleteCompetitor } = await import('./competitors.repository')

    const { id: actorUserId } = addUser({ displayName: 'Delete Actor', userType: 'system' })

    expect(() => deleteCompetitor(actorUserId, 'missing-competitor-id')).toThrow(
      'Competitor not found'
    )
  })

  it('deletes competitors and records a deleted audit row', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor, deleteCompetitor, getCompetitors } =
      await import('./competitors.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Delete Actor', userType: 'system' })
    const competitor = addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka'
    })

    deleteCompetitor(actorUserId, competitor.id)

    expect(getCompetitors()).toEqual([])

    const auditRow = getDatabase()
      .prepare(
        `
        SELECT action, entity_type AS entityType, entity_id AS entityId, actor_user_id AS actorUserId
        FROM authorization_audit_logs
        WHERE entity_type = 'competitor' AND action = 'deleted'
      `
      )
      .get() as {
      action: string
      entityType: string
      entityId: string
      actorUserId: string
    }

    expect(auditRow).toMatchObject({
      action: 'deleted',
      entityType: 'competitor',
      entityId: competitor.id,
      actorUserId
    })
  })
})
