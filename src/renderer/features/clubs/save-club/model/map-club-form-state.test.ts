import { describe, expect, it } from 'vitest'

import { CLUB_MOCK_DATA } from '../../get-club-overview/model/club-mock-data'
import { createEmptyClubForm } from './club-form-state'
import {
  cloneClubFormState,
  joinWebsite,
  mapClubToFormState,
  mapFormStateToClub,
  splitWebsite
} from './map-club-form-state'

describe('map-club-form-state', () => {
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
    expect(joinWebsite('https://', 'www.example.com')).toBe('https://www.example.com')
    expect(joinWebsite('http://', '  /example.com  ')).toBe('http://example.com')
    expect(joinWebsite('https://', '   ')).toBeNull()
  })

  it('maps a club row into structured form fields', () => {
    const form = mapClubToFormState(CLUB_MOCK_DATA[0]!)

    expect(form.name).toBe('Judoclub Nord e.V.')
    expect(form.clubNumber).toBe('020123')
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

  it('uses headquarters when same-as switches are enabled', () => {
    const fields = {
      ...createEmptyClubForm(),
      name: 'Shared Address Club',
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

    const club = mapFormStateToClub(fields, {
      id: 'shared',
      source: 'manual',
      createdAt: '2026-04-01T00:00:00.000Z'
    })

    expect(club.addresses).toEqual([
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

  it('maps form fields back into a club row', () => {
    const fields = {
      ...createEmptyClubForm(),
      name: 'Test Club',
      shortName: 'TC',
      websiteProtocol: 'https://' as const,
      websiteHost: 'test.example',
      districtName: 'Berlin',
      clubNumber: '110011',
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
      email: 'club@test.example',
      phoneCountryCode: '+49',
      phoneNumber: '30 123'
    }

    const club = mapFormStateToClub(fields, {
      id: 'club-x',
      source: 'manual',
      createdAt: '2026-04-01T00:00:00.000Z'
    })

    expect(club.id).toBe('club-x')
    expect(club.name).toBe('Test Club')
    expect(club.city).toBe('Berlin')
    expect(club.website).toBe('https://test.example')
    expect(club.identifiers).toEqual([
      {
        type: 'djb_club_number',
        value: '110011',
        authority: 'DJB'
      }
    ])
    expect(club.addresses).toEqual([
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
    expect(club.contacts).toEqual([
      {
        contactType: 'email',
        value: 'club@test.example',
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

  it('omits empty optional child collections', () => {
    const club = mapFormStateToClub(createEmptyClubForm(), {
      id: 'empty',
      source: 'manual',
      createdAt: '2026-04-01T00:00:00.000Z'
    })

    expect(club.identifiers).toEqual([])
    expect(club.addresses).toEqual([])
    expect(club.contacts).toEqual([])
    expect(club.city).toBeNull()
    expect(club.website).toBeNull()
  })

  it('deep-clones nested address fields', () => {
    const original = mapClubToFormState(CLUB_MOCK_DATA[0]!)
    const cloned = cloneClubFormState(original)

    cloned.headquarters.street = 'Changed'
    expect(original.headquarters.street).toBe('Dojostraße')
  })
})
