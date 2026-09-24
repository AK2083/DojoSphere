import type { AssociationSyncTimestamps } from '@shared/types/electron-api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Hoisted mocks – must be declared before any import of the module under test
// ---------------------------------------------------------------------------

const supabaseFromMock = vi.hoisted(() => vi.fn())

vi.mock('@shared/api/supabase/client', () => ({
  supabase: { from: supabaseFromMock }
}))

// ---------------------------------------------------------------------------
// Chainable query builder helper
// ---------------------------------------------------------------------------

type QueryResult = { data: Record<string, unknown>[] | null; error: { message: string } | null }

/** Returns a chainable mock that resolves to `result` when awaited. */
function makeQuery(result: QueryResult) {
  return {
    select: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    then(onFulfilled?: (value: QueryResult) => unknown, onRejected?: (reason: unknown) => unknown) {
      return Promise.resolve(result).then(onFulfilled, onRejected)
    }
  }
}

/** Configures the supabase.from mock to return per-table data. */
function setupSupabaseMock(tableResults: Record<string, QueryResult>) {
  supabaseFromMock.mockImplementation((table: string) => {
    const result = tableResults[table] ?? { data: [], error: null }
    return makeQuery(result)
  })
}

// ---------------------------------------------------------------------------
// Module under test (imported after mocks are set up)
// ---------------------------------------------------------------------------

import { fetchSyncPayloadFromSupabase } from './sync-from-supabase'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const noTimestamps: AssociationSyncTimestamps = {
  countries: null,
  federations: null,
  regionalFederations: null,
  districts: null,
  associations: null,
  localAssociationIds: []
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('fetchSyncPayloadFromSupabase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: return empty data from all tables
    setupSupabaseMock({})
  })

  it('returns empty arrays when all tables return no rows', async () => {
    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.countries).toEqual([])
    expect(payload.federations).toEqual([])
    expect(payload.regionalFederations).toEqual([])
    expect(payload.districts).toEqual([])
    expect(payload.associations).toEqual([])
  })

  it('maps country rows to the expected camelCase shape', async () => {
    setupSupabaseMock({
      countries: {
        data: [
          { id: 'country-1', name: 'Germany', iso_code: 'DE', updated_at: '2026-01-01T00:00:00Z' }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.countries).toEqual([
      { id: 'country-1', name: 'Germany', isoCode: 'DE', updatedAt: '2026-01-01T00:00:00Z' }
    ])
  })

  it('maps federation rows to the expected camelCase shape', async () => {
    setupSupabaseMock({
      federations: {
        data: [
          {
            id: 'fed-1',
            country_id: 'country-1',
            name: 'DJB',
            short_name: 'DJB',
            website: null,
            updated_at: null
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.federations).toEqual([
      {
        id: 'fed-1',
        countryId: 'country-1',
        name: 'DJB',
        shortName: 'DJB',
        website: null,
        updatedAt: null
      }
    ])
  })

  it('maps regional_federation rows to the expected camelCase shape', async () => {
    setupSupabaseMock({
      regional_federations: {
        data: [
          {
            id: 'rf-1',
            federation_id: 'fed-1',
            name: 'HJV',
            short_name: null,
            website: null,
            updated_at: null
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.regionalFederations).toEqual([
      {
        id: 'rf-1',
        federationId: 'fed-1',
        name: 'HJV',
        shortName: null,
        website: null,
        updatedAt: null
      }
    ])
  })

  it('maps district rows to the expected camelCase shape', async () => {
    setupSupabaseMock({
      districts: {
        data: [
          {
            id: 'district-1',
            regional_federation_id: 'rf-1',
            name: 'Bezirk Hamburg',
            short_name: 'HH',
            sort_order: 2,
            updated_at: null
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.districts).toEqual([
      {
        id: 'district-1',
        regionalFederationId: 'rf-1',
        name: 'Bezirk Hamburg',
        shortName: 'HH',
        sortOrder: 2,
        updatedAt: null
      }
    ])
  })

  it('maps regional_federation rows to the expected camelCase shape', async () => {
    setupSupabaseMock({
      regional_federations: {
        data: [
          {
            id: 'rf-1',
            federation_id: 'fed-1',
            name: 'HJV',
            short_name: 'HJV',
            website: 'https://hjv.example',
            updated_at: '2026-01-15T00:00:00Z'
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.regionalFederations).toEqual([
      {
        id: 'rf-1',
        federationId: 'fed-1',
        name: 'HJV',
        shortName: 'HJV',
        website: 'https://hjv.example',
        updatedAt: '2026-01-15T00:00:00Z'
      }
    ])
  })

  it('maps district rows to the expected camelCase shape', async () => {
    setupSupabaseMock({
      districts: {
        data: [
          {
            id: 'district-1',
            regional_federation_id: 'rf-1',
            name: 'Bezirk Hamburg',
            short_name: 'HH',
            sort_order: 3,
            updated_at: '2026-02-01T00:00:00Z'
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.districts).toEqual([
      {
        id: 'district-1',
        regionalFederationId: 'rf-1',
        name: 'Bezirk Hamburg',
        shortName: 'HH',
        sortOrder: 3,
        updatedAt: '2026-02-01T00:00:00Z'
      }
    ])
  })

  it('maps association rows with empty children when none match', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-1',
            district_id: 'district-1',
            name: 'Test Club',
            short_name: 'TC',
            city: 'Berlin',
            website: null,
            is_active: true,
            source: 'cloud',
            updated_at: '2026-09-01T00:00:00Z'
          }
        ],
        error: null
      },
      association_identifiers: { data: [], error: null },
      association_addresses: { data: [], error: null },
      association_contacts: { data: [], error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.associations).toHaveLength(1)
    expect(payload.associations[0]).toMatchObject({
      id: 'assoc-1',
      name: 'Test Club',
      districtId: 'district-1',
      city: 'Berlin',
      identifiers: [],
      addresses: [],
      contacts: []
    })
  })

  it('maps association rows with populated children', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-1',
            district_id: 'district-1',
            name: 'Full Club',
            short_name: 'FC',
            city: 'Hamburg',
            website: 'https://fc.example',
            is_active: true,
            source: 'cloud',
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: {
        data: [
          {
            id: 'ident-1',
            association_id: 'assoc-1',
            type: 'vereinsregister_number',
            value: 'VR 999',
            authority: 'Hamburg'
          }
        ],
        error: null
      },
      association_addresses: {
        data: [
          {
            id: 'addr-1',
            association_id: 'assoc-1',
            street: 'Teststr.',
            house_number: '1',
            postal_code: '20095',
            city: 'Hamburg',
            country_code: 'DE',
            address_type: 'primary'
          }
        ],
        error: null
      },
      association_contacts: {
        data: [
          {
            id: 'contact-1',
            association_id: 'assoc-1',
            contact_type: 'email',
            value: 'info@fc.example',
            label: 'Board',
            is_public: true
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.associations).toHaveLength(1)
    const assoc = payload.associations[0]!
    expect(assoc.identifiers).toEqual([
      { id: 'ident-1', type: 'vereinsregister_number', value: 'VR 999', authority: 'Hamburg' }
    ])
    expect(assoc.addresses).toEqual([
      {
        id: 'addr-1',
        street: 'Teststr.',
        houseNumber: '1',
        postalCode: '20095',
        city: 'Hamburg',
        countryCode: 'DE',
        addressType: 'primary'
      }
    ])
    expect(assoc.contacts).toEqual([
      {
        id: 'contact-1',
        contactType: 'email',
        value: 'info@fc.example',
        label: 'Board',
        isPublic: true
      }
    ])
  })

  it('maps address rows with null optional fields', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-null',
            district_id: 'd1',
            name: 'Sparse Club',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: null,
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: { data: [], error: null },
      association_addresses: {
        data: [
          {
            id: 'addr-null',
            association_id: 'assoc-null',
            // All optional fields are null → covers the `?? null` right branches
            street: null,
            house_number: null,
            postal_code: null,
            city: null,
            country_code: null,
            address_type: 'primary'
          }
        ],
        error: null
      },
      association_contacts: {
        data: [
          {
            id: 'contact-null',
            association_id: 'assoc-null',
            contact_type: 'email',
            value: 'info@sparse.example',
            // label null → covers the `?? null` right branch
            label: null,
            is_public: false
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    const assoc = payload.associations[0]!
    expect(assoc.addresses[0]).toMatchObject({
      street: null,
      houseNumber: null,
      postalCode: null,
      city: null,
      countryCode: null
    })
    expect(assoc.contacts[0]).toMatchObject({ label: null, isPublic: false })
  })

  it('filters children correctly when multiple associations are present', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-A',
            district_id: 'district-1',
            name: 'Club A',
            short_name: null,
            city: null,
            website: null,
            is_active: false,
            source: null,
            updated_at: null
          },
          {
            id: 'assoc-B',
            district_id: 'district-1',
            name: 'Club B',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: null,
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: {
        data: [
          {
            id: 'ident-A',
            association_id: 'assoc-A',
            type: 'local_id',
            value: 'A1',
            authority: null
          }
        ],
        error: null
      },
      association_addresses: { data: [], error: null },
      association_contacts: { data: [], error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.associations).toHaveLength(2)
    const assocA = payload.associations.find((a) => a.id === 'assoc-A')!
    const assocB = payload.associations.find((a) => a.id === 'assoc-B')!

    expect(assocA.identifiers).toHaveLength(1)
    expect(assocB.identifiers).toHaveLength(0)
  })

  it('applies a gt filter for federations when timestamps.federations is non-null', async () => {
    const fedQuerySpy = { select: vi.fn().mockReturnThis(), gt: vi.fn().mockReturnThis() }
    fedQuerySpy.gt.mockReturnValue(makeQuery({ data: [], error: null }))
    fedQuerySpy.select.mockReturnValue(fedQuerySpy)

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'federations') return fedQuerySpy
      return makeQuery({ data: [], error: null })
    })

    await fetchSyncPayloadFromSupabase({ ...noTimestamps, federations: '2026-03-01T00:00:00Z' })

    expect(fedQuerySpy.gt).toHaveBeenCalledWith('updated_at', '2026-03-01T00:00:00Z')
  })

  it('applies a gt filter for regional_federations when timestamps.regionalFederations is non-null', async () => {
    const rfQuerySpy = { select: vi.fn().mockReturnThis(), gt: vi.fn().mockReturnThis() }
    rfQuerySpy.gt.mockReturnValue(makeQuery({ data: [], error: null }))
    rfQuerySpy.select.mockReturnValue(rfQuerySpy)

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'regional_federations') return rfQuerySpy
      return makeQuery({ data: [], error: null })
    })

    await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      regionalFederations: '2026-04-01T00:00:00Z'
    })

    expect(rfQuerySpy.gt).toHaveBeenCalledWith('updated_at', '2026-04-01T00:00:00Z')
  })

  it('applies a gt filter for districts when timestamps.districts is non-null', async () => {
    const districtQuerySpy = { select: vi.fn().mockReturnThis(), gt: vi.fn().mockReturnThis() }
    districtQuerySpy.gt.mockReturnValue(makeQuery({ data: [], error: null }))
    districtQuerySpy.select.mockReturnValue(districtQuerySpy)

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'districts') return districtQuerySpy
      return makeQuery({ data: [], error: null })
    })

    await fetchSyncPayloadFromSupabase({ ...noTimestamps, districts: '2026-04-15T00:00:00Z' })

    expect(districtQuerySpy.gt).toHaveBeenCalledWith('updated_at', '2026-04-15T00:00:00Z')
  })

  it('applies a gt filter for associations when local ids exist and timestamps.associations is set', async () => {
    const changedQuery = {
      select: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      then(
        onFulfilled?: (value: QueryResult) => unknown,
        onRejected?: (reason: unknown) => unknown
      ) {
        return Promise.resolve({ data: [], error: null }).then(onFulfilled, onRejected)
      }
    }
    const idsQuery = makeQuery({ data: [{ id: 'local-1' }], error: null })
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        return associationsCalls === 1 ? changedQuery : idsQuery
      }
      return makeQuery({ data: [], error: null })
    })

    await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['local-1']
    })

    expect(changedQuery.neq).toHaveBeenCalledWith('id', '00000000-0000-0000-0000-000000000000')
    expect(changedQuery.gt).toHaveBeenCalledWith('updated_at', '2026-05-01T00:00:00Z')
  })

  it('merges changed and missing associations without duplicating ids', async () => {
    const changedQuery = makeQuery({
      data: [
        {
          id: 'changed-id',
          district_id: 'd1',
          name: 'Changed Club',
          short_name: null,
          city: null,
          website: null,
          is_active: true,
          source: 'cloud',
          updated_at: '2026-06-01T00:00:00Z'
        }
      ],
      error: null
    })
    const idsQuery = makeQuery({
      data: [{ id: 'changed-id' }, { id: 'missing-id' }],
      error: null
    })
    const missingQuery = makeQuery({
      data: [
        {
          id: 'missing-id',
          district_id: 'd1',
          name: 'Missing Club',
          short_name: null,
          city: null,
          website: null,
          is_active: true,
          source: 'cloud',
          updated_at: '2026-01-01T00:00:00Z'
        }
      ],
      error: null
    })
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) return changedQuery
        if (associationsCalls === 2) return idsQuery
        return missingQuery
      }
      return makeQuery({ data: [], error: null })
    })

    const payload = await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['present-id']
    })

    expect(payload.associations).toHaveLength(2)
    expect(payload.associations.map((row) => row.id).sort()).toEqual(['changed-id', 'missing-id'])
  })

  it('re-fetches associations that are missing locally even when unchanged remotely', async () => {
    const changedQuery = makeQuery({ data: [], error: null })
    const idsQuery = makeQuery({
      data: [{ id: 'present-id' }, { id: 'missing-id' }],
      error: null
    })
    const missingQuery = makeQuery({
      data: [
        {
          id: 'missing-id',
          district_id: 'd1',
          name: 'Missing Club',
          short_name: null,
          city: null,
          website: null,
          is_active: true,
          source: 'cloud',
          updated_at: '2026-01-01T00:00:00Z'
        }
      ],
      error: null
    })
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) return changedQuery
        if (associationsCalls === 2) return idsQuery
        return missingQuery
      }
      return makeQuery({ data: [], error: null })
    })

    const payload = await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['present-id']
    })

    expect(payload.associations).toHaveLength(1)
    expect(payload.associations[0]).toMatchObject({ id: 'missing-id', name: 'Missing Club' })
  })

  it('never treats the seeded Unknown association as missing', async () => {
    const changedQuery = makeQuery({ data: [], error: null })
    const idsQuery = makeQuery({
      data: [{ id: 'present-id' }, { id: '00000000-0000-0000-0000-000000000000' }],
      error: null
    })
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        return associationsCalls === 1 ? changedQuery : idsQuery
      }
      return makeQuery({ data: [], error: null })
    })

    const payload = await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['present-id']
    })

    expect(payload.associations).toEqual([])
    expect(associationsCalls).toBe(2)
  })

  it('uses an empty local id list when localAssociationIds is omitted', async () => {
    setupSupabaseMock({
      associations: { data: [], error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase({
      countries: null,
      federations: null,
      regionalFederations: null,
      districts: null,
      associations: null
    } as AssociationSyncTimestamps)

    expect(payload.associations).toEqual([])
  })

  it('throws when fetching remote association ids fails', async () => {
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) {
          return makeQuery({ data: [], error: null })
        }
        return makeQuery({ data: null, error: { message: 'ids failed' } })
      }
      return makeQuery({ data: [], error: null })
    })

    await expect(
      fetchSyncPayloadFromSupabase({
        ...noTimestamps,
        associations: '2026-05-01T00:00:00Z',
        localAssociationIds: ['present-id']
      })
    ).rejects.toThrow('Failed to fetch association ids: ids failed')
  })

  it('treats a null remote association id list as empty', async () => {
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) return makeQuery({ data: [], error: null })
        return makeQuery({ data: null, error: null })
      }
      return makeQuery({ data: [], error: null })
    })

    const payload = await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['present-id']
    })

    expect(payload.associations).toEqual([])
  })

  it('throws when fetching missing associations by id fails', async () => {
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) return makeQuery({ data: [], error: null })
        if (associationsCalls === 2) {
          return makeQuery({ data: [{ id: 'missing-id' }], error: null })
        }
        return makeQuery({ data: null, error: { message: 'by-id failed' } })
      }
      return makeQuery({ data: [], error: null })
    })

    await expect(
      fetchSyncPayloadFromSupabase({
        ...noTimestamps,
        associations: '2026-05-01T00:00:00Z',
        localAssociationIds: ['present-id']
      })
    ).rejects.toThrow('Failed to fetch associations by id: by-id failed')
  })

  it('ignores Unknown rows returned from a missing-id lookup', async () => {
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) return makeQuery({ data: [], error: null })
        if (associationsCalls === 2) {
          return makeQuery({
            data: [{ id: 'missing-id' }, { id: '00000000-0000-0000-0000-000000000000' }],
            error: null
          })
        }
        return makeQuery({
          data: [
            {
              id: 'missing-id',
              district_id: 'd1',
              name: 'Missing Club',
              short_name: null,
              city: null,
              website: null,
              is_active: true,
              source: 'cloud',
              updated_at: null
            },
            {
              id: '00000000-0000-0000-0000-000000000000',
              district_id: 'd1',
              name: 'Unknown',
              short_name: null,
              city: null,
              website: null,
              is_active: true,
              source: 'seed',
              updated_at: null
            }
          ],
          error: null
        })
      }
      return makeQuery({ data: [], error: null })
    })

    const payload = await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['present-id']
    })

    expect(payload.associations).toHaveLength(1)
    expect(payload.associations[0]?.id).toBe('missing-id')
  })

  it('treats a null missing-id lookup response as empty', async () => {
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) return makeQuery({ data: [], error: null })
        if (associationsCalls === 2) {
          return makeQuery({ data: [{ id: 'missing-id' }], error: null })
        }
        return makeQuery({ data: null, error: null })
      }
      return makeQuery({ data: [], error: null })
    })

    const payload = await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['present-id']
    })

    expect(payload.associations).toEqual([])
  })

  it('chunks missing association id lookups when more than 100 ids are missing', async () => {
    const missingIds = Array.from({ length: 101 }, (_, index) => `missing-${index}`)
    const inSpy = vi.fn().mockReturnThis()
    let associationsCalls = 0

    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'associations') {
        associationsCalls += 1
        if (associationsCalls === 1) return makeQuery({ data: [], error: null })
        if (associationsCalls === 2) {
          return makeQuery({
            data: missingIds.map((id) => ({ id })),
            error: null
          })
        }

        return {
          select: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          neq: vi.fn().mockReturnThis(),
          in: inSpy.mockImplementation(() => ({
            then(
              onFulfilled?: (value: QueryResult) => unknown,
              onRejected?: (reason: unknown) => unknown
            ) {
              return Promise.resolve({ data: [], error: null }).then(onFulfilled, onRejected)
            }
          })),
          then(
            onFulfilled?: (value: QueryResult) => unknown,
            onRejected?: (reason: unknown) => unknown
          ) {
            return Promise.resolve({ data: [], error: null }).then(onFulfilled, onRejected)
          }
        }
      }
      return makeQuery({ data: [], error: null })
    })

    const payload = await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      associations: '2026-05-01T00:00:00Z',
      localAssociationIds: ['present-id']
    })

    expect(payload.associations).toEqual([])
    expect(inSpy).toHaveBeenCalledTimes(2)
    expect(inSpy.mock.calls[0]?.[1]).toHaveLength(100)
    expect(inSpy.mock.calls[1]?.[1]).toHaveLength(1)
  })

  it('filters Unknown out of a full association download', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: '00000000-0000-0000-0000-000000000000',
            district_id: 'd1',
            name: 'Unknown',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: 'seed',
            updated_at: null
          },
          {
            id: 'club-1',
            district_id: 'd1',
            name: 'Real Club',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: 'cloud',
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: { data: [], error: null },
      association_addresses: { data: [], error: null },
      association_contacts: { data: [], error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.associations).toHaveLength(1)
    expect(payload.associations[0]?.id).toBe('club-1')
  })

  it('skips association child fetches when the association list is empty', async () => {
    setupSupabaseMock({
      associations: { data: [], error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.associations).toEqual([])
    // supabaseFromMock should not have been called for child tables
    const calledTables = supabaseFromMock.mock.calls.map((call) => call[0] as string)
    expect(calledTables).not.toContain('association_identifiers')
    expect(calledTables).not.toContain('association_addresses')
    expect(calledTables).not.toContain('association_contacts')
  })

  it('applies a gt filter when timestamps.countries is non-null', async () => {
    const querySpy = { select: vi.fn().mockReturnThis(), gt: vi.fn().mockReturnThis() }
    querySpy.gt.mockReturnValue(makeQuery({ data: [], error: null }))
    querySpy.select.mockReturnValue(querySpy)
    supabaseFromMock.mockReturnValue(makeQuery({ data: [], error: null }))

    // Use a from mock that returns a spy for the countries table
    supabaseFromMock.mockImplementation((table: string) => {
      if (table === 'countries') return querySpy
      return makeQuery({ data: [], error: null })
    })

    await fetchSyncPayloadFromSupabase({
      ...noTimestamps,
      countries: '2026-01-01T00:00:00Z'
    })

    expect(querySpy.gt).toHaveBeenCalledWith('updated_at', '2026-01-01T00:00:00Z')
  })

  it('handles null data responses (no error) by returning empty arrays', async () => {
    // Supabase can return { data: null, error: null } in edge cases.
    // The `data ?? []` expression must take the right branch (return []).
    setupSupabaseMock({
      countries: { data: null, error: null },
      federations: { data: null, error: null },
      regional_federations: { data: null, error: null },
      districts: { data: null, error: null },
      associations: { data: null, error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.countries).toEqual([])
    expect(payload.federations).toEqual([])
    expect(payload.regionalFederations).toEqual([])
    expect(payload.districts).toEqual([])
    expect(payload.associations).toEqual([])
  })

  it('maps federation rows with null shortName (covers shortName ?? null right branch)', async () => {
    setupSupabaseMock({
      federations: {
        data: [
          {
            id: 'fed-null',
            country_id: 'c1',
            name: 'No Short Name',
            short_name: null, // → covers right branch of `?? null`
            website: null,
            updated_at: null
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)
    expect(payload.federations[0]?.shortName).toBeNull()
  })

  it('maps district rows with null shortName (covers shortName ?? null right branch)', async () => {
    setupSupabaseMock({
      districts: {
        data: [
          {
            id: 'district-null',
            regional_federation_id: 'rf-1',
            name: 'No Short Name District',
            short_name: null, // → covers right branch of `?? null`
            sort_order: 0,
            updated_at: null
          }
        ],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)
    expect(payload.districts[0]?.shortName).toBeNull()
  })

  it('maps country rows with null updated_at (covers updatedAt ?? null right branch)', async () => {
    setupSupabaseMock({
      countries: {
        data: [{ id: 'c1', name: 'NoDate', iso_code: 'ND', updated_at: null }],
        error: null
      }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.countries[0]?.updatedAt).toBeNull()
  })

  it('maps identifier rows with null authority and covers data ?? [] for child tables', async () => {
    // This test serves three purposes:
    // 1. `authority ?? null` right branch (authority is null)
    // 2. `data ?? []` right branch for association_addresses (data is null, no error)
    // 3. `data ?? []` right branch for association_contacts (data is null, no error)
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-auth',
            district_id: 'd1',
            name: 'Club',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: null,
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: {
        data: [
          {
            id: 'ident-auth',
            association_id: 'assoc-auth',
            type: 'local_id',
            value: 'L1',
            authority: null // → covers `authority ?? null` right branch
          }
        ],
        error: null
      },
      // null data without error → covers `data ?? []` right branches
      association_addresses: { data: null, error: null },
      association_contacts: { data: null, error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.associations[0]?.identifiers[0]?.authority).toBeNull()
    expect(payload.associations[0]?.addresses).toEqual([])
    expect(payload.associations[0]?.contacts).toEqual([])
  })

  it('covers data ?? [] right branch for association_identifiers when data is null', async () => {
    // fetchIdentifiersForIds is only called when there are associations.
    // Here we return null (no error) from identifiers to cover the `data ?? []` null path.
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-null-ident',
            district_id: 'd1',
            name: 'Club',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: null,
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: { data: null, error: null }, // null → `data ?? []` right branch
      association_addresses: { data: [], error: null },
      association_contacts: { data: [], error: null }
    })

    const payload = await fetchSyncPayloadFromSupabase(noTimestamps)

    expect(payload.associations[0]?.identifiers).toEqual([])
  })

  it('throws a descriptive error when the countries query fails', async () => {
    setupSupabaseMock({
      countries: { data: null, error: { message: 'Connection refused' } }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch countries: Connection refused'
    )
  })

  it('throws a descriptive error when the federations query fails', async () => {
    setupSupabaseMock({
      federations: { data: null, error: { message: 'DB error' } }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch federations: DB error'
    )
  })

  it('throws a descriptive error when the regional_federations query fails', async () => {
    setupSupabaseMock({
      regional_federations: { data: null, error: { message: 'RF error' } }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch regional federations: RF error'
    )
  })

  it('throws a descriptive error when the districts query fails', async () => {
    setupSupabaseMock({
      districts: { data: null, error: { message: 'District error' } }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch districts: District error'
    )
  })

  it('throws a descriptive error when the associations query fails', async () => {
    setupSupabaseMock({
      associations: { data: null, error: { message: 'Assoc error' } }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch associations: Assoc error'
    )
  })

  it('throws a descriptive error when the association_identifiers query fails', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-1',
            district_id: 'd1',
            name: 'Club',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: null,
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: { data: null, error: { message: 'Ident error' } },
      association_addresses: { data: [], error: null },
      association_contacts: { data: [], error: null }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch association identifiers: Ident error'
    )
  })

  it('throws a descriptive error when the association_addresses query fails', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-1',
            district_id: 'd1',
            name: 'Club',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: null,
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: { data: [], error: null },
      association_addresses: { data: null, error: { message: 'Address error' } },
      association_contacts: { data: [], error: null }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch association addresses: Address error'
    )
  })

  it('throws a descriptive error when the association_contacts query fails', async () => {
    setupSupabaseMock({
      associations: {
        data: [
          {
            id: 'assoc-1',
            district_id: 'd1',
            name: 'Club',
            short_name: null,
            city: null,
            website: null,
            is_active: true,
            source: null,
            updated_at: null
          }
        ],
        error: null
      },
      association_identifiers: { data: [], error: null },
      association_addresses: { data: [], error: null },
      association_contacts: { data: null, error: { message: 'Contact error' } }
    })

    await expect(fetchSyncPayloadFromSupabase(noTimestamps)).rejects.toThrow(
      'Failed to fetch association contacts: Contact error'
    )
  })
})
