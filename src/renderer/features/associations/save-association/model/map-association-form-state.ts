import {
  ASSOCIATION_ADDRESS_TYPES,
  ASSOCIATION_CONTACT_TYPES,
  ASSOCIATION_NUMBER_IDENTIFIER_TYPE
} from '../../get-association-overview/lib/resolve-association-detail-fields'
import type {
  AssociationAddress,
  AssociationContact,
  AssociationOverviewRow
} from '../../get-association-overview/model/association-row'
import { joinPhoneCountryCode, splitPhoneCountryCode } from '../lib/phone-country-codes'
import {
  type AssociationAddressFormFields,
  type AssociationFormState,
  type AssociationWebsiteProtocol,
  createEmptyAddressFields,
  createEmptyAssociationForm
} from './association-form-state'

function optionalText(value: string): string | null {
  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

function cloneAddressFields(fields: AssociationAddressFormFields): AssociationAddressFormFields {
  return {
    street: fields.street,
    houseNumber: fields.houseNumber,
    postalCode: fields.postalCode,
    city: fields.city
  }
}

function addressHasValues(fields: AssociationAddressFormFields): boolean {
  return Boolean(
    optionalText(fields.street) ||
    optionalText(fields.houseNumber) ||
    optionalText(fields.postalCode) ||
    optionalText(fields.city)
  )
}

function addressFromFormFields(
  addressType: string,
  fields: AssociationAddressFormFields
): AssociationAddress | null {
  if (!addressHasValues(fields)) {
    return null
  }

  return {
    street: optionalText(fields.street),
    houseNumber: optionalText(fields.houseNumber),
    postalCode: optionalText(fields.postalCode),
    city: optionalText(fields.city),
    countryCode: null,
    addressType
  }
}

function addressToFormFields(
  address: AssociationAddress | undefined
): AssociationAddressFormFields {
  if (!address) {
    return createEmptyAddressFields()
  }

  return {
    street: address.street ?? '',
    houseNumber: address.houseNumber ?? '',
    postalCode: address.postalCode ?? '',
    city: address.city ?? ''
  }
}

function addressFieldsEqual(
  left: AssociationAddressFormFields,
  right: AssociationAddressFormFields
): boolean {
  return (
    left.street.trim() === right.street.trim() &&
    left.houseNumber.trim() === right.houseNumber.trim() &&
    left.postalCode.trim() === right.postalCode.trim() &&
    left.city.trim() === right.city.trim()
  )
}

/**
 * Copies headquarters address fields into another address block.
 *
 * @param headquarters - Source headquarters fields.
 * @returns Independent address copy.
 */
export function copyHeadquartersAddress(
  headquarters: AssociationAddressFormFields
): AssociationAddressFormFields {
  return cloneAddressFields(headquarters)
}

function findAddress(
  addresses: AssociationAddress[],
  addressType: string
): AssociationAddress | undefined {
  return addresses.find((entry) => entry.addressType === addressType)
}

/**
 * Splits a stored website URL into protocol prefix and host path.
 *
 * @param website - Full website URL or empty.
 * @returns Protocol and host/path for the form controls.
 */
export function splitWebsite(website: string | null): {
  websiteProtocol: AssociationWebsiteProtocol
  websiteHost: string
} {
  const trimmed = website?.trim() ?? ''

  if (trimmed.startsWith('http://')) {
    return {
      websiteProtocol: 'http://',
      websiteHost: trimmed.slice('http://'.length)
    }
  }

  if (trimmed.startsWith('https://')) {
    return {
      websiteProtocol: 'https://',
      websiteHost: trimmed.slice('https://'.length)
    }
  }

  return {
    websiteProtocol: 'https://',
    websiteHost: trimmed
  }
}

/**
 * Joins protocol prefix and host path into a full website URL.
 *
 * @param protocol - `http://` or `https://`.
 * @param host - Host and optional path without protocol.
 * @returns Full URL, or `null` when host is blank.
 */
export function joinWebsite(protocol: AssociationWebsiteProtocol, host: string): string | null {
  const trimmedHost = host.trim().replace(/^\/+/, '')

  if (!trimmedHost) {
    return null
  }

  return `${protocol}${trimmedHost}`
}

/**
 * Maps a stored association row into editable form fields.
 *
 * @param association - Association overview row from the store.
 * @returns Form state for the association editor.
 */
export function mapAssociationToFormState(
  association: AssociationOverviewRow
): AssociationFormState {
  const website = splitWebsite(association.website)
  const phoneValue =
    association.contacts.find((contact) => contact.contactType === ASSOCIATION_CONTACT_TYPES.phone)
      ?.value ?? ''
  const phone = splitPhoneCountryCode(phoneValue)
  const associationNumber =
    association.identifiers.find(
      (identifier) => identifier.type === ASSOCIATION_NUMBER_IDENTIFIER_TYPE
    )?.value ?? ''
  const headquarters = addressToFormFields(
    findAddress(association.addresses, ASSOCIATION_ADDRESS_TYPES.headquarters)
  )
  const trainingVenue = addressToFormFields(
    findAddress(association.addresses, ASSOCIATION_ADDRESS_TYPES.trainingVenue)
  )
  const billingAddress = addressToFormFields(
    findAddress(association.addresses, ASSOCIATION_ADDRESS_TYPES.billing)
  )
  const trainingVenueSameAsHeadquarters =
    addressHasValues(headquarters) && addressFieldsEqual(headquarters, trainingVenue)
  const billingAddressSameAsHeadquarters =
    addressHasValues(headquarters) && addressFieldsEqual(headquarters, billingAddress)

  return {
    name: association.name,
    shortName: association.shortName ?? '',
    websiteProtocol: website.websiteProtocol,
    websiteHost: website.websiteHost,
    isActive: association.isActive,
    districtName: association.districtName,
    countryName: association.countryName,
    federationName: association.federationName,
    federationShortName: association.federationShortName ?? '',
    regionalFederationName: association.regionalFederationName,
    regionalFederationShortName: association.regionalFederationShortName ?? '',
    districtShortName: association.districtShortName ?? '',
    associationNumber,
    headquarters,
    trainingVenue,
    billingAddress,
    trainingVenueSameAsHeadquarters,
    billingAddressSameAsHeadquarters,
    email:
      association.contacts.find(
        (contact) => contact.contactType === ASSOCIATION_CONTACT_TYPES.email
      )?.value ?? '',
    phoneCountryCode: phone.phoneCountryCode,
    phoneNumber: phone.phoneNumber
  }
}

/**
 * Maps form fields into a association overview row for store persistence.
 *
 * @param fields - Current form values.
 * @param options - Existing id/source/createdAt when editing.
 * @param options.id
 * @param options.source
 * @param options.createdAt
 * @returns Association row ready for the in-memory store.
 */
export function mapFormStateToAssociation(
  fields: AssociationFormState,
  options: {
    id: string
    source: string | null
    createdAt: string
  }
): AssociationOverviewRow {
  const trainingVenueFields = fields.trainingVenueSameAsHeadquarters
    ? fields.headquarters
    : fields.trainingVenue
  const billingAddressFields = fields.billingAddressSameAsHeadquarters
    ? fields.headquarters
    : fields.billingAddress

  const addresses = [
    addressFromFormFields(ASSOCIATION_ADDRESS_TYPES.headquarters, fields.headquarters),
    addressFromFormFields(ASSOCIATION_ADDRESS_TYPES.trainingVenue, trainingVenueFields),
    addressFromFormFields(ASSOCIATION_ADDRESS_TYPES.billing, billingAddressFields)
  ].filter((address): address is AssociationAddress => address != null)

  const contacts: AssociationContact[] = []
  const email = optionalText(fields.email)
  const phone = joinPhoneCountryCode(fields.phoneCountryCode, fields.phoneNumber)

  if (email) {
    contacts.push({
      contactType: ASSOCIATION_CONTACT_TYPES.email,
      value: email,
      label: null,
      isPublic: true
    })
  }

  if (phone) {
    contacts.push({
      contactType: ASSOCIATION_CONTACT_TYPES.phone,
      value: phone,
      label: null,
      isPublic: false
    })
  }

  const associationNumber = optionalText(fields.associationNumber)
  const headquartersCity = optionalText(fields.headquarters.city)

  return {
    id: options.id,
    name: fields.name.trim(),
    shortName: optionalText(fields.shortName),
    city: headquartersCity,
    website: joinWebsite(fields.websiteProtocol, fields.websiteHost),
    isActive: fields.isActive,
    source: options.source,
    createdAt: options.createdAt,
    districtName: fields.districtName.trim(),
    districtShortName: optionalText(fields.districtShortName),
    regionalFederationName:
      fields.regionalFederationName.trim() || createEmptyAssociationForm().regionalFederationName,
    regionalFederationShortName: optionalText(fields.regionalFederationShortName),
    federationName: fields.federationName.trim() || createEmptyAssociationForm().federationName,
    federationShortName: optionalText(fields.federationShortName),
    countryName: fields.countryName.trim() || createEmptyAssociationForm().countryName,
    identifiers: associationNumber
      ? [
          {
            type: ASSOCIATION_NUMBER_IDENTIFIER_TYPE,
            value: associationNumber,
            authority: 'DJB'
          }
        ]
      : [],
    addresses,
    contacts
  }
}

/**
 * Deep-clones association form state including nested address objects.
 *
 * @param fields - Form state to clone.
 * @returns Independent copy safe for reset snapshots.
 */
export function cloneAssociationFormState(fields: AssociationFormState): AssociationFormState {
  return {
    ...fields,
    headquarters: cloneAddressFields(fields.headquarters),
    trainingVenue: cloneAddressFields(fields.trainingVenue),
    billingAddress: cloneAddressFields(fields.billingAddress)
  }
}
