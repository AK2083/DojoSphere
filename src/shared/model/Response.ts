import type { ApiError } from "@shared/model/Error";

export type ApiResult<T> = { success: true; data: T } | { success: false; error: ApiError };
