import { expect, test } from '@playwright/test'

const LANGUAGE_STORAGE_KEY = 'dojosphere.settings.language'

test.describe('RegisterForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ([languageKey]) => {
        globalThis.localStorage?.setItem(languageKey, JSON.stringify('en'))
      },
      [LANGUAGE_STORAGE_KEY]
    )
  })

  test('renders register form fields and login link', async ({ page }) => {
    await page.goto('/#/datasource')

    await expect(page.locator('form')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="email"]')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="new-password"]')).toHaveCount(1)
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
    await expect(page.locator('a[href$="#/login"]').first()).toBeVisible()
  })
})
