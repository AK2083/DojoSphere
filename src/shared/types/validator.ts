/**
 * A generic validator type.
 *
 * A validator function takes a value of type T
 * and returns a string error message if the value is invalid,
 * or null if the value is valid.
 */
export type Validator<T> = (value: T) => string | null;
