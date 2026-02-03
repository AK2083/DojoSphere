import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

import LanguageSelector from "@features/settings/components/LanguageSelector";
import ThemeModeSelector from "@features/settings/components/ThemeModeSelector";

export default function Settings() {
  return (
    <>
      <Box sx={{ mx: 4, mt: 2 }}>
        <Typography variant="h2">Einstellungen</Typography>
        <LanguageSelector />
        <ThemeModeSelector />
      </Box>
    </>
  );
}
