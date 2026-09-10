/** External or federation identifier shown on a association card. */
export type AssociationIdentifier = {
  type: string
  value: string
  authority: string | null
}

/** Postal address linked to a association. */
export type AssociationAddress = {
  street: string | null
  houseNumber: string | null
  postalCode: string | null
  city: string | null
  countryCode: string | null
  addressType: string
}

/** Contact channel linked to a association. */
export type AssociationContact = {
  contactType: string
  value: string
  label: string | null
  isPublic: boolean
}

/**
 * Association row shaped for the associations overview cards.
 *
 * Mirrors the associations schema hierarchy and child tables without requiring IPC yet.
 */
export type AssociationOverviewRow = {
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
  identifiers: AssociationIdentifier[]
  addresses: AssociationAddress[]
  contacts: AssociationContact[]
}
