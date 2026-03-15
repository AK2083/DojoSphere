import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import security from 'eslint-plugin-security'
import unusedImports from 'eslint-plugin-unused-imports'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import jsdoc from 'eslint-plugin-jsdoc'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const autoImportGlobals = require('./.eslintrc-auto-import.json')

export default defineConfig([
  {
    ignores: [
      'node_modules',
      'dist',
      'coverage',
      '.vscode',
      '*.min.js',
      'auto-imports.d.ts',
      'ui.d.ts'
    ]
  },
  {
    files: ['src/**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...autoImportGlobals.globals
      }
    }
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    files: ['electron/**/*.js'],
    plugins: { security },
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      ...security.configs.recommended.rules,
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'security/detect-object-injection': 'off'
    }
  },
  ...pluginVue.configs['flat/strongly-recommended'].map((config) => ({
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
    files: ['electron/**/*.js'],
    plugins: { security },
    rules: security.configs.recommended.rules
  },
  {
    files: ['src/**/*.{js,ts,vue}'],
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-duplicate-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [['^node:'], ['^vue', '^@?\\w'], ['^@/'], ['^\\.'], ['^.+\\.?(css|scss)$']]
        }
      ],
      'simple-import-sort/exports': 'warn'
    }
  },
  {
    files: ['src/**/*.{ts,js}'],
    plugins: {
      jsdoc
    },
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true
          }
        }
      ],
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/check-types': 'error'
    }
  },
  prettier
])
