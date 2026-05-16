import { expect, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

test.describe('EmailStep', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
  })

  test('enables next action after entering a valid email', async ({ page }) => {
    await page.goto('/#/passwordreset')

    const nextButton = page.getByRole('button', { name: 'Continue', exact: true })
    await expect(nextButton).toBeDisabled()

    const emailInput = page.locator('input[autocomplete="email"]').first()
    await emailInput.fill('user@example.com')

    await expect(nextButton).toBeEnabled()
  })
})
