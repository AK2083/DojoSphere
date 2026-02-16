import { useState } from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import useSignUp from "@features/authentication/hooks/use-sign-up";
import useTranslations from "@features/authentication/hooks/use-translations";
import {
  monitorInformation,
  MONITORING_EVENTS,
} from "@features/authentication/monitoring/monitoring";
import { EMailValidator, PasswordValidator } from "@features/authentication/utils/validator";
import { useAppForm } from "@shared/lib/form-context";
import { ApiErrorCode } from "@shared/types/api-result";

type RegisterFormValues = {
  email: string;
  password: string;
};

export default function RegisterForm() {
  const { translations } = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useSignUp();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      monitorInformation(MONITORING_EVENTS.AUTH_REGISTER_SUBMITTED);
      signUpUser(value);
    },
  });

  const signUpUser = async (value: RegisterFormValues) => {
    const result = await signUp(value.email, value.password);

    if (!result.success) {
      switch (result.error.code) {
        case ApiErrorCode.RATE_LIMITED:
          setFormError(translations.form.error.retry);
          break;

        default:
          setFormError(translations.form.error.unknown);
      }

      return;
    }

    setFormError(null);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Card sx={{ width: { xs: "95vw", md: "40vw" }, height: "65vh", p: 2 }}>
        <CardHeader title={translations.form.title} subheader={translations.form.description} />

        <CardContent>
          <Stack direction="column" spacing={0.25}>
            <form.AppField
              name="email"
              validators={{
                onBlur: ({ value }) => EMailValidator(value),
              }}
              children={(field) => (
                <field.CustomTextField
                  label={translations.form.mail.title}
                  type="text"
                  errorMessages={{
                    INVALID_EMAIL: translations.form.mail.invalid,
                  }}
                />
              )}
            ></form.AppField>

            <form.AppField
              name="password"
              validators={{
                onBlur: ({ value }) => PasswordValidator(value),
              }}
              children={(field) => (
                <field.CustomTextField
                  label={translations.form.password.title}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password display"
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
                  errorMessages={{
                    INVALID_PASSWORD: translations.form.password.invalid,
                  }}
                />
              )}
            />
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <form.Button fullWidth variant="contained" type="submit">
            {translations.form.submit}
          </form.Button>
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
    </form>
  );
}
