import type { WebContents } from 'electron'

import { getDatabase, runInTransaction } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

// ---------------------------------------------------------------------------
// Payload types (mirror the shapes fetched from Supabase in the renderer)
// ---------------------------------------------------------------------------

/**
 *
 */
export type SyncCountryRow = {
  id: string
  name: string
  isoCode: string
  updatedAt: string | null
}

/**
 *
 */
export type SyncFederationRow = {
  id: string
  countryId: string
  name: string
  shortName: string | null
  website: string | null
  updatedAt: string | null
}

/**
 *
 */
export type SyncRegionalFederationRow = {
  id: string
  federationId: string
  name: string
  shortName: string | null
  website: string | null
  updatedAt: string | null
}

/**
 *
 */
export type SyncDistrictRow = {
  id: string
  regionalFederationId: string
  name: string
  shortName: string | null
  sortOrder: number
  updatedAt: string | null
}

/**
 *
 */
export type SyncAssociationIdentifierRow = {
  id: string
  type: string
  value: string
  authority: string | null
}

/**
 *
 */
export type SyncAssociationAddressRow = {
  id: string
  street: string | null
  houseNumber: string | null
  postalCode: string | null
  city: string | null
  countryCode: string | null
  addressType: string
}

/**
 *
 */
export type SyncAssociationContactRow = {
  id: string
  contactType: string
  value: string
  label: string | null
  isPublic: boolean
}

/**
 *
 */
export type SyncAssociationRow = {
  id: string
  districtId: string
  name: string
  shortName: string | null
  city: string | null
  website: string | null
  isActive: boolean
  source: string | null
  updatedAt: string | null
  identifiers: SyncAssociationIdentifierRow[]
  addresses: SyncAssociationAddressRow[]
  contacts: SyncAssociationContactRow[]
}

/**
 *
 */
export type AssociationSyncPayload = {
  countries: SyncCountryRow[]
  federations: SyncFederationRow[]
  regionalFederations: SyncRegionalFederationRow[]
  districts: SyncDistrictRow[]
  associations: SyncAssociationRow[]
}

// Progress event emitted back to renderer via sender.send
/**
 *
 */
export type AssociationSyncProgressEvent = {
  processed: number
  total: number
  currentName: string
}

// ---------------------------------------------------------------------------
// Sync timestamps
// ---------------------------------------------------------------------------

/**
 *
 */
export type AssociationSyncTimestamps = {
  countries: string | null
  federations: string | null
  regionalFederations: string | null
  districts: string | null
  associations: string | null
}

/**
 * Returns the latest `synced_at` value for each association hierarchy table.
 * A `null` entry means that table has never been synced from the cloud.
 *
 * @returns Latest synced_at per table, or `null` when a table has never been synced.
 */
export function getSyncTimestamps(): AssociationSyncTimestamps {
  return withDbErrorLogging('associations-sync', 'getSyncTimestamps', () => {
    const db = getDatabase()

    const pick = (table: string): string | null => {
      const row = db.prepare(`SELECT MAX(synced_at) AS ts FROM ${table}`).get() as {
        ts: string | null
      }
      return row.ts
    }

    return {
      countries: pick('countries'),
      federations: pick('federations'),
      regionalFederations: pick('regional_federations'),
      districts: pick('districts'),
      associations: pick('associations')
    }
  })
}

// ---------------------------------------------------------------------------
// Apply sync batch
// ---------------------------------------------------------------------------

/**
 * Upserts all records from the sync payload into SQLite and emits per-association
 * progress events back to the renderer.
 *
 * Hierarchy rows (countries → federations → regional_federations → districts) are
 * upserted first in a single transaction, then each association with its children
 * is upserted individually so progress can be streamed to the UI.
 *
 * @param payload  Records fetched from Supabase by the renderer.
 * @param sender   Renderer WebContents to send progress events to.
 */
export function applySyncBatch(payload: AssociationSyncPayload, sender: WebContents): void {
  withDbErrorLogging('associations-sync', 'applySyncBatch', () => {
    const db = getDatabase()
    const now = new Date().toISOString()

    // --- 1. Upsert hierarchy rows in one transaction ---
    runInTransaction(db, () => {
      const upsertCountry = db.prepare(`
        INSERT INTO countries (id, name, iso_code, synced_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          iso_code = excluded.iso_code,
          synced_at = excluded.synced_at
      `)
      for (const c of payload.countries) {
        upsertCountry.run(c.id, c.name, c.isoCode, now)
      }

      const upsertFederation = db.prepare(`
        INSERT INTO federations (id, country_id, name, short_name, website, synced_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          country_id = excluded.country_id,
          name = excluded.name,
          short_name = excluded.short_name,
          website = excluded.website,
          synced_at = excluded.synced_at
      `)
      for (const f of payload.federations) {
        upsertFederation.run(f.id, f.countryId, f.name, f.shortName ?? null, f.website ?? null, now)
      }

      const upsertRegionalFederation = db.prepare(`
        INSERT INTO regional_federations (id, federation_id, name, short_name, website, synced_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          federation_id = excluded.federation_id,
          name = excluded.name,
          short_name = excluded.short_name,
          website = excluded.website,
          synced_at = excluded.synced_at
      `)
      for (const rf of payload.regionalFederations) {
        upsertRegionalFederation.run(
          rf.id,
          rf.federationId,
          rf.name,
          rf.shortName ?? null,
          rf.website ?? null,
          now
        )
      }

      const upsertDistrict = db.prepare(`
        INSERT INTO districts (id, regional_federation_id, name, short_name, sort_order, synced_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          regional_federation_id = excluded.regional_federation_id,
          name = excluded.name,
          short_name = excluded.short_name,
          sort_order = excluded.sort_order,
          synced_at = excluded.synced_at
      `)
      for (const d of payload.districts) {
        upsertDistrict.run(
          d.id,
          d.regionalFederationId,
          d.name,
          d.shortName ?? null,
          d.sortOrder,
          now
        )
      }
    })

    // --- 2. Upsert each association + children, emit progress events ---
    const total = payload.associations.length

    const upsertAssociation = db.prepare(`
      INSERT INTO associations (
        id, district_id, name, short_name, city, website, is_active, source, synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        district_id = excluded.district_id,
        name = excluded.name,
        short_name = excluded.short_name,
        city = excluded.city,
        website = excluded.website,
        is_active = excluded.is_active,
        source = excluded.source,
        synced_at = excluded.synced_at
    `)

    const deleteIdentifiers = db.prepare(
      `DELETE FROM association_identifiers WHERE association_id = ?`
    )
    const insertIdentifier = db.prepare(`
      INSERT OR REPLACE INTO association_identifiers (id, association_id, type, value, authority)
      VALUES (?, ?, ?, ?, ?)
    `)

    const deleteAddresses = db.prepare(`DELETE FROM association_addresses WHERE association_id = ?`)
    const insertAddress = db.prepare(`
      INSERT OR REPLACE INTO association_addresses (
        id, association_id, street, house_number, postal_code, city, country_code, address_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const deleteContacts = db.prepare(`DELETE FROM association_contacts WHERE association_id = ?`)
    const insertContact = db.prepare(`
      INSERT OR REPLACE INTO association_contacts (
        id, association_id, contact_type, value, label, is_public
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)

    payload.associations.forEach((assoc, index) => {
      runInTransaction(db, () => {
        upsertAssociation.run(
          assoc.id,
          assoc.districtId,
          assoc.name,
          assoc.shortName ?? null,
          assoc.city ?? null,
          assoc.website ?? null,
          assoc.isActive ? 1 : 0,
          assoc.source ?? null,
          now
        )

        // Replace children entirely for synced associations
        deleteIdentifiers.run(assoc.id)
        for (const ident of assoc.identifiers) {
          insertIdentifier.run(ident.id, assoc.id, ident.type, ident.value, ident.authority ?? null)
        }

        deleteAddresses.run(assoc.id)
        for (const addr of assoc.addresses) {
          insertAddress.run(
            addr.id,
            assoc.id,
            addr.street ?? null,
            addr.houseNumber ?? null,
            addr.postalCode ?? null,
            addr.city ?? null,
            addr.countryCode ?? null,
            addr.addressType
          )
        }

        deleteContacts.run(assoc.id)
        for (const contact of assoc.contacts) {
          insertContact.run(
            contact.id,
            assoc.id,
            contact.contactType,
            contact.value,
            contact.label ?? null,
            contact.isPublic ? 1 : 0
          )
        }
      })

      const progress: AssociationSyncProgressEvent = {
        processed: index + 1,
        total,
        currentName: assoc.name
      }
      sender.send('associations:sync:progress', progress)
    })
  })
}
