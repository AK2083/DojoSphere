import type {
  Association,
  Competitor,
  CreateAssociationInput,
  CreateCompetitorInput,
  ElectronAPI
} from '@shared/types/electron-api'

const PLAYWRIGHT_LOCAL_SESSIONS_KEY = 'dojosphere.e2e.localSessions'
const PLAYWRIGHT_COMPETITORS_KEY = 'dojosphere.e2e.competitors'

type LocalSessionEntry = { userId: string; displayName: string }

/** Persisted competitor fields without personal data (Playwright browser-only stub). */
type PlaywrightStoredCompetitor = Omit<
  Competitor,
  | 'gender'
  | 'birthDate'
  | 'nationality'
  | 'passNumber'
  | 'licenseNumber'
  | 'contactPhone'
  | 'contactPerson'
  | 'remarks'
>

type FictionalCompetitorSensitiveDetails = Pick<
  Competitor,
  | 'gender'
  | 'birthDate'
  | 'nationality'
  | 'passNumber'
  | 'licenseNumber'
  | 'contactPhone'
  | 'contactPerson'
  | 'remarks'
>

/**
 * Fictional sensitive fields for Playwright seeds — not real personal data.
 * Keyed by given name so competitors can be rehydrated after a full page reload.
 */
const FICTIONAL_COMPETITOR_SENSITIVE_BY_GIVEN_NAME: Record<
  string,
  FictionalCompetitorSensitiveDetails
> = {
  Yuki: {
    gender: 'm',
    birthDate: '2011-04-12',
    nationality: 'DE',
    passNumber: 'JP-000142',
    licenseNumber: 'WL-2024-001',
    contactPhone: '+49 555 010201',
    contactPerson: 'S. Fischer',
    remarks: null
  },
  Anna: {
    gender: 'f',
    birthDate: '2013-08-03',
    nationality: 'DE',
    passNumber: 'JP-000287',
    licenseNumber: 'WL-2024-014',
    contactPhone: '+49 555 010202',
    contactPerson: 'M. Keller',
    remarks: null
  },
  Leo: {
    gender: 'm',
    birthDate: '2009-11-21',
    nationality: 'AT',
    passNumber: 'JP-000391',
    licenseNumber: 'WL-2024-028',
    contactPhone: '+43 555 010203',
    contactPerson: 'T. Brandt',
    remarks: null
  }
}

const DEFAULT_FICTIONAL_SENSITIVE_DETAILS: FictionalCompetitorSensitiveDetails = {
  gender: 'f',
  birthDate: '2000-01-01',
  nationality: 'DE',
  passNumber: '00000000',
  licenseNumber: null,
  contactPhone: null,
  contactPerson: null,
  remarks: null
}

let competitorsMemory: Competitor[] | null = null

function stripSensitiveFields(competitor: Competitor): PlaywrightStoredCompetitor {
  return {
    id: competitor.id,
    givenName: competitor.givenName,
    familyName: competitor.familyName,
    association: competitor.association,
    weightClass: competitor.weightClass,
    associationId: competitor.associationId,
    weightClassId: competitor.weightClassId,
    ageClassId: competitor.ageClassId,
    gradeId: competitor.gradeId,
    startEligible: competitor.startEligible,
    registrationStatus: competitor.registrationStatus,
    createdAt: competitor.createdAt,
    updatedAt: competitor.updatedAt
  }
}

function resolveFictionalSensitiveDetails(givenName: string): FictionalCompetitorSensitiveDetails {
  return (
    FICTIONAL_COMPETITOR_SENSITIVE_BY_GIVEN_NAME[givenName] ?? DEFAULT_FICTIONAL_SENSITIVE_DETAILS
  )
}

function rehydrateStoredCompetitor(stored: PlaywrightStoredCompetitor): Competitor {
  return {
    ...stored,
    ...resolveFictionalSensitiveDetails(stored.givenName)
  }
}

function loadStoredCompetitors(): PlaywrightStoredCompetitor[] {
  try {
    const raw = sessionStorage.getItem(PLAYWRIGHT_COMPETITORS_KEY)

    return raw ? (JSON.parse(raw) as PlaywrightStoredCompetitor[]) : []
  } catch {
    return []
  }
}

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
  if (competitorsMemory) {
    return competitorsMemory
  }

  competitorsMemory = loadStoredCompetitors().map(rehydrateStoredCompetitor)

  return competitorsMemory
}

function saveCompetitors(competitors: Competitor[]): void {
  competitorsMemory = competitors
  sessionStorage.setItem(
    PLAYWRIGHT_COMPETITORS_KEY,
    JSON.stringify(competitors.map(stripSensitiveFields))
  )
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
    association: input.association ?? null,
    weightClass: input.weightClass ?? null,
    licenseNumber: input.licenseNumber ?? null,
    contactPhone: input.contactPhone ?? null,
    contactPerson: input.contactPerson ?? null,
    associationId: input.associationId ?? 'stub-association-id',
    weightClassId: input.weightClassId ?? 'stub-weight-class-id',
    ageClassId: input.ageClassId ?? 'stub-age-class-id',
    gradeId: input.gradeId ?? null,
    startEligible: input.startEligible ?? true,
    registrationStatus: input.registrationStatus ?? null,
    remarks: input.remarks ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: null
  }
}

/**
 * Builds a stub association record for Playwright browser-only stubs.
 *
 * @param id - Generated association identifier.
 * @param input - Association create/update input from the form.
 * @returns A fully populated association record.
 */
function buildStubAssociation(id: string, input: CreateAssociationInput): Association {
  return {
    id,
    name: input.name,
    shortName: input.shortName ?? null,
    city: input.city ?? null,
    website: input.website ?? null,
    isActive: input.isActive ?? true,
    source: input.source ?? 'manual',
    createdAt: new Date().toISOString(),
    districtName: 'Placeholder District',
    districtShortName: null,
    regionalFederationName: 'Placeholder Regional Federation',
    regionalFederationShortName: null,
    federationName: 'Deutscher Judo-Bund',
    federationShortName: 'DJB',
    countryName: 'Germany',
    identifiers: (input.identifiers ?? []).map((identifier) => ({
      type: identifier.type,
      value: identifier.value,
      authority: identifier.authority ?? null
    })),
    addresses: (input.addresses ?? []).map((address) => ({
      street: address.street ?? null,
      houseNumber: address.houseNumber ?? null,
      postalCode: address.postalCode ?? null,
      city: address.city ?? null,
      countryCode: address.countryCode ?? null,
      addressType: address.addressType
    })),
    contacts: (input.contacts ?? []).map((contact) => ({
      contactType: contact.contactType,
      value: contact.value,
      label: contact.label ?? null,
      isPublic: contact.isPublic ?? false
    }))
  }
}

/**
 * Installs a stub `window.api` when Playwright runs the renderer in a browser
 * without Electron (see `VITE_PLAYWRIGHT_BROWSER_ONLY` in `.env.e2e`).
 *
 * @param overrides - Optional API method overrides (e.g. custom `getOsUsername` in Storybook).
 */
export function installPlaywrightBrowserElectronApi(overrides: Partial<ElectronAPI> = {}) {
  competitorsMemory = null

  const associations: Association[] = []

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
        association: input.association ?? base.association,
        weightClass: input.weightClass ?? base.weightClass,
        licenseNumber: input.licenseNumber ?? base.licenseNumber,
        contactPhone: input.contactPhone ?? base.contactPhone,
        contactPerson: input.contactPerson ?? base.contactPerson,
        associationId: input.associationId ?? base.associationId,
        weightClassId: input.weightClassId ?? base.weightClassId,
        ageClassId: input.ageClassId ?? base.ageClassId,
        gradeId: input.gradeId ?? base.gradeId,
        startEligible: input.startEligible ?? base.startEligible,
        registrationStatus: input.registrationStatus ?? base.registrationStatus,
        remarks: input.remarks ?? base.remarks,
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
    getAssociations: async () => [...associations],
    getAssociation: async (_token, id) => {
      const association = associations.find((entry) => entry.id === id)

      if (!association) {
        throw new Error('Association not found')
      }

      return association
    },
    addAssociation: async (_token, input) => {
      const association = buildStubAssociation(`association-${associations.length + 1}`, input)

      associations.push(association)

      return association
    },
    updateAssociation: async (_token, id, input) => {
      const index = associations.findIndex((association) => association.id === id)
      const base =
        index >= 0
          ? associations[index]!
          : buildStubAssociation(id, { name: input.name ?? 'Association' })
      const updated: Association = {
        ...base,
        name: input.name ?? base.name,
        shortName: input.shortName === undefined ? base.shortName : input.shortName,
        city: input.city === undefined ? base.city : input.city,
        website: input.website === undefined ? base.website : input.website,
        isActive: input.isActive ?? base.isActive,
        identifiers:
          input.identifiers === undefined
            ? base.identifiers
            : input.identifiers.map((identifier) => ({
                type: identifier.type,
                value: identifier.value,
                authority: identifier.authority ?? null
              })),
        addresses:
          input.addresses === undefined
            ? base.addresses
            : input.addresses.map((address) => ({
                street: address.street ?? null,
                houseNumber: address.houseNumber ?? null,
                postalCode: address.postalCode ?? null,
                city: address.city ?? null,
                countryCode: address.countryCode ?? null,
                addressType: address.addressType
              })),
        contacts:
          input.contacts === undefined
            ? base.contacts
            : input.contacts.map((contact) => ({
                contactType: contact.contactType,
                value: contact.value,
                label: contact.label ?? null,
                isPublic: contact.isPublic ?? false
              }))
      }

      if (index >= 0) {
        associations[index] = updated
      } else {
        associations.push(updated)
      }

      return updated
    },
    deleteAssociation: async (_token, id) => {
      const index = associations.findIndex((association) => association.id === id)

      if (index >= 0) {
        associations.splice(index, 1)
      }
    },
    importParticipantsPreview: async () => ({
      columns: [
        { id: 'sheet1#0', sheetName: 'Sheet1', header: 'Given name', sampleValues: ['Yuki'] },
        { id: 'sheet1#1', sheetName: 'Sheet1', header: 'Family name', sampleValues: ['Tanaka'] },
        { id: 'sheet1#2', sheetName: 'Sheet1', header: 'Association', sampleValues: ['Dojo Nord'] }
      ],
      fields: [
        { key: 'givenName', required: true },
        { key: 'familyName', required: true },
        { key: 'association', required: false }
      ],
      suggestedMapping: {
        givenName: 'sheet1#0',
        familyName: 'sheet1#1',
        association: 'sheet1#2'
      },
      sources: {
        givenName: 'header',
        familyName: 'header',
        association: 'header'
      },
      mappingValid: true,
      missingRequiredFields: [],
      rowCount: 1
    }),
    importParticipantsExecute: async () => ({
      results: [
        {
          index: 0,
          givenName: 'Yuki',
          familyName: 'Tanaka',
          association: 'Dojo Nord',
          success: true
        }
      ],
      importedCount: 1,
      failedCount: 0
    }),
    onImportParticipantsProgress: () => () => undefined,
    getSyncTimestamps: async () => ({
      countries: null,
      federations: null,
      regionalFederations: null,
      districts: null,
      associations: null,
      localAssociationIds: []
    }),
    applySync: async () => undefined,
    onSyncProgress: () => () => undefined,
    hasPermission: async () => true,
    getOsUsername: async () => 'TestUser',
    ...overrides
  }

  globalThis.window.api = api
}
