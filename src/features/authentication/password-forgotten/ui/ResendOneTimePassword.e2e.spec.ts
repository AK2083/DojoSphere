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

test.describe('ResendOneTimePassword (password-forgotten)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
    await mockRecoveryRequest(page)
  })

  test('shows resend action on otp step', async ({ page }) => {
    await goToOtpStep(page)

    const resendButton = page.getByRole('button', {
      name: 'Send me a new confirmation code',
      exact: true
    })

    await expect(resendButton).toBeVisible()
    await expect(resendButton).toBeEnabled()
  })
})
