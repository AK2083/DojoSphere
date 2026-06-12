/**
 * Application-specific error class used for consistent error handling.
 *
 * `AppError` represents domain-level errors in the application and is
 * typically created when mapping external errors (e.g. Supabase errors)
 * to application-specific error codes.
 *
 * The `code` usually represents a translation key or internal error
 * identifier that can be used by the UI to display localized messages.
 */
export class AppError extends Error {
  code: string
  details?: unknown

  /**
   *
   * @param code
   * @param message
   * @param details
   */
  constructor(code: string, message?: string, details?: unknown) {
    super(message)
    this.code = code
    this.details = details
  }
}
