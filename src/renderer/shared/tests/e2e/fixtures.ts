import { expect, test as base } from '@playwright/test'

import { setEnglishLanguage } from './setup-language'
import { mockHeartbeatSuccess } from './setup-login-available'

/**
 * Playwright test fixture with stable defaults for browser-only e2e runs.
 *
 * Mocks Supabase heartbeat reachability so auth calls are not blocked when
 * no local Supabase stack is running (e.g. CI).
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await setEnglishLanguage(page)
    await mockHeartbeatSuccess(page)
    await use(page)
  }
})

export { expect }
