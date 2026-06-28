import { logError, toError } from './log-error'
import { createLogger } from './logger'

const processLogger = createLogger('main:process')

let handlersRegistered = false

/**
 * Registers Node process handlers that log unhandled errors.
 *
 * Safe to call once after {@link initLogger}; subsequent calls are ignored.
 */
export function registerProcessErrorHandlers(): void {
  if (handlersRegistered) {
    return
  }

  handlersRegistered = true

  process.on('uncaughtException', (error) => {
    logError(error, 'main', 'uncaughtException')
    processLogger.error('Uncaught exception', { message: error.message })
  })

  process.on('unhandledRejection', (reason) => {
    const error = toError(reason)
    logError(error, 'main', 'unhandledRejection')
    processLogger.error('Unhandled promise rejection', { message: error.message })
  })
}

/**
 * Resets handler registration state (for tests).
 */
export function resetProcessErrorHandlersForTests(): void {
  handlersRegistered = false
}
