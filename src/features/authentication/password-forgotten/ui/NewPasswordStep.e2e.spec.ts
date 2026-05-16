import { expect, type Page, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

async function mockRecoveryFlowRequests(page: Page): Promise<void> {
  await page.route('**/auth/v1/recover**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}'
    })
  })

  await page.route('**/auth/v1/verify**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}'
    })
  })
}

async function goToNewPasswordStep(page: Page): Promise<void> {
  await page.goto('/#/passwordreset')
  await page.locator('input[autocomplete="email"]').first().fill('user@example.com')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()

  await page.locator('.v-otp-input input:visible').first().click()
  await page.keyboard.type('123456')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}

test.describe('NewPasswordStep', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
    await mockRecoveryFlowRequests(page)
  })

  test('renders new-password fields after successful otp step', async ({ page }) => {
    await goToNewPasswordStep(page)

    await expect(page.locator('input[aria-label="New password"]')).toHaveCount(1)
    await expect(page.locator('input[aria-label="Repeat password"]')).toHaveCount(1)
  })
})
