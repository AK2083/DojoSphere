import Box from "@mui/material/Box";
import { Outlet } from "react-router";

import Navigation from "@shared/components/navigation";

export default function CommonLayout() {
  return (
    <>
      <Navigation />
      <Box
        component="main"
        sx={{
          ml: "64px",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
