import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import { Drawer, List, ListItemButton, ListItemIcon, Box, Tooltip } from "@mui/material";
import { NavLink } from "react-router";

export default function Navigation() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 64,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 64,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          height: "100vh",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          py: 2,
        }}
      >
        <List sx={{ p: 0 }}>
          <Tooltip title="Home" placement="right">
            <ListItemButton sx={{ justifyContent: "center" }} component={NavLink} to="/dashboard">
              <ListItemIcon sx={{ minWidth: 0 }}>
                <HomeIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>

          <Tooltip title="Dashboard" placement="right">
            <ListItemButton sx={{ justifyContent: "center" }}>
              <ListItemIcon sx={{ minWidth: 0 }}>
                <DashboardIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </List>

        <Tooltip title="Einstellungen" placement="right">
          <ListItemButton
            sx={{
              justifyContent: "center",
              mt: "auto",
            }}
            component={NavLink}
            to="/settings"
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              <SettingsIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
