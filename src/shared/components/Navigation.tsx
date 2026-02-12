import React from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NavLink } from "react-router";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
    toggleButtonRef.current?.focus();
  };

  return (
    <>
      <Button
        aria-controls="main-navigation"
        aria-expanded={mobileOpen}
        aria-label="Navigation öffnen"
        ref={toggleButtonRef}
        sx={{
          top: 10,
          left: 0,
          borderLeft: "none",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          position: "fixed",
          zIndex: (theme) => theme.zIndex.drawer - 1,
          display: { xs: "flex", md: "none" },
          minWidth: 0,
          boxShadow: 2,
        }}
        variant="contained"
        onClick={handleDrawerToggle}
      >
        <MenuIcon />
      </Button>

      <Drawer
        aria-label="Hauptnavigation"
        open={isDesktop ? true : mobileOpen}
        role="navigation"
        sx={{
          width: 64,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 64,
            boxSizing: "border-box",
          },
        }}
        variant={isDesktop ? "permanent" : "temporary"}
        onClose={handleCloseMobile}
      >
        <Box
          sx={{
            height: "100vh",
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            py: 2,
          }}
        >
          <List sx={{ p: 0 }} aria-label="Hauptmenü">
            <Tooltip title="Dashboard" placement="right" arrow>
              <ListItemButton
                aria-label="Dashboard"
                component={NavLink}
                sx={{ justifyContent: "center" }}
                to="/dashboard"
                onClick={() => !isDesktop && setMobileOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <DashboardIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </List>

          <Tooltip title="Einstellungen" placement="right" arrow>
            <ListItemButton
              aria-label="Einstellungen"
              component={NavLink}
              sx={{
                justifyContent: "center",
                mt: "auto",
              }}
              to="/settings"
              onClick={() => !isDesktop && setMobileOpen(false)}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <SettingsIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>
    </>
  );
}
