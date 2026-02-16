import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectProps } from "@mui/material/Select";

import { useFieldContext } from "@shared/lib/form-context";

type SelectValue = string | number;

type Option<T extends SelectValue> = {
  value: T;
  label: string;
};

type CustomSelectFieldProps<T extends SelectValue> = SelectProps & {
  data: readonly Option<T>[];
  fieldLabel: string;
};

export default function CustomSelectField<T extends SelectValue>({
  data,
  fieldLabel,
  ...props
}: CustomSelectFieldProps<T>) {
  const field = useFieldContext<T>();
  const labelId = `${field.name}-label`;

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{fieldLabel}</InputLabel>
        <Select
          {...props}
          id={field.name}
          value={field.state.value ?? ""}
          label={fieldLabel}
          onChange={(e) => field.handleChange(e.target.value as T)}
          onBlur={field.handleBlur}
        >
          {data.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
