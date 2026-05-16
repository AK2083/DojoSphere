import { expect, test } from '@playwright/test'

test.describe('settings page', () => {
  test('renders language selector and theme toggle', async ({ page }) => {
    await page.goto('/#/settings')

    await expect(page.locator('.v-select [role="combobox"]:visible').first()).toBeVisible()
    await expect(page.locator('.v-btn-toggle button')).toHaveCount(3)
  })
})
