import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useTranslations from "@features/authentication/hooks/use-translations";

export default function SuccessPage() {
  const { translations } = useTranslations();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 5, md: 6 },
          textAlign: "center",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />

        <Typography variant="h4" gutterBottom>
          {translations.success.title}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {translations.success.description}
        </Typography>

        <Button variant="text" size="small" sx={{ mb: 3 }}>
          {translations.success.resendMail}
        </Button>

        <Button variant="contained" fullWidth size="large">
          {translations.form.logMeIn}
        </Button>
      </Paper>
    </Box>
  );
}
