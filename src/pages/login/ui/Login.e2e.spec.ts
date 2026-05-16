import { expect, test } from '@playwright/test'

test.describe('login page', () => {
  test('renders credentials form and link back to datasource', async ({ page }) => {
    await page.goto('/#/login')

    await expect(page.locator('form')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="email"]')).toHaveCount(1)
    await expect(page.locator('input[autocomplete="current-password"]')).toHaveCount(1)
    await expect(page.locator('a[href$="#/datasource"]').first()).toBeVisible()
  })

  test('forgot-password action navigates to password reset', async ({ page }) => {
    await page.goto('/#/login')

    await page.locator('form button[type="button"].mt-2').click()
    await expect(page).toHaveURL(/#\/passwordreset$/)
    await expect(page.locator('.v-stepper')).toBeVisible()
  })
})
