import type { Page } from '@playwright/test'

const OTP_ACTIVE_KEY = 'dojosphere.auth.register.otpActive'
const REGISTER_EMAIL_KEY = 'dojosphere.auth.register.email'

/**
 * Seeds pending email-verification state before the SPA bootstraps.
 *
 * @param page - Playwright page instance.
 * @param email - Registration email shown on the confirmation card.
 */
export async function setupPendingEmailVerification(
  page: Page,
  email = 'e2e@example.com'
): Promise<void> {
  await page.addInitScript(
    ([otpActiveKey, registerEmailKey, registerEmail]) => {
      globalThis.localStorage?.setItem(otpActiveKey, JSON.stringify(true))
      globalThis.localStorage?.setItem(registerEmailKey, JSON.stringify(registerEmail))
    },
    [OTP_ACTIVE_KEY, REGISTER_EMAIL_KEY, email]
  )
}
