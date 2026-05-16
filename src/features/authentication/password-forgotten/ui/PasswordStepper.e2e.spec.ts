import { expect, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

test.describe('PasswordStepper', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
  })

  test('renders stepper with three steps and disabled next action initially', async ({ page }) => {
    await page.goto('/#/passwordreset')

    await expect(page.locator('.v-stepper')).toBeVisible()
    await expect(page.locator('.v-stepper-header .v-stepper-item')).toHaveCount(3)
    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeDisabled()
  })
})
