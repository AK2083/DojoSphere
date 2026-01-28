import type { Validator } from "@shared/types/validator";
import { getPasswordRules } from "@shared/utils/password-rules";

/**
 * Validator to check if a string value is not empty.
 *
 * @param v - The string value to validate
 * @returns An error message if the value is empty, otherwise null
 */
export const required: Validator<string> = (v) => (v ? null : "Pflichtfeld");

/**
 * Validator to check if a string is a valid email address.
 *
 * @param mailaddress - The email address string to validate
 * @returns An error message if the email is invalid, otherwise null
 */
export const emailValidator: Validator<string> = (mailaddress: string) => {
  if (!/^\S+@\S+\.\S+$/.test(mailaddress)) return "Ungültige E-Mail";
  return null;
};

/**
 * Validator to check if a string meets password rules.
 *
 * Uses `getPasswordRules` to validate if the password:
 * - contains letters
 * - contains numbers
 * - contains special characters
 * - has a minimum length of 8
 *
 * @param password - The password string to validate
 * @returns An error message if the password does not meet the rules, otherwise null
 */
export const passwordValidator: Validator<string> = (password: string) => {
  if (!password) return null;

  const rules = getPasswordRules(password);
  return Object.values(rules).every(Boolean) ? null : null;
};

/**
 * Composes multiple validators into a single validator.
 *
 * The composed validator runs each validator in order,
 * returning the first error message encountered, or null if all pass.
 *
 * @param validators - An array of validator functions
 * @returns A single validator function that combines all provided validators
 */
export function composeValidators<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}
