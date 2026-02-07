import TextField from "@mui/material/TextField";

import useTranslations from "@shared/hooks/useTranslations";
import type { FormFieldProps } from "@shared/types/form-field-props";

export default function EMail({ field }: FormFieldProps) {
  const { translations } = useTranslations();

  return (
    <TextField
      error={!!field.error}
      helperText={field.error ?? " "}
      id="email"
      label={translations.mail}
      size="small"
      type="text"
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
