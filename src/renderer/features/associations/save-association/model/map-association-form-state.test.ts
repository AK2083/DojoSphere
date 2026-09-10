import { describe, expect, it } from 'vitest'

import { ASSOCIATION_MOCK_DATA } from '../../get-association-overview/model/association-mock-data'
import type { AssociationOverviewRow } from '../../get-association-overview/model/association-row'
import { createEmptyAddressFields, createEmptyAssociationForm } from './association-form-state'
import {
  cloneAssociationFormState,
  copyHeadquartersAddress,
  joinWebsite,
  mapAssociationToFormState,
  mapFormStateToAssociation,
  splitWebsite
} from './map-association-form-state'

describe('map-association-form-state', () => {
  it('splits and joins website protocol and host', () => {
    expect(splitWebsite('https://www.jcnord.example')).toEqual({
      websiteProtocol: 'https://',
      websiteHost: 'www.jcnord.example'
    })
    expect(splitWebsite('http://example.com/path')).toEqual({
      websiteProtocol: 'http://',
      websiteHost: 'example.com/path'
    })
    expect(splitWebsite('www.example.com')).toEqual({
      websiteProtocol: 'https://',
      websiteHost: 'www.example.com'
    })
    expect(splitWebsite(null)).toEqual({
      websiteProtocol: 'https://',
      websiteHost: ''
    })
    expect(splitWebsite('   ')).toEqual({
      websiteProtocol: 'https://',
      websiteHost: ''
    })
    expect(joinWebsite('https://', 'www.example.com')).toBe('https://www.example.com')
    expect(joinWebsite('http://', '  /example.com  ')).toBe('http://example.com')
    expect(joinWebsite('https://', '   ')).toBeNull()
  })

  it('maps a association row into structured form fields', () => {
    const form = mapAssociationToFormState(ASSOCIATION_MOCK_DATA[0]!)

    expect(form.name).toBe('Judoclub Nord e.V.')
    expect(form.associationNumber).toBe('020123')
    expect(form.email).toBe('info@jcnord.example')
    expect(form.phoneCountryCode).toBe('+49')
    expect(form.phoneNumber).toBe('40 555 0100')
    expect(form.websiteProtocol).toBe('https://')
    expect(form.websiteHost).toBe('www.jcnord.example')
    expect(form.headquarters).toEqual({
      street: 'Dojostraße',
      houseNumber: '12',
      postalCode: '20095',
      city: 'Hamburg'
    })
    expect(form.trainingVenue.street).toBe('Trainingweg')
    expect(form.billingAddress.street).toBe('Rechnungsweg')
    expect(form.trainingVenueSameAsHeadquarters).toBe(false)
    expect(form.billingAddressSameAsHeadquarters).toBe(false)
  })

  it('uses empty address blocks when a association has no addresses', () => {
    const form = mapAssociationToFormState(ASSOCIATION_MOCK_DATA[2]!)

    expect(form.headquarters).toEqual(createEmptyAddressFields())
    expect(form.trainingVenue).toEqual(createEmptyAddressFields())
    expect(form.billingAddress).toEqual(createEmptyAddressFields())
    expect(form.websiteHost).toBe('')
    expect(form.associationNumber).toBe('')
    expect(form.email).toBe('')
    expect(form.phoneNumber).toBe('')
    expect(form.trainingVenueSameAsHeadquarters).toBe(false)
    expect(form.billingAddressSameAsHeadquarters).toBe(false)
  })

  it('maps null address fields to empty strings', () => {
    const association: AssociationOverviewRow = {
      ...ASSOCIATION_MOCK_DATA[2]!,
      id: 'null-address-fields',
      shortName: null,
      website: 'http://same.example',
      districtShortName: null,
      regionalFederationShortName: null,
      federationShortName: null,
      addresses: [
        {
          street: null,
          houseNumber: null,
          postalCode: null,
          city: null,
          countryCode: null,
          addressType: 'primary'
        }
      ],
      contacts: [],
      identifiers: []
    }

    const form = mapAssociationToFormState(association)

    expect(form.websiteProtocol).toBe('http://')
    expect(form.websiteHost).toBe('same.example')
    expect(form.headquarters).toEqual(createEmptyAddressFields())
    expect(form.trainingVenueSameAsHeadquarters).toBe(false)
    expect(form.billingAddressSameAsHeadquarters).toBe(false)
  })

  it('flags training and billing as same as headquarters when values match', () => {
    const sharedAddress = {
      street: 'Dojostraße',
      houseNumber: '12',
      postalCode: '20095',
      city: 'Hamburg',
      countryCode: 'DE' as string | null
    }
    const association: AssociationOverviewRow = {
      ...ASSOCIATION_MOCK_DATA[0]!,
      id: 'same-hq',
      addresses: [
        { ...sharedAddress, addressType: 'primary' },
        { ...sharedAddress, addressType: 'training' },
        { ...sharedAddress, addressType: 'billing' }
      ]
    }

    const form = mapAssociationToFormState(association)

    expect(form.trainingVenueSameAsHeadquarters).toBe(true)
    expect(form.billingAddressSameAsHeadquarters).toBe(true)
  })

  it('copies headquarters address fields independently', () => {
    const headquarters = {
      street: 'Dojostraße',
      houseNumber: '12',
      postalCode: '20095',
      city: 'Hamburg'
    }
    const copied = copyHeadquartersAddress(headquarters)

    expect(copied).toEqual(headquarters)
    expect(copied).not.toBe(headquarters)
  })

  it('uses headquarters when same-as switches are enabled', () => {
    const fields = {
      ...createEmptyAssociationForm(),
      name: 'Shared Address Association',
      districtName: 'Hamburg',
      headquarters: {
        street: 'Dojostraße',
        houseNumber: '12',
        postalCode: '20095',
        city: 'Hamburg'
      },
      trainingVenue: {
        street: 'Other',
        houseNumber: '1',
        postalCode: '20099',
        city: 'Hamburg'
      },
      billingAddress: {
        street: 'Other',
        houseNumber: '2',
        postalCode: '20099',
        city: 'Hamburg'
      },
      trainingVenueSameAsHeadquarters: true,
      billingAddressSameAsHeadquarters: true
    }

    const association = mapFormStateToAssociation(fields, {
      id: 'shared',
      source: 'manual',
      createdAt: '2026-04-01T00:00:00.000Z'
    })

    expect(association.addresses).toEqual([
      {
        street: 'Dojostraße',
        houseNumber: '12',
        postalCode: '20095',
        city: 'Hamburg',
        countryCode: null,
        addressType: 'primary'
      },
      {
        street: 'Dojostraße',
        houseNumber: '12',
        postalCode: '20095',
        city: 'Hamburg',
        countryCode: null,
        addressType: 'training'
      },
      {
        street: 'Dojostraße',
        houseNumber: '12',
        postalCode: '20095',
        city: 'Hamburg',
        countryCode: null,
        addressType: 'billing'
      }
    ])
  })

  it('maps form fields back into a association row', () => {
    const fields = {
      ...createEmptyAssociationForm(),
      name: 'Test Association',
      shortName: 'TC',
      websiteProtocol: 'https://' as const,
      websiteHost: 'test.example',
      districtName: 'Berlin',
      associationNumber: '110011',
      headquarters: {
        street: 'Hauptstr.',
        houseNumber: '1',
        postalCode: '10115',
        city: 'Berlin'
      },
      trainingVenue: {
        street: 'Dojo',
        houseNumber: '2',
        postalCode: '10115',
        city: 'Berlin'
      },
      billingAddress: {
        street: 'Invoice',
        houseNumber: '3',
        postalCode: '10115',
        city: 'Berlin'
      },
      email: 'association@test.example',
      phoneCountryCode: '+49',
      phoneNumber: '30 123'
    }

    const association = mapFormStateToAssociation(fields, {
      id: 'association-x',
      source: 'manual',
      createdAt: '2026-04-01T00:00:00.000Z'
    })

    expect(association.id).toBe('association-x')
    expect(association.name).toBe('Test Association')
    expect(association.city).toBe('Berlin')
    expect(association.website).toBe('https://test.example')
    expect(association.identifiers).toEqual([
      {
        type: 'djb_association_number',
        value: '110011',
        authority: 'DJB'
      }
    ])
    expect(association.addresses).toEqual([
      {
        street: 'Hauptstr.',
        houseNumber: '1',
        postalCode: '10115',
        city: 'Berlin',
        countryCode: null,
        addressType: 'primary'
      },
      {
        street: 'Dojo',
        houseNumber: '2',
        postalCode: '10115',
        city: 'Berlin',
        countryCode: null,
        addressType: 'training'
      },
      {
        street: 'Invoice',
        houseNumber: '3',
        postalCode: '10115',
        city: 'Berlin',
        countryCode: null,
        addressType: 'billing'
      }
    ])
    expect(association.contacts).toEqual([
      {
        contactType: 'email',
        value: 'association@test.example',
        label: null,
        isPublic: true
      },
      {
        contactType: 'phone',
        value: '+49 30 123',
        label: null,
        isPublic: false
      }
    ])
  })

  it('falls back to default hierarchy names when blank', () => {
    const association = mapFormStateToAssociation(
      {
        ...createEmptyAssociationForm(),
        name: 'Blank Hierarchy',
        districtName: 'Berlin',
        federationName: '   ',
        regionalFederationName: '   ',
        countryName: '   ',
        federationShortName: '  ',
        regionalFederationShortName: '  ',
        districtShortName: '  '
      },
      {
        id: 'blank-hierarchy',
        source: 'manual',
        createdAt: '2026-04-01T00:00:00.000Z'
      }
    )

    expect(association.federationName).toBe(createEmptyAssociationForm().federationName)
    expect(association.regionalFederationName).toBe(
      createEmptyAssociationForm().regionalFederationName
    )
    expect(association.countryName).toBe(createEmptyAssociationForm().countryName)
    expect(association.federationShortName).toBeNull()
    expect(association.regionalFederationShortName).toBeNull()
    expect(association.districtShortName).toBeNull()
  })

  it('omits empty optional child collections', () => {
    const association = mapFormStateToAssociation(createEmptyAssociationForm(), {
      id: 'empty',
      source: 'manual',
      createdAt: '2026-04-01T00:00:00.000Z'
    })

    expect(association.identifiers).toEqual([])
    expect(association.addresses).toEqual([])
    expect(association.contacts).toEqual([])
    expect(association.city).toBeNull()
    expect(association.website).toBeNull()
  })

  it('deep-clones nested address fields', () => {
    const original = mapAssociationToFormState(ASSOCIATION_MOCK_DATA[0]!)
    const cloned = cloneAssociationFormState(original)

    cloned.headquarters.street = 'Changed'
    expect(original.headquarters.street).toBe('Dojostraße')
  })
})
