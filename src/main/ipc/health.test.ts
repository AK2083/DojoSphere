import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeTestDatabase, initTestDatabase } from '../test/database'
import { getIpcHandler } from '../test/electron-mock'

describe('registerHealthIpc', () => {
  afterEach(async () => {
    await closeTestDatabase()
  })

  it('returns sqlite version from the healthcheck handler', async () => {
    await initTestDatabase()
    const { registerHealthIpc } = await import('./health')

    registerHealthIpc()

    const handler = getIpcHandler('db:healthcheck')
    const result = await handler()

    expect(result).toEqual({
      ok: true,
      version: expect.any(String)
    })
  })

  it('returns unknown when sqlite_version has no result', async () => {
    vi.resetModules()
    vi.doMock('../database/connection', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../database/connection')>()

      return {
        ...actual,
        getDatabase: () => ({
          prepare: () => ({
            get: () => undefined
          })
        })
      }
    })

    const { registerHealthIpc } = await import('./health')
    registerHealthIpc()

    const result = await getIpcHandler('db:healthcheck')()

    expect(result).toEqual({
      ok: true,
      version: 'unknown'
    })

    vi.doUnmock('../database/connection')
    vi.resetModules()
  })
})
