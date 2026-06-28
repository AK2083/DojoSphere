import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initLogger, resetLogger } from './logger'
import { logError, toError, withDbErrorLogging } from './log-error'

describe('logError', () => {
  beforeEach(async () => {
    resetLogger()
    const tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-logs-'))
    initLogger(tempDir)
  })

  afterEach(() => {
    resetLogger()
    vi.restoreAllMocks()
  })

  it('writes error logs through the logger', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const error = new Error('persist failed')
    Object.assign(error, { code: 'db_error' })

    logError(error, 'telemetry', 'persist')

    expect(errorSpy).toHaveBeenCalledWith('[dojosphere:telemetry]', 'persist', { code: 'db_error' })
  })

  it('normalizes non-error values with toError', () => {
    expect(toError('failure')).toEqual(new Error('failure'))
  })

  it('rethrows after logging in withDbErrorLogging', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() =>
      withDbErrorLogging('repo', 'query', () => {
        throw new Error('query failed')
      })
    ).toThrow('query failed')

    expect(errorSpy).toHaveBeenCalled()
  })
})
