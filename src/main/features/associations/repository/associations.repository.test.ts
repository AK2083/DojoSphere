import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'
import { UNKNOWN_ASSOCIATION_ID } from '../../../shared/database/reference-seed-ids'

function validAssociationInput(
  overrides: Partial<{
    name: string
    shortName: string | null
    city: string | null
    website: string | null
    isActive: boolean
    associationNumber: string
    email: string
  }> = {}
) {
  const associationNumber = overrides.associationNumber ?? 'VR 20123 P'
  const email = overrides.email ?? 'info@example.com'

  return {
    name: overrides.name ?? 'Judoclub Nord e.V.',
    shortName: overrides.shortName ?? 'JC Nord',
    city: overrides.city ?? 'Hamburg',
    website: overrides.website ?? 'https://www.jcnord.example',
    isActive: overrides.isActive ?? true,
    identifiers: [
      {
        type: 'vereinsregister_number',
        value: associationNumber,
        authority: null
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
        value: email,
        isPublic: true
      },
      {
        contactType: 'phone',
        value: '+4940123456',
        isPublic: false
      }
    ]
  }
}

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

    const association = addAssociation(actorUserId, validAssociationInput())

    expect(association).toMatchObject({
      name: 'Judoclub Nord e.V.',
      shortName: 'JC Nord',
      city: 'Hamburg',
      districtName: 'Placeholder District',
      countryName: 'Germany',
      federationShortName: 'DJB',
      source: 'manual',
      isActive: true
    })
    expect(association.identifiers).toEqual([
      {
        type: 'vereinsregister_number',
        value: 'VR 20123 P',
        authority: null
      }
    ])
    expect(association.addresses).toHaveLength(1)
    expect(association.contacts).toEqual([
      {
        contactType: 'email',
        value: 'info@example.com',
        label: null,
        isPublic: true
      },
      {
        contactType: 'phone',
        value: '+4940123456',
        label: null,
        isPublic: false
      }
    ])
    expect(getAssociations()).toHaveLength(1)
    expect(getAssociation(association.id)?.name).toBe('Judoclub Nord e.V.')
  })

  it('updates association fields and replaces child collections', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Update Actor', userType: 'system' })
    const created = addAssociation(actorUserId, validAssociationInput())

    const updated = updateAssociation(actorUserId, created.id, {
      name: 'Judoclub Nord Updated',
      isActive: false,
      identifiers: [
        {
          type: 'vereinsregister_number',
          value: 'VR 20999 P',
          authority: null
        }
      ],
      addresses: [
        {
          street: 'Neue Straße',
          houseNumber: '1',
          postalCode: '10115',
          city: 'Berlin',
          addressType: 'primary'
        }
      ],
      contacts: [{ contactType: 'email', value: 'neu@example.com', isPublic: true }]
    })

    expect(updated).toMatchObject({
      name: 'Judoclub Nord Updated',
      isActive: false,
      contacts: [
        {
          contactType: 'email',
          value: 'neu@example.com',
          label: null,
          isPublic: true
        }
      ]
    })
    expect(updated.addresses[0]).toMatchObject({
      street: 'Neue Straße',
      city: 'Berlin',
      addressType: 'primary'
    })
  })

  it('returns the existing record when an update has no changes', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Noop Actor', userType: 'system' })
    const created = addAssociation(actorUserId, validAssociationInput())

    const updated = updateAssociation(actorUserId, created.id, {})

    expect(updated).toEqual(created)
  })

  it('deletes an association that is not referenced by competitors', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, deleteAssociation, getAssociation } =
      await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Delete Actor', userType: 'system' })
    const created = addAssociation(
      actorUserId,
      validAssociationInput({ associationNumber: 'VR 30001 P' })
    )

    deleteAssociation(actorUserId, created.id)

    expect(getAssociation(created.id)).toBeNull()
  })

  it('rejects deleting associations that are still referenced by competitors', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addCompetitor } = await import('@main/features/competitors')
    const { addAssociation, deleteAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Linked Actor', userType: 'system' })
    const association = addAssociation(
      actorUserId,
      validAssociationInput({ associationNumber: 'VR 40001 P' })
    )

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
    const created = addAssociation(
      actorUserId,
      validAssociationInput({ isActive: false, associationNumber: 'VR 50001 P' })
    )

    expect(created.isActive).toBe(false)

    const updated = updateAssociation(actorUserId, created.id, {
      shortName: 'JC Nord',
      city: 'Kiel',
      website: 'https://www.jcnord.example'
    })

    expect(updated).toMatchObject({
      shortName: 'JC Nord',
      city: 'Kiel',
      website: 'https://www.jcnord.example',
      isActive: false
    })
  })

  it('clears optional text fields and reactivates an association on update', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation, updateAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Optional Actor', userType: 'system' })
    const created = addAssociation(
      actorUserId,
      validAssociationInput({ isActive: false, associationNumber: 'VR 60001 P' })
    )

    const updated = updateAssociation(actorUserId, created.id, {
      shortName: '   ',
      website: null,
      isActive: true
    })

    expect(updated).toMatchObject({
      shortName: null,
      website: null,
      isActive: true
    })
  })

  it('rejects missing association number, headquarters, or email', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Required Actor', userType: 'system' })

    expect(() =>
      addAssociation(actorUserId, {
        name: 'Judoclub Nord e.V.',
        addresses: validAssociationInput().addresses,
        contacts: validAssociationInput().contacts
      })
    ).toThrow('Association number must not be empty')

    expect(() =>
      addAssociation(actorUserId, {
        name: 'Judoclub Nord e.V.',
        identifiers: validAssociationInput().identifiers,
        contacts: validAssociationInput().contacts
      })
    ).toThrow('Headquarters address must not be empty')

    expect(() =>
      addAssociation(actorUserId, {
        name: 'Judoclub Nord e.V.',
        identifiers: validAssociationInput().identifiers,
        addresses: validAssociationInput().addresses
      })
    ).toThrow('Email must not be empty')

    expect(() =>
      addAssociation(actorUserId, {
        name: 'Judoclub Nord e.V.',
        identifiers: validAssociationInput().identifiers,
        addresses: validAssociationInput().addresses,
        contacts: [{ contactType: 'email', value: 'not-an-email' }]
      })
    ).toThrow('Email is invalid')
  })

  it('rejects blank identifier and contact values', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const { addAssociation } = await import('./associations.repository')

    const { id: actorUserId } = addUser({ displayName: 'Child Actor', userType: 'system' })

    expect(() =>
      addAssociation(actorUserId, {
        ...validAssociationInput({ associationNumber: 'VR 70001 P' }),
        identifiers: [
          { type: 'vereinsregister_number', value: 'VR 70001 P', authority: null },
          { type: '  ', value: 'extra' }
        ]
      })
    ).toThrow('Identifier type must not be empty')
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
      repository.addAssociation(
        actorUserId,
        validAssociationInput({ associationNumber: 'VR 80001 P' })
      )
    ).toThrow('Association not found')
  })

  it('throws when the association disappears after update', async () => {
    await initTestDatabase()
    const { addUser } = await import('@main/features/users')
    const repository = await import('./associations.repository')
    const { getDatabase } = await import('@main/shared/database')

    const { id: actorUserId } = addUser({ displayName: 'Update Race Actor', userType: 'system' })
    const created = repository.addAssociation(
      actorUserId,
      validAssociationInput({ associationNumber: 'VR 90001 P' })
    )

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
        ...validAssociationInput({ associationNumber: 'VR 100001 P' }),
        name: '   '
      })
    ).toThrow('Association name must not be empty')
  })
})
