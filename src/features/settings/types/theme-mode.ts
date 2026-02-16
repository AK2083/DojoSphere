import type { useColorScheme } from "@mui/material/styles";

export type ThemeMode = NonNullable<ReturnType<typeof useColorScheme>["mode"]>;
