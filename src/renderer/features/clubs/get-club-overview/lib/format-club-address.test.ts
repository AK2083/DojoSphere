import { describe, expect, it } from 'vitest'

import { formatClubAddress } from './format-club-address'

describe('formatClubAddress', () => {
  it('formats a complete address', () => {
    expect(
      formatClubAddress({
        street: 'Dojostraße',
        houseNumber: '12',
        postalCode: '20095',
        city: 'Hamburg',
        countryCode: 'DE',
        addressType: 'primary'
      })
    ).toBe('Dojostraße 12, 20095 Hamburg, DE')
  })

  it('omits blank parts', () => {
    expect(
      formatClubAddress({
        street: null,
        houseNumber: null,
        postalCode: null,
        city: 'München',
        countryCode: null,
        addressType: 'training'
      })
    ).toBe('München')
  })

  it('returns an empty string when all fields are blank', () => {
    expect(
      formatClubAddress({
        street: null,
        houseNumber: null,
        postalCode: null,
        city: null,
        countryCode: null,
        addressType: 'primary'
      })
    ).toBe('')
  })
})
