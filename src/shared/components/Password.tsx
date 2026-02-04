import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import type { FormFieldProps } from "@shared/types/form-field-props";
import { getPasswordRules } from "@shared/utils/password-rules";

export default function Password({ field }: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const rules = getPasswordRules(field.value);

  const passwordHints = (
    <Typography variant="caption" component="span">
      Dein Passwort muss{" "}
      <Typography
        component="span"
        sx={{ color: rules.length ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        mindestens 8 Zeichen
      </Typography>
      ,{" "}
      <Typography
        component="span"
        sx={{ color: rules.letters ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        Groß- & Kleinbuchstaben
      </Typography>
      ,{" "}
      <Typography
        component="span"
        sx={{ color: rules.numbers ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        Zahlen
      </Typography>
      {" und "}
      <Typography
        component="span"
        sx={{ color: rules.special ? "success.main" : "text.secondary" }}
        variant="caption"
      >
        Sonderzeichen
      </Typography>
      {" enthalten."}
    </Typography>
  );

  const helperText = () => {
    // Fehler nur zeigen, solange Feld leer ist (Submit-Fall)
    if (field.error && field.value.length === 0) {
      return field.error;
    }

    // Sobald der User tippt → Regeln anzeigen
    if (field.value.length > 0) {
      return passwordHints;
    }

    // Leerzustand
    return " ";
  };

  return (
    <TextField
      error={!!field.error && field.value.length === 0}
      helperText={helperText()}
      id="password"
      label="Passwort"
      size="small"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
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
