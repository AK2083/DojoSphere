/** Result of probing Grafana Cloud OTLP reachability via main-process IPC. */
export type GrafanaReachabilityResult =
  | { reachable: true }
  | { reachable: false; reason: 'not_configured' | 'request_failed' }

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

/** Typed IPC surface exposed on `window.api` by the preload script. */
export interface ElectronAPI {
  getUsers: () => Promise<User[]>
  addUser: (user: CreateUserInput) => Promise<AddUserResult>
  ensureLocalSession: (displayName: string) => Promise<EnsureLocalSessionResult>
  getLocalSession: (token: string) => Promise<LocalSession | null>
  revokeLocalSession: (token: string) => Promise<void>
  updateUserDisplayName: (token: string, displayName: string) => Promise<User>
  dbHealthcheck: () => Promise<DbHealthcheckResult>
  checkGrafanaCloudReachability: () => Promise<GrafanaReachabilityResult>
  getOsUsername: () => Promise<string>
}
