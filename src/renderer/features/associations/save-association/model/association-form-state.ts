/** Address fields matching `club_addresses` columns (except id/club_id/type). */
export type ClubAddressFormFields = {
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

/** Website protocol prefix stored separately from the host path. */
export type ClubWebsiteProtocol = 'http://' | 'https://'

/** Editable club fields for the save form. */
export type ClubFormState = {
  name: string
  shortName: string
  websiteProtocol: ClubWebsiteProtocol
  websiteHost: string
  isActive: boolean
  districtName: string
  countryName: string
  associationName: string
  associationShortName: string
  regionalAssociationName: string
  regionalAssociationShortName: string
  districtShortName: string
  clubNumber: string
  headquarters: ClubAddressFormFields
  trainingVenue: ClubAddressFormFields
  billingAddress: ClubAddressFormFields
  trainingVenueSameAsHeadquarters: boolean
  billingAddressSameAsHeadquarters: boolean
  email: string
  phoneCountryCode: string
  phoneNumber: string
}

/** Default federation hierarchy used when creating clubs without SQLite wiring. */
export const DEFAULT_CLUB_HIERARCHY = {
  countryName: 'Germany',
  associationName: 'German Judo Federation',
  associationShortName: 'DJB',
  regionalAssociationName: 'Placeholder Regional Association',
  regionalAssociationShortName: '',
  districtName: '',
  districtShortName: ''
} as const

/**
 * Creates empty address fields for one address type.
 *
 * @returns Blank street/house number/postal code/city values.
 */
export function createEmptyAddressFields(): ClubAddressFormFields {
  return {
    street: '',
    houseNumber: '',
    postalCode: '',
    city: ''
  }
}

/**
 * Creates an empty club form state.
 *
 * @returns Initial form values for a new club.
 */
export function createEmptyClubForm(): ClubFormState {
  return {
    name: '',
    shortName: '',
    websiteProtocol: 'https://',
    websiteHost: '',
    isActive: true,
    districtName: DEFAULT_CLUB_HIERARCHY.districtName,
    countryName: DEFAULT_CLUB_HIERARCHY.countryName,
    associationName: DEFAULT_CLUB_HIERARCHY.associationName,
    associationShortName: DEFAULT_CLUB_HIERARCHY.associationShortName,
    regionalAssociationName: DEFAULT_CLUB_HIERARCHY.regionalAssociationName,
    regionalAssociationShortName: DEFAULT_CLUB_HIERARCHY.regionalAssociationShortName,
    districtShortName: DEFAULT_CLUB_HIERARCHY.districtShortName,
    clubNumber: '',
    headquarters: createEmptyAddressFields(),
    trainingVenue: createEmptyAddressFields(),
    billingAddress: createEmptyAddressFields(),
    trainingVenueSameAsHeadquarters: false,
    billingAddressSameAsHeadquarters: false,
    email: '',
    phoneCountryCode: '+49',
    phoneNumber: ''
  }
}
