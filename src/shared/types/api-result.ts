import type { ApiError } from "@/shared/types/api-error";

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
