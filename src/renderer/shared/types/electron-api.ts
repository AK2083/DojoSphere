export interface DbHealthcheckResult {
  ok: boolean
  version: string
}

export interface ElectronAPI {
  getUsers: () => Promise<Array<{ id: number; name: string; data: unknown }>>
  addUser: (user: { name: string; data: unknown }) => Promise<unknown>
  dbHealthcheck: () => Promise<DbHealthcheckResult>
}
