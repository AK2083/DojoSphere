import type { Page } from '@playwright/test'

const CLOUD_STATUS_KEY = 'dojosphere.cloud.status.isCloudUsed'

/**
 * Enables cloud mode in local storage before the app bootstraps.
 *
 * @param page - Playwright page instance.
 */
export async function setCloudModeEnabled(page: Page): Promise<void> {
  await page.addInitScript(
    ([cloudStatusKey]) => {
      globalThis.localStorage?.setItem(cloudStatusKey, JSON.stringify(true))
    },
    [CLOUD_STATUS_KEY]
  )
}

/**
 * Mocks the Supabase heartbeat edge function as reachable.
 *
 * @param page - Playwright page instance.
 */
export async function mockHeartbeatSuccess(page: Page): Promise<void> {
  await page.route('**/functions/v1/heartbeat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString()
      })
    })
  })
}

/**
 * Prepares a stable online/cloud login environment for browser e2e tests.
 *
 * @param page - Playwright page instance.
 */
export async function setupLoginAvailable(page: Page): Promise<void> {
  await setCloudModeEnabled(page)
  await mockHeartbeatSuccess(page)
}

/**
 * Disables cloud mode in local storage before the app bootstraps.
 *
 * @param page - Playwright page instance.
 */
export async function setCloudModeDisabled(page: Page): Promise<void> {
  await page.addInitScript(
    ([cloudStatusKey]) => {
      globalThis.localStorage?.setItem(cloudStatusKey, JSON.stringify(false))
    },
    [CLOUD_STATUS_KEY]
  )
}
