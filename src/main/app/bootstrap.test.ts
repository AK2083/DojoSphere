import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, createTestUserDataDir } from '../test/database'
import { getIpcHandler, ipcMain } from '../test/electron-mock'

describe('bootstrap', () => {
  beforeEach(() => {
    vi.resetModules()
    createTestUserDataDir()
  })

  afterEach(async () => {
    await closeTestDatabase()
  })

  it('initializes database, runs migrations, and registers ipc handlers', async () => {
    const { bootstrap } = await import('./bootstrap')
    const { db } = bootstrap()

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'")
      .all()

    expect(tables).toHaveLength(1)
    expect(ipcMain.handle).toHaveBeenCalledWith('db:healthcheck', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('users:list', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('users:add', expect.any(Function))

    const healthcheck = await getIpcHandler('db:healthcheck')()
    expect(healthcheck).toEqual({
      ok: true,
      version: expect.any(String)
    })
  })
})
