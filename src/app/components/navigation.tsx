import { useRef, useState } from "react";

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

import useAppTranslations from "@app/hooks/use-translations";
import useSettingsTranslations from "@features/settings/hooks/use-translations";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const appTranslations = useAppTranslations();
  const settingsTranslations = useSettingsTranslations();

  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  function handleDrawerToggle() {
    setMobileOpen((prev) => !prev);
  }

  function handleCloseMobile() {
    setMobileOpen(false);
    toggleButtonRef.current?.focus();
  }

  return (
    <>
      <Button
        aria-controls="main-navigation"
        aria-expanded={mobileOpen}
        aria-label={appTranslations.translations.navigation.open}
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
        aria-label={appTranslations.translations.navigation.title}
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
          <List sx={{ p: 0 }} aria-label={appTranslations.translations.navigation.menuTitle}>
            <Tooltip
              title={appTranslations.translations.navigation.dashboard}
              placement="right"
              arrow
            >
              <ListItemButton
                aria-label={appTranslations.translations.navigation.dashboard}
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

          <Tooltip title={settingsTranslations.translations.title} placement="right" arrow>
            <ListItemButton
              aria-label={settingsTranslations.translations.title}
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
