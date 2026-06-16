import { defineConfig, devices } from '@playwright/test'
import os from 'node:os'

import { DEV_HOST, E2E_BASE_URL, E2E_SERVER_PORT } from './config/dev'

const logicalCpuCount = os.cpus().length
const derivedWorkerCount = Math.max(2, Math.floor(logicalCpuCount * 0.75))

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['src/renderer/{widgets,features,pages,shared}/**/ui/**/*.e2e.spec.ts'],
  testIgnore: ['**/node_modules/**', '**/dist/**'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry flaky browser navigation under parallel Vite dev-server load. */
  retries: process.env.CI ? 2 : 1,
  timeout: 60_000,
  /* Cap workers — too much parallelism overwhelms the e2e Vite server (especially WebKit). */
  workers: process.env.CI ? Math.min(2, derivedWorkerCount) : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'line' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: E2E_BASE_URL,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: {
    // Uses Vite mode `e2e` (.env.e2e): renderer in browser only, Electron disabled, window.api mocked.
    command: `npm run e2e:server -- --host ${DEV_HOST} --port ${E2E_SERVER_PORT}`,
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
