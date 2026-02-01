import Box from "@mui/material/Box";

export default function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src="./Logo.png" alt="Logo" width="600" height="600" />
    </Box>
  );
}
