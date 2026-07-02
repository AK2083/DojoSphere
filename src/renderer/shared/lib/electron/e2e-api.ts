import type { Competitor, CreateCompetitorInput, ElectronAPI } from '@shared/types/electron-api'

const PLAYWRIGHT_LOCAL_SESSIONS_KEY = 'dojosphere.e2e.localSessions'
const PLAYWRIGHT_COMPETITORS_KEY = 'dojosphere.e2e.competitors'

type LocalSessionEntry = { userId: string; displayName: string }

function loadLocalSessions(): Map<string, LocalSessionEntry> {
  try {
    const raw = sessionStorage.getItem(PLAYWRIGHT_LOCAL_SESSIONS_KEY)

    if (!raw) {
      return new Map()
    }

    return new Map(JSON.parse(raw) as Array<[string, LocalSessionEntry]>)
  } catch {
    return new Map()
  }
}

function saveLocalSessions(localSessions: Map<string, LocalSessionEntry>): void {
  sessionStorage.setItem(
    PLAYWRIGHT_LOCAL_SESSIONS_KEY,
    JSON.stringify([...localSessions.entries()])
  )
}

function loadCompetitors(): Competitor[] {
  try {
    const raw = sessionStorage.getItem(PLAYWRIGHT_COMPETITORS_KEY)

    return raw ? (JSON.parse(raw) as Competitor[]) : []
  } catch {
    return []
  }
}

function saveCompetitors(competitors: Competitor[]): void {
  sessionStorage.setItem(PLAYWRIGHT_COMPETITORS_KEY, JSON.stringify(competitors))
}

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
  const api: ElectronAPI = {
    getUsers: async () => [],
    addUser: async () => ({ id: 'local-user-id', sessionToken: 'local-session-token' }),
    ensureLocalSession: async (displayName) => {
      const id = 'local-user-id'
      const sessionToken = 'local-session-token'
      const localSessions = loadLocalSessions()

      localSessions.set(sessionToken, { userId: id, displayName })
      saveLocalSessions(localSessions)

      return {
        id,
        sessionToken,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString()
      }
    },
    getLocalSession: async (token) => {
      const session = loadLocalSessions().get(token)

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
      const localSessions = loadLocalSessions()
      const session = localSessions.get(token)

      if (!session) {
        throw new Error('Unauthorized')
      }

      const trimmedDisplayName = displayName.trim()

      if (!trimmedDisplayName) {
        throw new Error('Display name must not be empty')
      }

      session.displayName = trimmedDisplayName
      saveLocalSessions(localSessions)

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
    getCompetitors: async () => [...loadCompetitors()],
    getCompetitor: async (_token, id) => {
      const competitor = loadCompetitors().find((entry) => entry.id === id)

      if (!competitor) {
        throw new Error('Competitor not found')
      }

      return competitor
    },
    addCompetitor: async (_token, input) => {
      const competitors = loadCompetitors()
      const competitor = buildStubCompetitor(`competitor-${competitors.length + 1}`, input)

      competitors.push(competitor)
      saveCompetitors(competitors)

      return competitor
    },
    updateCompetitor: async (_token, id, input) => {
      const competitors = loadCompetitors()
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
        saveCompetitors(competitors)
      }

      return updated
    },
    deleteCompetitor: async (_token, id) => {
      const competitors = loadCompetitors()
      const index = competitors.findIndex((competitor) => competitor.id === id)

      if (index >= 0) {
        competitors.splice(index, 1)
        saveCompetitors(competitors)
      }
    },
    hasPermission: async () => true,
    getOsUsername: async () => 'TestUser',
    ...overrides
  }

  globalThis.window.api = api
}
