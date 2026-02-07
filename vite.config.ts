import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: "src/electron/electron.js",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@i18n": path.resolve(__dirname, "src/i18n"),
    },
  },
  build: {
    minify: "esbuild",
    sourcemap: false,
  },
});
