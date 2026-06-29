import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initLogger, resetLogger } from './logger'
import {
  registerProcessErrorHandlers,
  resetProcessErrorHandlersForTests
} from './register-process-error-handlers'

describe('registerProcessErrorHandlers', () => {
  const handlers = new Map<string, (...args: unknown[]) => void>()

  beforeEach(async () => {
    resetLogger()
    resetProcessErrorHandlersForTests()
    handlers.clear()

    vi.spyOn(process, 'on').mockImplementation((event, listener) => {
      handlers.set(event as string, listener as (...args: unknown[]) => void)
      return process
    })

    const tempDir = await mkdtemp(join(tmpdir(), 'dojosphere-logs-'))
    initLogger(tempDir)
  })

  afterEach(() => {
    resetProcessErrorHandlersForTests()
    resetLogger()
    vi.restoreAllMocks()
  })

  it('registers handlers only once', () => {
    registerProcessErrorHandlers()
    const callCount = vi.mocked(process.on).mock.calls.length

    registerProcessErrorHandlers()

    expect(vi.mocked(process.on).mock.calls.length).toBe(callCount)
    expect(handlers.has('uncaughtException')).toBe(true)
    expect(handlers.has('unhandledRejection')).toBe(true)
  })

  it('logs uncaught exceptions', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    registerProcessErrorHandlers()

    const error = new Error('boom')
    handlers.get('uncaughtException')!(error)

    expect(errorSpy).toHaveBeenCalledWith('[dojosphere:main:process]', 'Uncaught exception', {
      message: 'boom'
    })
    expect(errorSpy).toHaveBeenCalledWith('[dojosphere:main]', 'uncaughtException', {})
  })

  it('logs unhandled rejections', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    registerProcessErrorHandlers()

    handlers.get('unhandledRejection')!('rejected')

    expect(errorSpy).toHaveBeenCalledWith(
      '[dojosphere:main:process]',
      'Unhandled promise rejection',
      { message: 'rejected' }
    )
    expect(errorSpy).toHaveBeenCalledWith('[dojosphere:main]', 'unhandledRejection', {})
  })
})
