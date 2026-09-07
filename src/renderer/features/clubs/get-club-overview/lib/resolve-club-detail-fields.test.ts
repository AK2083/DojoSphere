import { describe, expect, it } from 'vitest'

import { resolveClubDetailFields } from './resolve-club-detail-fields'

describe('resolveClubDetailFields', () => {
  it('maps club number, typed addresses, and typed contacts', () => {
    expect(
      resolveClubDetailFields({
        identifiers: [
          { type: 'djb_club_number', value: '020123', authority: 'DJB' },
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
      clubNumber: '020123',
      headquarters: 'Dojostraße 12, 20095 Hamburg, DE',
      trainingVenue: 'Trainingweg 4, 20099 Hamburg, DE',
      billingAddress: 'Rechnungsweg 1, 20095 Hamburg, DE',
      email: 'info@jcnord.example',
      phone: '+49 40 555 0100'
    })
  })

  it('returns null for missing typed fields', () => {
    expect(
      resolveClubDetailFields({
        identifiers: [],
        addresses: [],
        contacts: []
      })
    ).toEqual({
      clubNumber: null,
      headquarters: null,
      trainingVenue: null,
      billingAddress: null,
      email: null,
      phone: null
    })
  })

  it('returns null for blank club number and contact values', () => {
    expect(
      resolveClubDetailFields({
        identifiers: [{ type: 'djb_club_number', value: '   ', authority: null }],
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
      clubNumber: null,
      headquarters: null,
      trainingVenue: null,
      billingAddress: null,
      email: null,
      phone: null
    })
  })

  it('returns null when an address of the type exists but has no displayable parts', () => {
    expect(
      resolveClubDetailFields({
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
      clubNumber: null,
      headquarters: null,
      trainingVenue: null,
      billingAddress: null,
      email: null,
      phone: null
    })
  })
})
