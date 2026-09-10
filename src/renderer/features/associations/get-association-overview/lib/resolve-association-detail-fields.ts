import type {
  AssociationAddress,
  AssociationContact,
  AssociationIdentifier,
  AssociationOverviewRow
} from '../model/association-row'
import { formatAssociationAddress } from './format-association-address'

/** Identifier type used for the federation association number (Vereinsnummer). */
export const ASSOCIATION_NUMBER_IDENTIFIER_TYPE = 'djb_association_number'

/** Known address types shown on the association card. */
export const ASSOCIATION_ADDRESS_TYPES = {
  headquarters: 'primary',
  trainingVenue: 'training',
  billing: 'billing'
} as const

/** Known contact types shown on the association card. */
export const ASSOCIATION_CONTACT_TYPES = {
  email: 'email',
  phone: 'phone'
} as const

/**
 * Resolves the association number (Vereinsnummer) from association identifiers.
 *
 * @param identifiers - Identifier rows for the association.
 * @returns Association number value, or `null` when missing.
 */
export function resolveAssociationNumber(identifiers: AssociationIdentifier[]): string | null {
  const associationNumber = identifiers.find(
    (identifier) => identifier.type === ASSOCIATION_NUMBER_IDENTIFIER_TYPE
  )?.value

  return associationNumber?.trim() ? associationNumber.trim() : null
}

/**
 * Finds the first address of a given type and formats it for display.
 *
 * @param addresses - Address rows for the association.
 * @param addressType - Address type token (`primary`, `training`, `billing`).
 * @returns Formatted address, or `null` when missing.
 */
export function resolveAssociationAddressByType(
  addresses: AssociationAddress[],
  addressType: string
): string | null {
  const address = addresses.find((entry) => entry.addressType === addressType)

  if (!address) {
    return null
  }

  const formatted = formatAssociationAddress(address)

  return formatted.length > 0 ? formatted : null
}

/**
 * Finds the first contact value of a given type.
 *
 * @param contacts - Contact rows for the association.
 * @param contactType - Contact type token (`email`, `phone`).
 * @returns Contact value, or `null` when missing.
 */
export function resolveAssociationContactByType(
  contacts: AssociationContact[],
  contactType: string
): string | null {
  const contact = contacts.find((entry) => entry.contactType === contactType)?.value

  return contact?.trim() ? contact.trim() : null
}

/**
 * Builds detail field values for a association card from typed child collections.
 *
 * @param association - Association overview row.
 * @returns Resolved Vereinsnummer, address, and contact display values.
 */
export function resolveAssociationDetailFields(
  association: Pick<AssociationOverviewRow, 'identifiers' | 'addresses' | 'contacts'>
): {
  associationNumber: string | null
  headquarters: string | null
  trainingVenue: string | null
  billingAddress: string | null
  email: string | null
  phone: string | null
} {
  return {
    associationNumber: resolveAssociationNumber(association.identifiers),
    headquarters: resolveAssociationAddressByType(
      association.addresses,
      ASSOCIATION_ADDRESS_TYPES.headquarters
    ),
    trainingVenue: resolveAssociationAddressByType(
      association.addresses,
      ASSOCIATION_ADDRESS_TYPES.trainingVenue
    ),
    billingAddress: resolveAssociationAddressByType(
      association.addresses,
      ASSOCIATION_ADDRESS_TYPES.billing
    ),
    email: resolveAssociationContactByType(association.contacts, ASSOCIATION_CONTACT_TYPES.email),
    phone: resolveAssociationContactByType(association.contacts, ASSOCIATION_CONTACT_TYPES.phone)
  }
}
