import { useState } from "react";

import Box from "@mui/material/Box";

export default function Dashboard() {
  const [loaded, setLoaded] = useState(false);

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
        alt="Dojosphere Logo"
        component="img"
        src="/Logo-256.webp"
        width="256"
        height="256"
        sx={{
          maxWidth: "100%",
          maxHeight: "80vh",
          height: "auto",
          opacity: loaded ? 1 : 0,
          transition: "opacity 600ms ease-in-out",
          pointerEvents: "none",
        }}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
      />
    </Box>
  );
}
