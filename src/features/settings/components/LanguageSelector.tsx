import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import useTranslations from "@features/settings/hooks/useTranslations";

import { AVAILABLE_LANGUAGES } from "@shared/constants/AvailableLanguages";
import { useSelectedTranslation } from "@shared/hooks/useI18n";

export default function LanguageSelector() {
  const { translations } = useTranslations();
  const { language, changeLanguage } = useSelectedTranslation();

  const languageItem = AVAILABLE_LANGUAGES.map((item) => (
    <MenuItem key={item.code} value={item.code}>
      {item.name}
    </MenuItem>
  ));

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        px: 3,
        py: 2,
        my: 2,
        flexGrow: 1,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid size="grow">
          <Typography variant="subtitle1" fontWeight={500}>
            {translations.language.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translations.language.description}
          </Typography>
        </Grid>

        <Grid display="flex" size={6} justifyContent="flex-end">
          <FormControl fullWidth size="small">
            <InputLabel id="language-label">Sprache</InputLabel>
            <Select
              label="Sprache"
              labelId="language-label"
              value={language}
              onChange={(e) => changeLanguage(e.target.value as typeof language)}
            >
              {languageItem}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
