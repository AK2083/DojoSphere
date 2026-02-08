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

import useTranslations from "@features/authentication/hooks/useTranslations";

import EMail from "@shared/components/EMail";
import Password from "@shared/components/Password";
import { useField } from "@shared/hooks/useFields";
import useSignUp from "@shared/hooks/useSignUp";
import {
  composeValidators,
  emailValidator,
  passwordValidator,
  required,
} from "@shared/utils/validators";

export default function RegisterForm() {
  const { translations } = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
  const email = useField<string>("", composeValidators(required, emailValidator));
  const password = useField<string>("", composeValidators(required, passwordValidator));
  const { signUp } = useSignUp();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    email.setTouched(true);
    password.setTouched(true);

    const isEmailValid = email.validate();
    const isPasswordValid = password.validate();

    if (!isEmailValid || !isPasswordValid) return;

    signUpUser();
  };

  const signUpUser = async () => {
    const result = await signUp(email.value, password.value);

    if (!result.success) {
      switch (result.error.code) {
        case "RATE_LIMITED":
          setFormError(translations.form.error.retry);
          break;

        default:
          setFormError(translations.form.error.unknown);
      }

      return;
    }
  };

  return (
    <>
      <Card
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: { xs: "95vw", md: "40vw" }, height: "65vh", p: 2 }}
      >
        <CardHeader title={translations.form.title} subheader={translations.form.description} />

        <CardContent>
          <Stack direction="column" spacing={0.25}>
            <EMail field={email} />
            <Password field={password} />
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button fullWidth variant="contained" type="submit">
            {translations.form.submit}
          </Button>
        </CardActions>

        {formError && (
          <Alert variant="filled" severity="error" sx={{ px: 2, mx: 2 }}>
            {formError}
          </Alert>
        )}

        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="body2">
            {translations.form.alreadyAccount} <Link href="#">{translations.form.logMeIn}</Link>
          </Typography>
        </Box>
      </Card>
    </>
  );
}
