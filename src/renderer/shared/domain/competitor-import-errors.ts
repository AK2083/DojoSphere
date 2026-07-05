/**
 * Stable import error codes exchanged between main and renderer.
 *
 * Codes are intentionally short strings so IPC can surface them without
 * leaking technical details to the UI. Extend this union when new actionable
 * failure modes are identified.
 */
export type ImportErrorCode =
  | 'database_schema'
  | 'database_error'
  | 'empty_workbook'
  | 'file_transfer'
  | 'generic'
  | 'no_session'
  | 'parse_failed'
  | 'unauthorized'

/** Prefix for structured import errors thrown across the Electron IPC boundary. */
export const IMPORT_IPC_ERROR_PREFIX = 'IMPORT:'

const IMPORT_ERROR_CODES: ReadonlySet<string> = new Set<ImportErrorCode>([
  'database_schema',
  'database_error',
  'empty_workbook',
  'file_transfer',
  'generic',
  'no_session',
  'parse_failed',
  'unauthorized'
])

function isImportErrorCode(value: string): value is ImportErrorCode {
  return IMPORT_ERROR_CODES.has(value)
}

/**
 * Builds an IPC-safe error message carrying a stable code and the original text
 * for logging on the receiving side.
 *
 * @param code - Actionable import error code.
 * @param originalMessage - Technical message for logs only.
 * @returns Error message in `IMPORT:<code>|<original>` form.
 */
export function buildImportIpcErrorMessage(code: ImportErrorCode, originalMessage: string): string {
  return `${IMPORT_IPC_ERROR_PREFIX}${code}|${originalMessage}`
}

/**
 * Classifies a technical failure into an actionable import error code.
 *
 * @param error - Thrown value from import preview or execution.
 * @returns A stable code for i18n lookup in the renderer.
 */
export function classifyImportError(error: unknown): ImportErrorCode {
  const message = error instanceof Error ? error.message : String(error)

  const prefixed = parsePrefixedImportError(message)

  if (prefixed) {
    return prefixed.code
  }

  const normalized = message.toLowerCase()

  if (normalized.includes('no local session')) {
    return 'no_session'
  }

  if (normalized.includes('unauthorized')) {
    return 'unauthorized'
  }

  if (normalized.includes('could not be cloned') || normalized.includes('could not be cloned.')) {
    return 'file_transfer'
  }

  if (normalized.includes('no such column') || normalized.includes('no such table')) {
    return 'database_schema'
  }

  if (
    normalized.includes('err_sqlite') ||
    normalized.includes('sqlite') ||
    normalized.includes('sql logic error')
  ) {
    return 'database_error'
  }

  if (normalized.includes('empty_workbook')) {
    return 'empty_workbook'
  }

  if (
    normalized.includes('invalid file') ||
    normalized.includes('unsupported') ||
    normalized.includes('cannot read') ||
    normalized.includes('corrupt')
  ) {
    return 'parse_failed'
  }

  return 'generic'
}

/**
 * Parses a structured import IPC error message.
 *
 * @param message - Raw error message, optionally prefixed with {@link IMPORT_IPC_ERROR_PREFIX}.
 * @returns Parsed code and original message when structured; otherwise `undefined`.
 */
export function parsePrefixedImportError(
  message: string
): { code: ImportErrorCode; originalMessage: string } | undefined {
  if (!message.startsWith(IMPORT_IPC_ERROR_PREFIX)) {
    return undefined
  }

  const payload = message.slice(IMPORT_IPC_ERROR_PREFIX.length)
  const separatorIndex = payload.indexOf('|')

  if (separatorIndex <= 0) {
    return undefined
  }

  const code = payload.slice(0, separatorIndex)

  if (!isImportErrorCode(code)) {
    return undefined
  }

  return {
    code,
    originalMessage: payload.slice(separatorIndex + 1)
  }
}

/**
 * Creates an {@link Error} suitable for throwing from import IPC handlers.
 *
 * @param error - Original failure.
 * @returns Error whose message encodes {@link ImportErrorCode} for the renderer.
 */
export function toImportIpcError(error: unknown): Error {
  const originalMessage = error instanceof Error ? error.message : String(error)
  const code = classifyImportError(error)

  return new Error(buildImportIpcErrorMessage(code, originalMessage))
}
