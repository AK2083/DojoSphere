import { ValidationErrorCode } from "@features/authentication/types/validation-errors";

export function EMailValidator(mailaddress: string) {
  return !/^\S+@\S+\.\S+$/.test(mailaddress) ? ValidationErrorCode.INVALID_EMAIL : undefined;
}

export function PasswordValidator(password: string) {
  const MINPASSWORDLENGTH = 12;
  return !password || password.trim().length === 0 || password.trim().length < MINPASSWORDLENGTH
    ? ValidationErrorCode.INVALID_PASSWORD
    : undefined;
}
