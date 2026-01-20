import { getPasswordRules } from "@shared/utils/passwordRules";

export type Validator<T> = (value: T) => string | null;

export const required: Validator<string> = (v) => (v ? null : "Pflichtfeld");

export const emailValidator: Validator<string> = (mailaddress: string) => {
  if (!/^\S+@\S+\.\S+$/.test(mailaddress)) return "Ungültige E-Mail";
  return null;
};

export const passwordValidator: Validator<string> = (password: string) => {
  if (!password) return null;

  const rules = getPasswordRules(password);
  return Object.values(rules).every(Boolean) ? null : null;
};

export function composeValidators<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}
