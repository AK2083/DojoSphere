import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createMainMonitoring } from './create-monitoring'
import { initLogger, resetLogger } from './logger'

describe('createMainMonitoring', () => {
  beforeEach(async () => {
    resetLogger()
    const tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-logs-'))
    initLogger(tempDir)
  })

  afterEach(() => {
    resetLogger()
    vi.restoreAllMocks()
  })

  it('forwards all log levels to the scoped logger', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined)
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const { logDebug, logInformation, logWarning, logError } = createMainMonitoring('feature')

    logDebug('feature.debug', { step: 'read' })
    logInformation('feature.info')
    logWarning('feature.warning', { code: 'retry' })
    logError('feature.error')

    expect(debugSpy).toHaveBeenCalledWith('[dojosphere:feature]', 'feature.debug', {
      step: 'read'
    })
    expect(infoSpy).toHaveBeenCalledWith('[dojosphere:feature]', 'feature.info', '')
    expect(warnSpy).toHaveBeenCalledWith('[dojosphere:feature]', 'feature.warning', {
      code: 'retry'
    })
    expect(errorSpy).toHaveBeenCalledWith('[dojosphere:feature]', 'feature.error', '')
  })
})
