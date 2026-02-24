import { useEffect, type ReactNode } from "react";

import MonitorIcon from "@mui/icons-material/Monitor";
import MoonIcon from "@mui/icons-material/NightsStay";
import SunIcon from "@mui/icons-material/WbSunny";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useColorScheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { useSettingsForm } from "@features/settings/form/settings-form.config";
import useSettingTranslation from "@features/settings/hooks/use-translations";
import { type ThemeMode } from "@features/settings/types/theme-mode";

export default function ThemeModeSelector() {
  const { translations } = useSettingTranslation();
  const { mode, setMode } = useColorScheme();

  const form = useSettingsForm({
    defaultValues: {
      mode: "system" as ThemeMode,
    },
  });

  useEffect(() => {
    if (mode) {
      form.setFieldValue("mode", mode);
    }
  }, [mode, form]);

  const themeOptions = [
    {
      value: "light",
      icon: <SunIcon />,
      tooltip: translations.theme.tooltip.light,
    },
    {
      value: "dark",
      icon: <MoonIcon />,
      tooltip: translations.theme.tooltip.dark,
    },
    {
      value: "system",
      icon: <MonitorIcon />,
      tooltip: translations.theme.tooltip.system,
    },
  ] satisfies readonly {
    value: ThemeMode;
    icon: ReactNode;
    tooltip?: string;
  }[];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        px: 3,
        py: 2,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid size="grow">
          <Typography variant="subtitle1" fontWeight={500}>
            {translations.theme.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translations.theme.description}
          </Typography>
        </Grid>

        <Grid display="flex" justifyContent="flex-end">
          <form.AppField
            name="mode"
            validators={{
              onChange: ({ value }) => setMode(value),
            }}
            children={(field) => (
              <field.CustomButtonGroupField
                ariaLabel={translations.theme.title}
                options={themeOptions}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
