import type { ClubOverviewRow } from '../model/club-row'
import type { ClubFieldHeader, ClubOverviewItem } from '../model/use-club-overview'
import { resetClubsLoaderForStorybook, setClubsLoaderForStorybook } from '../service/load-clubs'

/** Column headers for presentational club overview stories (English labels). */
export const storyFieldHeaders: ClubFieldHeader[] = [
  { title: 'City', key: 'city' },
  { title: 'Website', key: 'website' },
  { title: 'Status', key: 'status' },
  { title: 'District', key: 'district' },
  { title: 'Country', key: 'country' },
  { title: 'Association', key: 'association' },
  { title: 'Regional association', key: 'regionalAssociation' },
  { title: 'Club number', key: 'clubNumber' },
  { title: 'Headquarters', key: 'headquarters' },
  { title: 'Training venue', key: 'trainingVenue' },
  { title: 'Billing address', key: 'billingAddress' },
  { title: 'Email address', key: 'email' },
  { title: 'Phone number', key: 'phone' }
]

const storyClubRows: ClubOverviewRow[] = [
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
    regionalAssociationName: 'Hamburger Judo-Verband',
    regionalAssociationShortName: 'HJV',
    associationName: 'Deutscher Judo-Bund',
    associationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [
      {
        type: 'djb_club_number',
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
    isActive: false,
    source: 'manual',
    createdAt: '2026-02-15T09:30:00.000Z',
    districtName: 'Bezirk Oberbayern',
    districtShortName: 'OB',
    regionalAssociationName: 'Bayerischer Judo-Verband',
    regionalAssociationShortName: 'BJV',
    associationName: 'Deutscher Judo-Bund',
    associationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [],
    addresses: [],
    contacts: []
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
    regionalAssociationName: 'Placeholder Regional Association',
    regionalAssociationShortName: null,
    associationName: 'German Judo Federation',
    associationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: [],
    addresses: [],
    contacts: []
  }
]

/** Card rows for presentational club overview stories. */
export const storyClubs: ClubOverviewItem[] = storyClubRows.map((club) => ({
  ...club,
  statusLabel: club.isActive ? 'Active' : 'Inactive'
}))

/**
 * Installs a clubs loader for overview section stories.
 *
 * @param clubs - Clubs returned by `loadClubs`.
 */
export function installStorybookClubsLoader(clubs: ClubOverviewRow[] = storyClubRows): void {
  setClubsLoaderForStorybook(async () => structuredClone(clubs))
}

/** Installs a clubs loader that rejects. */
export function installStorybookClubsLoaderError(): void {
  setClubsLoaderForStorybook(async () => {
    throw new Error('Clubs could not be loaded.')
  })
}

/**
 * Installs a clubs loader that keeps the overview in a loading state.
 *
 * @param delayMs - Delay before resolving the club list.
 */
export function installStorybookClubsLoaderLoading(delayMs = 60_000): void {
  setClubsLoaderForStorybook(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs)
    })

    return []
  })
}

/** Restores the default clubs loader between stories. */
export function resetStorybookClubsLoader(): void {
  resetClubsLoaderForStorybook()
}
