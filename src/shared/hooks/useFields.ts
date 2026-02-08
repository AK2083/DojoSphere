import { useState } from "react";

import type { ValidationError, Validator } from "@shared/types/validator";

/**
 * Custom React hook to manage a single form field with optional validation.
 *
 * Provides state and functions for the field value, validation, error handling, and reset.
 *
 * @template T - The type of the field's value.
 * @param initialValue - The initial value for the field
 * @param validator - Optional validator function to check the field's value
 * @returns An object conforming to the `Field<T>` type, containing:
 *  - `value`: current value
 *  - `setValue`: function to update the value
 *  - `error`: current validation error or null
 *  - `validate`: function to validate the current value
 *  - `reset`: function to reset the field to its initial state
 *
 * @example
 * const usernameField = useField<string>("", required);
 *
 * // Update value
 * usernameField.setValue("newUsername");
 *
 * // Validate
 * if (!usernameField.validate()) {
 *   console.error(usernameField.error);
 * }
 *
 * // Reset field
 * usernameField.reset();
 */
export function useField<T>(initialValue: T, validator?: Validator<T> | undefined) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<ValidationError | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = () => {
    const err = validator?.(value) ?? null;
    setError(err);
    return !err;
  };

  return {
    value,
    setValue,
    error,
    validate,
    touched,
    setTouched,
    reset: () => {
      setValue(initialValue);
      setError(null);
    },
  };
}
