/** Error payload forwarded from the renderer to the main-process log file. */
export type RecordErrorInput = {
  service: string
  action: string
  code?: string
  message: string
}

/** Cloud diagnostic upload preferences synced to the main process. */
export type DiagnosticsUploadPreferences = {
  autoUploadDiagnostics: boolean
}

/** Result of a SQLite health check exposed over IPC. */
export interface DbHealthcheckResult {
  ok: boolean
  version: string
}

/** Local user record stored in SQLite. */
export interface User {
  id: string
  displayName: string
  email: string | null
  userType: 'local' | 'device' | 'system'
  createdAt: string
  updatedAt: string | null
}

/** Input for creating a local user via IPC. */
export interface CreateUserInput {
  displayName: string
  email?: string | null
  userType?: 'local' | 'device' | 'system'
}

/** Result of adding a user, optionally including a new session. */
export interface AddUserResult {
  id: string
  sessionToken?: string
  expiresAt?: string
}

/** Active local session with embedded user profile. */
export interface LocalSession {
  id: string
  userId: string
  expiresAt: string
  createdAt: string
  user: User
}

/** Result of ensuring a local session for a display name. */
export interface EnsureLocalSessionResult {
  id: string
  sessionToken: string
  expiresAt: string
}

/** Tournament competitor record stored in SQLite. */
export interface Competitor {
  id: string
  givenName: string
  familyName: string
  club: string | null
  weightClass: string | null
  createdAt: string
  updatedAt: string | null
}

/** Input for creating a competitor via IPC. */
export interface CreateCompetitorInput {
  givenName: string
  familyName: string
  club?: string | null
  weightClass?: string | null
}

/** Input for updating a competitor via IPC. */
export interface UpdateCompetitorInput {
  givenName?: string
  familyName?: string
  club?: string | null
  weightClass?: string | null
}

/** Input for recording an audit event via IPC. */
export interface AuditRecordInput {
  token: string
  action: string
  entityType: string
  entityId?: string | null
  oldValueJson?: string | null
  newValueJson?: string | null
}

/** Audit event fields without the session token (added by the caller or shared lib). */
export type AuditEventPayload = Omit<AuditRecordInput, 'token'>

/** @deprecated Use {@link DiagnosticsUploadPreferences}. */
export type TelemetryUploadPreferences = DiagnosticsUploadPreferences

/** Typed IPC surface exposed on `window.api` by the preload script. */
export interface ElectronAPI {
  getUsers: () => Promise<User[]>
  addUser: (user: CreateUserInput) => Promise<AddUserResult>
  ensureLocalSession: (displayName: string) => Promise<EnsureLocalSessionResult>
  getLocalSession: (token: string) => Promise<LocalSession | null>
  revokeLocalSession: (token: string) => Promise<void>
  updateUserDisplayName: (token: string, displayName: string) => Promise<User>
  dbHealthcheck: () => Promise<DbHealthcheckResult>
  recordError: (input: RecordErrorInput) => Promise<void>
  setDiagnosticsUploadPreferences: (preferences: DiagnosticsUploadPreferences) => Promise<void>
  auditRecord: (input: AuditRecordInput) => Promise<void>
  getCompetitors: (token: string) => Promise<Competitor[]>
  addCompetitor: (token: string, input: CreateCompetitorInput) => Promise<Competitor>
  updateCompetitor: (token: string, id: string, input: UpdateCompetitorInput) => Promise<Competitor>
  deleteCompetitor: (token: string, id: string) => Promise<void>
  getOsUsername: () => Promise<string>
}
