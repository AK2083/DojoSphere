import { getCurrentSession } from '@shared/api'
import { supabase } from '@shared/api/supabase/client'
import type {
  AssociationSyncPayload,
  AssociationSyncTimestamps,
  SyncAssociationRow,
  SyncCountryRow,
  SyncDistrictRow,
  SyncFederationRow,
  SyncRegionalFederationRow
} from '@shared/types/electron-api'

/** Thrown when the user is not authenticated with Supabase. */
export class NotSignedInError extends Error {
  /**
   *
   */
  constructor() {
    super('NOT_SIGNED_IN')
    this.name = 'NotSignedInError'
  }
}

/**
 * Fetches updated association hierarchy records from Supabase.
 *
 * Each table is queried with `updated_at > latestSyncedAt` so only rows that
 * changed since the last local sync are downloaded. If `latestSyncedAt` is
 * null the full table is fetched (first-time sync).
 *
 * For associations the child tables (identifiers, addresses, contacts) are
 * always included in full for any association that needs syncing, since those
 * child tables are re-inserted from scratch in the main process.
 *
 * @param timestamps  Latest synced_at values from the local SQLite database.
 * @throws {NotSignedInError} When no valid Supabase session is present.
 * @returns           Full sync payload ready to be forwarded to the main process via IPC.
 */
export async function fetchSyncPayloadFromSupabase(
  timestamps: AssociationSyncTimestamps
): Promise<AssociationSyncPayload> {
  // Verify the user has an active Supabase session before making any queries.
  // The RLS policies on hierarchy tables require the `authenticated` role; without
  // a valid JWT the request will be rejected with a JWT/key error.
  const session = await getCurrentSession()

  if (!session) {
    throw new NotSignedInError()
  }

  const [countries, federations, regionalFederations, districts, associations] = await Promise.all([
    fetchCountries(timestamps.countries),
    fetchFederations(timestamps.federations),
    fetchRegionalFederations(timestamps.regionalFederations),
    fetchDistricts(timestamps.districts),
    fetchAssociations(timestamps.associations)
  ])

  return { countries, federations, regionalFederations, districts, associations }
}

// ---------------------------------------------------------------------------
// Per-table fetch helpers
// ---------------------------------------------------------------------------

async function fetchCountries(latestSyncedAt: string | null): Promise<SyncCountryRow[]> {
  let query = supabase.from('countries').select('id, name, iso_code, updated_at')
  if (latestSyncedAt) {
    query = query.gt('updated_at', latestSyncedAt)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch countries: ${error.message}`)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    isoCode: row.iso_code as string,
    updatedAt: (row.updated_at as string | null) ?? null
  }))
}

async function fetchFederations(latestSyncedAt: string | null): Promise<SyncFederationRow[]> {
  let query = supabase
    .from('federations')
    .select('id, country_id, name, short_name, website, updated_at')
  if (latestSyncedAt) {
    query = query.gt('updated_at', latestSyncedAt)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch federations: ${error.message}`)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    countryId: row.country_id as string,
    name: row.name as string,
    shortName: (row.short_name as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    updatedAt: (row.updated_at as string | null) ?? null
  }))
}

async function fetchRegionalFederations(
  latestSyncedAt: string | null
): Promise<SyncRegionalFederationRow[]> {
  let query = supabase
    .from('regional_federations')
    .select('id, federation_id, name, short_name, website, updated_at')
  if (latestSyncedAt) {
    query = query.gt('updated_at', latestSyncedAt)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch regional federations: ${error.message}`)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    federationId: row.federation_id as string,
    name: row.name as string,
    shortName: (row.short_name as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    updatedAt: (row.updated_at as string | null) ?? null
  }))
}

async function fetchDistricts(latestSyncedAt: string | null): Promise<SyncDistrictRow[]> {
  let query = supabase
    .from('districts')
    .select('id, regional_federation_id, name, short_name, sort_order, updated_at')
  if (latestSyncedAt) {
    query = query.gt('updated_at', latestSyncedAt)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch districts: ${error.message}`)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    regionalFederationId: row.regional_federation_id as string,
    name: row.name as string,
    shortName: (row.short_name as string | null) ?? null,
    sortOrder: row.sort_order as number,
    updatedAt: (row.updated_at as string | null) ?? null
  }))
}

async function fetchAssociations(latestSyncedAt: string | null): Promise<SyncAssociationRow[]> {
  // Fetch associations that changed since last sync
  let assocQuery = supabase
    .from('associations')
    .select('id, district_id, name, short_name, city, website, is_active, source, updated_at')
  if (latestSyncedAt) {
    assocQuery = assocQuery.gt('updated_at', latestSyncedAt)
  }

  const { data: assocData, error: assocError } = await assocQuery

  if (assocError) throw new Error(`Failed to fetch associations: ${assocError.message}`)

  const assocRows = assocData ?? []

  if (assocRows.length === 0) return []

  const assocIds = assocRows.map((r) => r.id as string)

  // Fetch children in parallel for all matched associations
  const [identifiers, addresses, contacts] = await Promise.all([
    fetchIdentifiersForIds(assocIds),
    fetchAddressesForIds(assocIds),
    fetchContactsForIds(assocIds)
  ])

  return assocRows.map((row) => {
    const id = row.id as string

    return {
      id,
      districtId: row.district_id as string,
      name: row.name as string,
      shortName: (row.short_name as string | null) ?? null,
      city: (row.city as string | null) ?? null,
      website: (row.website as string | null) ?? null,
      isActive: row.is_active as boolean,
      source: (row.source as string | null) ?? null,
      updatedAt: (row.updated_at as string | null) ?? null,
      identifiers: identifiers
        .filter((i) => i.associationId === id)
        .map((i) => ({
          id: i.id,
          type: i.type,
          value: i.value,
          authority: i.authority
        })),
      addresses: addresses
        .filter((a) => a.associationId === id)
        .map((a) => ({
          id: a.id,
          street: a.street,
          houseNumber: a.houseNumber,
          postalCode: a.postalCode,
          city: a.city,
          countryCode: a.countryCode,
          addressType: a.addressType
        })),
      contacts: contacts
        .filter((c) => c.associationId === id)
        .map((c) => ({
          id: c.id,
          contactType: c.contactType,
          value: c.value,
          label: c.label,
          isPublic: c.isPublic
        }))
    }
  })
}

type IdentifierRow = {
  id: string
  associationId: string
  type: string
  value: string
  authority: string | null
}

async function fetchIdentifiersForIds(associationIds: string[]): Promise<IdentifierRow[]> {
  const { data, error } = await supabase
    .from('association_identifiers')
    .select('id, association_id, type, value, authority')
    .in('association_id', associationIds)

  if (error) throw new Error(`Failed to fetch association identifiers: ${error.message}`)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    associationId: row.association_id as string,
    type: row.type as string,
    value: row.value as string,
    authority: (row.authority as string | null) ?? null
  }))
}

type AddressRow = {
  id: string
  associationId: string
  street: string | null
  houseNumber: string | null
  postalCode: string | null
  city: string | null
  countryCode: string | null
  addressType: string
}

async function fetchAddressesForIds(associationIds: string[]): Promise<AddressRow[]> {
  const { data, error } = await supabase
    .from('association_addresses')
    .select(
      'id, association_id, street, house_number, postal_code, city, country_code, address_type'
    )
    .in('association_id', associationIds)

  if (error) throw new Error(`Failed to fetch association addresses: ${error.message}`)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    associationId: row.association_id as string,
    street: (row.street as string | null) ?? null,
    houseNumber: (row.house_number as string | null) ?? null,
    postalCode: (row.postal_code as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    countryCode: (row.country_code as string | null) ?? null,
    addressType: row.address_type as string
  }))
}

type ContactRow = {
  id: string
  associationId: string
  contactType: string
  value: string
  label: string | null
  isPublic: boolean
}

async function fetchContactsForIds(associationIds: string[]): Promise<ContactRow[]> {
  const { data, error } = await supabase
    .from('association_contacts')
    .select('id, association_id, contact_type, value, label, is_public')
    .in('association_id', associationIds)

  if (error) throw new Error(`Failed to fetch association contacts: ${error.message}`)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    associationId: row.association_id as string,
    contactType: row.contact_type as string,
    value: row.value as string,
    label: (row.label as string | null) ?? null,
    isPublic: row.is_public as boolean
  }))
}
