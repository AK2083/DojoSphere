import type { AssociationOverviewRow } from './association-row'

/**
 * Temporary association fixtures for Storybook and form mapping unit tests.
 *
 * Includes the seeded Unknown association plus two fictional German associations.
 */
export const ASSOCIATION_MOCK_DATA: AssociationOverviewRow[] = [
  {
    id: 'c1000000-0000-4000-8000-000000000001',
    name: 'Judoclub Nord e.V.',
    shortName: 'JC Nord',
    city: 'Hamburg',
    website: 'https://www.jcnord.example',
    isActive: true,
    source: 'manual',
    createdAt: '2026-03-01T10:00:00.000Z',
    districtName: 'Bezirk Hamburg',
    districtShortName: 'HH',
    regionalFederationName: 'Hamburger Judo-Verband',
    regionalFederationShortName: 'HJV',
    federationName: 'Deutscher Judo-Bund',
    federationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [
      {
        type: 'djb_association_number',
        value: '020123',
        authority: 'DJB'
      }
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
  },
  {
    id: 'c1000000-0000-4000-8000-000000000002',
    name: 'SV Süd Judo',
    shortName: 'SV Süd',
    city: 'München',
    website: 'https://www.svsued-judo.example',
    isActive: true,
    source: 'manual',
    createdAt: '2026-02-15T09:30:00.000Z',
    districtName: 'Bezirk Oberbayern',
    districtShortName: 'OB',
    regionalFederationName: 'Bayerischer Judo-Verband',
    regionalFederationShortName: 'BJV',
    federationName: 'Deutscher Judo-Bund',
    federationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [
      {
        type: 'djb_association_number',
        value: '090456',
        authority: 'DJB'
      }
    ],
    addresses: [
      {
        street: 'Tatamiplatz',
        houseNumber: '8',
        postalCode: '80331',
        city: 'München',
        countryCode: 'DE',
        addressType: 'primary'
      }
    ],
    contacts: [
      {
        contactType: 'email',
        value: 'meldung@svsued-judo.example',
        label: 'Meldungen',
        isPublic: true
      }
    ]
  },
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Unknown',
    shortName: null,
    city: null,
    website: null,
    isActive: true,
    source: 'seed',
    createdAt: '2026-01-01T00:00:00.000Z',
    districtName: 'Placeholder District',
    districtShortName: null,
    regionalFederationName: 'Placeholder Regional Federation',
    regionalFederationShortName: null,
    federationName: 'German Judo Federation',
    federationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [],
    addresses: [],
    contacts: []
  }
]
