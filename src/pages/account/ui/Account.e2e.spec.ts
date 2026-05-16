import { expect, test } from '@playwright/test'

test.describe('account page', () => {
  test('redirects unauthenticated users to login with redirect query', async ({ page }) => {
    await page.goto('/#/account')

    await expect(page).toHaveURL(/#\/login\?redirect=\/account$/)
    await expect(page.locator('input[autocomplete="email"]')).toHaveCount(1)
  })
})
