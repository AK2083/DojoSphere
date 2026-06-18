import type { AppError } from '@shared/errors/app-error'

/** Discriminated result for authentication actions in feature services. */
export type AuthActionResult = { success: true } | { success: false; error: AppError }
