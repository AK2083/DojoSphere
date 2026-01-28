import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import checkFile from "eslint-plugin-check-file";

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
      import: importPlugin,
      "check-file": checkFile,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "lf",
        },
      ],

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",

      "react-hooks/exhaustive-deps": "warn",
      "linebreak-style": "off",

      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/shared",
              from: "./src/features",
            },
            {
              target: "./src/shared",
              from: "./src/app",
            },
            {
              target: "./src/features",
              from: "./src/app",
            },
          ],
        },
      ],

      "check-file/filename-naming-convention": [
        "error",
        {
          // React Components
          "src/**/{components, pages}/**/*.tsx": "PASCAL_CASE",
          "src/**/{components, pages}/**/*.spec.ts": "PASCAL_CASE",

          // Hooks
          "src/**/hooks/use*.ts": "CAMEL_CASE",
          "src/**/hooks/use*.test.ts": "CAMEL_CASE",

          // Utils, Types
          "src/**/{utils, types}/**/*.ts": "KEBAB_CASE",
          "src/**/{utils, types}/**/*.test.ts": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/!(__tests__)": "KEBAB_CASE",
        },
      ],

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "@features/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@shared/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@app/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
    },
  },
]);
