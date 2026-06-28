import { afterEach, describe, expect, it, vi } from 'vitest'

import { app } from '../test/electron-mock'

vi.mock('@main/shared/logging', () => ({
  initLogger: vi.fn()
}))

vi.mock('@main/shared/logging/register-process-error-handlers', () => ({
  registerProcessErrorHandlers: vi.fn()
}))

describe('initLogging', () => {
  afterEach(() => {
    vi.resetModules()
  })

  it('initializes logger and registers process error handlers', async () => {
    const { initLogger } = await import('@main/shared/logging')
    const { registerProcessErrorHandlers } =
      await import('@main/shared/logging/register-process-error-handlers')
    const { initLogging } = await import('./init-logging')

    initLogging()

    expect(app.getPath).toHaveBeenCalledWith('userData')
    expect(initLogger).toHaveBeenCalledWith('/tmp/dojosphere-test')
    expect(registerProcessErrorHandlers).toHaveBeenCalled()
  })
})
