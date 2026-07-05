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

import type { CompetitorRegistrationStatus } from '@shared/domain/competitor-field-limits'

/** Gender code stored in `competitors.gender`. */
export type CompetitorGender = 'd' | 'f' | 'm'

export type { CompetitorRegistrationStatus }

/** Tournament competitor record stored in SQLite. */
export interface Competitor {
  id: string
  givenName: string
  familyName: string
  gender: CompetitorGender
  birthDate: string
  nationality: string
  passNumber: string
  club: string | null
  weightClass: string | null
  licenseNumber: string | null
  contactPhone: string | null
  contactPerson: string | null
  clubId: string
  weightClassId: string | null
  ageClassId: string
  gradeId: string | null
  startEligible: boolean
  registrationStatus: CompetitorRegistrationStatus | null
  remarks: string | null
  createdAt: string
  updatedAt: string | null
}

/** Optional detail fields shared by competitor create and update inputs. */
interface CompetitorDetailInput {
  gender?: CompetitorGender | null
  birthDate?: string | null
  nationality?: string | null
  passNumber?: string | null
  gradeId?: string | null
  licenseNumber?: string | null
  contactPhone?: string | null
  contactPerson?: string | null
  startEligible?: boolean | null
  registrationStatus?: CompetitorRegistrationStatus | null
  remarks?: string | null
}

/** Input for creating a competitor via IPC. */
export interface CreateCompetitorInput extends CompetitorDetailInput {
  givenName: string
  familyName: string
  club?: string | null
  weightClass?: string | null
  clubId?: string | null
  weightClassId?: string | null
  ageClassId?: string | null
}

/** Input for updating a competitor via IPC. */
export interface UpdateCompetitorInput extends CompetitorDetailInput {
  givenName?: string
  familyName?: string
  club?: string | null
  weightClass?: string | null
  clubId?: string | null
  weightClassId?: string | null
  ageClassId?: string | null
}

/** How a target field was mapped to a source column during import. */
export type ImportColumnMappingSource = 'data' | 'header' | 'manual'

/** A detected import source from an uploaded workbook (table column or form field). */
export interface ImportPreviewColumn {
  id: string
  sheetName: string
  header: string
  sampleValues: string[]
  /** `form` for single-value registration header fields; `column` for table columns. */
  sourceKind?: 'column' | 'form'
}

/** A target field an Excel column can be mapped to. */
export interface ImportTargetFieldInfo {
  key: string
  required: boolean
}

/** Result of previewing an uploaded workbook for import. */
export interface ImportPreviewResult {
  columns: ImportPreviewColumn[]
  fields: ImportTargetFieldInfo[]
  suggestedMapping: Record<string, string>
  sources: Record<string, ImportColumnMappingSource>
  mappingValid: boolean
  missingRequiredFields: string[]
  rowCount: number
}

/** Per-row outcome of executing a participant import. */
export interface ImportRowResult {
  index: number
  givenName: string
  familyName: string
  club: string
  success: boolean
  errorCode?: string
}

/** Aggregate result of executing a participant import. */
export interface ImportExecuteResult {
  results: ImportRowResult[]
  importedCount: number
  failedCount: number
}

/** Progress event emitted while executing a participant import. */
export interface ImportProgressEvent {
  processed: number
  total: number
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
  getCompetitor: (token: string, id: string) => Promise<Competitor>
  addCompetitor: (token: string, input: CreateCompetitorInput) => Promise<Competitor>
  updateCompetitor: (token: string, id: string, input: UpdateCompetitorInput) => Promise<Competitor>
  deleteCompetitor: (token: string, id: string) => Promise<void>
  importParticipantsPreview: (token: string, buffer: ArrayBuffer) => Promise<ImportPreviewResult>
  importParticipantsExecute: (
    token: string,
    buffer: ArrayBuffer,
    mapping: Record<string, string>
  ) => Promise<ImportExecuteResult>
  onImportParticipantsProgress: (listener: (progress: ImportProgressEvent) => void) => () => void
  hasPermission: (token: string, resource: string, action: string) => Promise<boolean>
  getOsUsername: () => Promise<string>
}
