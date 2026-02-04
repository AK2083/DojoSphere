import TextField from "@mui/material/TextField";

import type { FormFieldProps } from "@shared/types/form-field-props";

export default function EMail({ field }: FormFieldProps) {
  return (
    <TextField
      error={!!field.error}
      helperText={field.error ?? " "}
      id="email"
      label="E-Mail"
      size="small"
      slotProps={{
        formHelperText: {
          sx: { minHeight: 10 },
        },
      }}
      sx={{ pb: 2 }}
      value={field.value}
      onChange={(e) => field.setValue(e.target.value)}
    />
  );
}
