import type { ClubAddress } from '../model/club-row'

/**
 * Formats a club address into a single display line.
 *
 * @param address - Address fields from the club row.
 * @returns Human-readable address, or an empty string when all fields are blank.
 */
export function formatClubAddress(address: ClubAddress): string {
  const streetLine = [address.street, address.houseNumber]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')
    .trim()

  const cityLine = [address.postalCode, address.city]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')
    .trim()

  const parts = [streetLine, cityLine, address.countryCode?.trim() ?? ''].filter(
    (part) => part.length > 0
  )

  return parts.join(', ')
}
