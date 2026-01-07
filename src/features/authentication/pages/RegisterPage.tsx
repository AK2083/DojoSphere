import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RegisterForm from "../components/RegisterForm";

export default function CenteredCard() {
  return (
    <Grid container minWidth="100vw" minHeight="100vh" alignItems="center" justifyContent="center">
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
        <RegisterForm />
        <Card sx={{ width: "40vw", height: "50vh" }}>
          <CardContent>
            <Stack alignItems="center" justifyContent="center" height={150}>
              <Typography>Stack Center</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Grid>
  );
}
