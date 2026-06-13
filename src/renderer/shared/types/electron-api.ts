export interface DbHealthcheckResult {
  ok: boolean
  version: string
}

export interface User {
  id: string
  displayName: string
  email: string | null
  userType: 'local' | 'device' | 'system'
  createdAt: string
  updatedAt: string | null
}

export interface CreateUserInput {
  displayName: string
  email?: string | null
  userType?: 'local' | 'device' | 'system'
}

export interface AddUserResult {
  id: string
  sessionToken?: string
  expiresAt?: string
}

export interface LocalSession {
  id: string
  userId: string
  expiresAt: string
  createdAt: string
  user: User
}

export interface ElectronAPI {
  getUsers: () => Promise<User[]>
  addUser: (user: CreateUserInput) => Promise<AddUserResult>
  getLocalSession: (token: string) => Promise<LocalSession | null>
  revokeLocalSession: (token: string) => Promise<void>
  dbHealthcheck: () => Promise<DbHealthcheckResult>
  getOsUsername: () => Promise<string>
}
