import { createLogger } from '@main/shared/logging'

import { captureException } from './capture-exception'

const processLogger = createLogger('main:process')

let handlersRegistered = false

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

/**
 * Registers Node process handlers that capture unhandled errors to telemetry.
 *
 * Safe to call once after {@link initTelemetry}; subsequent calls are ignored.
 */
export function registerProcessErrorHandlers(): void {
  if (handlersRegistered) {
    return
  }

  handlersRegistered = true

  process.on('uncaughtException', (error) => {
    captureException(error, 'main', 'uncaughtException')
    processLogger.error('Uncaught exception', { message: error.message })
  })

  process.on('unhandledRejection', (reason) => {
    const error = toError(reason)
    captureException(error, 'main', 'unhandledRejection')
    processLogger.error('Unhandled promise rejection', { message: error.message })
  })
}

/**
 * Resets handler registration state (for tests).
 */
export function resetProcessErrorHandlersForTests(): void {
  handlersRegistered = false
}
