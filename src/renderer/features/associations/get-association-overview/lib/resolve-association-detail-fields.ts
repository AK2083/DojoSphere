import type { ClubAddress, ClubContact, ClubIdentifier, ClubOverviewRow } from '../model/club-row'
import { formatClubAddress } from './format-club-address'

/** Identifier type used for the federation club number (Vereinsnummer). */
export const CLUB_NUMBER_IDENTIFIER_TYPE = 'djb_club_number'

/** Known address types shown on the club card. */
export const CLUB_ADDRESS_TYPES = {
  headquarters: 'primary',
  trainingVenue: 'training',
  billing: 'billing'
} as const

/** Known contact types shown on the club card. */
export const CLUB_CONTACT_TYPES = {
  email: 'email',
  phone: 'phone'
} as const

/**
 * Resolves the club number (Vereinsnummer) from club identifiers.
 *
 * @param identifiers - Identifier rows for the club.
 * @returns Club number value, or `null` when missing.
 */
export function resolveClubNumber(identifiers: ClubIdentifier[]): string | null {
  const clubNumber = identifiers.find(
    (identifier) => identifier.type === CLUB_NUMBER_IDENTIFIER_TYPE
  )?.value

  return clubNumber?.trim() ? clubNumber.trim() : null
}

/**
 * Finds the first address of a given type and formats it for display.
 *
 * @param addresses - Address rows for the club.
 * @param addressType - Address type token (`primary`, `training`, `billing`).
 * @returns Formatted address, or `null` when missing.
 */
export function resolveClubAddressByType(
  addresses: ClubAddress[],
  addressType: string
): string | null {
  const address = addresses.find((entry) => entry.addressType === addressType)

  if (!address) {
    return null
  }

  const formatted = formatClubAddress(address)

  return formatted.length > 0 ? formatted : null
}

/**
 * Finds the first contact value of a given type.
 *
 * @param contacts - Contact rows for the club.
 * @param contactType - Contact type token (`email`, `phone`).
 * @returns Contact value, or `null` when missing.
 */
export function resolveClubContactByType(
  contacts: ClubContact[],
  contactType: string
): string | null {
  const contact = contacts.find((entry) => entry.contactType === contactType)?.value

  return contact?.trim() ? contact.trim() : null
}

/**
 * Builds detail field values for a club card from typed child collections.
 *
 * @param club - Club overview row.
 * @returns Resolved Vereinsnummer, address, and contact display values.
 */
export function resolveClubDetailFields(
  club: Pick<ClubOverviewRow, 'identifiers' | 'addresses' | 'contacts'>
): {
  clubNumber: string | null
  headquarters: string | null
  trainingVenue: string | null
  billingAddress: string | null
  email: string | null
  phone: string | null
} {
  return {
    clubNumber: resolveClubNumber(club.identifiers),
    headquarters: resolveClubAddressByType(club.addresses, CLUB_ADDRESS_TYPES.headquarters),
    trainingVenue: resolveClubAddressByType(club.addresses, CLUB_ADDRESS_TYPES.trainingVenue),
    billingAddress: resolveClubAddressByType(club.addresses, CLUB_ADDRESS_TYPES.billing),
    email: resolveClubContactByType(club.contacts, CLUB_CONTACT_TYPES.email),
    phone: resolveClubContactByType(club.contacts, CLUB_CONTACT_TYPES.phone)
  }
}
