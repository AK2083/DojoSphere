import {
  CLUB_ADDRESS_TYPES,
  CLUB_CONTACT_TYPES,
  CLUB_NUMBER_IDENTIFIER_TYPE
} from '../../get-club-overview/lib/resolve-club-detail-fields'
import type {
  ClubAddress,
  ClubContact,
  ClubOverviewRow
} from '../../get-club-overview/model/club-row'
import { joinPhoneCountryCode, splitPhoneCountryCode } from '../lib/phone-country-codes'
import {
  type ClubAddressFormFields,
  type ClubFormState,
  type ClubWebsiteProtocol,
  createEmptyAddressFields,
  createEmptyClubForm
} from './club-form-state'

function optionalText(value: string): string | null {
  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

function cloneAddressFields(fields: ClubAddressFormFields): ClubAddressFormFields {
  return {
    street: fields.street,
    houseNumber: fields.houseNumber,
    postalCode: fields.postalCode,
    city: fields.city
  }
}

function addressHasValues(fields: ClubAddressFormFields): boolean {
  return Boolean(
    optionalText(fields.street) ||
    optionalText(fields.houseNumber) ||
    optionalText(fields.postalCode) ||
    optionalText(fields.city)
  )
}

function addressFromFormFields(
  addressType: string,
  fields: ClubAddressFormFields
): ClubAddress | null {
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

function addressToFormFields(address: ClubAddress | undefined): ClubAddressFormFields {
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

function addressFieldsEqual(left: ClubAddressFormFields, right: ClubAddressFormFields): boolean {
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
  headquarters: ClubAddressFormFields
): ClubAddressFormFields {
  return cloneAddressFields(headquarters)
}

function findAddress(addresses: ClubAddress[], addressType: string): ClubAddress | undefined {
  return addresses.find((entry) => entry.addressType === addressType)
}

/**
 * Splits a stored website URL into protocol prefix and host path.
 *
 * @param website - Full website URL or empty.
 * @returns Protocol and host/path for the form controls.
 */
export function splitWebsite(website: string | null): {
  websiteProtocol: ClubWebsiteProtocol
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
export function joinWebsite(protocol: ClubWebsiteProtocol, host: string): string | null {
  const trimmedHost = host.trim().replace(/^\/+/, '')

  if (!trimmedHost) {
    return null
  }

  return `${protocol}${trimmedHost}`
}

/**
 * Maps a stored club row into editable form fields.
 *
 * @param club - Club overview row from the store.
 * @returns Form state for the club editor.
 */
export function mapClubToFormState(club: ClubOverviewRow): ClubFormState {
  const website = splitWebsite(club.website)
  const phoneValue =
    club.contacts.find((contact) => contact.contactType === CLUB_CONTACT_TYPES.phone)?.value ?? ''
  const phone = splitPhoneCountryCode(phoneValue)
  const clubNumber =
    club.identifiers.find((identifier) => identifier.type === CLUB_NUMBER_IDENTIFIER_TYPE)?.value ??
    ''
  const headquarters = addressToFormFields(
    findAddress(club.addresses, CLUB_ADDRESS_TYPES.headquarters)
  )
  const trainingVenue = addressToFormFields(
    findAddress(club.addresses, CLUB_ADDRESS_TYPES.trainingVenue)
  )
  const billingAddress = addressToFormFields(
    findAddress(club.addresses, CLUB_ADDRESS_TYPES.billing)
  )
  const trainingVenueSameAsHeadquarters =
    addressHasValues(headquarters) && addressFieldsEqual(headquarters, trainingVenue)
  const billingAddressSameAsHeadquarters =
    addressHasValues(headquarters) && addressFieldsEqual(headquarters, billingAddress)

  return {
    name: club.name,
    shortName: club.shortName ?? '',
    websiteProtocol: website.websiteProtocol,
    websiteHost: website.websiteHost,
    isActive: club.isActive,
    districtName: club.districtName,
    countryName: club.countryName,
    associationName: club.associationName,
    associationShortName: club.associationShortName ?? '',
    regionalAssociationName: club.regionalAssociationName,
    regionalAssociationShortName: club.regionalAssociationShortName ?? '',
    districtShortName: club.districtShortName ?? '',
    clubNumber,
    headquarters,
    trainingVenue,
    billingAddress,
    trainingVenueSameAsHeadquarters,
    billingAddressSameAsHeadquarters,
    email:
      club.contacts.find((contact) => contact.contactType === CLUB_CONTACT_TYPES.email)?.value ??
      '',
    phoneCountryCode: phone.phoneCountryCode,
    phoneNumber: phone.phoneNumber
  }
}

/**
 * Maps form fields into a club overview row for store persistence.
 *
 * @param fields - Current form values.
 * @param options - Existing id/source/createdAt when editing.
 * @param options.id
 * @param options.source
 * @param options.createdAt
 * @returns Club row ready for the in-memory store.
 */
export function mapFormStateToClub(
  fields: ClubFormState,
  options: {
    id: string
    source: string | null
    createdAt: string
  }
): ClubOverviewRow {
  const trainingVenueFields = fields.trainingVenueSameAsHeadquarters
    ? fields.headquarters
    : fields.trainingVenue
  const billingAddressFields = fields.billingAddressSameAsHeadquarters
    ? fields.headquarters
    : fields.billingAddress

  const addresses = [
    addressFromFormFields(CLUB_ADDRESS_TYPES.headquarters, fields.headquarters),
    addressFromFormFields(CLUB_ADDRESS_TYPES.trainingVenue, trainingVenueFields),
    addressFromFormFields(CLUB_ADDRESS_TYPES.billing, billingAddressFields)
  ].filter((address): address is ClubAddress => address != null)

  const contacts: ClubContact[] = []
  const email = optionalText(fields.email)
  const phone = joinPhoneCountryCode(fields.phoneCountryCode, fields.phoneNumber)

  if (email) {
    contacts.push({
      contactType: CLUB_CONTACT_TYPES.email,
      value: email,
      label: null,
      isPublic: true
    })
  }

  if (phone) {
    contacts.push({
      contactType: CLUB_CONTACT_TYPES.phone,
      value: phone,
      label: null,
      isPublic: false
    })
  }

  const clubNumber = optionalText(fields.clubNumber)
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
    regionalAssociationName:
      fields.regionalAssociationName.trim() || createEmptyClubForm().regionalAssociationName,
    regionalAssociationShortName: optionalText(fields.regionalAssociationShortName),
    associationName: fields.associationName.trim() || createEmptyClubForm().associationName,
    associationShortName: optionalText(fields.associationShortName),
    countryName: fields.countryName.trim() || createEmptyClubForm().countryName,
    identifiers: clubNumber
      ? [
          {
            type: CLUB_NUMBER_IDENTIFIER_TYPE,
            value: clubNumber,
            authority: 'DJB'
          }
        ]
      : [],
    addresses,
    contacts
  }
}

/**
 * Deep-clones club form state including nested address objects.
 *
 * @param fields - Form state to clone.
 * @returns Independent copy safe for reset snapshots.
 */
export function cloneClubFormState(fields: ClubFormState): ClubFormState {
  return {
    ...fields,
    headquarters: cloneAddressFields(fields.headquarters),
    trainingVenue: cloneAddressFields(fields.trainingVenue),
    billingAddress: cloneAddressFields(fields.billingAddress)
  }
}
