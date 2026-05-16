import { expect, test } from '@playwright/test'

test.describe('dashboard page', () => {
  test('redirects unauthenticated users to login with redirect query', async ({ page }) => {
    await page.goto('/#/dashboard')

    await expect(page).toHaveURL(/#\/login\?redirect=\/dashboard$/)
    await expect(page.locator('input[autocomplete="current-password"]')).toHaveCount(1)
  })
})
