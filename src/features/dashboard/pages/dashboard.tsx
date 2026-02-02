import Box from "@mui/material/Box";
import React from "react";

export default function Dashboard() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src="/Logo.png"
        alt="Dojosphere Logo" // ♿ sinnvoller Alternativtext
        onLoad={() => setLoaded(true)}
        sx={{
          maxWidth: "100%",
          maxHeight: "80vh",
          height: "auto",

          // ✨ Fade-In
          opacity: loaded ? 1 : 0,
          transition: "opacity 600ms ease-in-out",

          // optional: kein Fokus, da nicht interaktiv
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
