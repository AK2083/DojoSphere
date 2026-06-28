import { createLogger } from './logger'

/**
 * Normalizes an unknown thrown value to an {@link Error}.
 *
 * @param value Thrown value from a catch block or process handler.
 * @returns Error instance.
 */
export function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

function resolveErrorCode(error: Error): string | undefined {
  if ('code' in error && typeof error.code === 'string') {
    return error.code
  }

  return undefined
}

/**
 * Records an application error to the main-process log file.
 *
 * @param error Error that occurred.
 * @param service Logical service or module name.
 * @param action Action that failed.
 */
export function logError(error: Error, service: string, action: string): void {
  const code = resolveErrorCode(error)
  const context: Record<string, string> = {}

  if (code) {
    context.code = code
  }

  createLogger(service).error(action, context)
}

/**
 * Runs a repository action and logs unexpected database failures.
 *
 * @param service Repository scope name.
 * @param action Action identifier.
 * @param fn Repository function to execute.
 * @returns Result of {@link fn}.
 */
export function withDbErrorLogging<T>(service: string, action: string, fn: () => T): T {
  try {
    return fn()
  } catch (error) {
    logError(toError(error), service, action)
    throw error
  }
}
