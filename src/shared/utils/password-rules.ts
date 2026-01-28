/**
 * Validates a password against common password rules.
 *
 * The function checks whether the given password
 * - contains at least one letter (a–z, A–Z),
 * - contains at least one number (0–9),
 * - contains at least one special character,
 * - and has a minimum length of 8 characters.
 *
 * @param password - The password string to validate
 * @returns An object containing boolean values for each password rule
 */
export function getPasswordRules(password: string) {
  return {
    letters: /[a-zA-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
    length: password.length >= 8,
  };
}
