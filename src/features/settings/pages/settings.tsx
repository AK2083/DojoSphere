import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import LanguageSelector from "@features/settings/components/language-selector";
import ThemeModeSelector from "@features/settings/components/theme-mode-selector";
import useTranslations from "@features/settings/hooks/use-translations";

export default function Settings() {
  const { translations } = useTranslations();

  return (
    <Box sx={{ mx: 4, mt: 2 }}>
      <Typography variant="h2">{translations.title}</Typography>
      <LanguageSelector />
      <ThemeModeSelector />
    </Box>
  );
}
