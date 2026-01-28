/**
 * Represents a controlled form field with value, validation, and reset capabilities.
 *
 * @template T - The type of the field's value.
 */
export type FormField<T> = {
  /** The current value of the field */
  value: T;
  /** Function to update the field's value */
  setValue: (v: T) => void;
  /** Current validation error message, or null if valid */
  error: string | null;
  /** Function to validate the field, returns true if valid */
  validate: () => boolean;
  /** Function to reset the field to its initial value and clear errors */
  reset: () => void;
};
