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

export default function ThemeModeSelector() {
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
            Theme
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bevorzugtes Theme der Anwendung
          </Typography>
        </Grid>

        <Grid display="flex" justifyContent="flex-end">
          <ToggleButtonGroup
            exclusive
            aria-label="Theme Mode auswählen"
            value={mode}
            onChange={onChangeMode}
          >
            <Tooltip title="Heller Modus">
              <ToggleButton value="light" aria-label="light mode">
                <SunIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Dunkler Modus">
              <ToggleButton value="dark" aria-label="dark mode">
                <MoonIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="System">
              <ToggleButton value="system" aria-label="system mode">
                <MonitorIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
}
