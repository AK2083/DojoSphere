import MoonIcon from "@mui/icons-material/NightsStay";
import SunIcon from "@mui/icons-material/WbSunny";
import { Box, FormControlLabel, InputLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import React from "react";

export default function Settings() {
  const [language, setLanguage] = React.useState("");

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const [alignment, setAlignment] = React.useState<string | null>("left");

  const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      <Box sx={{ mx: 4, mt: 2 }}>
        <Typography variant="h2">Einstellungen</Typography>

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
                Sprache
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bevorzugte Sprache der Anwendung
              </Typography>
            </Grid>

            <Grid display="flex" size={6} justifyContent="flex-end">
              <FormControl fullWidth size="small">
                <InputLabel id="language-label">Sprache</InputLabel>
                <Select
                  labelId="language-label"
                  value={language}
                  label="Sprache"
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="de">Deutsch</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

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
      </Box>
    </>
  );
}
