import { expect, test } from '@playwright/test'

test.describe('login page', () => {
  test('login route renders', async ({ page }) => {
    await page.goto('/#/login')

    await expect(page).toHaveURL(/#\/login$/)
    await expect(page.locator('form')).toHaveCount(1)
  })
})
