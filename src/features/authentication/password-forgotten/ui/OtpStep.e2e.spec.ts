import { expect, type Page, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

async function mockRecoveryRequest(page: Page): Promise<void> {
  await page.route('**/auth/v1/recover**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}'
    })
  })
}

async function goToOtpStep(page: Page): Promise<void> {
  await page.goto('/#/passwordreset')
  await page.locator('input[autocomplete="email"]').first().fill('user@example.com')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}

test.describe('OtpStep', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
    await mockRecoveryRequest(page)
  })

  test('renders otp fields after successful email step', async ({ page }) => {
    await goToOtpStep(page)

    await expect(page.locator('.v-otp-input input:visible')).toHaveCount(6)
    await expect(page.locator('#otpTitle').last()).toHaveText(
      'Enter verification code for user@example.com'
    )
  })
})
