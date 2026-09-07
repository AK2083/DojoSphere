/** External or federation identifier shown on a club card. */
export type ClubIdentifier = {
  type: string
  value: string
  authority: string | null
}

/** Postal address linked to a club. */
export type ClubAddress = {
  street: string | null
  houseNumber: string | null
  postalCode: string | null
  city: string | null
  countryCode: string | null
  addressType: string
}

/** Contact channel linked to a club. */
export type ClubContact = {
  contactType: string
  value: string
  label: string | null
  isPublic: boolean
}

/**
 * Club row shaped for the clubs overview cards.
 *
 * Mirrors the clubs schema hierarchy and child tables without requiring IPC yet.
 */
export type ClubOverviewRow = {
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
  regionalAssociationName: string
  regionalAssociationShortName: string | null
  associationName: string
  associationShortName: string | null
  countryName: string
  identifiers: ClubIdentifier[]
  addresses: ClubAddress[]
  contacts: ClubContact[]
}
