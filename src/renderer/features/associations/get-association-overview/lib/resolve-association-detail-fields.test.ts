import { describe, expect, it } from 'vitest'

import { resolveAssociationDetailFields } from './resolve-association-detail-fields'

describe('resolveAssociationDetailFields', () => {
  it('maps association number, typed addresses, and typed contacts', () => {
    expect(
      resolveAssociationDetailFields({
        identifiers: [
          { type: 'vereinsregister_number', value: 'VR 20123 P', authority: null },
          { type: 'other', value: 'ignored', authority: null }
        ],
        addresses: [
          {
            street: 'Dojostraße',
            houseNumber: '12',
            postalCode: '20095',
            city: 'Hamburg',
            countryCode: 'DE',
            addressType: 'primary'
          },
          {
            street: 'Trainingweg',
            houseNumber: '4',
            postalCode: '20099',
            city: 'Hamburg',
            countryCode: 'DE',
            addressType: 'training'
          },
          {
            street: 'Rechnungsweg',
            houseNumber: '1',
            postalCode: '20095',
            city: 'Hamburg',
            countryCode: 'DE',
            addressType: 'billing'
          }
        ],
        contacts: [
          {
            contactType: 'email',
            value: 'info@jcnord.example',
            label: null,
            isPublic: true
          },
          {
            contactType: 'phone',
            value: '+49 40 555 0100',
            label: null,
            isPublic: false
          }
        ]
      })
    ).toEqual({
      associationNumber: 'VR 20123 P',
      headquarters: 'Dojostraße 12, 20095 Hamburg, DE',
      trainingVenue: 'Trainingweg 4, 20099 Hamburg, DE',
      billingAddress: 'Rechnungsweg 1, 20095 Hamburg, DE',
      email: 'info@jcnord.example',
      phone: '+49 40 555 0100'
    })
  })

  it('returns null for missing typed fields', () => {
    expect(
      resolveAssociationDetailFields({
        identifiers: [],
        addresses: [],
        contacts: []
      })
    ).toEqual({
      associationNumber: null,
      headquarters: null,
      trainingVenue: null,
      billingAddress: null,
      email: null,
      phone: null
    })
  })

  it('returns null for blank association number and contact values', () => {
    expect(
      resolveAssociationDetailFields({
        identifiers: [{ type: 'vereinsregister_number', value: '   ', authority: null }],
        addresses: [],
        contacts: [
          {
            contactType: 'email',
            value: '  ',
            label: null,
            isPublic: true
          },
          {
            contactType: 'phone',
            value: '\t',
            label: null,
            isPublic: false
          }
        ]
      })
    ).toEqual({
      associationNumber: null,
      headquarters: null,
      trainingVenue: null,
      billingAddress: null,
      email: null,
      phone: null
    })
  })

  it('returns null when an address of the type exists but has no displayable parts', () => {
    expect(
      resolveAssociationDetailFields({
        identifiers: [],
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
        contacts: []
      })
    ).toEqual({
      associationNumber: null,
      headquarters: null,
      trainingVenue: null,
      billingAddress: null,
      email: null,
      phone: null
    })
  })
})
