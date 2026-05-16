import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('RegisterForm', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
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
