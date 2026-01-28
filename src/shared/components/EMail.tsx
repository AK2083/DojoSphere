import TextField from "@mui/material/TextField";

import type { FormFieldProps } from "@shared/types/form-field-props";

export default function EMail({ field }: FormFieldProps) {
  return (
    <TextField
      id="email"
      size="small"
      label="E-Mail"
      value={field.value}
      helperText={field.error ?? " "}
      onChange={(e) => field.setValue(e.target.value)}
      error={!!field.error}
      sx={{ pb: 2 }}
      slotProps={{
        formHelperText: {
          sx: { minHeight: 10 },
        },
      }}
    />
  );
}
