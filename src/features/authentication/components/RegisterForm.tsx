import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import EMail from "@/shared/components/EMail";
import Password from "@/shared/components/Password";
import { useField } from "@/shared/hooks/useFields";
import {
  composeValidators,
  emailValidator,
  passwordValidator,
  required,
} from "@/shared/utils/validators";

import { RegistrationFailedException } from "@features/authentication/exceptions/RegistrationFailedException";
import { TooManyRequestsException } from "@features/authentication/exceptions/TooManyRequestsException";

import useSignUp from "@shared/hooks/useSignUp";

export default function RegisterForm() {
  const email = useField<string>("", composeValidators(required, emailValidator));
  const password = useField<string>("", composeValidators(required, passwordValidator));
  const { signUp } = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valid = [email.validate(), password.validate()].every(Boolean);
    if (!valid) return;

    let error: string = "";

    try {
      signUp(email.value, password.value);
    } catch (err) {
      if (err instanceof TooManyRequestsException) {
        error = "Zu viele Versuche. Bitte später erneut versuchen.";
      } else if (err instanceof RegistrationFailedException) {
        error = "Registrierung fehlgeschlagen.";
      } else {
        error = "Unbekannter Fehler. Bitte später erneut versuchen.";
      }
    }
  };

  return (
    <>
      <Card sx={{ width: { xs: "95vw", md: "40vw" }, height: "70vh", p: 2 }}>
        <CardHeader title="Registrierung" subheader="Neuen Benutzer registrieren" />
        <CardContent>
          <Stack
            direction="column"
            spacing={0.25}
            marginBottom={1}
            component="form"
            id="register-form"
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
        <Box sx={{ px: 2 }}>
          <Typography variant="body2">
            Ich habe schon einen Account. <Link href="#">Log mich ein.</Link>
          </Typography>
        </Box>
      </Card>
    </>
  );
}
