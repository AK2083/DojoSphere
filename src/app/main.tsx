import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router";

import App from "@app/components/app";
import "@lib/i18n/i18n";
import "@lib/i18n/import-resources";
import "@lib/sentry/sentry";
import { AuthProvider } from "@app/monitoring/auth-provider";

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
});

// Reason: The root element is guaranteed by index.html (Vite entry point)
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme} noSsr>
    <CssBaseline />
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  </ThemeProvider>,
);
