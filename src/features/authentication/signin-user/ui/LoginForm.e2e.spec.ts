import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('LoginForm', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders login form fields and actions', async ({ page }) => {
    await page.goto('/#/login')

    await expect(page.locator('form')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="email"]')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="current-password"]')).toHaveCount(1)
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
    await expect(page.locator('a[href$="#/datasource"]').first()).toBeVisible()
  })

  test('navigates to password reset from forgot-password action', async ({ page }) => {
    await page.goto('/#/login')

    await page.locator('form button[type="button"].mt-2').click()
    await expect(page).toHaveURL(/#\/passwordreset$/)
  })
})
