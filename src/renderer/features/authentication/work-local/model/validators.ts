export const DISPLAY_NAME_MIN_LETTERS = 3

export const WorkLocalErrorCode = {
  REQUIRED: 'required',
  MIN_LETTERS: 'minLetters'
} as const

export type WorkLocalErrorCode = (typeof WorkLocalErrorCode)[keyof typeof WorkLocalErrorCode]

/**
 * Counts Unicode letters in the given string.
 *
 * @param value - Input string to inspect.
 * @returns Number of letter characters (`\p{L}`), excluding digits and symbols.
 */
export function countLetters(value: string): number {
  return (value.match(/\p{L}/gu) ?? []).length
}

export const displayNameRules: ((value?: string) => true | WorkLocalErrorCode)[] = [
  (value) => !!value?.trim() || WorkLocalErrorCode.REQUIRED,
  (value) => countLetters(value ?? '') >= DISPLAY_NAME_MIN_LETTERS || WorkLocalErrorCode.MIN_LETTERS
]
