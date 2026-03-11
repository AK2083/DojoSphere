export class AppError extends Error {
  code: string
  details?: unknown

  constructor(code: string, message?: string, details?: unknown) {
    super(message)
    this.code = code
    this.details = details
  }
}
