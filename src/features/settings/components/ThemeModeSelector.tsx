import MoonIcon from "@mui/icons-material/NightsStay";
import SunIcon from "@mui/icons-material/WbSunny";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import React from "react";
export default function ThemeModeSelector() {
  const [alignment, setAlignment] = React.useState<string | null>("left");

  const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
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
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton value="left" aria-label="left aligned">
                  <SunIcon />
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                  <MoonIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            }
            label={undefined}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
