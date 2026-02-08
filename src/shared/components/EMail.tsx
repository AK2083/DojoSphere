import TextField from "@mui/material/TextField";

import useTranslations from "@shared/hooks/useTranslations";
import type { FormFieldProps } from "@shared/types/form-field-props";

export default function EMail({ field }: FormFieldProps) {
  const { translations } = useTranslations();

  const handleError = () => {
    if (!field.error) return " ";

    switch (field.error) {
      case "required":
        return translations.error.required;
      case "invalid_email":
        return translations.error.invalid_email;
      default:
        return field.error;
    }
  };

  return (
    <TextField
      error={!!field.error}
      helperText={handleError()}
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
