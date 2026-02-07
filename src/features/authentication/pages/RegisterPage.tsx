import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RegisterForm from "@features/authentication/components/RegisterForm";
import useTranslations from "@features/authentication/hooks/useTranslations";

export default function RegisterPage() {
  const { translations } = useTranslations();

  return (
    <Grid container minWidth="100vw" minHeight="100vh" alignItems="center" justifyContent="center">
      <Stack
        direction={{ xs: "column", md: "row" }}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <RegisterForm />
        <Card sx={{ width: { xs: "95vw", md: "40vw" }, height: "10vh" }}>
          <CardContent>
            <Stack height={150}>
              <Typography>{translations.useWithoutAuth}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Grid>
  );
}
