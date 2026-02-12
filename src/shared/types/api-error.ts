import type { ApiErrorCode } from "@shared/types/api-error-code";

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
