import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "src/shared"),
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@lib": path.resolve(__dirname, "src/lib"),
    },
  },
  test: {
    environment: "jsdom",
    browser: undefined,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov"],
      clean: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/node_modules/**",
        "**/dist/**",
        "**/types/**",
        "**/exceptions/**",
        "**/mocks/**",
        "**/pages/**",
        "**/app/**",
        "**/components/**",
        "**/constants/**",
        "**/i18n/**",
        "**/lib/**",
        "**/monitoring/**",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
