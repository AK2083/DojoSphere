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
export const ApiErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

/**
 * Represents an error returned from the API.
 *
 * @property code - The error code indicating the type of error. See `ApiErrorCode`.
 * @property message - A human-readable error message describing the problem.
 * @property field - (Optional) The specific field related to the error, if applicable.
 * @property correlationId - (Optional) A unique ID for tracing the request in logs or for support purposes.
 */
export type ApiError = {
  code: ApiErrorCode;
  message?: string;
  field?: string;
  correlationId?: string;
};

/**
 * Represents the result of an API call, which can be either a success or a failure.
 *
 * @template T - The type of the data returned on a successful API call.
 *
 * @example
 * // Success result
 * const result: ApiResult<User> = {
 *   success: true,
 *   data: { id: "123", name: "Alice" },
 * };
 *
 * // Error result
 * const errorResult: ApiResult<User> = {
 *   success: false,
 *   error: {
 *     code: "VALIDATION_ERROR",
 *     message: "Invalid email address",
 *     field: "email",
 *   },
 * };
 */
export type ApiResult<T> = { success: true; data: T } | { success: false; error: ApiError };
