import { Visibility, VisibilityOff, Check } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { useField } from "../../../shared/hooks/useFields";
import { getPasswordRules } from "../../../shared/utils/passwordRules";
import { emailValidator, passwordValidator } from "../../../shared/utils/validators";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const email = useField<string>("", emailValidator);
  const password = useField<string>("", passwordValidator);

  const color = (ok: boolean) => (ok ? "success.main" : "text.secondary");

  const rules = getPasswordRules(password.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valid = [email.validate(), password.validate()].every(Boolean);

    if (!valid) return;
  };

  return (
    <Card sx={{ width: "40vw", height: "70vh", p: 2 }}>
      <CardHeader title="Registrierung" subheader="Neuen Benutzer registrieren" />
      <CardContent>
        <Stack
          direction="column"
          spacing={1}
          marginBottom={1}
          component="form"
          id="register-form"
          onSubmit={handleSubmit}
        >
          <TextField
            id="email"
            size="small"
            label="E-Mail"
            value={email.value}
            helperText={email.error}
            onChange={(e) => email.setValue(e.target.value)}
            error={!!email.error}
            sx={{ pb: 2 }}
          />
          <TextField
            id="password"
            size="small"
            label="Passwort"
            helperText={password.error}
            type={showPassword ? "text" : "password"}
            value={password.value}
            onChange={(e) => password.setValue(e.target.value)}
            error={!!password.error}
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
        <Stack direction="column" spacing={0.5} sx={{ ml: 0.5 }}>
          <Typography
            sx={{ display: "flex", alignItems: "center", color: color(rules.letters) }}
            variant="caption"
          >
            <IconButton
              aria-label="checked password rule"
              size="small"
              onClick={() => setShowPassword((previousState) => !previousState)}
              sx={{ mr: 0.25 }}
            >
              <Check sx={{ fontSize: 14 }} />
            </IconButton>
            Es beinhaltet große und kleine Buchstaben
          </Typography>
          <Typography sx={{ display: "flex", color: color(rules.numbers) }} variant="caption">
            <IconButton
              aria-label="checked password rule"
              size="small"
              onClick={() => setShowPassword((previousState) => !previousState)}
              sx={{ mr: 0.25 }}
            >
              <Check sx={{ fontSize: 14 }} />
            </IconButton>
            Dein Passwort beinhaltet Zahlen
          </Typography>
          <Typography sx={{ display: "flex", color: color(rules.special) }} variant="caption">
            <IconButton
              aria-label="checked password rule"
              size="small"
              onClick={() => setShowPassword((previousState) => !previousState)}
              sx={{ mr: 0.25 }}
            >
              <Check sx={{ fontSize: 14 }} />
            </IconButton>
            Es hat Sonderzeichen (möglichst keine sprachabhängigen)
          </Typography>
          <Typography sx={{ display: "flex", color: color(rules.length) }} variant="caption">
            <IconButton
              aria-label="checked password rule"
              size="small"
              onClick={() => setShowPassword((previousState) => !previousState)}
              sx={{ mr: 0.25 }}
            >
              <Check sx={{ fontSize: 14 }} />
            </IconButton>
            Dein Passwort sollte eine min. eine Länge von 8 Zeichen haben
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button fullWidth variant="contained" type="submit" form="register-form">
          Registriere mich
        </Button>
      </CardActions>
      <Box sx={{ px: 2 }}>
        <Typography variant="body2">
          Ich habe schon einen Account. <Link href="#">Log mich ein.</Link>
        </Typography>
      </Box>
    </Card>
  );
}
