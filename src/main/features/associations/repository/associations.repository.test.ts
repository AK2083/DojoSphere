import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'
import { UNKNOWN_ASSOCIATION_ID } from '../../../shared/database/reference-seed-ids'

describe('associations.repository', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await closeTestDatabase()
  })

  it('returns an empty list before associations are added', async () => {
    await initTestDatabase()
    const { getAssociations } = await import('./associations.repository')

    expect(getAssociations()).toEqual([])
  })

  it('persists and returns created associations with child rows', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, getAssociations, getAssociation } =
      await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Association Keeper', userType: 'system' })

    const association = addAssociation(actorUserId, {
      name: 'Judoclub Nord e.V.',
      shortName: 'JC Nord',
      city: 'Hamburg',
      website: 'https://www.jcnord.example',
      districtName: 'Bezirk Hamburg',
      districtShortName: 'HH',
      identifiers: [
        {
          type: 'djb_association_number',
          value: '020123',
          authority: 'DJB'
        }
      ],
      addresses: [
        {
          street: 'Dojostraße',
          houseNumber: '12',
          postalCode: '20095',
          city: 'Hamburg',
          countryCode: 'DE',
          addressType: 'primary'
        }
      ],
      contacts: [
        {
          contactType: 'email',
          value: 'info@jcnord.example',
          isPublic: true
        }
      ]
    })

    expect(association).toMatchObject({
      name: 'Judoclub Nord e.V.',
      shortName: 'JC Nord',
      city: 'Hamburg',
      districtName: 'Bezirk Hamburg',
      districtShortName: 'HH',
      countryName: 'Germany',
      federationShortName: 'DJB',
      source: 'manual',
      isActive: true
    })
    expect(association.identifiers).toEqual([
      {
        type: 'djb_association_number',
        value: '020123',
        authority: 'DJB'
      }
    ])
    expect(association.addresses).toHaveLength(1)
    expect(association.contacts).toEqual([
      {
        contactType: 'email',
        value: 'info@jcnord.example',
        label: null,
        isPublic: true
      }
    ])
    expect(getAssociations()).toHaveLength(1)
    expect(getAssociation(association.id)?.name).toBe('Judoclub Nord e.V.')
  })

  it('reuses an existing district by name within the placeholder regional federation', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation } = await import('./associations.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'District Actor', userType: 'system' })

    addAssociation(actorUserId, {
      name: 'First Association',
      districtName: 'Bezirk Hamburg',
      districtShortName: 'HH'
    })
    addAssociation(actorUserId, {
      name: 'Second Association',
      districtName: 'Bezirk Hamburg',
      districtShortName: 'HH2'
    })

    const districts = getDatabase()
      .prepare(`SELECT name, short_name AS shortName FROM districts WHERE name = ?`)
      .all('Bezirk Hamburg') as Array<{ name: string; shortName: string | null }>

    expect(districts).toEqual([{ name: 'Bezirk Hamburg', shortName: 'HH2' }])
  })

  it('updates association fields and replaces child collections', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Update Actor', userType: 'system' })
    const created = addAssociation(actorUserId, {
      name: 'Judoclub Nord e.V.',
      districtName: 'Bezirk Hamburg',
      contacts: [{ contactType: 'email', value: 'old@example.com' }]
    })

    const updated = updateAssociation(actorUserId, created.id, {
      name: 'Judoclub Nord Updated',
      isActive: false,
      districtName: 'Bezirk Berlin',
      contacts: [{ contactType: 'phone', value: '+49 30 111', isPublic: false }],
      identifiers: [],
      addresses: []
    })

    expect(updated).toMatchObject({
      name: 'Judoclub Nord Updated',
      isActive: false,
      districtName: 'Bezirk Berlin',
      contacts: [
        {
          contactType: 'phone',
          value: '+49 30 111',
          label: null,
          isPublic: false
        }
      ],
      identifiers: [],
      addresses: []
    })
  })

  it('returns the existing record when an update has no changes', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Noop Actor', userType: 'system' })
    const created = addAssociation(actorUserId, {
      name: 'Judoclub Nord e.V.',
      districtName: 'Bezirk Hamburg'
    })

    const updated = updateAssociation(actorUserId, created.id, {})

    expect(updated).toEqual(created)
  })

  it('deletes an association that is not referenced by competitors', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, deleteAssociation, getAssociation } =
      await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Delete Actor', userType: 'system' })
    const created = addAssociation(actorUserId, {
      name: 'Temporary Association',
      districtName: 'Bezirk Hamburg'
    })

    deleteAssociation(actorUserId, created.id)

    expect(getAssociation(created.id)).toBeNull()
  })

  it('rejects deleting associations that are still referenced by competitors', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('@main/features/competitors')
    const { addAssociation, deleteAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Linked Actor', userType: 'system' })
    const association = addAssociation(actorUserId, {
      name: 'Linked Association',
      districtName: 'Bezirk Hamburg'
    })

    addCompetitor(actorUserId, {
      givenName: 'Yuki',
      familyName: 'Tanaka',
      associationId: association.id
    })

    expect(() => deleteAssociation(actorUserId, association.id)).toThrow(
      'Association is referenced by competitors'
    )
  })

  it('rejects mutating the seeded Unknown association', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { deleteAssociation, getAssociation, updateAssociation } =
      await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Seed Actor', userType: 'system' })
    const unknown = getAssociation(UNKNOWN_ASSOCIATION_ID)

    expect(unknown?.name).toBe('Unknown')
    expect(() =>
      updateAssociation(actorUserId, UNKNOWN_ASSOCIATION_ID, { name: 'Changed' })
    ).toThrow('Seed association cannot be modified')
    expect(() => deleteAssociation(actorUserId, UNKNOWN_ASSOCIATION_ID)).toThrow(
      'Seed association cannot be modified'
    )
  })

  it('throws when updating or deleting a missing association', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { deleteAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Missing Actor', userType: 'system' })

    expect(() => updateAssociation(actorUserId, 'missing-id', { name: 'Nope' })).toThrow(
      'Association not found'
    )
    expect(() => deleteAssociation(actorUserId, 'missing-id')).toThrow('Association not found')
  })

  it('updates short name, city, and website independently', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Field Actor', userType: 'system' })
    const created = addAssociation(actorUserId, {
      name: 'Judoclub Nord e.V.',
      districtName: 'Bezirk Hamburg',
      isActive: false
    })

    expect(created.isActive).toBe(false)

    const updated = updateAssociation(actorUserId, created.id, {
      shortName: 'JC Nord',
      city: 'Hamburg',
      website: 'https://www.jcnord.example',
      districtShortName: 'HH'
    })

    expect(updated).toMatchObject({
      shortName: 'JC Nord',
      city: 'Hamburg',
      website: 'https://www.jcnord.example',
      districtShortName: 'HH',
      isActive: false
    })
  })

  it('clears optional text fields and reactivates an association on update', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Optional Actor', userType: 'system' })
    const created = addAssociation(actorUserId, {
      name: 'Judoclub Nord e.V.',
      shortName: 'JC Nord',
      districtName: 'Bezirk Hamburg',
      isActive: false
    })

    const updated = updateAssociation(actorUserId, created.id, {
      shortName: '   ',
      city: null,
      website: null,
      isActive: true
    })

    expect(updated).toMatchObject({
      shortName: null,
      city: null,
      website: null,
      isActive: true
    })
  })

  it('rejects blank identifier and contact values', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Child Actor', userType: 'system' })

    expect(() =>
      addAssociation(actorUserId, {
        name: 'Judoclub Nord e.V.',
        districtName: 'Bezirk Hamburg',
        identifiers: [{ type: '  ', value: '020123' }]
      })
    ).toThrow('Identifier type must not be empty')

    expect(() =>
      addAssociation(actorUserId, {
        name: 'Judoclub Nord e.V.',
        districtName: 'Bezirk Hamburg',
        contacts: [{ contactType: 'email', value: '  ' }]
      })
    ).toThrow('Contact value must not be empty')
  })

  it('reuses a district without overwriting short name when omitted', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation } = await import('./associations.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Reuse Actor', userType: 'system' })

    addAssociation(actorUserId, {
      name: 'First Association',
      districtName: 'Bezirk Hamburg',
      districtShortName: 'HH'
    })
    addAssociation(actorUserId, {
      name: 'Second Association',
      districtName: 'Bezirk Hamburg'
    })

    const district = getDatabase()
      .prepare(`SELECT short_name AS shortName FROM districts WHERE name = ?`)
      .get('Bezirk Hamburg') as { shortName: string | null }

    expect(district.shortName).toBe('HH')
  })

  it('throws when the association disappears after create', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('./associations.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Race Actor', userType: 'system' })
    const originalPrepare = getDatabase().prepare.bind(getDatabase())

    vi.spyOn(getDatabase(), 'prepare').mockImplementation((sql: string) => {
      if (typeof sql === 'string' && sql.includes('WHERE a.id = ?')) {
        return {
          get: () => undefined,
          all: () => [],
          run: () => ({ changes: 0 })
        } as never
      }

      return originalPrepare(sql)
    })

    expect(() =>
      repository.addAssociation(actorUserId, {
        name: 'Ghost Association',
        districtName: 'Bezirk Hamburg'
      })
    ).toThrow('Association not found')
  })

  it('throws when the association disappears after update', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('./associations.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Update Race Actor', userType: 'system' })
    const created = repository.addAssociation(actorUserId, {
      name: 'Temporary Association',
      districtName: 'Bezirk Hamburg'
    })

    const db = getDatabase()
    const realPrepare = db.prepare.bind(db)
    let selectCount = 0

    vi.spyOn(db, 'prepare').mockImplementation((sql: string) => {
      if (typeof sql === 'string' && sql.includes('WHERE a.id = ?')) {
        selectCount += 1

        if (selectCount === 1) {
          return realPrepare(sql)
        }

        return {
          get: () => undefined,
          all: () => [],
          run: () => ({ changes: 0 })
        } as never
      }

      return realPrepare(sql)
    })

    expect(() =>
      repository.updateAssociation(actorUserId, created.id, {
        name: 'Renamed Association'
      })
    ).toThrow('Association not found')
  })

  it('rejects blank required names', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Validation Actor', userType: 'system' })

    expect(() =>
      addAssociation(actorUserId, {
        name: '   ',
        districtName: 'Bezirk Hamburg'
      })
    ).toThrow('Association name must not be empty')

    expect(() =>
      addAssociation(actorUserId, {
        name: 'Valid Name',
        districtName: '   '
      })
    ).toThrow('District name must not be empty')
  })
})
