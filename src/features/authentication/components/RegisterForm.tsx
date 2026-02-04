import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import EMail from "@/shared/components/EMail";
import Password from "@/shared/components/Password";
import { useField } from "@/shared/hooks/useFields";
import {
  composeValidators,
  emailValidator,
  passwordValidator,
  required,
} from "@/shared/utils/validators";

import useSignUp from "@shared/hooks/useSignUp";

export default function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const email = useField<string>("", composeValidators(required, emailValidator));
  const password = useField<string>("", composeValidators(required, passwordValidator));
  const { signUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = [email.validate(), password.validate()].every(Boolean);
    if (!valid) return;

    const result = await signUp(email.value, password.value);

    if (!result.success) {
      switch (result.error.code) {
        case "RATE_LIMITED":
          setFormError("Zu viele Versuche. Bitte später erneut versuchen.");
          break;

        default:
          setFormError("Unbekannter Fehler. Bitte später erneut versuchen.");
      }

      return;
    }
  };

  return (
    <>
      <Card sx={{ width: { xs: "95vw", md: "40vw" }, height: "65vh", p: 2 }}>
        <CardHeader title="Registrierung" subheader="Neuen Benutzer registrieren" />
        <CardContent>
          <Stack
            component="form"
            direction="column"
            id="register-form"
            marginBottom={1}
            spacing={0.25}
            onSubmit={handleSubmit}
          >
            <EMail field={email} />
            <Password field={password} />
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button fullWidth variant="contained" type="submit" form="register-form">
            Registriere mich
          </Button>
        </CardActions>
        {formError && (
          <Alert variant="filled" severity="error" sx={{ px: 2, mx: 2 }}>
            {formError}
          </Alert>
        )}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="body2">
            Ich habe schon einen Account. <Link href="#">Log mich ein.</Link>
          </Typography>
        </Box>
      </Card>
    </>
  );
}
