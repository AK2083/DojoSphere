import type { AppError } from '@shared/errors/app-error'

export type RegisterResult = { success: true } | { success: false; error: AppError }
