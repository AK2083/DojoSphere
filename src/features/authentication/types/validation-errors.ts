export const ValidationErrorCode = {
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PASSWORD: "INVALID_PASSWORD",
};

export type ValidationErrorCode = (typeof ValidationErrorCode)[keyof typeof ValidationErrorCode];
