import type { Database } from '@main/shared/database'
import { randomUUID } from 'node:crypto'

import {
  recordAssociationCreated,
  recordAssociationDeleted,
  recordAssociationUpdated
} from '@main/features/audit'
import {
  PLACEHOLDER_DISTRICT_ID,
  UNKNOWN_ASSOCIATION_ID
} from '@main/shared/database/reference-seed-ids'
import { getDatabase, runInTransaction } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

/** External or federation identifier stored for an association. */
export type AssociationIdentifierInput = {
  type: string
  value: string
  authority?: string | null
}

/** Postal address stored for an association. */
export type AssociationAddressInput = {
  street?: string | null
  houseNumber?: string | null
  postalCode?: string | null
  city?: string | null
  countryCode?: string | null
  addressType: string
}

/** Contact channel stored for an association. */
export type AssociationContactInput = {
  contactType: string
  value: string
  label?: string | null
  isPublic?: boolean
}

/** Input for creating an association record. */
export type CreateAssociationInput = {
  name: string
  shortName?: string | null
  city?: string | null
  website?: string | null
  isActive?: boolean
  source?: string | null
  identifiers?: AssociationIdentifierInput[]
  addresses?: AssociationAddressInput[]
  contacts?: AssociationContactInput[]
}

/** Partial input for updating an association record. */
export type UpdateAssociationInput = {
  name?: string
  shortName?: string | null
  city?: string | null
  website?: string | null
  isActive?: boolean
  identifiers?: AssociationIdentifierInput[]
  addresses?: AssociationAddressInput[]
  contacts?: AssociationContactInput[]
}

/** Persisted association row returned by repository queries. */
export type AssociationRecord = {
  id: string
  name: string
  shortName: string | null
  city: string | null
  website: string | null
  isActive: boolean
  source: string | null
  createdAt: string
  districtName: string
  districtShortName: string | null
  regionalFederationName: string
  regionalFederationShortName: string | null
  federationName: string
  federationShortName: string | null
  countryName: string
  identifiers: Array<{
    type: string
    value: string
    authority: string | null
  }>
  addresses: Array<{
    street: string | null
    houseNumber: string | null
    postalCode: string | null
    city: string | null
    countryCode: string | null
    addressType: string
  }>
  contacts: Array<{
    contactType: string
    value: string
    label: string | null
    isPublic: boolean
  }>
}

type AssociationHeaderRow = {
  id: string
  name: string
  shortName: string | null
  city: string | null
  website: string | null
  isActive: number
  source: string | null
  createdAt: string
  districtName: string
  districtShortName: string | null
  regionalFederationName: string
  regionalFederationShortName: string | null
  federationName: string
  federationShortName: string | null
  countryName: string
}

const ASSOCIATION_SELECT = `
  SELECT
    a.id,
    a.name,
    a.short_name AS shortName,
    a.city,
    a.website,
    a.is_active AS isActive,
    a.source,
    a.created_at AS createdAt,
    d.name AS districtName,
    d.short_name AS districtShortName,
    rf.name AS regionalFederationName,
    rf.short_name AS regionalFederationShortName,
    f.name AS federationName,
    f.short_name AS federationShortName,
    c.name AS countryName
  FROM associations a
  JOIN districts d ON d.id = a.district_id
  JOIN regional_federations rf ON rf.id = d.regional_federation_id
  JOIN federations f ON f.id = rf.federation_id
  JOIN countries c ON c.id = f.country_id
`

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) {
    return null
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

function normalizeRequiredName(value: string, fieldLabel: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error(`${fieldLabel} must not be empty`)
  }

  return trimmed
}

const ASSOCIATION_NUMBER_TYPE = 'djb_association_number'
const HEADQUARTERS_ADDRESS_TYPE = 'primary'
const EMAIL_CONTACT_TYPE = 'email'

function assertRequiredAssociationDetails(input: {
  identifiers: AssociationIdentifierInput[]
  addresses: AssociationAddressInput[]
  contacts: AssociationContactInput[]
}): void {
  const associationNumber = input.identifiers.find(
    (identifier) => identifier.type === ASSOCIATION_NUMBER_TYPE && identifier.value.trim()
  )

  if (!associationNumber) {
    throw new Error('Association number must not be empty')
  }

  const headquarters = input.addresses.find(
    (address) => address.addressType === HEADQUARTERS_ADDRESS_TYPE
  )

  if (
    !headquarters ||
    !normalizeOptionalText(headquarters.street) ||
    !normalizeOptionalText(headquarters.houseNumber) ||
    !normalizeOptionalText(headquarters.postalCode) ||
    !normalizeOptionalText(headquarters.city)
  ) {
    throw new Error('Headquarters address must not be empty')
  }

  const email = input.contacts.find(
    (contact) => contact.contactType === EMAIL_CONTACT_TYPE && contact.value.trim()
  )

  if (!email) {
    throw new Error('Email must not be empty')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    throw new Error('Email is invalid')
  }
}

function replaceAssociationChildren(
  db: Database,
  associationId: string,
  input: {
    identifiers?: AssociationIdentifierInput[]
    addresses?: AssociationAddressInput[]
    contacts?: AssociationContactInput[]
  }
): void {
  if (input.identifiers !== undefined) {
    db.prepare(`DELETE FROM association_identifiers WHERE association_id = ?`).run(associationId)

    const insertIdentifier = db.prepare(
      `
      INSERT INTO association_identifiers (id, association_id, type, value, authority)
      VALUES (?, ?, ?, ?, ?)
    `
    )

    for (const identifier of input.identifiers) {
      const type = normalizeRequiredName(identifier.type, 'Identifier type')
      const value = normalizeRequiredName(identifier.value, 'Identifier value')

      insertIdentifier.run(
        randomUUID(),
        associationId,
        type,
        value,
        normalizeOptionalText(identifier.authority)
      )
    }
  }

  if (input.addresses !== undefined) {
    db.prepare(`DELETE FROM association_addresses WHERE association_id = ?`).run(associationId)

    const insertAddress = db.prepare(
      `
      INSERT INTO association_addresses (
        id, association_id, street, house_number, postal_code, city, country_code, address_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    )

    for (const address of input.addresses) {
      insertAddress.run(
        randomUUID(),
        associationId,
        normalizeOptionalText(address.street),
        normalizeOptionalText(address.houseNumber),
        normalizeOptionalText(address.postalCode),
        normalizeOptionalText(address.city),
        normalizeOptionalText(address.countryCode),
        normalizeRequiredName(address.addressType, 'Address type')
      )
    }
  }

  if (input.contacts !== undefined) {
    db.prepare(`DELETE FROM association_contacts WHERE association_id = ?`).run(associationId)

    const insertContact = db.prepare(
      `
      INSERT INTO association_contacts (
        id, association_id, contact_type, value, label, is_public
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `
    )

    for (const contact of input.contacts) {
      insertContact.run(
        randomUUID(),
        associationId,
        normalizeRequiredName(contact.contactType, 'Contact type'),
        normalizeRequiredName(contact.value, 'Contact value'),
        normalizeOptionalText(contact.label),
        contact.isPublic === true ? 1 : 0
      )
    }
  }
}

function loadIdentifiers(db: Database, associationId: string): AssociationRecord['identifiers'] {
  return db
    .prepare(
      `
      SELECT type, value, authority
      FROM association_identifiers
      WHERE association_id = ?
      ORDER BY type, value
    `
    )
    .all(associationId) as AssociationRecord['identifiers']
}

function loadAddresses(db: Database, associationId: string): AssociationRecord['addresses'] {
  return db
    .prepare(
      `
      SELECT
        street,
        house_number AS houseNumber,
        postal_code AS postalCode,
        city,
        country_code AS countryCode,
        address_type AS addressType
      FROM association_addresses
      WHERE association_id = ?
      ORDER BY address_type, city
    `
    )
    .all(associationId) as AssociationRecord['addresses']
}

function loadContacts(db: Database, associationId: string): AssociationRecord['contacts'] {
  const rows = db
    .prepare(
      `
      SELECT
        contact_type AS contactType,
        value,
        label,
        is_public AS isPublic
      FROM association_contacts
      WHERE association_id = ?
      ORDER BY contact_type, value
    `
    )
    .all(associationId) as Array<{
    contactType: string
    value: string
    label: string | null
    isPublic: number
  }>

  return rows.map((row) => ({
    contactType: row.contactType,
    value: row.value,
    label: row.label,
    isPublic: row.isPublic === 1
  }))
}

function mapAssociationHeader(row: AssociationHeaderRow, db: Database): AssociationRecord {
  return {
    id: row.id,
    name: row.name,
    shortName: row.shortName,
    city: row.city,
    website: row.website,
    isActive: row.isActive === 1,
    source: row.source,
    createdAt: row.createdAt,
    districtName: row.districtName,
    districtShortName: row.districtShortName,
    regionalFederationName: row.regionalFederationName,
    regionalFederationShortName: row.regionalFederationShortName,
    federationName: row.federationName,
    federationShortName: row.federationShortName,
    countryName: row.countryName,
    identifiers: loadIdentifiers(db, row.id),
    addresses: loadAddresses(db, row.id),
    contacts: loadContacts(db, row.id)
  }
}

function getAssociationById(associationId: string): AssociationRecord | null {
  const db = getDatabase()
  const row = db.prepare(`${ASSOCIATION_SELECT} WHERE a.id = ?`).get(associationId) as
    AssociationHeaderRow | undefined

  if (!row) {
    return null
  }

  return mapAssociationHeader(row, db)
}

function assertNotSeedAssociation(association: AssociationRecord): void {
  if (association.id === UNKNOWN_ASSOCIATION_ID || association.source === 'seed') {
    throw new Error('Seed association cannot be modified')
  }
}

/**
 * Lists associations for the overview, excluding the seeded Unknown placeholder.
 *
 * @returns Association records ordered newest-first.
 */
export function getAssociations(): AssociationRecord[] {
  return withDbErrorLogging('associations', 'list', () => {
    const db = getDatabase()
    const rows = db
      .prepare(
        `
        ${ASSOCIATION_SELECT}
        WHERE IFNULL(a.source, '') != 'seed'
        ORDER BY a.created_at DESC
      `
      )
      .all() as AssociationHeaderRow[]

    return rows.map((row) => mapAssociationHeader(row, db))
  })
}

/**
 * Returns a single association by id, including the seeded Unknown row.
 *
 * @param associationId - Association identifier.
 * @returns Association record, or `null` when missing.
 */
export function getAssociation(associationId: string): AssociationRecord | null {
  return withDbErrorLogging('associations', 'get', () => getAssociationById(associationId))
}

/**
 * Creates an association with optional child rows and records an audit event.
 *
 * @param actorUserId - User performing the action.
 * @param input - Association fields and nested child collections.
 * @returns The persisted association record.
 */
export function addAssociation(
  actorUserId: string,
  input: CreateAssociationInput
): AssociationRecord {
  const name = normalizeRequiredName(input.name, 'Association name')
  const identifiers = input.identifiers ?? []
  const addresses = input.addresses ?? []
  const contacts = input.contacts ?? []

  assertRequiredAssociationDetails({ identifiers, addresses, contacts })

  const db = getDatabase()

  return withDbErrorLogging('associations', 'create', () => {
    const associationId = randomUUID()

    runInTransaction(db, () => {
      db.prepare(
        `
        INSERT INTO associations (
          id, district_id, name, short_name, city, website, is_active, source
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      ).run(
        associationId,
        PLACEHOLDER_DISTRICT_ID,
        name,
        normalizeOptionalText(input.shortName),
        normalizeOptionalText(input.city),
        normalizeOptionalText(input.website),
        input.isActive === false ? 0 : 1,
        normalizeOptionalText(input.source) ?? 'manual'
      )

      replaceAssociationChildren(db, associationId, {
        identifiers,
        addresses,
        contacts
      })

      recordAssociationCreated({ actorUserId, associationId })
    })

    const association = getAssociationById(associationId)

    if (!association) {
      throw new Error('Association not found')
    }

    return association
  })
}

/**
 * Updates an association and optionally replaces child collections.
 *
 * @param actorUserId - User performing the action.
 * @param associationId - Association identifier to update.
 * @param input - Fields to change.
 * @returns The updated association record.
 */
export function updateAssociation(
  actorUserId: string,
  associationId: string,
  input: UpdateAssociationInput
): AssociationRecord {
  const existing = getAssociationById(associationId)

  if (!existing) {
    throw new Error('Association not found')
  }

  assertNotSeedAssociation(existing)

  const nextName =
    input.name !== undefined ? normalizeRequiredName(input.name, 'Association name') : existing.name
  const nextShortName =
    input.shortName !== undefined ? normalizeOptionalText(input.shortName) : existing.shortName
  const nextCity = input.city !== undefined ? normalizeOptionalText(input.city) : existing.city
  const nextWebsite =
    input.website !== undefined ? normalizeOptionalText(input.website) : existing.website
  const nextIsActive = input.isActive !== undefined ? input.isActive : existing.isActive

  const nextIdentifiers =
    input.identifiers !== undefined
      ? input.identifiers
      : existing.identifiers.map((identifier) => ({
          type: identifier.type,
          value: identifier.value,
          authority: identifier.authority
        }))
  const nextAddresses =
    input.addresses !== undefined
      ? input.addresses
      : existing.addresses.map((address) => ({
          street: address.street,
          houseNumber: address.houseNumber,
          postalCode: address.postalCode,
          city: address.city,
          countryCode: address.countryCode,
          addressType: address.addressType
        }))
  const nextContacts =
    input.contacts !== undefined
      ? input.contacts
      : existing.contacts.map((contact) => ({
          contactType: contact.contactType,
          value: contact.value,
          label: contact.label,
          isPublic: contact.isPublic
        }))

  assertRequiredAssociationDetails({
    identifiers: nextIdentifiers,
    addresses: nextAddresses,
    contacts: nextContacts
  })

  const changedFields: string[] = []

  if (nextName !== existing.name) {
    changedFields.push('name')
  }

  if (nextShortName !== existing.shortName) {
    changedFields.push('short_name')
  }

  if (nextCity !== existing.city) {
    changedFields.push('city')
  }

  if (nextWebsite !== existing.website) {
    changedFields.push('website')
  }

  if (nextIsActive !== existing.isActive) {
    changedFields.push('is_active')
  }

  if (input.identifiers !== undefined) {
    changedFields.push('identifiers')
  }

  if (input.addresses !== undefined) {
    changedFields.push('addresses')
  }

  if (input.contacts !== undefined) {
    changedFields.push('contacts')
  }

  if (changedFields.length === 0) {
    return existing
  }

  const db = getDatabase()

  return withDbErrorLogging('associations', 'update', () => {
    runInTransaction(db, () => {
      db.prepare(
        `
        UPDATE associations
        SET
          district_id = ?,
          name = ?,
          short_name = ?,
          city = ?,
          website = ?,
          is_active = ?
        WHERE id = ?
      `
      ).run(
        PLACEHOLDER_DISTRICT_ID,
        nextName,
        nextShortName,
        nextCity,
        nextWebsite,
        nextIsActive ? 1 : 0,
        associationId
      )

      replaceAssociationChildren(db, associationId, {
        identifiers: input.identifiers,
        addresses: input.addresses,
        contacts: input.contacts
      })

      recordAssociationUpdated({
        actorUserId,
        associationId,
        changedFields
      })
    })

    const association = getAssociationById(associationId)

    if (!association) {
      throw new Error('Association not found')
    }

    return association
  })
}

/**
 * Deletes an association when it is not referenced by competitors.
 *
 * @param actorUserId - User performing the action.
 * @param associationId - Association identifier to delete.
 */
export function deleteAssociation(actorUserId: string, associationId: string): void {
  const existing = getAssociationById(associationId)

  if (!existing) {
    throw new Error('Association not found')
  }

  assertNotSeedAssociation(existing)

  const db = getDatabase()

  withDbErrorLogging('associations', 'delete', () => {
    runInTransaction(db, () => {
      const competitorCount = db
        .prepare(`SELECT COUNT(*) AS count FROM competitors WHERE association_id = ?`)
        .get(associationId) as { count: number }

      if (competitorCount.count > 0) {
        throw new Error('Association is referenced by competitors')
      }

      db.prepare(`DELETE FROM associations WHERE id = ?`).run(associationId)

      recordAssociationDeleted({ actorUserId, associationId })
    })
  })
}
