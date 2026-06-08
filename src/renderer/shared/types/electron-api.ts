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

export interface ElectronAPI {
  getUsers: () => Promise<User[]>
  addUser: (user: CreateUserInput) => Promise<unknown>
  dbHealthcheck: () => Promise<DbHealthcheckResult>
}
