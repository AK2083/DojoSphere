import type { AssociationOverviewRow } from '../model/association-row'
import type {
  AssociationFieldHeader,
  AssociationOverviewItem
} from '../model/use-association-overview'
import {
  resetAssociationsLoaderForStorybook,
  setAssociationsLoaderForStorybook
} from '../service/load-associations'

/** Column headers for presentational association overview stories (English labels). */
export const storyFieldHeaders: AssociationFieldHeader[] = [
  { title: 'City', key: 'city' },
  { title: 'Website', key: 'website' },
  { title: 'Status', key: 'status' },
  { title: 'District', key: 'district' },
  { title: 'Country', key: 'country' },
  { title: 'Association', key: 'association' },
  { title: 'Regional association', key: 'regionalFederation' },
  { title: 'Association number', key: 'associationNumber' },
  { title: 'Headquarters', key: 'headquarters' },
  { title: 'Training venue', key: 'trainingVenue' },
  { title: 'Billing address', key: 'billingAddress' },
  { title: 'Email address', key: 'email' },
  { title: 'Phone number', key: 'phone' }
]

const storyAssociationRows: AssociationOverviewRow[] = [
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
    isActive: false,
    source: 'manual',
    createdAt: '2026-02-15T09:30:00.000Z',
    districtName: 'Bezirk Oberbayern',
    districtShortName: 'OB',
    regionalFederationName: 'Bayerischer Judo-Verband',
    regionalFederationShortName: 'BJV',
    federationName: 'Deutscher Judo-Bund',
    federationShortName: 'DJB',
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

/** Card rows for presentational association overview stories. */
export const storyAssociations: AssociationOverviewItem[] = storyAssociationRows.map(
  (association) => ({
    ...association,
    statusLabel: association.isActive ? 'Active' : 'Inactive'
  })
)

/**
 * Installs a associations loader for overview section stories.
 *
 * @param associations - Associations returned by `loadAssociations`.
 */
export function installStorybookAssociationsLoader(
  associations: AssociationOverviewRow[] = storyAssociationRows
): void {
  setAssociationsLoaderForStorybook(async () => structuredClone(associations))
}

/** Installs a associations loader that rejects. */
export function installStorybookAssociationsLoaderError(): void {
  setAssociationsLoaderForStorybook(async () => {
    throw new Error('Associations could not be loaded.')
  })
}

/**
 * Installs a associations loader that keeps the overview in a loading state.
 *
 * @param delayMs - Delay before resolving the association list.
 */
export function installStorybookAssociationsLoaderLoading(delayMs = 60_000): void {
  setAssociationsLoaderForStorybook(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs)
    })

    return []
  })
}

/** Restores the default associations loader between stories. */
export function resetStorybookAssociationsLoader(): void {
  resetAssociationsLoaderForStorybook()
}
