import type { ReactNode, MouseEvent } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import { useFieldContext } from "@shared/lib/form-context";

type ToggleOption<T extends string> = {
  value: T;
  icon: ReactNode;
  tooltip?: string;
};

type ToggleButtonGroupFieldProps<T extends string> = {
  options: readonly ToggleOption<T>[];
  ariaLabel?: string;
};

export default function CustomButtonGroupField<T extends string>({
  options,
  ariaLabel,
}: ToggleButtonGroupFieldProps<T>) {
  const field = useFieldContext<T>();

  function handleChange(_: MouseEvent<HTMLElement>, value: T | null) {
    if (value !== null) {
      field.handleChange(value);
    }
  }

  return (
    <ToggleButtonGroup
      exclusive
      aria-label={ariaLabel}
      value={field.state.value ?? null}
      onChange={handleChange}
    >
      {options.map((option) => (
        <Tooltip key={option.value} title={option.tooltip ?? ""}>
          <ToggleButton value={option.value} aria-label={option.tooltip}>
            {option.icon}
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
}
