import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createLogger, initLogger, resetLogger } from './logger'

async function waitForLogContents(logFile: string, expected: string): Promise<string> {
  return vi.waitFor(
    async () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- vitest temp directory
      const contents = await readFile(logFile, 'utf8')
      expect(contents).toContain(expected)
      return contents
    },
    { timeout: 2000, interval: 20 }
  )
}

describe('main logger', () => {
  let tempDir = ''

  beforeEach(async () => {
    resetLogger()
    tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-logs-'))
    initLogger(tempDir)
  })

  afterEach(() => {
    resetLogger()
    vi.restoreAllMocks()
  })

  it('writes info logs to console and the debug log file', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    const logger = createLogger('test')

    logger.info('bootstrap complete', { step: 'ipc' })

    expect(infoSpy).toHaveBeenCalledWith('[dojosphere:test]', 'bootstrap complete', {
      step: 'ipc'
    })

    const logFile = join(tempDir, 'logs', 'app.log')
    await waitForLogContents(logFile, '[info] [test] bootstrap complete step=ipc')
  })

  it('writes debug, warning, and error logs through the matching console methods', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const logger = createLogger('levels')

    logger.debug('debug message')
    logger.warn('warn message', { code: 'retry' })
    logger.warn('solo warn')
    logger.error('error message')

    expect(debugSpy).toHaveBeenCalledWith('[dojosphere:levels]', 'debug message', '')
    expect(warnSpy).toHaveBeenCalledWith('[dojosphere:levels]', 'warn message', { code: 'retry' })
    expect(warnSpy).toHaveBeenCalledWith('[dojosphere:levels]', 'solo warn', '')
    expect(errorSpy).toHaveBeenCalledWith('[dojosphere:levels]', 'error message', '')
  })

  it('omits empty context fields from file log lines', async () => {
    const logger = createLogger('context')
    logger.info('message only', { ignored: undefined })

    const logFile = join(tempDir, 'logs', 'app.log')
    const contents = await waitForLogContents(logFile, '[info] [context] message only')
    expect(contents).not.toContain('ignored=')
  })

  it('skips file output when the logger has not been initialized', async () => {
    resetLogger()
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    const logger = createLogger('uninitialized')

    logger.info('console only')

    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(infoSpy).toHaveBeenCalledOnce()
  })
})
