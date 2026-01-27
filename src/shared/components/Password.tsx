import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { getPasswordRules } from "@/shared/utils/password-rules";

import type { Field } from "@shared/hooks/useFields";

type Props = {
  field: Field<string>;
};

export default function Password({ field }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const rules = getPasswordRules(field.value);

  const passwordHints = (
    <Typography variant="caption" component="span">
      Dein Passwort muss{" "}
      <Typography
        variant="caption"
        component="span"
        sx={{ color: rules.length ? "success.main" : "text.secondary" }}
      >
        mindestens 8 Zeichen
      </Typography>
      ,{" "}
      <Typography
        variant="caption"
        component="span"
        sx={{ color: rules.letters ? "success.main" : "text.secondary" }}
      >
        Groß- & Kleinbuchstaben
      </Typography>
      ,{" "}
      <Typography
        variant="caption"
        component="span"
        sx={{ color: rules.numbers ? "success.main" : "text.secondary" }}
      >
        Zahlen
      </Typography>
      {" und "}
      <Typography
        variant="caption"
        component="span"
        sx={{ color: rules.special ? "success.main" : "text.secondary" }}
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
      id="password"
      size="small"
      label="Passwort"
      helperText={helperText()}
      type={showPassword ? "text" : "password"}
      value={field.value}
      onChange={(e) => field.setValue(e.target.value)}
      error={!!field.error && field.value.length === 0}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                size="small"
                onClick={() => setShowPassword((previousState) => !previousState)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
