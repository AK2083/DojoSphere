import { Visibility, VisibilityOff } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card sx={{ width: "40vw", height: "60vh", p: 2 }}>
      <CardHeader title="Registrierung" subheader="Neuen Benutzer registrieren" />
      <CardContent>
        <Stack direction="column" spacing={2} marginBottom={1}>
          <TextField
            id="email"
            size="small"
            defaultValue="sheldon.cooper@bbt.de"
            label="E-Mail"
            sx={{ pb: 2 }}
          />
          <TextField
            id="password"
            size="small"
            label="Passwort"
            type={showPassword ? "text" : "password"}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
        <Stack direction="column" spacing={0.5} sx={{ ml: 2 }}>
          <Typography sx={{ display: "flex", color: "text.secondary" }} variant="caption">
            Buchstaben
          </Typography>
          <Typography sx={{ display: "flex", color: "text.secondary" }} variant="caption">
            Zahlen
          </Typography>
          <Typography sx={{ display: "flex", color: "text.secondary" }} variant="caption">
            Sonderzeichen
          </Typography>
          <Typography sx={{ display: "flex", color: "text.secondary" }} variant="caption">
            Mindestlänge: 8 Zeichen
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button fullWidth variant="contained" disabled>
          Registriere mich
        </Button>
      </CardActions>
      <Box sx={{ px: 2 }}>
        <Typography variant="body2">
          Ich habe schon einen Account. <Link href="#">Log mich ein.</Link>
        </Typography>
      </Box>
    </Card>
  );
}
