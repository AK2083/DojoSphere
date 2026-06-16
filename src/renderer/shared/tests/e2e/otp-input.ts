import { expect, type Locator, type Page } from '@playwright/test'

export const OTP_INPUTS_SELECTOR = '.v-otp-input input:visible'

/**
 * Returns a locator for all visible OTP input fields.
 *
 * @param page - Playwright page instance.
 * @returns Locator for the OTP input fields.
 */
export function getOtpInputs(page: Page): Locator {
  return page.locator(OTP_INPUTS_SELECTOR)
}

/**
 * Waits until six OTP input fields are visible.
 *
 * @param page - Playwright page instance.
 */
export async function waitForOtpInputs(page: Page): Promise<void> {
  await expect(getOtpInputs(page)).toHaveCount(6, { timeout: 10_000 })
}

/**
 * Waits until the password-reset OTP step is visible.
 *
 * @param page - Playwright page instance.
 */
export async function waitForPasswordResetOtpStep(page: Page): Promise<void> {
  await expect(page.locator('#otpTitle').filter({ hasText: /verification code/i })).toBeVisible({
    timeout: 10_000
  })
  await waitForOtpInputs(page)
}

/**
 * Types an OTP token into the first visible OTP field.
 *
 * @param page - Playwright page instance.
 * @param token - OTP token to enter.
 */
export async function typeOtp(page: Page, token: string): Promise<void> {
  const firstOtpField = getOtpInputs(page).first()
  await expect(firstOtpField).toBeVisible({ timeout: 10_000 })

  if (token.length === 6) {
    await firstOtpField.fill(token)
    return
  }

  await firstOtpField.click()
  await page.keyboard.type(token)
}
