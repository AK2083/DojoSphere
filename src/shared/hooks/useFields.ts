import { useState } from "react";

import type { Validator } from "@shared/utils/validators";

export type Field<T> = {
  value: T;
  setValue: (v: T) => void;
  error: string | null;
  validate: () => boolean;
  reset: () => void;
};

export function useField<T>(initialValue: T, validator?: Validator<T> | undefined) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);

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
    reset: () => {
      setValue(initialValue);
      setError(null);
    },
  };
}
