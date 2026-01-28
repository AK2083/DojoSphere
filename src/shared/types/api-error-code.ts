/**
 * Represents the set of possible API error codes.
 *
 * These codes are used in `ApiError` to indicate the type of error returned by the API.
 *
 * @remarks
 * Common use cases include:
 * - VALIDATION_ERROR: The request failed due to invalid input.
 * - UNAUTHORIZED: The user is not authenticated.
 * - FORBIDDEN: The user does not have permission to perform the action.
 * - NOT_FOUND: The requested resource does not exist.
 * - CONFLICT: A resource conflict occurred (e.g., duplicate entry).
 * - RATE_LIMITED: Too many requests were made in a short period.
 * - INTERNAL_ERROR: An unexpected server error occurred.
 *
 * @example
 * const errorCode: ApiErrorCode = "VALIDATION_ERROR";
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";
