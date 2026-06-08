import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, createTestUserDataDir } from '../test/database'

const mockDb = {
  close: vi.fn(),
  prepare: vi.fn(),
  exec: vi.fn()
}

vi.mock('./drivers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./drivers')>()

  return {
    ...actual,
    createDatabaseSync: vi.fn((...args: Parameters<typeof actual.createDatabaseSync>) =>
      actual.createDatabaseSync(...args)
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

  it('opens the database via node:sqlite', async () => {
    vi.resetModules()
    createTestUserDataDir()

    const drivers = await import('./drivers')
    vi.mocked(drivers.createDatabaseSync).mockReturnValue(mockDb as never)

    const { initDatabase } = await import('./connection')
    const db = initDatabase()

    expect(db).toBe(mockDb)
    expect(drivers.createDatabaseSync).toHaveBeenCalledWith(expect.stringMatching(/database\.db$/))
  })

  it('closes the database connection', async () => {
    vi.resetModules()
    createTestUserDataDir()

    const drivers = await import('./drivers')
    vi.mocked(drivers.createDatabaseSync).mockReturnValue(mockDb as never)

    const { initDatabase, closeDatabase } = await import('./connection')
    initDatabase()
    closeDatabase()

    expect(mockDb.close).toHaveBeenCalled()
  })
})
