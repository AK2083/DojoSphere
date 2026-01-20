import TextField from "@mui/material/TextField";

import type { Field } from "@shared/hooks/useFields";

type Props = {
  field: Field<string>;
};

export default function EMail({ field }: Props) {
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
