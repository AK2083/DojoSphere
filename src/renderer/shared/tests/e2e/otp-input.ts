import { expect, type Locator, type Page } from '@playwright/test'

export const OTP_INPUTS_SELECTOR = '.v-otp-input input:visible'

export function getOtpInputs(page: Page): Locator {
  return page.locator(OTP_INPUTS_SELECTOR)
}

export async function waitForOtpInputs(page: Page): Promise<void> {
  await expect(getOtpInputs(page)).toHaveCount(6, { timeout: 10_000 })
}

export async function waitForPasswordResetOtpStep(page: Page): Promise<void> {
  await expect(page.locator('#otpTitle').filter({ hasText: /verification code/i })).toBeVisible({
    timeout: 10_000
  })
  await waitForOtpInputs(page)
}

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
