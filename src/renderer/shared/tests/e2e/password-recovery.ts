import { expect, type Page, type Route } from '@playwright/test'

import { typeOtp, waitForPasswordResetOtpStep } from './otp-input'
import { mockHeartbeatSuccess } from './setup-login-available'

async function fulfillWithSuccess(route: Route): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: '{}'
  })
}

const CONTINUE_BUTTON = /^(Continue|Weiter)$/

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
  await mockHeartbeatSuccess(page)
  await mockRecoveryRequest(page)
  await mockRecoveryVerify(page)
}

async function ensurePasswordResetPage(page: Page): Promise<void> {
  await page.goto('/#/passwordreset')

  const emailInputs = page.locator('input[autocomplete="email"]')
  if ((await emailInputs.count()) === 0) {
    await page.reload()
    await page.goto('/#/passwordreset')
  }

  await expect(emailInputs.first()).toBeVisible({ timeout: 10_000 })
}

async function submitEmailStep(page: Page, email: string): Promise<void> {
  const continueButton = page.getByRole('button', { name: CONTINUE_BUTTON })
  const emailInput = page.locator('input[autocomplete="email"]').first()

  await emailInput.fill(email)
  await expect(continueButton).toBeEnabled({ timeout: 10_000 })

  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes('/auth/v1/recover') && response.ok(),
      { timeout: 10_000 }
    ),
    continueButton.click({ noWaitAfter: true })
  ])
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
  await ensurePasswordResetPage(page)
  await submitEmailStep(page, email)
  await waitForPasswordResetOtpStep(page)
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

  await typeOtp(page, token)

  const continueButton = page.getByRole('button', { name: CONTINUE_BUTTON })
  await expect(continueButton).toBeEnabled({ timeout: 10_000 })

  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes('/auth/v1/verify') && response.ok(),
      { timeout: 10_000 }
    ),
    continueButton.click({ noWaitAfter: true })
  ])

  await expect(page.locator('input[aria-label="New password"]')).toBeVisible({ timeout: 10_000 })
}

export { waitForOtpInputs, waitForPasswordResetOtpStep } from './otp-input'
