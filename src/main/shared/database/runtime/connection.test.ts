import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, createTestUserDataDir } from '../../../test/database'

const mockDb = {
  close: vi.fn(),
  prepare: vi.fn(),
  exec: vi.fn()
}

vi.mock('../sqlite/driver', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../sqlite/driver')>()

  return {
    ...actual,
    createSqliteDatabase: vi.fn((...args: Parameters<typeof actual.createSqliteDatabase>) =>
      actual.createSqliteDatabase(...args)
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

    expect(() => getDatabase()).toThrow('Database has not been initialized yet.')
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

    const driver = await import('../sqlite/driver')
    vi.mocked(driver.createSqliteDatabase).mockReturnValue(mockDb as never)

    const { initDatabase } = await import('./connection')
    const db = initDatabase()

    expect(db).toBe(mockDb)
    expect(driver.createSqliteDatabase).toHaveBeenCalledWith(expect.stringMatching(/database\.db$/))
  })

  it('closes the database connection', async () => {
    vi.resetModules()
    createTestUserDataDir()

    const driver = await import('../sqlite/driver')
    vi.mocked(driver.createSqliteDatabase).mockReturnValue(mockDb as never)

    const { initDatabase, closeDatabase } = await import('./connection')
    initDatabase()
    closeDatabase()

    expect(mockDb.close).toHaveBeenCalled()
  })
})
