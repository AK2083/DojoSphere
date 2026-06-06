import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
const includeStorybookProject = process.env.VITEST_STORYBOOK === 'true'

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: [
      'vuetify/components/VAlert',
      'vuetify/components/VAppBar',
      'vuetify/components/VAvatar',
      'vuetify/components/VBtn',
      'vuetify/components/VBtnToggle',
      'vuetify/components/VCard',
      'vuetify/components/VChip',
      'vuetify/components/VDivider',
      'vuetify/components/VFooter',
      'vuetify/components/VForm',
      'vuetify/components/VGrid',
      'vuetify/components/VIcon',
      'vuetify/components/VList',
      'vuetify/components/VNavigationDrawer',
      'vuetify/components/VOtpInput',
      'vuetify/components/VProgressLinear',
      'vuetify/components/VSelect',
      'vuetify/components/VSheet',
      'vuetify/components/VSnackbar',
      'vuetify/components/VStepper',
      'vuetify/components/VTextField',
      'vuetify/components/VTooltip'
    ]
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/renderer/shared'),
      '@app': path.resolve(__dirname, 'src/renderer/app'),
      '@features': path.resolve(__dirname, 'src/renderer/features'),
      '@widgets': path.resolve(__dirname, 'src/renderer/widgets'),
      '@pages': path.resolve(__dirname, 'src/renderer/pages')
    }
  },
  test: {
    api: {
      host: '127.0.0.1'
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      clean: true,
      include: ['src/renderer/**/*.{ts,tsx}'],
      exclude: [
        'env.d.ts',
        'index.ts',
        '**/*.spec.ts',
        '**/*.stories.ts',
        '**/shared/lib/**',
        '**/node_modules/**',
        '**/app/**',
        '**/dist/**',
        '**/types/**',
        '**/exceptions/**',
        '**/mocks/**',
        '**/pages/**',
        '**/autoimport/**',
        '**/components/**',
        '**/pages/**',
        '**/constants/**',
        '**/monitoring/**',
        '**/form/**',
        '**/providers/**',
        '**/i18n/**'
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
    projects: [
      {
        extends: true,
        test: {
          globals: true,
          environment: 'jsdom',
          include: ['src/renderer/**/*.test.ts', 'src/renderer/**/*.test.tsx']
        }
      },
      ...(includeStorybookProject
        ? [
            {
              extends: true,
              plugins: [
                // The plugin will run tests for the stories defined in your Storybook config
                // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                storybookTest({
                  configDir: path.join(dirname, '.storybook')
                })
              ],
              test: {
                name: 'storybook',
                browser: {
                  enabled: true,
                  api: {
                    host: '127.0.0.1',
                    port: 42123
                  },
                  headless: true,
                  provider: playwright({}),
                  instances: [
                    {
                      browser: 'chromium'
                    }
                  ]
                }
              }
            }
          ]
        : [])
    ]
  }
})
