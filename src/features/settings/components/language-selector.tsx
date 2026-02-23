import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import useTranslations from "@features/settings/hooks/use-translations";
import { setLocalStorageItem } from "@lib/browser/local-storage";
import { languageOptions, type LanguageCode } from "@lib/i18n/available-languages";
import { useSelectedTranslation } from "@lib/i18n/use-selected-translation";
import { STORAGE_KEYS } from "@shared/constants/storage-keys";
import { useAppForm } from "@shared/lib/form-context";

export default function LanguageSelector() {
  const { translations } = useTranslations();
  const { language, changeLanguage } = useSelectedTranslation();

  const form = useAppForm({
    defaultValues: {
      language: language,
    },
  });

  function handleChangeLanguage(lang: LanguageCode) {
    changeLanguage(lang);
    setLocalStorageItem(STORAGE_KEYS.DEFAULT_LANGUAGE, lang);
  }

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
          <form.AppField
            name="language"
            validators={{
              onChange: ({ value }) => handleChangeLanguage(value),
            }}
            children={(field) => (
              <field.CustomSelectField<LanguageCode>
                fieldLabel={translations.language.title}
                data={languageOptions}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
