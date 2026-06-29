import { afterEach, describe, expect, it, vi } from 'vitest'

import { getIpcHandler } from '../../../test/electron-mock'

vi.mock('@main/shared/logging', () => ({
  logError: vi.fn()
}))

describe('registerLoggingIpc', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('forwards renderer errors to logError', async () => {
    const { logError } = await import('@main/shared/logging')
    const { registerLoggingIpc } = await import('./register')

    registerLoggingIpc()

    const handler = getIpcHandler('logging:recordError')
    handler(
      {},
      {
        service: 'auth',
        action: 'login',
        message: 'Invalid credentials',
        code: 'auth.invalid_credentials'
      }
    )

    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid credentials',
        code: 'auth.invalid_credentials'
      }),
      'auth',
      'login'
    )
  })

  it('forwards renderer errors without optional code', async () => {
    const { logError } = await import('@main/shared/logging')
    const { registerLoggingIpc } = await import('./register')

    registerLoggingIpc()

    const handler = getIpcHandler('logging:recordError')
    handler(
      {},
      {
        service: 'auth',
        action: 'login',
        message: 'Invalid credentials'
      }
    )

    const errorArg = vi.mocked(logError).mock.calls[0]?.[0]
    expect(errorArg).toEqual(expect.objectContaining({ message: 'Invalid credentials' }))
    expect(errorArg && 'code' in errorArg ? errorArg.code : undefined).toBeUndefined()
    expect(logError).toHaveBeenCalledWith(errorArg, 'auth', 'login')
  })
})
