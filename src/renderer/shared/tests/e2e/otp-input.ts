import { expect, type Locator, type Page } from '@playwright/test'

export const OTP_FIELDS_SELECTOR = '.v-otp-input__field'
export const OTP_INPUT_SELECTOR = '.v-otp-input__input'

/**
 * Returns a locator for the six visible OTP digit cells.
 *
 * @param page - Playwright page instance.
 * @returns Locator for the OTP field cells.
 */
export function getOtpFields(page: Page): Locator {
  return page.locator(OTP_FIELDS_SELECTOR)
}

/**
 * Returns a locator for the hidden merged OTP text input (Vuetify 4).
 *
 * @param page - Playwright page instance.
 * @returns Locator for the OTP input element.
 */
export function getOtpInput(page: Page): Locator {
  return page.locator(OTP_INPUT_SELECTOR)
}

/**
 * Returns a locator for OTP digit cells.
 *
 * @param page - Playwright page instance.
 * @returns Locator for the OTP field cells.
 */
export function getOtpInputs(page: Page): Locator {
  return getOtpFields(page)
}

/**
 * Waits until six OTP digit cells and the merged input are present.
 *
 * @param page - Playwright page instance.
 */
export async function waitForOtpInputs(page: Page): Promise<void> {
  await expect(getOtpFields(page)).toHaveCount(6, { timeout: 10_000 })
  await expect(getOtpInput(page)).toBeAttached()
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
 * Types an OTP token into the merged OTP input.
 *
 * @param page - Playwright page instance.
 * @param token - OTP token to enter.
 */
export async function typeOtp(page: Page, token: string): Promise<void> {
  await getOtpFields(page).first().click()
  const otpInput = getOtpInput(page)
  await expect(otpInput).toBeAttached({ timeout: 10_000 })

  if (token.length === 6) {
    await otpInput.fill(token)
    return
  }

  await page.keyboard.type(token)
}
