import MonitorIcon from "@mui/icons-material/Monitor";
import MoonIcon from "@mui/icons-material/NightsStay";
import SunIcon from "@mui/icons-material/WbSunny";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useColorScheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";

import useSettingTranslation from "@features/settings/hooks/useTranslations";

export default function ThemeModeSelector() {
  const { translations } = useSettingTranslation();
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  type ThemeMode = "light" | "dark" | "system";

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const onChangeMode = (_: React.MouseEvent<HTMLElement>, value: ThemeMode | null) => {
    if (value) setMode(value);
  };

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
          <ToggleButtonGroup
            exclusive
            aria-label={translations.theme.title}
            value={mode}
            onChange={onChangeMode}
          >
            <Tooltip title={translations.theme.tooltip.light}>
              <ToggleButton value="light" aria-label={translations.theme.tooltip.light}>
                <SunIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title={translations.theme.tooltip.dark}>
              <ToggleButton value="dark" aria-label={translations.theme.tooltip.dark}>
                <MoonIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title={translations.theme.tooltip.system}>
              <ToggleButton value="system" aria-label={translations.theme.tooltip.system}>
                <MonitorIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
}
