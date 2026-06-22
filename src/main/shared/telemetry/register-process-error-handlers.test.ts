import { beforeEach, describe, expect, it, vi } from 'vitest'

const captureException = vi.fn()
const errorLogger = vi.fn()

vi.mock('./capture-exception', () => ({
  captureException
}))

vi.mock('@main/shared/logging', () => ({
  createLogger: () => ({
    error: errorLogger
  })
}))

describe('registerProcessErrorHandlers', () => {
  const listeners = new Map<string, (value: unknown) => void>()

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    listeners.clear()

    vi.spyOn(process, 'on').mockImplementation((event, listener) => {
      listeners.set(String(event), listener as (value: unknown) => void)
      return process
    })

    const { resetProcessErrorHandlersForTests } = await import('./register-process-error-handlers')
    resetProcessErrorHandlersForTests()
  })

  it('captures uncaught exceptions and logs to the debug lane', async () => {
    const { registerProcessErrorHandlers } = await import('./register-process-error-handlers')

    registerProcessErrorHandlers()

    const error = new Error('fatal')
    listeners.get('uncaughtException')?.(error)

    expect(captureException).toHaveBeenCalledWith(error, 'main', 'uncaughtException')
    expect(errorLogger).toHaveBeenCalledWith('Uncaught exception', { message: 'fatal' })
  })

  it('captures unhandled rejections with error and non-error reasons', async () => {
    const { registerProcessErrorHandlers } = await import('./register-process-error-handlers')

    registerProcessErrorHandlers()

    const rejectedError = new Error('rejected promise')
    listeners.get('unhandledRejection')?.(rejectedError)

    expect(captureException).toHaveBeenCalledWith(rejectedError, 'main', 'unhandledRejection')

    listeners.get('unhandledRejection')?.('network down')

    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'network down' }),
      'main',
      'unhandledRejection'
    )
    expect(errorLogger).toHaveBeenCalledWith('Unhandled promise rejection', {
      message: 'network down'
    })
  })

  it('registers handlers only once', async () => {
    const { registerProcessErrorHandlers } = await import('./register-process-error-handlers')

    registerProcessErrorHandlers()
    registerProcessErrorHandlers()

    expect(process.on).toHaveBeenCalledTimes(2)
  })
})
