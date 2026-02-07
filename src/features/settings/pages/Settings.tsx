import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

import LanguageSelector from "@features/settings/components/LanguageSelector";
import ThemeModeSelector from "@features/settings/components/ThemeModeSelector";
import useTranslations from "@features/settings/hooks/useTranslations";

export default function Settings() {
  const { translations } = useTranslations();

  return (
    <>
      <Box sx={{ mx: 4, mt: 2 }}>
        <Typography variant="h2">{translations.title}</Typography>
        <LanguageSelector />
        <ThemeModeSelector />
      </Box>
    </>
  );
}
