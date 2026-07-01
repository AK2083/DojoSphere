import type { Competitor, CreateCompetitorInput, ElectronAPI } from '@shared/types/electron-api'

/** Fictional sample competitors for Playwright browser-only runs (no Electron SQLite). */
const PLAYWRIGHT_SAMPLE_COMPETITORS: Array<{ id: string; input: CreateCompetitorInput }> = [
  {
    id: 'participant-1',
    input: {
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
      coach: 'S. Fischer'
    }
  },
  {
    id: 'participant-2',
    input: {
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
      coach: 'M. Keller'
    }
  },
  {
    id: 'participant-3',
    input: {
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
      coach: 'T. Brandt'
    }
  }
]

/**
 * Whether the renderer runs in Playwright browser-only mode (without Electron).
 *
 * @param value - Raw env value; defaults to `import.meta.env.VITE_PLAYWRIGHT_BROWSER_ONLY`.
 * @returns `true` when Playwright serves the renderer in a browser and `window.api` is stubbed.
 */
export function isPlaywrightBrowserOnly(
  value: string | undefined = import.meta.env.VITE_PLAYWRIGHT_BROWSER_ONLY
): boolean {
  return value === 'true' || value === '1'
}

/**
 * Builds an in-memory competitor stub for the Playwright browser-only API.
 *
 * @param id - Generated competitor identifier.
 * @param input - Competitor create input from the form.
 * @returns A fully populated competitor record.
 */
function buildStubCompetitor(id: string, input: CreateCompetitorInput): Competitor {
  return {
    id,
    givenName: input.givenName,
    familyName: input.familyName,
    gender: input.gender ?? 'f',
    birthDate: input.birthDate ?? '2000-01-01',
    nationality: input.nationality ?? 'DE',
    passNumber: input.passNumber ?? '00000000',
    club: input.club ?? null,
    weightClass: input.weightClass ?? null,
    licenseNumber: input.licenseNumber ?? null,
    contactPhone: input.contactPhone ?? null,
    coach: input.coach ?? null,
    clubId: input.clubId ?? 'stub-club-id',
    weightClassId: input.weightClassId ?? 'stub-weight-class-id',
    ageClassId: input.ageClassId ?? 'stub-age-class-id',
    gradeId: input.gradeId ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: null
  }
}

/**
 * Installs a stub `window.api` when Playwright runs the renderer in a browser
 * without Electron (see `VITE_PLAYWRIGHT_BROWSER_ONLY` in `.env.e2e`).
 *
 * @param overrides - Optional API method overrides (e.g. custom `getOsUsername` in Storybook).
 */
export function installPlaywrightBrowserElectronApi(overrides: Partial<ElectronAPI> = {}) {
  const localSessions = new Map<string, { userId: string; displayName: string }>()
  const competitors: Competitor[] = PLAYWRIGHT_SAMPLE_COMPETITORS.map(({ id, input }) =>
    buildStubCompetitor(id, input)
  )

  const api: ElectronAPI = {
    getUsers: async () => [],
    addUser: async () => ({ id: 'local-user-id', sessionToken: 'local-session-token' }),
    ensureLocalSession: async (displayName) => {
      const id = 'local-user-id'
      const sessionToken = 'local-session-token'

      localSessions.set(sessionToken, { userId: id, displayName })

      return {
        id,
        sessionToken,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString()
      }
    },
    getLocalSession: async (token) => {
      const session = localSessions.get(token)

      if (!session) {
        return null
      }

      return {
        id: 'session-1',
        userId: session.userId,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        createdAt: new Date().toISOString(),
        user: {
          id: session.userId,
          displayName: session.displayName,
          email: null,
          userType: 'local',
          createdAt: new Date().toISOString(),
          updatedAt: null
        }
      }
    },
    revokeLocalSession: async () => undefined,
    updateUserDisplayName: async (token, displayName) => {
      const session = localSessions.get(token)

      if (!session) {
        throw new Error('Unauthorized')
      }

      const trimmedDisplayName = displayName.trim()

      if (!trimmedDisplayName) {
        throw new Error('Display name must not be empty')
      }

      session.displayName = trimmedDisplayName

      return {
        id: session.userId,
        displayName: trimmedDisplayName,
        email: null,
        userType: 'local' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    dbHealthcheck: async () => ({ ok: true, version: 'playwright-browser' }),
    recordError: async () => undefined,
    setDiagnosticsUploadPreferences: async () => undefined,
    auditRecord: async () => undefined,
    getCompetitors: async () => [...competitors],
    addCompetitor: async (_token, input) => {
      const competitor = buildStubCompetitor(`competitor-${competitors.length + 1}`, input)

      competitors.push(competitor)

      return competitor
    },
    updateCompetitor: async (_token, id, input) => {
      const index = competitors.findIndex((competitor) => competitor.id === id)
      const base =
        index >= 0
          ? competitors[index]!
          : buildStubCompetitor(id, { givenName: 'Test', familyName: 'Competitor' })
      const updated: Competitor = {
        ...base,
        givenName: input.givenName ?? base.givenName,
        familyName: input.familyName ?? base.familyName,
        gender: input.gender ?? base.gender,
        birthDate: input.birthDate ?? base.birthDate,
        nationality: input.nationality ?? base.nationality,
        passNumber: input.passNumber ?? base.passNumber,
        club: input.club ?? base.club,
        weightClass: input.weightClass ?? base.weightClass,
        licenseNumber: input.licenseNumber ?? base.licenseNumber,
        contactPhone: input.contactPhone ?? base.contactPhone,
        coach: input.coach ?? base.coach,
        clubId: input.clubId ?? base.clubId,
        weightClassId: input.weightClassId ?? base.weightClassId,
        ageClassId: input.ageClassId ?? base.ageClassId,
        gradeId: input.gradeId ?? base.gradeId,
        id,
        updatedAt: new Date().toISOString()
      }

      if (index >= 0) {
        competitors[index] = updated
      }

      return updated
    },
    deleteCompetitor: async (_token, id) => {
      const index = competitors.findIndex((competitor) => competitor.id === id)

      if (index >= 0) {
        competitors.splice(index, 1)
      }
    },
    getOsUsername: async () => 'TestUser',
    ...overrides
  }

  globalThis.window.api = api
}
