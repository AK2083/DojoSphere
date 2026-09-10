/** Address fields matching `association_addresses` columns (except id/association_id/type). */
export type AssociationAddressFormFields = {
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

/** Website protocol prefix stored separately from the host path. */
export type AssociationWebsiteProtocol = 'http://' | 'https://'

/** Editable association fields for the save form. */
export type AssociationFormState = {
  name: string
  shortName: string
  websiteProtocol: AssociationWebsiteProtocol
  websiteHost: string
  isActive: boolean
  districtName: string
  countryName: string
  federationName: string
  federationShortName: string
  regionalFederationName: string
  regionalFederationShortName: string
  districtShortName: string
  associationNumber: string
  headquarters: AssociationAddressFormFields
  trainingVenue: AssociationAddressFormFields
  billingAddress: AssociationAddressFormFields
  trainingVenueSameAsHeadquarters: boolean
  billingAddressSameAsHeadquarters: boolean
  email: string
  phoneCountryCode: string
  phoneNumber: string
}

/** Default federation hierarchy used when creating associations without SQLite wiring. */
export const DEFAULT_ASSOCIATION_HIERARCHY = {
  countryName: 'Germany',
  federationName: 'German Judo Federation',
  federationShortName: 'DJB',
  regionalFederationName: 'Placeholder Regional Federation',
  regionalFederationShortName: '',
  districtName: '',
  districtShortName: ''
} as const

/**
 * Creates empty address fields for one address type.
 *
 * @returns Blank street/house number/postal code/city values.
 */
export function createEmptyAddressFields(): AssociationAddressFormFields {
  return {
    street: '',
    houseNumber: '',
    postalCode: '',
    city: ''
  }
}

/**
 * Creates an empty association form state.
 *
 * @returns Initial form values for a new association.
 */
export function createEmptyAssociationForm(): AssociationFormState {
  return {
    name: '',
    shortName: '',
    websiteProtocol: 'https://',
    websiteHost: '',
    isActive: true,
    districtName: DEFAULT_ASSOCIATION_HIERARCHY.districtName,
    countryName: DEFAULT_ASSOCIATION_HIERARCHY.countryName,
    federationName: DEFAULT_ASSOCIATION_HIERARCHY.federationName,
    federationShortName: DEFAULT_ASSOCIATION_HIERARCHY.federationShortName,
    regionalFederationName: DEFAULT_ASSOCIATION_HIERARCHY.regionalFederationName,
    regionalFederationShortName: DEFAULT_ASSOCIATION_HIERARCHY.regionalFederationShortName,
    districtShortName: DEFAULT_ASSOCIATION_HIERARCHY.districtShortName,
    associationNumber: '',
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
