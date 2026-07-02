import { setLocalSessionToken } from '@features/authentication/service/local-session-storage'
import type { Competitor } from '@shared/types/electron-api'

import type {
  ParticipantFieldHeader,
  ParticipantOverviewItem
} from '../model/use-participant-overview'

const STORYBOOK_SESSION_TOKEN = 'storybook-local-session'

/** Fictional competitors for Storybook API stubs and visual fixtures. */
export const storyCompetitors: Competitor[] = [
  {
    id: 'participant-1',
    givenName: 'Yuki',
    familyName: 'Tanaka',
    gender: 'm',
    birthDate: '2011-04-12',
    nationality: 'DE',
    passNumber: 'JP-000142',
    club: 'Dojo Nord',
    weightClass: '-60',
    licenseNumber: 'WL-2024-001',
    contactPhone: '+49 555 010201',
    coach: 'S. Fischer',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000008',
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    gradeId: 'a1000000-0000-4000-8000-000000000001',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: null
  },
  {
    id: 'participant-2',
    givenName: 'Anna',
    familyName: 'Weber',
    gender: 'f',
    birthDate: '2013-08-03',
    nationality: 'DE',
    passNumber: 'JP-000287',
    club: 'JC West',
    weightClass: '-52',
    licenseNumber: 'WL-2024-014',
    contactPhone: '+49 555 010202',
    coach: 'M. Keller',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000008',
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    gradeId: null,
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: null
  },
  {
    id: 'participant-3',
    givenName: 'Leo',
    familyName: 'Martin',
    gender: 'm',
    birthDate: '2009-11-21',
    nationality: 'AT',
    passNumber: 'JP-000391',
    club: 'SV Süd',
    weightClass: '-73',
    licenseNumber: 'WL-2024-028',
    contactPhone: '+43 555 010203',
    coach: 'T. Brandt',
    clubId: '00000000-0000-0000-0000-000000000000',
    weightClassId: 'b3000000-0000-4000-8000-000000000008',
    ageClassId: 'c2000000-0000-4000-8000-000000000003',
    gradeId: 'a1000000-0000-4000-8000-000000000002',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: null
  }
]

/** Column headers for presentational overview stories (English labels). */
export const storyFieldHeaders: ParticipantFieldHeader[] = [
  { title: 'Given name', key: 'givenName' },
  { title: 'Family name', key: 'familyName' },
  { title: 'Gender', key: 'gender' },
  { title: 'Date of birth', key: 'birthDate' },
  { title: 'Club', key: 'club' },
  { title: 'Nationality', key: 'nationality' },
  { title: 'Weight class', key: 'weightClass' },
  { title: 'Age class', key: 'ageClass' },
  { title: 'Judo pass number', key: 'passNumber' },
  { title: 'Grade (kyu/dan)', key: 'grade' },
  { title: 'Competition licence number', key: 'licenseNumber' },
  { title: 'Club contact email', key: 'clubContactEmail' },
  { title: 'Contact phone', key: 'contactPhone' },
  { title: 'Coach / guardian', key: 'coach' }
]

/** Card rows for presentational overview stories (English labels). */
export const storyParticipants: ParticipantOverviewItem[] = [
  {
    id: 'participant-1',
    createdAt: '2026-03-01T00:00:00.000Z',
    givenName: 'Yuki',
    familyName: 'Tanaka',
    gender: 'Male',
    birthDate: '2011-04-12',
    club: 'Dojo Nord',
    nationality: 'DE',
    weightClass: 'Up to 60 kg',
    ageClass: 'Boys U15',
    passNumber: 'JP-000142',
    grade: '3rd Kyu',
    gradeBeltColorToken: 'judo-belt-white',
    licenseNumber: 'WL-2024-001',
    clubContactEmail: 'kontakt@example-dojo.invalid',
    contactPhone: '+49 555 010201',
    coach: 'S. Fischer'
  },
  {
    id: 'participant-2',
    createdAt: '2026-02-15T00:00:00.000Z',
    givenName: 'Anna',
    familyName: 'Weber',
    gender: 'Female',
    birthDate: '2013-08-03',
    club: 'JC West',
    nationality: 'DE',
    weightClass: 'Up to 52 kg',
    ageClass: 'Girls U13',
    passNumber: 'JP-000287',
    grade: '—',
    gradeBeltColorToken: null,
    licenseNumber: 'WL-2024-014',
    clubContactEmail: 'anmeldung@example-jc.invalid',
    contactPhone: '+49 555 010202',
    coach: 'M. Keller'
  },
  {
    id: 'participant-3',
    createdAt: '2026-01-10T00:00:00.000Z',
    givenName: 'Leo',
    familyName: 'Martin',
    gender: 'Male',
    birthDate: '2009-11-21',
    club: 'SV Süd',
    nationality: 'AT',
    weightClass: 'Up to 73 kg',
    ageClass: 'Boys U17',
    passNumber: 'JP-000391',
    grade: '2nd Kyu',
    gradeBeltColorToken: 'judo-belt-yellow',
    licenseNumber: 'WL-2024-028',
    clubContactEmail: 'sport@example-sv.invalid',
    contactPhone: '+43 555 010203',
    coach: 'T. Brandt'
  }
]

/**
 * Installs a minimal `window.api` stub for participant overview section stories.
 *
 * @param competitors - Competitors returned by `getCompetitors`.
 */
export function installStorybookParticipantApi(competitors: Competitor[] = storyCompetitors): void {
  setLocalSessionToken(STORYBOOK_SESSION_TOKEN)

  const existingApi = globalThis.window.api

  globalThis.window.api = {
    ...existingApi,
    getCompetitors: async (token: string) => {
      if (token !== STORYBOOK_SESSION_TOKEN) {
        return []
      }

      return competitors
    },
    deleteCompetitor: async (_token, _id) => undefined
  } as typeof globalThis.window.api
}

/** Installs an API stub that rejects participant loading. */
export function installStorybookParticipantApiError(): void {
  setLocalSessionToken(STORYBOOK_SESSION_TOKEN)

  const existingApi = globalThis.window.api

  globalThis.window.api = {
    ...existingApi,
    getCompetitors: async () => {
      throw new Error('Participants could not be loaded.')
    }
  } as typeof globalThis.window.api
}

/**
 * Installs an API stub that keeps the overview in a loading state.
 *
 * @param delayMs - Delay before resolving the competitor list.
 */
export function installStorybookParticipantApiLoading(delayMs = 60_000): void {
  setLocalSessionToken(STORYBOOK_SESSION_TOKEN)

  const existingApi = globalThis.window.api

  globalThis.window.api = {
    ...existingApi,
    getCompetitors: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs)
      })

      return []
    }
  } as typeof globalThis.window.api
}

/** Clears storybook session state between stories. */
export function resetStorybookParticipantApi(): void {
  globalThis.localStorage.removeItem('dojosphere.auth.local.session')
}
