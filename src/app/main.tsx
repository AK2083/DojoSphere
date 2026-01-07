import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

// Reason: The root element is guaranteed by index.html (Vite entry point)
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    theme={createTheme({
      palette: {
        mode: "dark",
      },
    })}
  >
    <CssBaseline />
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>,
);
