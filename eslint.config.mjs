import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import security from 'eslint-plugin-security'
import unusedImports from 'eslint-plugin-unused-imports'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const autoImportGlobals = require('./.eslintrc-auto-import.json')

export default defineConfig([
  {
    ignores: ['node_modules', 'dist', '.vscode']
  },
  {
    files: ['src/**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...autoImportGlobals.globals
      }
    }
  },
  {
    files: ['electron/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['src/**/*.{ts,vue}'],
    rules: {
      ...config.rules,
      '@typescript-eslint/no-unused-vars': 'off'
    }
  })),
  ...pluginVue.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['src/**/*.vue']
  })),
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['src/**/*.{js,ts}', 'electron/**/*.js'],
    plugins: { security },
    rules: security.configs.recommended.rules
  },
  {
    files: ['src/**/*.{js,ts,vue}'],
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },
  prettier
])
