export type ApiError = {
  code: ApiErrorCode;
  message: string;
  field?: string;
  correlationId?: string;
};

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";
