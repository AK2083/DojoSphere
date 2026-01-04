import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Build-Output ignorieren
  globalIgnores(["dist", "build"]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,

      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",

      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);
