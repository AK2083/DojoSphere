import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React from "react";

import type { SelectChangeEvent } from "@mui/material/Select";

export default function LanguageSelector() {
  const [language, setLanguage] = React.useState("");

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

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
  );
}
