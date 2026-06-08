import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, createTestUserDataDir } from '../test/database'

const mockDb = {
  close: vi.fn(),
  prepare: vi.fn(),
  exec: vi.fn()
}

const mockDbNoClose = {
  prepare: vi.fn(),
  exec: vi.fn()
}

vi.mock('./drivers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./drivers')>()

  return {
    ...actual,
    loadBetterSqlite3Database: vi.fn(
      (...args: Parameters<typeof actual.loadBetterSqlite3Database>) =>
        actual.loadBetterSqlite3Database(...args)
    ),
    loadNodeSqliteDatabase: vi.fn((...args: Parameters<typeof actual.loadNodeSqliteDatabase>) =>
      actual.loadNodeSqliteDatabase(...args)
    )
  }
})

describe('connection', () => {
  afterEach(async () => {
    vi.clearAllMocks()
    await closeTestDatabase()
    vi.resetModules()
  })

  it('throws when the database was not initialized', async () => {
    vi.resetModules()
    const { getDatabase } = await import('./connection')

    expect(() => getDatabase()).toThrow('Database wurde noch nicht initialisiert.')
  })

  it('returns the same database instance on repeated init', async () => {
    vi.resetModules()
    createTestUserDataDir()

    const { initDatabase } = await import('./connection')
    const first = initDatabase()
    const second = initDatabase()

    expect(second).toBe(first)
  })

  it('uses better-sqlite3 when the native module is available', async () => {
    vi.resetModules()
    createTestUserDataDir()

    const drivers = await import('./drivers')
    vi.mocked(drivers.loadBetterSqlite3Database).mockReturnValue(mockDb as never)

    const { initDatabase } = await import('./connection')
    const db = initDatabase()

    expect(db).toBe(mockDb)
    expect(drivers.loadNodeSqliteDatabase).not.toHaveBeenCalled()
  })

  it('falls back to node:sqlite when better-sqlite3 throws a non-error value', async () => {
    vi.resetModules()
    createTestUserDataDir()

    const drivers = await import('./drivers')
    vi.mocked(drivers.loadBetterSqlite3Database).mockImplementation(() => {
      throw 'native module missing'
    })

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const { initDatabase } = await import('./connection')
    const db = initDatabase()

    expect(db).toBeDefined()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('native module missing'))
    expect(drivers.loadNodeSqliteDatabase).toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it('skips close when the database driver has no close method', async () => {
    vi.resetModules()
    createTestUserDataDir()

    const drivers = await import('./drivers')
    vi.mocked(drivers.loadBetterSqlite3Database).mockReturnValue(mockDbNoClose as never)

    const { initDatabase, closeDatabase } = await import('./connection')
    initDatabase()

    expect(() => closeDatabase()).not.toThrow()
  })
})
