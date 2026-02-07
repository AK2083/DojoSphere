import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import useTranslations from "@shared/hooks/useTranslations";
import type { FormFieldProps } from "@shared/types/form-field-props";
import { getPasswordRules } from "@shared/utils/password-rules";

export default function Password({ field }: FormFieldProps) {
  const { translations } = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const rules = getPasswordRules(field.value);

  const passwordHints = (
    <Typography variant="caption" component="span">
      {translations.password.hints.common}{" "}
      <Typography
        component="span"
        sx={{ color: rules.length ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        {translations.password.hints.length}
      </Typography>
      ,{" "}
      <Typography
        component="span"
        sx={{ color: rules.letters ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        {translations.password.hints.uppercase}
      </Typography>
      ,{" "}
      <Typography
        component="span"
        sx={{ color: rules.numbers ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        {translations.password.hints.number}
      </Typography>
      {" " + translations.conjunction + " "}
      <Typography
        component="span"
        sx={{ color: rules.special ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        {translations.password.hints.special}
      </Typography>
      {" " + translations.contain}
    </Typography>
  );

  const helperText = () => {
    if (field.error && field.value.length === 0) {
      return field.error;
    }

    if (field.value.length > 0) {
      return passwordHints;
    }

    return " ";
  };

  return (
    <TextField
      error={!!field.error && field.value.length === 0}
      helperText={helperText()}
      id="password"
      label={translations.password.label}
      size="small"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={translations.password.toggle}
                edge="end"
                size="small"
                onClick={() => setShowPassword((previousState) => !previousState)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      type={showPassword ? "text" : "password"}
      value={field.value}
      onChange={(e) => field.setValue(e.target.value)}
    />
  );
}
