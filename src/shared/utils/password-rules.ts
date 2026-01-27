export function getPasswordRules(password: string) {
  return {
    letters: /[a-zA-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
    length: password.length >= 8,
  };
}
