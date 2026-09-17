import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../../../test/database'
import type { AssociationSyncPayload } from './sync-associations.service'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a self-contained sync payload whose hierarchy rows satisfy all FKs. */
function makePayload(overrides: Partial<AssociationSyncPayload> = {}): AssociationSyncPayload {
  return {
    countries: [
      {
        id: 'ee000000-0000-4000-8000-000000000001',
        name: 'Test Country',
        isoCode: 'TX',
        updatedAt: null
      }
    ],
    federations: [
      {
        id: 'ee000000-0000-4000-8000-000000000002',
        countryId: 'ee000000-0000-4000-8000-000000000001',
        name: 'Test Federation',
        shortName: 'TF',
        website: null,
        updatedAt: null
      }
    ],
    regionalFederations: [
      {
        id: 'ee000000-0000-4000-8000-000000000003',
        federationId: 'ee000000-0000-4000-8000-000000000002',
        name: 'Test Regional Federation',
        shortName: 'TRF',
        website: null,
        updatedAt: null
      }
    ],
    districts: [
      {
        id: 'ee000000-0000-4000-8000-000000000004',
        regionalFederationId: 'ee000000-0000-4000-8000-000000000003',
        name: 'Test District',
        shortName: 'TD',
        sortOrder: 1,
        updatedAt: null
      }
    ],
    associations: [],
    ...overrides
  }
}

/** Builds a WebContents sender mock. */
function makeSender() {
  return { send: vi.fn() }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('sync-associations.service', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await closeTestDatabase()
  })

  // -------------------------------------------------------------------------
  // getSyncTimestamps
  // -------------------------------------------------------------------------

  describe('getSyncTimestamps', () => {
    it('returns null for all tables on a fresh database', async () => {
      await initTestDatabase()
      const { getSyncTimestamps } = await import('./sync-associations.service')

      const timestamps = getSyncTimestamps()

      expect(timestamps).toEqual({
        countries: null,
        federations: null,
        regionalFederations: null,
        districts: null,
        associations: null
      })
    })

    it('returns the max synced_at after a batch has been applied', async () => {
      await initTestDatabase()
      const { getSyncTimestamps, applySyncBatch } = await import('./sync-associations.service')
      const sender = makeSender()

      applySyncBatch(makePayload(), sender as never)

      const timestamps = getSyncTimestamps()

      expect(typeof timestamps.countries).toBe('string')
      expect(timestamps.countries).not.toBeNull()
      expect(typeof timestamps.federations).toBe('string')
      expect(typeof timestamps.regionalFederations).toBe('string')
      expect(typeof timestamps.districts).toBe('string')
      // No associations in payload, so that stays null
      expect(timestamps.associations).toBeNull()
    })

    it('returns synced_at for associations after they are synced', async () => {
      await initTestDatabase()
      const { getSyncTimestamps, applySyncBatch } = await import('./sync-associations.service')
      const sender = makeSender()

      const payload = makePayload({
        associations: [
          {
            id: 'aa000000-0000-4000-8000-000000000001',
            districtId: 'ee000000-0000-4000-8000-000000000004',
            name: 'Synced Club',
            shortName: null,
            city: null,
            website: null,
            isActive: true,
            source: null,
            updatedAt: null,
            identifiers: [],
            addresses: [],
            contacts: []
          }
        ]
      })

      applySyncBatch(payload, sender as never)

      const timestamps = getSyncTimestamps()
      expect(typeof timestamps.associations).toBe('string')
    })
  })

  // -------------------------------------------------------------------------
  // applySyncBatch – hierarchy upsert
  // -------------------------------------------------------------------------

  describe('applySyncBatch – hierarchy', () => {
    it('upserts countries, federations, regional_federations and districts', async () => {
      const db = await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')

      applySyncBatch(makePayload(), makeSender() as never)

      const country = db
        .prepare('SELECT name, iso_code FROM countries WHERE id = ?')
        .get('ee000000-0000-4000-8000-000000000001') as
        { name: string; iso_code: string } | undefined

      expect(country?.name).toBe('Test Country')
      expect(country?.iso_code).toBe('TX')

      const federation = db
        .prepare('SELECT name FROM federations WHERE id = ?')
        .get('ee000000-0000-4000-8000-000000000002') as { name: string } | undefined

      expect(federation?.name).toBe('Test Federation')

      const rf = db
        .prepare('SELECT name FROM regional_federations WHERE id = ?')
        .get('ee000000-0000-4000-8000-000000000003') as { name: string } | undefined

      expect(rf?.name).toBe('Test Regional Federation')

      const district = db
        .prepare('SELECT name FROM districts WHERE id = ?')
        .get('ee000000-0000-4000-8000-000000000004') as { name: string } | undefined

      expect(district?.name).toBe('Test District')
    })

    it('updates existing hierarchy rows on re-sync', async () => {
      const db = await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')

      // First sync
      applySyncBatch(makePayload(), makeSender() as never)

      // Second sync with updated name
      applySyncBatch(
        {
          ...makePayload(),
          countries: [
            {
              id: 'ee000000-0000-4000-8000-000000000001',
              name: 'Test Country Updated',
              isoCode: 'TX',
              updatedAt: null
            }
          ]
        },
        makeSender() as never
      )

      const country = db
        .prepare('SELECT name FROM countries WHERE id = ?')
        .get('ee000000-0000-4000-8000-000000000001') as { name: string } | undefined

      expect(country?.name).toBe('Test Country Updated')
    })

    it('sets synced_at on hierarchy rows', async () => {
      const db = await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')
      const before = new Date().toISOString()

      applySyncBatch(makePayload(), makeSender() as never)

      const after = new Date().toISOString()

      const row = db
        .prepare('SELECT synced_at FROM countries WHERE id = ?')
        .get('ee000000-0000-4000-8000-000000000001') as { synced_at: string } | undefined

      expect(row?.synced_at).toBeDefined()
      expect(row!.synced_at >= before).toBe(true)
      expect(row!.synced_at <= after).toBe(true)
    })

    it('does not emit any progress events when there are no associations', async () => {
      await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')
      const sender = makeSender()

      applySyncBatch(makePayload(), sender as never)

      expect(sender.send).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // applySyncBatch – associations
  // -------------------------------------------------------------------------

  describe('applySyncBatch – associations', () => {
    it('upserts an association with identifiers, addresses and contacts', async () => {
      const db = await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')

      const payload = makePayload({
        associations: [
          {
            id: 'aa000000-0000-4000-8000-000000000010',
            districtId: 'ee000000-0000-4000-8000-000000000004',
            name: 'Test Club',
            shortName: 'TC',
            city: 'Berlin',
            website: 'https://example.com',
            isActive: true,
            source: 'cloud',
            updatedAt: null,
            identifiers: [
              {
                id: 'ii000000-0000-4000-8000-000000000001',
                type: 'vereinsregister_number',
                value: 'VR 12345',
                authority: null
              }
            ],
            addresses: [
              {
                id: 'ad000000-0000-4000-8000-000000000001',
                street: 'Teststr.',
                houseNumber: '1',
                postalCode: '10115',
                city: 'Berlin',
                countryCode: 'DE',
                addressType: 'primary'
              }
            ],
            contacts: [
              {
                id: 'co000000-0000-4000-8000-000000000001',
                contactType: 'email',
                value: 'info@test.example',
                label: null,
                isPublic: true
              }
            ]
          }
        ]
      })

      applySyncBatch(payload, makeSender() as never)

      const assoc = db
        .prepare('SELECT name, city, is_active FROM associations WHERE id = ?')
        .get('aa000000-0000-4000-8000-000000000010') as
        | {
            name: string
            city: string
            is_active: number
          }
        | undefined

      expect(assoc?.name).toBe('Test Club')
      expect(assoc?.city).toBe('Berlin')
      expect(assoc?.is_active).toBe(1)

      const identifiers = db
        .prepare('SELECT value FROM association_identifiers WHERE association_id = ?')
        .all('aa000000-0000-4000-8000-000000000010') as { value: string }[]

      expect(identifiers).toHaveLength(1)
      expect(identifiers[0]?.value).toBe('VR 12345')

      const addresses = db
        .prepare('SELECT street FROM association_addresses WHERE association_id = ?')
        .all('aa000000-0000-4000-8000-000000000010') as { street: string }[]

      expect(addresses).toHaveLength(1)
      expect(addresses[0]?.street).toBe('Teststr.')

      const contacts = db
        .prepare('SELECT value FROM association_contacts WHERE association_id = ?')
        .all('aa000000-0000-4000-8000-000000000010') as { value: string }[]

      expect(contacts).toHaveLength(1)
      expect(contacts[0]?.value).toBe('info@test.example')
    })

    it('emits one progress event per association in order', async () => {
      await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')
      const sender = makeSender()

      const makeAssoc = (id: string, name: string) => ({
        id,
        districtId: 'ee000000-0000-4000-8000-000000000004',
        name,
        shortName: null,
        city: null,
        website: null,
        isActive: true,
        source: null,
        updatedAt: null,
        identifiers: [],
        addresses: [],
        contacts: []
      })

      applySyncBatch(
        makePayload({
          associations: [
            makeAssoc('aa000000-0000-4000-8000-000000000020', 'Club Alpha'),
            makeAssoc('aa000000-0000-4000-8000-000000000021', 'Club Beta')
          ]
        }),
        sender as never
      )

      expect(sender.send).toHaveBeenCalledTimes(2)
      expect(sender.send).toHaveBeenNthCalledWith(1, 'associations:sync:progress', {
        processed: 1,
        total: 2,
        currentName: 'Club Alpha'
      })
      expect(sender.send).toHaveBeenNthCalledWith(2, 'associations:sync:progress', {
        processed: 2,
        total: 2,
        currentName: 'Club Beta'
      })
    })

    it('replaces children on re-sync without creating duplicates', async () => {
      const db = await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')

      const assocId = 'aa000000-0000-4000-8000-000000000030'
      const districtId = 'ee000000-0000-4000-8000-000000000004'

      const makeAssocWithContacts = (contacts: { id: string; value: string }[]) =>
        makePayload({
          associations: [
            {
              id: assocId,
              districtId,
              name: 'Stable Club',
              shortName: null,
              city: null,
              website: null,
              isActive: true,
              source: null,
              updatedAt: null,
              identifiers: [],
              addresses: [],
              contacts: contacts.map((c) => ({
                ...c,
                contactType: 'email',
                label: null,
                isPublic: true
              }))
            }
          ]
        })

      // First sync: one contact
      applySyncBatch(
        makeAssocWithContacts([
          { id: 'co000000-0000-4000-8000-000000000010', value: 'old@example.com' }
        ]),
        makeSender() as never
      )

      // Second sync: different contact
      applySyncBatch(
        makeAssocWithContacts([
          { id: 'co000000-0000-4000-8000-000000000011', value: 'new@example.com' }
        ]),
        makeSender() as never
      )

      const contacts = db
        .prepare('SELECT value FROM association_contacts WHERE association_id = ?')
        .all(assocId) as { value: string }[]

      expect(contacts).toHaveLength(1)
      expect(contacts[0]?.value).toBe('new@example.com')
    })

    it('upserts an association with null optional fields (covers null branches)', async () => {
      const db = await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')

      const payload = makePayload({
        associations: [
          {
            id: 'aa000000-0000-4000-8000-000000000050',
            districtId: 'ee000000-0000-4000-8000-000000000004',
            name: 'Minimal Club',
            shortName: null,
            city: null,
            website: null,
            isActive: false,
            source: null,
            updatedAt: null,
            identifiers: [],
            addresses: [
              {
                id: 'ad000000-0000-4000-8000-000000000050',
                // All optional address fields are null → covers the null branches
                street: null,
                houseNumber: null,
                postalCode: null,
                city: null,
                countryCode: null,
                addressType: 'primary'
              }
            ],
            contacts: [
              {
                id: 'co000000-0000-4000-8000-000000000050',
                contactType: 'phone',
                value: '+49 40 123456',
                // label is non-null → covers the non-null branch of `contact.label ?? null`
                label: 'Board contact',
                // isPublic false → covers `contact.isPublic ? 1 : 0` false branch
                isPublic: false
              }
            ]
          }
        ]
      })

      applySyncBatch(payload, makeSender() as never)

      const assoc = db
        .prepare('SELECT is_active FROM associations WHERE id = ?')
        .get('aa000000-0000-4000-8000-000000000050') as { is_active: number } | undefined

      expect(assoc?.is_active).toBe(0)

      const contacts = db
        .prepare('SELECT label, is_public FROM association_contacts WHERE association_id = ?')
        .all('aa000000-0000-4000-8000-000000000050') as { label: string; is_public: number }[]

      expect(contacts[0]?.label).toBe('Board contact')
      expect(contacts[0]?.is_public).toBe(0)
    })

    it('sets synced_at on upserted associations', async () => {
      const db = await initTestDatabase()
      const { applySyncBatch } = await import('./sync-associations.service')
      const before = new Date().toISOString()

      applySyncBatch(
        makePayload({
          associations: [
            {
              id: 'aa000000-0000-4000-8000-000000000040',
              districtId: 'ee000000-0000-4000-8000-000000000004',
              name: 'Club With Timestamp',
              shortName: null,
              city: null,
              website: null,
              isActive: false,
              source: null,
              updatedAt: null,
              identifiers: [],
              addresses: [],
              contacts: []
            }
          ]
        }),
        makeSender() as never
      )

      const after = new Date().toISOString()

      const row = db
        .prepare('SELECT synced_at FROM associations WHERE id = ?')
        .get('aa000000-0000-4000-8000-000000000040') as { synced_at: string } | undefined

      expect(row?.synced_at).toBeDefined()
      expect(row!.synced_at >= before).toBe(true)
      expect(row!.synced_at <= after).toBe(true)
    })
  })
})
