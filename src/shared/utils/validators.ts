import { getPasswordRules } from "@shared/utils/passwordRules";

export type Validator<T> = (value: T) => string | null;

export const required: Validator<string> = (v) => (v ? null : "Pflichtfeld");

export const emailValidator: Validator<string> = (mailaddress: string) => {
  if (!mailaddress) return "E-Mail ist erforderlich";
  if (!/^\S+@\S+\.\S+$/.test(mailaddress)) return "Ungültige E-Mail";
  return null;
};

export const passwordValidator: Validator<string> = (password: string) => {
  const rules = getPasswordRules(password);
  return Object.values(rules).every(Boolean) ? null : "Passwort erfüllt nicht alle Regeln";
};
