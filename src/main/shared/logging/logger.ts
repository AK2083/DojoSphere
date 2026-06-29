import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'

/** Supported log levels for the main-process debug logger. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/** Structured context fields attached to a log line. */
export type LogContext = Record<string, string | number | boolean | null | undefined>

let logFilePath: string | null = null

/**
 * Configures the debug log file path under Electron userData.
 *
 * @param userDataPath Electron userData directory.
 */
export function initLogger(userDataPath: string): void {
  logFilePath = join(userDataPath, 'logs', 'app.log')
}

function formatContext(context?: LogContext): string {
  if (!context) {
    return ''
  }

  const parts = Object.entries(context)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${String(value)}`)

  return parts.length > 0 ? ` ${parts.join(' ')}` : ''
}

function writeToConsole(level: LogLevel, scope: string, message: string, context?: LogContext) {
  const prefix = `[dojosphere:${scope}]`

  switch (level) {
    case 'debug':
      console.debug(prefix, message, context ?? '')
      break
    case 'info':
      console.info(prefix, message, context ?? '')
      break
    case 'warn':
      console.warn(prefix, message, context ?? '')
      break
    case 'error':
      console.error(prefix, message, context ?? '')
      break
  }
}

async function writeToFile(level: LogLevel, scope: string, message: string, context?: LogContext) {
  if (!logFilePath) {
    return
  }

  const line = `${new Date().toISOString()} [${level}] [${scope}] ${message}${formatContext(context)}\n`

  try {
    // Path is resolved under Electron userData; not derived from untrusted input.
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted userData log directory
    await mkdir(dirname(logFilePath), { recursive: true })
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- trusted userData log directory
    await appendFile(logFilePath, line)
  } catch {
    // Debug logging must not break application flows.
  }
}

function write(level: LogLevel, scope: string, message: string, context?: LogContext) {
  writeToConsole(level, scope, message, context)
  void writeToFile(level, scope, message, context)
}

/** Scoped logger for the Electron main-process debug lane. */
export type Logger = {
  debug: (message: string, context?: LogContext) => void
  info: (message: string, context?: LogContext) => void
  warn: (message: string, context?: LogContext) => void
  error: (message: string, context?: LogContext) => void
}

/**
 * Creates a scoped logger for a main-process feature or module.
 *
 * @param scope Logical scope name, e.g. `users` or `bootstrap`.
 * @returns Logger with debug/info/warn/error methods.
 */
export function createLogger(scope: string): Logger {
  return {
    debug: (message, context) => write('debug', scope, message, context),
    info: (message, context) => write('info', scope, message, context),
    warn: (message, context) => write('warn', scope, message, context),
    error: (message, context) => write('error', scope, message, context)
  }
}

/**
 * Resets logger configuration (for tests).
 */
export function resetLogger(): void {
  logFilePath = null
}
