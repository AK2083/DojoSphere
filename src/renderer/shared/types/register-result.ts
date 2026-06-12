import type { AppError } from '@shared/errors/app-error'

export type AuthActionResult = { success: true } | { success: false; error: AppError }
