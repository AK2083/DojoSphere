import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

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
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@pages': path.resolve(__dirname, 'src/pages')
    }
  },
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      clean: true,
      include: ['src/**/*.{ts,tsx}'],
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
          include: ['src/**/*.test.ts', 'src/**/*.test.tsx']
        }
      },
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
  }
})
