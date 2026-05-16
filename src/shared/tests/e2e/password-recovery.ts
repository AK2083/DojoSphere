import type { Page, Route } from '@playwright/test'

async function fulfillWithSuccess(route: Route): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: '{}'
  })
}

/**
 * Mocks Supabase password-recovery mail request endpoint.
 *
 * @param page - Playwright page instance.
 */
export async function mockRecoveryRequest(page: Page): Promise<void> {
  await page.route('**/auth/v1/recover**', fulfillWithSuccess)
}

/**
 * Mocks Supabase OTP verification endpoint in recovery flow.
 *
 * @param page - Playwright page instance.
 */
export async function mockRecoveryVerify(page: Page): Promise<void> {
  await page.route('**/auth/v1/verify**', fulfillWithSuccess)
}

/**
 * Mocks all network endpoints needed for password recovery step flow.
 *
 * @param page - Playwright page instance.
 */
export async function mockRecoveryFlowRequests(page: Page): Promise<void> {
  await mockRecoveryRequest(page)
  await mockRecoveryVerify(page)
}

/**
 * Navigates from password reset page to OTP step.
 *
 * @param page - Playwright page instance.
 * @param email - Email used in the recovery flow.
 */
export async function goToPasswordResetOtpStep(
  page: Page,
  email = 'user@example.com'
): Promise<void> {
  await page.goto('/#/passwordreset')
  await page.locator('input[autocomplete="email"]').first().fill(email)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}

/**
 * Navigates from password reset page to new-password step.
 *
 * @param page - Playwright page instance.
 * @param email - Email used in the recovery flow.
 * @param token - OTP token used for the recovery verification step.
 */
export async function goToPasswordResetNewPasswordStep(
  page: Page,
  email = 'user@example.com',
  token = '123456'
): Promise<void> {
  await goToPasswordResetOtpStep(page, email)
  await page.locator('.v-otp-input input:visible').first().click()
  await page.keyboard.type(token)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
