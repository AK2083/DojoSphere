import { classifyImportError, type ImportErrorCode } from '@shared/domain/competitor-import-errors'

import translationKeys from '../i18n/keys'

/** Maps import error codes to i18n keys shown in the import UI. */
export const IMPORT_ERROR_TRANSLATION_KEY: Record<ImportErrorCode, string> = {
  generic: translationKeys.steps.import.errors.generic,
  no_session: translationKeys.steps.import.errors.noSession,
  unauthorized: translationKeys.steps.import.errors.unauthorized,
  file_transfer: translationKeys.steps.import.errors.fileTransfer,
  database_schema: translationKeys.steps.import.errors.databaseSchema,
  database_error: translationKeys.steps.import.errors.databaseError,
  empty_workbook: translationKeys.steps.import.errors.emptyWorkbook,
  parse_failed: translationKeys.steps.import.errors.parseFailed
}

/** Maps per-row import failure codes to i18n keys. Extend when row errors gain detail. */
export const IMPORT_ROW_ERROR_TRANSLATION_KEY: Record<string, string> = {
  import_failed: translationKeys.steps.import.rowErrors.importFailed,
  validation_failed: translationKeys.steps.import.rowErrors.validationFailed,
  duplicate_competitor: translationKeys.steps.import.rowErrors.duplicateCompetitor,
  duplicate_in_import: translationKeys.steps.import.rowErrors.duplicateInImport
}

/**
 * Resolves an import execution failure to an i18n key for the user-facing message.
 *
 * @param error - Failure from preview or execute IPC.
 * @returns Translation key for {@link useTranslation}.
 */
export function importErrorTranslationKey(error: unknown): string {
  return IMPORT_ERROR_TRANSLATION_KEY[classifyImportError(error)]
}

/**
 * Resolves a per-row import failure code to an i18n key.
 *
 * @param errorCode - Optional row error code from the main process.
 * @returns Translation key, or `undefined` when no specific guidance exists.
 */
export function importRowErrorTranslationKey(errorCode: string | undefined): string | undefined {
  if (!errorCode) {
    return undefined
  }

  return IMPORT_ROW_ERROR_TRANSLATION_KEY[errorCode]
}

/**
 * Extracts the technical message from an import failure for logging.
 *
 * @param error - Failure from preview or execute IPC.
 * @returns Message safe to write to the local error log (not for UI).
 */
export function importErrorLogMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message
  }

  return String(error)
}
